import React from 'react';
import {
  Users,
  LayoutDashboard,
  UserPlus,
  BookOpen,
  AlertTriangle,
  Stethoscope,
  X,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

export function Sidebar({
  activeTab,
  setActiveTab,
  onOpenRegister,
  waitingCount = 0,
  criticalAlertCount = 0,
  mobileOpen = false,
  setMobileOpen,
}) {
  const navItems = [
    {
      id: 'queue',
      label: 'Live Patient Queue',
      icon: Users,
      badge: waitingCount > 0 ? `${waitingCount} waiting` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'dashboard',
      label: 'Triage Dashboard',
      icon: LayoutDashboard,
      badge: criticalAlertCount > 0 ? `${criticalAlertCount} alert` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'protocols',
      label: 'Clinical Protocols (ESI)',
      icon: BookOpen,
      badge: null,
    },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-61px)]`}
      >
        {/* Top Header inside mobile sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-navy-900">SmartCare Menu</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Quick Registration Button */}
          <button
            type="button"
            onClick={() => {
              onOpenRegister();
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:from-teal-700 hover:to-teal-800 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Register Patient</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-75" />
          </button>

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Clinical Workspace
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50/80 text-teal-900 font-semibold shadow-xs border border-teal-200/60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Department Quick Filter shortcuts */}
          <div className="pt-2">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              ED Resource Load
            </p>
            <div className="space-y-1.5 px-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Trauma Bays
                </span>
                <span className="font-mono text-slate-500 font-medium">3 / 4 Avail</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Resuscitation Bay
                </span>
                <span className="font-mono text-slate-500 font-medium">1 / 2 Avail</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Fast Track Pod
                </span>
                <span className="font-mono text-slate-500 font-medium">5 / 6 Avail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Staff Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-600/20">
              SV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-navy-900 truncate">Dr. Sarah Vance, MD</p>
              <p className="text-[11px] text-slate-500 truncate">Attending Triage Physician</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active Shift (12h)
            </span>
            <span className="font-mono">Station #04</span>
          </div>
        </div>
      </aside>
    </>
  );
}
