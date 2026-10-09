import React, { useState } from 'react';
import { ShieldAlert, Info, X, ExternalLink } from 'lucide-react';

export function ClinicalSafetyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Clinical Safety and Demo Notice" className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white px-4 py-2.5 text-xs border-b border-navy-700/60 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/20 text-teal-300 ring-1 ring-teal-400/30">
            <ShieldAlert className="h-3.5 w-3.5 text-teal-300" />
          </div>
          <p className="leading-snug text-slate-200">
            <strong className="text-teal-300 font-semibold tracking-wide">CLINICAL SAFETY MANDATE:</strong>{' '}
            All patient data is purely <span className="underline decoration-teal-400/50">fictional</span>. Automated vitals & symptom screener alerts represent <span className="text-amber-300 font-medium">preliminary warning flags</span>, NEVER medical diagnoses. Certified clinical staff must conduct physical assessment to assign final urgency.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1 rounded bg-navy-700/80 px-2 py-0.5 text-[10px] font-mono text-teal-200 border border-teal-400/20">
            ESI 5-Level Standard
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white transition-colors p-0.5 rounded focus:outline-none"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
