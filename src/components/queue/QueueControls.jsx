import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  UserCheck,
  RotateCcw,
  X,
  Stethoscope,
  Volume2,
} from 'lucide-react';
import { DEPARTMENTS, PATIENT_STATUS, URGENCY_LEVELS } from '../../constants/triageConstants';

export function QueueControls({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
  selectedUrgency,
  setSelectedUrgency,
  sortBy,
  setSortBy,
  patientCounts = {},
  onCallNextPatient,
  hasWaitingPatients = false,
}) {
  const statusOptions = [
    { id: 'All', label: 'All Patients', count: patientCounts.total || 0 },
    { id: PATIENT_STATUS.WAITING, label: 'Waiting', count: patientCounts.waiting || 0 },
    { id: PATIENT_STATUS.IN_CONSULTATION, label: 'In Consultation', count: patientCounts.inConsultation || 0 },
    { id: PATIENT_STATUS.COMPLETED, label: 'Completed', count: patientCounts.completed || 0 },
  ];

  const urgencyOptions = [
    { value: 'All', label: 'All Levels' },
    { value: '1', label: 'Level 1 (Immediate)' },
    { value: '2', label: 'Level 2 (Emergency)' },
    { value: '3', label: 'Level 3 (Urgent)' },
    { value: '4', label: 'Level 4 (Standard)' },
    { value: '5', label: 'Level 5 (Non-Urgent)' },
  ];

  const sortOptions = [
    { value: 'urgency_arrival', label: 'Acuity (High to Low) + Arrival Time' },
    { value: 'arrival_asc', label: 'Arrival: Oldest First' },
    { value: 'arrival_desc', label: 'Arrival: Newest First' },
    { value: 'wait_time_desc', label: 'Wait Time: Longest First' },
    { value: 'name_asc', label: 'Patient Name (A-Z)' },
  ];

  const hasActiveFilters =
    searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All' || selectedUrgency !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    setSelectedUrgency('All');
    setSortBy('urgency_arrival');
  };

  return (
    <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-subtle">
      {/* Top Bar: Search + Quick "Call Next Urgent" Action */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, MRN (e.g. SC-2026-8812), chief complaint..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Priority "Call Next Urgent Patient" Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCallNextPatient}
            disabled={!hasWaitingPatients}
            title="Automatically assign the highest acuity waiting patient to active consultation"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-navy-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Volume2 className="h-4 w-4 text-teal-400 animate-pulse" />
            <span>Call Next Urgent Patient</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {statusOptions.map((opt) => {
          const isActive = selectedStatus === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedStatus(opt.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Selectors Row: Department, Urgency Level, Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
        {/* Department Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Specialty / Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency Level Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Triage Acuity (ESI)
          </label>
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {urgencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3 text-slate-400" />
            <span>Sort Prioritization</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex flex-col justify-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear All Filters</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 py-2 text-center sm:text-left">
              Prioritized by ESI Urgency & Arrival
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
