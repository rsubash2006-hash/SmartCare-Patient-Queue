import React from 'react';
import { URGENCY_LEVELS } from '../../constants/triageConstants';
import { ShieldAlert, Info } from 'lucide-react';

export function UrgencyDistributionChart({ urgencyDistribution = {}, totalPatients = 0, onSelectUrgency }) {
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-navy-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-600" />
              <span>Triage Urgency Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinician-confirmed acuity levels (ESI 1–5)
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {totalPatients} Cases
          </span>
        </div>

        {/* Stacked Visual Bar */}
        <div className="my-4">
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {levels.map((lvl) => {
              const count = urgencyDistribution[lvl] || 0;
              const pct = totalPatients > 0 ? (count / totalPatients) * 100 : 0;
              if (pct === 0) return null;

              const bgColors = {
                1: 'bg-rose-600',
                2: 'bg-orange-500',
                3: 'bg-amber-400',
                4: 'bg-sky-500',
                5: 'bg-slate-400',
              };

              return (
                <div
                  key={lvl}
                  style={{ width: `${pct}%` }}
                  className={`${bgColors[lvl]} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                  title={`Level ${lvl}: ${count} patients (${pct.toFixed(0)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2.5">
          {levels.map((lvl) => {
            const urgency = URGENCY_LEVELS[lvl];
            const count = urgencyDistribution[lvl] || 0;
            const pct = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;

            return (
              <div
                key={lvl}
                onClick={() => onSelectUrgency && onSelectUrgency(String(lvl))}
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${urgency.dotClass}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-navy-900 group-hover:text-teal-700 transition-colors">
                        Level {lvl}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">({urgency.name})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                      Target review: {urgency.targetReviewTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={`h-full ${urgency.dotClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold font-mono text-navy-900 min-w-8 text-right">
                    {count} <span className="text-[10px] font-normal text-slate-400">({pct}%)</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span>Click any acuity level above to filter the live patient queue.</span>
      </div>
    </div>
  );
}
