import React from 'react';
import { AlertCircle, Clock, ArrowRight, ShieldAlert, HeartPulse, User } from 'lucide-react';
import { UrgencyBadge } from '../common/Badge';

export function TriageAlertsPanel({ alerts = [], onSelectPatient }) {
  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldAlert className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-navy-900 tracking-tight">
              Active Triage Alerts & Warning Flags
            </h3>
            <p className="text-xs text-slate-500">
              Physiological deviations requiring clinical clinician assessment
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          {alerts.length} Pending
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 mb-2">
            <HeartPulse className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No High-Risk Physiological Alerts</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
            All waiting patients are currently within non-critical physiological parameters.
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1 space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.patientId}
              onClick={() => onSelectPatient && onSelectPatient(alert.patientId)}
              className="pt-2 first:pt-0 group flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-navy-900 group-hover:text-teal-700 transition-colors">
                      {alert.patientName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{alert.mrn}</span>
                    <UrgencyBadge level={alert.urgencyLevel} size="sm" />
                  </div>

                  <p className="text-xs font-medium text-rose-700 mt-1 flex items-center gap-1.5 bg-rose-50/80 px-2 py-0.5 rounded border border-rose-200/60 w-fit">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{alert.alertReason}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Waited {alert.elapsedMins}m in queue
                    </span>
                    <span>•</span>
                    <span>{alert.department}</span>
                    {alert.roomOrBed && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{alert.roomOrBed}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 p-1.5 rounded-lg text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors"
                aria-label="View patient alert"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Safety Footnote */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 italic">
        * Algorithmic triage flags are preliminary warnings. Qualified medical staff must confirm triage priority.
      </div>
    </div>
  );
}
