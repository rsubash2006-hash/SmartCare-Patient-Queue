import React from 'react';
import {
  Users,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';

export function MetricCards({ metrics, onFilterStatus, onFilterUrgency }) {
  const {
    total,
    waitingCount,
    inConsultationCount,
    completedCount,
    criticalAlertCount,
    avgWaitTimeMinutes,
  } = metrics;

  const cards = [
    {
      id: 'waiting',
      title: 'Waiting in Queue',
      value: waitingCount,
      subtext: `${criticalAlertCount} requiring high-urgency care`,
      icon: Users,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200/80',
      action: () => onFilterStatus && onFilterStatus('Waiting'),
    },
    {
      id: 'in-consult',
      title: 'In Active Consultation',
      value: inConsultationCount,
      subtext: 'Assigned to clinical bays',
      icon: Stethoscope,
      color: 'teal',
      bgColor: 'bg-teal-500/10',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200/80',
      action: () => onFilterStatus && onFilterStatus('In Consultation'),
    },
    {
      id: 'critical',
      title: 'Critical Alert Flags',
      value: criticalAlertCount,
      subtext: 'ESI Level 1 & 2 active cases',
      icon: AlertTriangle,
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200/80',
      action: () => onFilterUrgency && onFilterUrgency('1'),
    },
    {
      id: 'avg-wait',
      title: 'Dynamic Avg Wait Time',
      value: `${avgWaitTimeMinutes}m`,
      subtext: 'Arrival to initial consultation',
      icon: Clock,
      color: 'sky',
      bgColor: 'bg-sky-500/10',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200/80',
    },
    {
      id: 'completed',
      title: 'Discharged / Completed',
      value: completedCount,
      subtext: `Total registered: ${total}`,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200/80',
      action: () => onFilterStatus && onFilterStatus('Completed'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.action}
            className={`group relative overflow-hidden rounded-2xl bg-white p-5 border shadow-subtle hover:shadow-card transition-all duration-200 ${
              card.action ? 'cursor-pointer hover:-translate-y-0.5' : ''
            } ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`rounded-xl p-2.5 ${card.bgColor} ${card.textColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-navy-900 font-sans">
                {card.value}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <span>{card.subtext}</span>
            </p>

            {/* Bottom accent bar */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 ${card.textColor}`}
            />
          </div>
        );
      })}
    </div>
  );
}
