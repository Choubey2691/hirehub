import React from 'react';
import { Filter, RotateCcw, MapPin, Briefcase, DollarSign, Laptop } from 'lucide-react';

const JOB_TYPES = ['Full Time', 'Part Time', 'Internship', 'Contract'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'];

const JobFilterSidebar = ({ filters, setFilters, onReset }) => {
  const handleJobTypeChange = (type) => {
    const current = filters.jobType ? filters.jobType.split(',') : [];
    let updated = [];
    if (current.includes(type)) {
      updated = current.filter((t) => t !== type);
    } else {
      updated = [...current, type];
    }
    setFilters((prev) => ({ ...prev, jobType: updated.join(',') }));
  };

  const handleWorkModeChange = (mode) => {
    const current = filters.workMode ? filters.workMode.split(',') : [];
    let updated = [];
    if (current.includes(mode)) {
      updated = current.filter((m) => m !== mode);
    } else {
      updated = [...current, mode];
    }
    setFilters((prev) => ({ ...prev, workMode: updated.join(',') }));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <Filter className="w-5 h-5 text-indigo-400" />
          Filter Jobs
        </div>
        <button
          onClick={onReset}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          Location
        </label>
        <input
          type="text"
          placeholder="e.g. Bengaluru, Remote"
          value={filters.location || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Job Type Checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          Job Type
        </label>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => {
            const checked = filters.jobType?.split(',').includes(type);
            return (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={!!checked}
                  onChange={() => handleJobTypeChange(type)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Work Mode Checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-indigo-400" />
          Work Mode
        </label>
        <div className="space-y-2">
          {WORK_MODES.map((mode) => {
            const checked = filters.workMode?.split(',').includes(mode);
            return (
              <label key={mode} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={!!checked}
                  onChange={() => handleWorkModeChange(mode)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span>{mode}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Experience Level
        </label>
        <select
          value={filters.experience || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="">All Experience Levels</option>
          {EXPERIENCE_LEVELS.map((exp) => (
            <option key={exp} value={exp}>{exp}</option>
          ))}
        </select>
      </div>

      {/* Minimum Salary Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
          Min Salary (LPA)
        </label>
        <input
          type="range"
          min="0"
          max="3500000"
          step="100000"
          value={filters.minSalary || 0}
          onChange={(e) => setFilters((prev) => ({ ...prev, minSalary: e.target.value }))}
          className="w-full accent-indigo-500"
        />
        <div className="text-right text-xs font-semibold text-indigo-400 mt-1">
          {filters.minSalary ? `₹${(filters.minSalary / 100000).toFixed(1)} LPA+` : 'Any Salary'}
        </div>
      </div>
    </div>
  );
};

export default JobFilterSidebar;
