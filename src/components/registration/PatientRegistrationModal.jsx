import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  UserPlus,
  HeartPulse,
  Activity,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Info,
} from 'lucide-react';
import {
  DEPARTMENTS,
  PATIENT_STATUS,
  URGENCY_LEVELS,
} from '../../constants/triageConstants';
import { storageService } from '../../services/storageService';
import { analyzePreliminaryWarningFlags } from '../../services/triageEngine';

export function PatientRegistrationModal({ isOpen, onClose, onRegisterPatient }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Female',
    phone: '',
    department: 'Emergency & Trauma',
    chiefComplaint: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    respiratoryRate: '',
    spO2: '',
    temperatureC: '37.0',
    painScore: '0',
    urgencyLevel: 3, // Default urgent unless assessed otherwise
    clinicianAssessor: 'Dr. Sarah Vance, MD',
    roomOrBed: 'Triage Waiting Area',
    clinicianNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preliminaryAnalysis, setPreliminaryAnalysis] = useState({
    flags: [],
    suggestedLevel: 3,
  });

  // Re-run real-time algorithmic preliminary analysis when vitals or chief complaint changes
  useEffect(() => {
    const vitalsObj = {
      bloodPressureSystolic: formData.bloodPressureSystolic,
      bloodPressureDiastolic: formData.bloodPressureDiastolic,
      heartRate: formData.heartRate,
      respiratoryRate: formData.respiratoryRate,
      spO2: formData.spO2,
      temperatureC: formData.temperatureC,
      painScore: formData.painScore,
    };
    const analysis = analyzePreliminaryWarningFlags(vitalsObj, formData.chiefComplaint);
    setPreliminaryAnalysis(analysis);
  }, [
    formData.bloodPressureSystolic,
    formData.bloodPressureDiastolic,
    formData.heartRate,
    formData.respiratoryRate,
    formData.spO2,
    formData.temperatureC,
    formData.painScore,
    formData.chiefComplaint,
  ]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Patient name is required (min 2 characters)';
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
      newErrors.age = 'Valid age between 0 and 125 is required';
    }

    if (!formData.chiefComplaint.trim() || formData.chiefComplaint.trim().length < 5) {
      newErrors.chiefComplaint = 'Chief complaint is required (min 5 characters)';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.clinicianAssessor.trim()) {
      newErrors.clinicianAssessor = 'Assessing clinician sign-off is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newPatient = {
      id: `pt-${Date.now()}`,
      mrn: storageService.generateMrn(),
      fullName: formData.fullName.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone.trim() || 'Unlisted',
      department: formData.department,
      chiefComplaint: formData.chiefComplaint.trim(),
      status: PATIENT_STATUS.WAITING,
      urgencyLevel: Number(formData.urgencyLevel),
      clinicianAssessor: formData.clinicianAssessor.trim(),
      arrivalTimestamp: Date.now(),
      consultationStartTimestamp: null,
      completionTimestamp: null,
      vitals: {
        bloodPressureSystolic: formData.bloodPressureSystolic ? Number(formData.bloodPressureSystolic) : 120,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? Number(formData.bloodPressureDiastolic) : 80,
        heartRate: formData.heartRate ? Number(formData.heartRate) : 75,
        respiratoryRate: formData.respiratoryRate ? Number(formData.respiratoryRate) : 16,
        spO2: formData.spO2 ? Number(formData.spO2) : 98,
        temperatureC: formData.temperatureC ? Number(formData.temperatureC) : 37.0,
        painScore: Number(formData.painScore || 0),
      },
      preliminaryWarningFlags: preliminaryAnalysis.flags,
      clinicianNotes: formData.clinicianNotes.trim() || 'Triage completed. Admitted to general ED waiting queue.',
      roomOrBed: formData.roomOrBed.trim() || 'Triage Waiting Area',
    };

    setTimeout(() => {
      onRegisterPatient(newPatient);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        fullName: '',
        age: '',
        gender: 'Female',
        phone: '',
        department: 'Emergency & Trauma',
        chiefComplaint: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        respiratoryRate: '',
        spO2: '',
        temperatureC: '37.0',
        painScore: '0',
        urgencyLevel: 3,
        clinicianAssessor: 'Dr. Sarah Vance, MD',
        roomOrBed: 'Triage Waiting Area',
        clinicianNotes: '',
      });
      setErrors({});
    }, 250);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Patient & Intake Triage"
      subtitle="Complete clinical vitals intake. Algorithmic checks provide early flags; certified staff confirm final urgency."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
        {/* Patient Demographics */}
        <div className="space-y-3">
          <h4 className="font-bold text-navy-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <UserPlus className="h-4 w-4 text-teal-600" />
            <span>1. Patient Demographics</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Katherine Pierce"
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border ${
                  errors.fullName ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                } focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="125"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 42"
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border ${
                  errors.age ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                } focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
              />
              {errors.age && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Assigned Unit / Specialty <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-700 block">
            Chief Complaint / Presenting Symptoms <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={formData.chiefComplaint}
            onChange={(e) => handleChange('chiefComplaint', e.target.value)}
            placeholder="Describe reason for emergency visit, onset duration, and symptoms (e.g., Acute left-sided chest pain with shortness of breath)"
            className={`w-full p-3 rounded-xl text-xs sm:text-sm bg-slate-50 border ${
              errors.chiefComplaint ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
            } focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
          />
          {errors.chiefComplaint && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.chiefComplaint}</p>
          )}
        </div>

        {/* Vital Signs Matrix */}
        <div className="space-y-3">
          <h4 className="font-bold text-navy-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-teal-600" />
              <span>2. Triage Vital Signs</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              Live algorithmic screening updates automatically
            </span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                BP Systolic (mmHg)
              </label>
              <input
                type="number"
                placeholder="120"
                value={formData.bloodPressureSystolic}
                onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                BP Diastolic (mmHg)
              </label>
              <input
                type="number"
                placeholder="80"
                value={formData.bloodPressureDiastolic}
                onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="75"
                value={formData.heartRate}
                onChange={(e) => handleChange('heartRate', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                SpO2 Saturation (%)
              </label>
              <input
                type="number"
                placeholder="98"
                min="50"
                max="100"
                value={formData.spO2}
                onChange={(e) => handleChange('spO2', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Resp Rate (/min)
              </label>
              <input
                type="number"
                placeholder="16"
                value={formData.respiratoryRate}
                onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Body Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="37.0"
                value={formData.temperatureC}
                onChange={(e) => handleChange('temperatureC', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Pain Level: <span className="font-bold text-teal-700">{formData.painScore} / 10</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.painScore}
                onChange={(e) => handleChange('painScore', e.target.value)}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Algorithmic Screener Result (Early Warning Flag) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Algorithmic Screener (Preliminary Warning Signals)</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Suggested Acuity: L{preliminaryAnalysis.suggestedLevel} (Advisory Only)
            </span>
          </div>

          {preliminaryAnalysis.flags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {preliminaryAnalysis.flags.map((flag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                >
                  {flag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              No physiological alert thresholds triggered based on current vitals.
            </p>
          )}

          <p className="text-[10px] text-slate-400 italic">
            Automated screener checks are preliminary warning flags, never medical diagnoses. Qualified medical staff must determine final triage priority.
          </p>
        </div>

        {/* 3. Clinician Final Confirmation */}
        <div className="space-y-3 p-4 rounded-xl bg-teal-50/50 border border-teal-200/80">
          <h4 className="font-bold text-navy-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-teal-700" />
              <span>3. Clinician-Confirmed Urgency & Allocation</span>
            </span>
            <span className="text-[11px] font-bold text-teal-800">Staff Assessed</span>
          </h4>

          {/* Acuity Level Radio Group */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const u = URGENCY_LEVELS[lvl];
              const isSelected = Number(formData.urgencyLevel) === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleChange('urgencyLevel', lvl)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? `${u.cardBorder} bg-white ring-2 ring-teal-500/30 border-teal-500 shadow-xs font-bold`
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${u.dotClass}`} />
                    <span className="text-xs font-bold text-navy-900">Level {lvl}</span>
                  </div>
                  <span className="text-[11px] block mt-0.5 text-slate-600">{u.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Assessing Clinician Name & Credential <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clinicianAssessor}
                onChange={(e) => handleChange('clinicianAssessor', e.target.value)}
                placeholder="Dr. Sarah Vance, MD"
                className={`w-full px-3 py-1.5 rounded-lg text-xs bg-white border ${
                  errors.clinicianAssessor ? 'border-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-1 focus:ring-teal-500`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Initial Treatment Area / Bed
              </label>
              <input
                type="text"
                value={formData.roomOrBed}
                onChange={(e) => handleChange('roomOrBed', e.target.value)}
                placeholder="Triage Waiting Area / Bed 4"
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Submit Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSubmitting ? 'Registering...' : 'Confirm Registration & Admit to Queue'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
