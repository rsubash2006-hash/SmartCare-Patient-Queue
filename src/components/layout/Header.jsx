import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Menu,
  Clock,
  ShieldCheck,
  Building2,
  BellRing,
} from 'lucide-react';

export function Header({
  onOpenRegister,
  onResetDemoData,
  onAddSimulatedPatient,
  onToggleMobileMenu,
  criticalAlertCount = 0,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all shadow-subtle">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Logo + Demo Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-sm ring-2 ring-teal-500/20">
              <HeartPulse className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-navy-900 font-sans">
                  Smart<span className="text-teal-600">Care</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Triage v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-400 leading-tight">
                Emergency Queue & Clinician Workflow
              </p>
            </div>
          </div>

          {/* Visible Demo Mode Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/90 text-teal-800 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
            <span className="hidden xs:inline">Demo Sandbox</span>
            <span className="xs:hidden">Demo</span>
            <span className="text-[10px] text-teal-600 font-normal hidden lg:inline">• Fictional EHR Data</span>
          </div>
        </div>

        {/* Center: Live Clock & Hospital Station Indicator */}
        <div className="hidden xl:flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Station: ED Acute Care Wing B</span>
          </div>
          <div className="flex items-center gap-2 font-mono font-medium text-slate-600 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Simulator Buttons */}
          <button
            type="button"
            onClick={onAddSimulatedPatient}
            title="Inject a realistic incoming emergency patient for live triage demonstration"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>+ Simulate Inflow</span>
          </button>

          <button
            type="button"
            onClick={onResetDemoData}
            title="Reset sandbox patient queue to standard demo baseline"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Reset Sandbox</span>
          </button>

          {/* Primary Action: Patient Registration */}
          <button
            type="button"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>
    </header>
  );
}
