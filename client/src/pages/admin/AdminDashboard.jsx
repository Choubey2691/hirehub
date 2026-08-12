import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, Building2, Briefcase, FileCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { CardSkeleton } from '../../components/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Administration</h1>
        <p className="text-slate-400 text-sm mt-1">
          Global HireHub system overview, user management, and moderation statistics.
        </p>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
          <div className="text-xs text-slate-400">
            {stats?.totalSeekers || 0} Seekers • {stats?.totalRecruiters || 0} Recruiters
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{stats?.totalCompanies || 0}</div>
          <div className="text-xs text-slate-400">Verified employer organizations</div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Job Postings</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats?.activeJobs || 0}</div>
          <div className="text-xs text-slate-400">Out of {stats?.totalJobs || 0} total listings</div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats?.totalApplications || 0}</div>
          <div className="text-xs text-slate-400">Submitted platform-wide</div>
        </div>
      </div>

      {/* Application Status Breakdown */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Application Pipeline Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold block uppercase">{status}</span>
              <span className="text-xl font-bold text-white block">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
