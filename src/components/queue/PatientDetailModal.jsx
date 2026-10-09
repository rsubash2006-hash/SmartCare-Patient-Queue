import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  Clock,
  User,
  Phone,
  Building2,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  Save,
  FileEdit,
} from 'lucide-react';
import { URGENCY_LEVELS, PATIENT_STATUS, DEPARTMENTS } from '../../constants/triageConstants';
import { UrgencyBadge, StatusBadge, DepartmentBadge } from '../common/Badge';
import { formatElapsedTime } from '../../services/triageEngine';

export function PatientDetailModal({
  isOpen,
  onClose,
  patient,
  onUpdatePatient,
}) {
  if (!patient) return null;

  const [urgencyLevel, setUrgencyLevel] = useState(patient.urgencyLevel);
  const [status, setStatus] = useState(patient.status);
  const [roomOrBed, setRoomOrBed] = useState(patient.roomOrBed || '');
  const [clinicianNotes, setClinicianNotes] = useState(patient.clinicianNotes || '');
  const [overrideReason, setOverrideReason] = useState('');
  const [clinicianAssessor, setClinicianAssessor] = useState(
    patient.clinicianAssessor || 'Dr. Sarah Vance, MD'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setUrgencyLevel(patient.urgencyLevel);
      setStatus(patient.status);
      setRoomOrBed(patient.roomOrBed || '');
      setClinicianNotes(patient.clinicianNotes || '');
      setClinicianAssessor(patient.clinicianAssessor || 'Dr. Sarah Vance, MD');
      setOverrideReason('');
    }
  }, [patient]);

  const handleSave = () => {
    setIsSaving(true);

    const now = Date.now();
    let updatedStart = patient.consultationStartTimestamp;
    let updatedComplete = patient.completionTimestamp;

    if (status === PATIENT_STATUS.IN_CONSULTATION && !updatedStart) {
      updatedStart = now;
    }
    if (status === PATIENT_STATUS.COMPLETED && !updatedComplete) {
      updatedComplete = now;
    }

    const updated = {
      ...patient,
      urgencyLevel: Number(urgencyLevel),
      status,
      roomOrBed,
      clinicianNotes: overrideReason
        ? `${clinicianNotes}\n[${new Date().toLocaleTimeString()}] Triage changed to Level ${urgencyLevel}: ${overrideReason} (${clinicianAssessor})`
        : clinicianNotes,
      clinicianAssessor,
      consultationStartTimestamp: updatedStart,
      completionTimestamp: updatedComplete,
    };

    setTimeout(() => {
      onUpdatePatient(updated);
      setIsSaving(false);
      onClose();
    }, 250);
  };

  const vitals = patient.vitals || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Clinical Record: ${patient.fullName}`}
      subtitle={`Medical Record Number (MRN): ${patient.mrn}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* Top Demographics Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Demographics</span>
            <span className="font-semibold text-slate-800">
              {patient.age} yrs • {patient.gender}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Contact Phone</span>
            <span className="font-mono text-slate-700">{patient.phone || 'Not recorded'}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Specialty Unit</span>
            <span className="font-semibold text-slate-800">{patient.department}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Queue Arrival</span>
            <span className="font-medium text-slate-700">
              {formatElapsedTime(patient.arrivalTimestamp)}
            </span>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Presenting Chief Complaint
          </p>
          <p className="text-slate-800 font-medium leading-relaxed">{patient.chiefComplaint}</p>
        </div>

        {/* Physiological Vital Signs Matrix */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-navy-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>Physiological Vital Signs Matrix</span>
            </h4>
            <span className="text-[11px] text-slate-400">Baseline Triage Vitals</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Blood Pressure</span>
              <span className="font-mono text-base font-bold text-navy-900">
                {vitals.bloodPressureSystolic || '—'}/{vitals.bloodPressureDiastolic || '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 120/80 mmHg</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Heart Rate</span>
              <span className="font-mono text-base font-bold text-navy-900">
                {vitals.heartRate ? `${vitals.heartRate} bpm` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 60–100 bpm</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Oxygen Saturation</span>
              <span
                className={`font-mono text-base font-bold ${
                  vitals.spO2 && vitals.spO2 < 93 ? 'text-rose-600' : 'text-navy-900'
                }`}
              >
                {vitals.spO2 ? `${vitals.spO2}%` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 95–100%</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Respiratory Rate</span>
              <span className="font-mono text-base font-bold text-navy-900">
                {vitals.respiratoryRate ? `${vitals.respiratoryRate} /min` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 12–20 /min</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Body Temperature</span>
              <span className="font-mono text-base font-bold text-navy-900">
                {vitals.temperatureC ? `${vitals.temperatureC}°C` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 36.5–37.5°C</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 block">Pain Score (VAS)</span>
              <span
                className={`font-mono text-base font-bold ${
                  vitals.painScore >= 8 ? 'text-amber-700' : 'text-navy-900'
                }`}
              >
                {vitals.painScore !== undefined ? `${vitals.painScore} / 10` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Visual Analogue Scale</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs col-span-2">
              <span className="text-[11px] text-slate-400 block">Assigned Treatment Location</span>
              <input
                type="text"
                value={roomOrBed}
                onChange={(e) => setRoomOrBed(e.target.value)}
                placeholder="e.g. Resus Bay 1, Exam Room 4, Triage Waiting"
                className="w-full mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Algorithmic Warning Flags Box */}
        {patient.preliminaryWarningFlags && patient.preliminaryWarningFlags.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center gap-2 text-rose-800 font-semibold mb-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>Preliminary Algorithmic Warning Flags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.preliminaryWarningFlags.map((flag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-rose-800 border border-rose-200 shadow-xs"
                >
                  {flag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-rose-600/90 italic">
              Warning flags serve solely as physiological cues. Qualified medical staff must determine urgency based on physical examination.
            </p>
          </div>
        )}

        {/* Clinician Urgency Confirmation / Acuity Re-evaluation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-navy-900 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-teal-600" />
              <span>Clinician-Confirmed Urgency (ESI Level)</span>
            </h4>
            <span className="text-[11px] font-medium text-teal-700">Staff Assessed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const u = URGENCY_LEVELS[lvl];
              const isSelected = Number(urgencyLevel) === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyLevel(lvl)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `${u.cardBorder} bg-white shadow-sm ring-2 ring-teal-500/20 border-teal-500`
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`h-2 w-2 rounded-full ${u.dotClass}`} />
                    <span className="font-bold text-xs text-navy-900">L{lvl}</span>
                  </div>
                  <p className="font-semibold text-xs text-slate-700">{u.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{u.description}</p>
                </button>
              );
            })}
          </div>

          {/* Rationale if changing level */}
          {Number(urgencyLevel) !== patient.urgencyLevel && (
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-amber-800 block mb-1">
                Clinical Rationale for Acuity Level Adjustment (Required for audit log)
              </label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g., Repeat vitals stabilized; ECG showed no STEMI; worsening respiratory effort"
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Clinical Staff Sign-off */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Assessing Clinician / Nurse
              </label>
              <input
                type="text"
                value={clinicianAssessor}
                onChange={(e) => setClinicianAssessor(e.target.value)}
                placeholder="Clinician name & designation"
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
              >
                <option value={PATIENT_STATUS.WAITING}>Waiting in Queue</option>
                <option value={PATIENT_STATUS.IN_CONSULTATION}>In Consultation (Active)</option>
                <option value={PATIENT_STATUS.COMPLETED}>Completed / Discharged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinical Notes Editor */}
        <div>
          <label className="text-[11px] font-bold text-navy-900 block mb-1.5 flex items-center gap-1.5">
            <FileEdit className="h-4 w-4 text-slate-500" />
            <span>Clinical Notes & Orders</span>
          </label>
          <textarea
            rows={3}
            value={clinicianNotes}
            onChange={(e) => setClinicianNotes(e.target.value)}
            placeholder="Add clinical observations, diagnostic lab orders, bed reassignment, or discharge notes..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Record...' : 'Update Clinical Record'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
