import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-800" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-slate-800/80 rounded-full" />
      <div className="h-6 w-20 bg-slate-800/80 rounded-full" />
      <div className="h-6 w-24 bg-slate-800/80 rounded-full" />
    </div>
    <div className="h-10 bg-slate-800/50 rounded-xl" />
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-3 w-1/3">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="h-4 bg-slate-800 rounded w-full" />
        </div>
        <div className="h-4 bg-slate-800 rounded w-1/5" />
        <div className="h-6 bg-slate-800 rounded-full w-24" />
      </div>
    ))}
  </div>
);
