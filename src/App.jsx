import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ClinicalSafetyBanner } from './components/layout/ClinicalSafetyBanner';
import { MetricCards } from './components/dashboard/MetricCards';
import { UrgencyDistributionChart } from './components/dashboard/UrgencyDistributionChart';
import { DepartmentFlowChart } from './components/dashboard/DepartmentFlowChart';
import { TriageAlertsPanel } from './components/dashboard/TriageAlertsPanel';
import { QueueControls } from './components/queue/QueueControls';
import { PatientCard } from './components/queue/PatientCard';
import { PatientDetailModal } from './components/queue/PatientDetailModal';
import { PatientRegistrationModal } from './components/registration/PatientRegistrationModal';
import { ClinicalProtocolsView } from './components/protocols/ClinicalProtocolsView';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ToastContainer } from './components/common/Toast';
import { storageService } from './services/storageService';
import {
  filterPatients,
  sortPatients,
  computeDashboardMetrics,
} from './services/triageEngine';
import { PATIENT_STATUS, DEPARTMENTS } from './constants/triageConstants';
import {
  Users,
  AlertCircle,
  Sparkles,
  Inbox,
  FilterX,
  PlusCircle,
  LayoutDashboard,
  Volume2,
} from 'lucide-react';

export function App() {
  // Patients state (synced with localStorage)
  const [patients, setPatients] = useState(() => storageService.getPatients());

  // Navigation state
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'dashboard', 'protocols'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [sortBy, setSortBy] = useState('urgency_arrival');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  // Toasts notification state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save patients whenever state changes
  useEffect(() => {
    storageService.savePatients(patients);
  }, [patients]);

  // Compute live dashboard metrics from single source of truth
  const metrics = useMemo(() => {
    return computeDashboardMetrics(patients);
  }, [patients]);

  // Filtered and sorted patient list
  const filteredPatients = useMemo(() => {
    return filterPatients(patients, {
      search: searchTerm,
      department: selectedDepartment,
      status: selectedStatus,
      urgencyLevel: selectedUrgency,
    });
  }, [patients, searchTerm, selectedDepartment, selectedStatus, selectedUrgency]);

  const sortedPatients = useMemo(() => {
    return sortPatients(filteredPatients, sortBy);
  }, [filteredPatients, sortBy]);

  // Patient counts for status pills
  const patientCounts = useMemo(() => {
    return {
      total: patients.length,
      waiting: patients.filter((p) => p.status === PATIENT_STATUS.WAITING).length,
      inConsultation: patients.filter((p) => p.status === PATIENT_STATUS.IN_CONSULTATION).length,
      completed: patients.filter((p) => p.status === PATIENT_STATUS.COMPLETED).length,
    };
  }, [patients]);

  // Handler: Register New Patient
  const handleRegisterPatient = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
    addToast(
      'success',
      `${newPatient.fullName} (${newPatient.mrn}) admitted to queue with Acuity Level ${newPatient.urgencyLevel}.`,
      'Patient Admitted'
    );
  };

  // Handler: Update Existing Patient (clinical details, re-triage, bed assignment)
  const handleUpdatePatient = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    addToast(
      'info',
      `Clinical record and triage for ${updatedPatient.fullName} updated.`,
      'Record Updated'
    );
  };

  // Handler: Status transition
  const handleStatusChange = (patientId, newStatus) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    if (newStatus === PATIENT_STATUS.COMPLETED) {
      // Require confirmation for patient discharge
      setConfirmDialog({
        isOpen: true,
        title: 'Confirm Discharge / Care Completion',
        message: `Are you sure you want to mark ${patient.fullName} (${patient.mrn}) as Completed and discharge from the active acute queue?`,
        type: 'info',
        confirmText: 'Complete & Discharge',
        onConfirm: () => {
          setPatients((prev) =>
            prev.map((p) =>
              p.id === patientId
                ? {
                    ...p,
                    status: newStatus,
                    completionTimestamp: Date.now(),
                    roomOrBed: 'Discharged Home',
                  }
                : p
            )
          );
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          addToast('success', `${patient.fullName} marked as completed / discharged.`, 'Patient Discharged');
        },
      });
      return;
    }

    // Direct transition to Consultation
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              status: newStatus,
              consultationStartTimestamp: p.consultationStartTimestamp || Date.now(),
              roomOrBed: p.roomOrBed === 'Triage Waiting Area' ? 'Active Exam Bay' : p.roomOrBed,
            }
          : p
      )
    );

    addToast(
      'info',
      `${patient.fullName} moved to ${newStatus}. Assigned to clinical bay.`,
      'Status Changed'
    );
  };

  // Handler: Call Next Urgent Patient
  const handleCallNextPatient = () => {
    // Find highest priority waiting patient (urgencyLevel ascending, arrivalTimestamp ascending)
    const waitingPatients = patients
      .filter((p) => p.status === PATIENT_STATUS.WAITING)
      .sort((a, b) => {
        const uDiff = a.urgencyLevel - b.urgencyLevel;
        if (uDiff !== 0) return uDiff;
        return a.arrivalTimestamp - b.arrivalTimestamp;
      });

    if (waitingPatients.length === 0) {
      addToast('warning', 'There are no waiting patients in the queue right now.', 'Queue Clear');
      return;
    }

    const nextPatient = waitingPatients[0];

    setConfirmDialog({
      isOpen: true,
      title: 'Call Next Urgent Patient to Consultation',
      message: `Highest priority patient in queue is ${nextPatient.fullName} (Level ${nextPatient.urgencyLevel} - ${nextPatient.department}). Admit to active consultation bay now?`,
      type: 'info',
      confirmText: 'Admit Patient',
      onConfirm: () => {
        handleStatusChange(nextPatient.id, PATIENT_STATUS.IN_CONSULTATION);
        setSelectedPatient(nextPatient);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handler: Add fast simulated patient (great for hackathon live demos)
  const handleAddSimulatedPatient = () => {
    const demoCases = [
      {
        name: 'Carlos Rivera',
        age: 62,
        gender: 'Male',
        dept: 'Cardiology',
        complaint: 'Crushing sub-sternal pressure radiating to back, diaphoresis',
        urgency: 1,
        flags: ['Critical SpO2 (91%)', 'Suspected Acute MI', 'Severe Pain (9/10)'],
        vitals: {
          bloodPressureSystolic: 175,
          bloodPressureDiastolic: 105,
          heartRate: 114,
          respiratoryRate: 24,
          spO2: 91,
          temperatureC: 37.1,
          painScore: 9,
        },
        bed: 'Resuscitation Bay 2',
      },
      {
        name: 'Zara Washington',
        age: 29,
        gender: 'Female',
        dept: 'Respiratory & Pulmonology',
        complaint: 'Severe bronchospasm, audible wheezing, unable to finish full sentences',
        urgency: 2,
        flags: ['Severe Tachypnea (28 /min)', 'Hypoxemia Risk'],
        vitals: {
          bloodPressureSystolic: 135,
          bloodPressureDiastolic: 85,
          heartRate: 112,
          respiratoryRate: 28,
          spO2: 92,
          temperatureC: 37.3,
          painScore: 7,
        },
        bed: 'Respiratory Bay 1',
      },
      {
        name: 'Benjamin Cole',
        age: 12,
        gender: 'Male',
        dept: 'Pediatrics',
        complaint: 'High fever 39.4°C with lethargy and refusal of oral hydration',
        urgency: 2,
        flags: ['High Grade Hyperthermia (39.4°C)', 'Pediatric Tachycardia (135 bpm)'],
        vitals: {
          bloodPressureSystolic: 102,
          bloodPressureDiastolic: 64,
          heartRate: 135,
          respiratoryRate: 24,
          spO2: 97,
          temperatureC: 39.4,
          painScore: 5,
        },
        bed: 'Peds Bay 3',
      },
    ];

    const randomCase = demoCases[Math.floor(Math.random() * demoCases.length)];
    const simulatedPatient = {
      id: `pt-sim-${Date.now()}`,
      mrn: storageService.generateMrn(),
      fullName: randomCase.name,
      age: randomCase.age,
      gender: randomCase.gender,
      phone: '+1 (555) 999-1234',
      department: randomCase.dept,
      chiefComplaint: randomCase.complaint,
      status: PATIENT_STATUS.WAITING,
      urgencyLevel: randomCase.urgency,
      clinicianAssessor: 'Dr. Sarah Vance, MD (Attending)',
      arrivalTimestamp: Date.now(),
      consultationStartTimestamp: null,
      completionTimestamp: null,
      vitals: randomCase.vitals,
      preliminaryWarningFlags: randomCase.flags,
      clinicianNotes: 'Simulated acute emergency intake for live hackathon demonstration.',
      roomOrBed: randomCase.bed,
    };

    setPatients((prev) => [simulatedPatient, ...prev]);
    // Switch to queue tab so user sees it right away
    setActiveTab('queue');
    addToast(
      'error',
      `Simulated Emergency Case: ${simulatedPatient.fullName} (Level ${simulatedPatient.urgencyLevel} - ${simulatedPatient.department}) arrived in queue.`,
      'Simulated Inflow Alert'
    );
  };

  // Handler: Reset demo data
  const handleResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Demo Data to Standard Baseline',
      message: 'This will restore the 12 realistic fictional demo patients and reset arrival timestamps. Any newly added sandbox records will be reset.',
      type: 'warning',
      confirmText: 'Reset Demo Sandbox',
      onConfirm: () => {
        const resetPatients = storageService.resetDemoData();
        setPatients(resetPatients);
        setSearchTerm('');
        setSelectedDepartment('All');
        setSelectedStatus('All');
        setSelectedUrgency('All');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        addToast('success', 'Demo patient database restored to pristine baseline state.', 'Sandbox Reset');
      },
    });
  };

  // Quick filter triggers from dashboard
  const handleQuickFilterStatus = (status) => {
    setSelectedStatus(status);
    setActiveTab('queue');
  };

  const handleQuickFilterUrgency = (urgency) => {
    setSelectedUrgency(urgency);
    setActiveTab('queue');
  };

  const handleQuickFilterDepartment = (dept) => {
    setSelectedDepartment(dept);
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Clinical Safety Banner */}
      <ClinicalSafetyBanner />

      {/* Main SaaS App Header */}
      <Header
        onOpenRegister={() => setIsRegisterOpen(true)}
        onResetDemoData={handleResetDemoData}
        onAddSimulatedPatient={handleAddSimulatedPatient}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        criticalAlertCount={metrics.criticalAlertCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRegister={() => setIsRegisterOpen(true)}
          waitingCount={metrics.waitingCount}
          criticalAlertCount={metrics.criticalAlertCount}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Dynamic Metric Cards (Always visible on Queue and Dashboard) */}
          <MetricCards
            metrics={metrics}
            onFilterStatus={handleQuickFilterStatus}
            onFilterUrgency={handleQuickFilterUrgency}
          />

          {/* VIEW: LIVE PATIENT QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-5">
              {/* Queue Controls (Search, Filters, Sort) */}
              <QueueControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedUrgency={selectedUrgency}
                setSelectedUrgency={setSelectedUrgency}
                sortBy={sortBy}
                setSortBy={setSortBy}
                patientCounts={patientCounts}
                onCallNextPatient={handleCallNextPatient}
                hasWaitingPatients={metrics.waitingCount > 0}
              />

              {/* Patient Cards List */}
              {sortedPatients.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/90 shadow-subtle">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                    <FilterX className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900">No Patients Match Current Filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Try clearing search query, resetting department filter, or registering a new intake.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartment('All');
                        setSelectedStatus('All');
                        setSelectedUrgency('All');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRegisterOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                    >
                      + Register Patient
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>
                      Displaying <strong>{sortedPatients.length}</strong> active patient records
                    </span>
                    <span className="font-medium text-teal-700">
                      Auto-sorted by Acuity & Arrival Time
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {sortedPatients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onSelectPatient={(p) => setSelectedPatient(p)}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: TRIAGE DASHBOARD & ANALYTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgency Acuity Distribution */}
                <UrgencyDistributionChart
                  urgencyDistribution={metrics.urgencyDistribution}
                  totalPatients={metrics.total}
                  onSelectUrgency={handleQuickFilterUrgency}
                />

                {/* Department Workload Distribution */}
                <DepartmentFlowChart
                  departmentBreakdown={metrics.departmentBreakdown}
                  totalPatients={metrics.total}
                  onSelectDepartment={handleQuickFilterDepartment}
                />
              </div>

              {/* Triage Alerts Panel */}
              <TriageAlertsPanel
                alerts={metrics.triageAlerts}
                onSelectPatient={(patientId) => {
                  const p = patients.find((item) => item.id === patientId);
                  if (p) setSelectedPatient(p);
                }}
              />
            </div>
          )}

          {/* VIEW: CLINICAL PROTOCOLS REFERENCE */}
          {activeTab === 'protocols' && <ClinicalProtocolsView />}
        </main>
      </div>

      {/* Registration Modal */}
      <PatientRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterPatient={handleRegisterPatient}
      />

      {/* Patient Detailed Clinical Record Modal */}
      <PatientDetailModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
        onUpdatePatient={handleUpdatePatient}
      />

      {/* Reusable Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
