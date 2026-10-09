import React from 'react';
import {
  Clock,
  User,
  HeartPulse,
  Activity,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  CheckCircle,
  FileText,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { URGENCY_LEVELS, PATIENT_STATUS } from '../../constants/triageConstants';
import { UrgencyBadge, StatusBadge, DepartmentBadge } from '../common/Badge';
import { formatElapsedTime } from '../../services/triageEngine';

export function PatientCard({
  patient,
  onSelectPatient,
  onStatusChange,
  onQuickAssignBay,
}) {
  const urgency = URGENCY_LEVELS[patient.urgencyLevel] || URGENCY_LEVELS[5];
  const isHighUrgency = patient.urgencyLevel <= 2;

  // Format vitals indicator tags
  const vitals = patient.vitals || {};
  const isSpO2Low = vitals.spO2 && vitals.spO2 <= 93;
  const isBPHigh = vitals.bloodPressureSystolic && vitals.bloodPressureSystolic >= 170;
  const isHRHigh = vitals.heartRate && vitals.heartRate >= 115;
  const isPainHigh = vitals.painScore && vitals.painScore >= 8;

  return (
    <div
      className={`group relative rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-subtle hover:shadow-card transition-all duration-200 border-l-4 ${
        urgency.cardBorder
      } ${patient.status === PATIENT_STATUS.COMPLETED ? 'opacity-85' : ''}`}
    >
      {/* Top Header: Acuity Badge + Demographics + Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <UrgencyBadge level={patient.urgencyLevel} size="md" />
          <DepartmentBadge department={patient.department} />
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {patient.mrn}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={patient.status} size="sm" />
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatElapsedTime(patient.arrivalTimestamp)}
          </span>
        </div>
      </div>

      {/* Patient Name & Primary Details */}
      <div className="mt-3 flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onSelectPatient(patient)}
              className="text-base font-bold text-navy-900 group-hover:text-teal-700 transition-colors cursor-pointer"
            >
              {patient.fullName}
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              ({patient.age}y, {patient.gender})
            </span>
          </div>

          {/* Chief Complaint */}
          <p className="mt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            <span className="text-slate-400 font-normal">Complaint: </span>
            {patient.chiefComplaint}
          </p>

          {/* Preliminary Warning Flags (Algorithmic Screener Flags) */}
          {patient.preliminaryWarningFlags && patient.preliminaryWarningFlags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-rose-600" />
                Warning Flags:
              </span>
              {patient.preliminaryWarningFlags.map((flag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Location / Bay */}
        <div className="shrink-0 text-right md:text-right">
          <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {patient.roomOrBed || 'Unassigned Waiting'}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">
            Triage: {patient.clinicianAssessor || 'Staff Assessed'}
          </p>
        </div>
      </div>

      {/* Vital Signs Grid Strip */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div
          className={`p-2 rounded-xl border ${
            isBPHigh
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 block font-medium">Blood Pressure</span>
          <span className="font-mono font-bold text-xs sm:text-sm">
            {vitals.bloodPressureSystolic || '—'}/{vitals.bloodPressureDiastolic || '—'}
            <span className="text-[9px] font-normal text-slate-400 ml-0.5">mmHg</span>
          </span>
        </div>

        <div
          className={`p-2 rounded-xl border ${
            isHRHigh
              ? 'bg-orange-50/80 border-orange-200 text-orange-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
          <span className="font-mono font-bold text-xs sm:text-sm">
            {vitals.heartRate || '—'}
            <span className="text-[9px] font-normal text-slate-400 ml-0.5">bpm</span>
          </span>
        </div>

        <div
          className={`p-2 rounded-xl border ${
            isSpO2Low
              ? 'bg-rose-50/80 border-rose-200 text-rose-900 font-bold'
              : 'bg-slate-50 border-slate-200/80 text-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 block font-medium">SpO2 (Pulse Ox)</span>
          <span className="font-mono font-bold text-xs sm:text-sm">
            {vitals.spO2 ? `${vitals.spO2}%` : '—'}
          </span>
        </div>

        <div className="p-2 rounded-xl border bg-slate-50 border-slate-200/80 text-slate-700">
          <span className="text-[10px] text-slate-400 block font-medium">Temp</span>
          <span className="font-mono font-bold text-xs sm:text-sm">
            {vitals.temperatureC ? `${vitals.temperatureC}°C` : '—'}
          </span>
        </div>

        <div
          className={`p-2 rounded-xl border ${
            isPainHigh
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-700'
          }`}
        >
          <span className="text-[10px] text-slate-400 block font-medium">Pain Score</span>
          <span className="font-mono font-bold text-xs sm:text-sm">
            {vitals.painScore !== undefined ? `${vitals.painScore} / 10` : '—'}
          </span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onSelectPatient(patient)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors p-1"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Full Clinical Record & Re-Triage</span>
        </button>

        <div className="flex items-center gap-2">
          {patient.status === PATIENT_STATUS.WAITING && (
            <button
              type="button"
              onClick={() => onStatusChange(patient.id, PATIENT_STATUS.IN_CONSULTATION)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Begin Consultation</span>
            </button>
          )}

          {patient.status === PATIENT_STATUS.IN_CONSULTATION && (
            <button
              type="button"
              onClick={() => onStatusChange(patient.id, PATIENT_STATUS.COMPLETED)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Complete / Discharge</span>
            </button>
          )}

          {patient.status === PATIENT_STATUS.COMPLETED && (
            <button
              type="button"
              onClick={() => onStatusChange(patient.id, PATIENT_STATUS.IN_CONSULTATION)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <span>Reopen Consultation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
