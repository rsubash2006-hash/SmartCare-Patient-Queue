import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Info,
} from 'lucide-react';
import { URGENCY_LEVELS } from '../../constants/triageConstants';

export function ClinicalProtocolsView() {
  const esiLevels = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 tracking-tight">
              Emergency Severity Index (ESI) Clinical Protocol Reference
            </h2>
            <p className="text-xs text-slate-500">
              Validated 5-Level Triage Framework utilized by acute emergency departments worldwide
            </p>
          </div>
        </div>

        <div className="mt-4 prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed max-w-none space-y-3">
          <p>
            The <strong>Emergency Severity Index (ESI)</strong> stratifies patients into five distinct acuity groups based on acuity of illness and expected hospital resource consumption. Unlike simple time-based queues, triage ensures that patients with the greatest physiological threat receive immediate clinical attention.
          </p>
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 text-teal-900 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-teal-800">
                Staff Governance & Clinical Safety Protocol
              </p>
              <p className="text-xs text-teal-800/90 mt-0.5">
                SmartCare uses algorithmic vitals screening strictly as a preliminary warning tool to alert triage staff to anomalous physiological parameters. Automated checks never diagnose conditions or supersede the professional assessment of qualified nurses and emergency physicians.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Level Acuity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {esiLevels.map((lvl) => {
          const u = URGENCY_LEVELS[lvl];
          return (
            <div
              key={lvl}
              className={`rounded-2xl bg-white p-5 border border-slate-200/90 shadow-subtle border-t-4 ${u.cardBorder} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${u.dotClass}`} />
                    Level {lvl} ({u.code})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${u.badgeClass}`}>
                    Target: {u.targetReviewTime}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-navy-900">{u.name}</h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{u.description}</p>

                {/* Clinical criteria examples */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 block">Typical Clinical Presentation:</span>
                  {lvl === 1 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>Cardiac arrest / apnea</li>
                      <li>Severe respiratory failure (SpO2 &lt; 85%)</li>
                      <li>Anaphylaxis with airway compromise</li>
                    </ul>
                  )}
                  {lvl === 2 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>Acute coronary syndrome / severe chest pain</li>
                      <li>Acute stroke symptoms (&lt; 4.5 hours)</li>
                      <li>Severe pain (8–10/10) with marked tachycardia</li>
                    </ul>
                  )}
                  {lvl === 3 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>Abdominal pain requiring labs & ultrasound</li>
                      <li>Moderate asthma flare requiring nebulizers</li>
                      <li>Complex laceration needing deep repair</li>
                    </ul>
                  )}
                  {lvl === 4 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>Simple ankle sprain requiring single X-ray</li>
                      <li>Minor laceration requiring simple sutures</li>
                      <li>Dysuria in young adult requiring urinalysis</li>
                    </ul>
                  )}
                  {lvl === 5 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>Prescription refill / dressing change</li>
                      <li>Suture removal</li>
                      <li>Mild chronic rash without distress</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vital Signs Alert Thresholds */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-subtle">
        <h3 className="text-sm font-bold text-navy-900 tracking-tight flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-teal-600" />
          <span>Algorithmic Vitals Screening Reference Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block">Oxygen Saturation (SpO2)</span>
            <span className="text-slate-500 block mt-1">Normal: 95% – 100%</span>
            <span className="text-rose-600 font-semibold block mt-0.5">Critical Flag: &lt; 92%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block">Blood Pressure (BP)</span>
            <span className="text-slate-500 block mt-1">Normal: 120 / 80 mmHg</span>
            <span className="text-rose-600 font-semibold block mt-0.5">Hypertensive Flag: &ge; 180/110</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block">Heart Rate (Pulse)</span>
            <span className="text-slate-500 block mt-1">Normal: 60 – 100 bpm</span>
            <span className="text-orange-600 font-semibold block mt-0.5">Tachycardia: &ge; 115 bpm</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block">Respiratory Rate (RR)</span>
            <span className="text-slate-500 block mt-1">Normal: 12 – 20 breaths/min</span>
            <span className="text-orange-600 font-semibold block mt-0.5">Tachypnea Flag: &ge; 24 bpm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
