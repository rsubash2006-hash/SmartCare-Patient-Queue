import React from 'react';
import { DEPARTMENTS } from '../../constants/triageConstants';
import { BarChart3, Activity } from 'lucide-react';

export function DepartmentFlowChart({ departmentBreakdown = {}, totalPatients = 0, onSelectDepartment }) {
  // Find highest caseload to scale visual progress bars
  const maxCount = Math.max(...Object.values(departmentBreakdown), 1);

  return (
    <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-navy-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal-600" />
              <span>Department Workload & Census</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active patient allocation across ED specialties
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
            6 Specialties
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {DEPARTMENTS.map((dept) => {
            const count = departmentBreakdown[dept] || 0;
            const barWidth = (count / maxCount) * 100;
            const isHeavy = count >= 3;

            return (
              <div
                key={dept}
                onClick={() => onSelectDepartment && onSelectDepartment(dept)}
                className="group p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                    {dept}
                  </span>
                  <div className="flex items-center gap-2">
                    {isHeavy && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium border border-amber-200">
                        High Load
                      </span>
                    )}
                    <span className="font-mono font-bold text-navy-900">
                      {count} <span className="text-[10px] font-normal text-slate-400">pts</span>
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHeavy ? 'bg-teal-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.max(barWidth, count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Click any specialty to filter queue</span>
        <span className="font-medium text-teal-700">Real-time update</span>
      </div>
    </div>
  );
}
