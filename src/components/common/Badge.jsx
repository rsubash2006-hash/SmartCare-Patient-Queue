import React from 'react';
import { URGENCY_LEVELS, PATIENT_STATUS } from '../../constants/triageConstants';

export function UrgencyBadge({ level, showDescription = false, size = 'md' }) {
  const urgency = URGENCY_LEVELS[level] || URGENCY_LEVELS[5];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${urgency.badgeClass} ${sizeClasses[size]}`}
        title={`Triage Level ${level}: ${urgency.description}`}
      >
        <span className={`h-2 w-2 rounded-full ${urgency.dotClass} ${level <= 2 ? 'animate-ping' : ''}`} />
        <span className="font-semibold tracking-wide">
          L{level} • {urgency.name}
        </span>
      </span>
      {showDescription && (
        <span className="text-xs text-slate-500 hidden sm:inline">({urgency.description})</span>
      )}
    </div>
  );
}

export function StatusBadge({ status, size = 'md' }) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (status === PATIENT_STATUS.WAITING) {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200/80 ring-1 ring-amber-500/10';
    dotColor = 'bg-amber-500';
  } else if (status === PATIENT_STATUS.IN_CONSULTATION) {
    badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200/80 ring-1 ring-teal-500/10';
    dotColor = 'bg-teal-600 animate-pulse';
  } else if (status === PATIENT_STATUS.COMPLETED) {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200/80 ring-1 ring-emerald-500/10';
    dotColor = 'bg-emerald-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${badgeStyle} ${sizeClasses[size]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}

export function DepartmentBadge({ department }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {department}
    </span>
  );
}
