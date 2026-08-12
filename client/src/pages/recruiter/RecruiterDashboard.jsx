import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { 
  Briefcase, Users, CheckCircle2, XCircle, PlusCircle, Building2, TrendingUp, Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CardSkeleton } from '../../components/SkeletonLoader';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#14b8a6', '#f43f5e'];

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const res = await jobService.getRecruiterJobs();
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);

  // Bar chart data for top jobs performance
  const jobPerformanceData = jobs.slice(0, 5).map((j) => ({
    name: j.title.length > 15 ? j.title.substring(0, 15) + '...' : j.title,
    Applicants: j.applicantCount || 0
  }));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Recruiter & Hiring Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Recruiter Hiring Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor talent pipelines, evaluate applicants, and post new open requisitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/jobs/create"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
          <Link
            to="/recruiter/company"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition border border-slate-700"
          >
            Company Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Posted Jobs</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalJobs}</div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Openings</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{activeJobs}</div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Candidates</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400">{totalApplicants}</div>
        </div>
      </div>

      {/* Recharts Performance Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Applicant Distribution */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Job Applicant Volume</h3>
          {loading ? (
            <CardSkeleton />
          ) : jobPerformanceData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              No jobs posted yet to display analytics.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="Applicants" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Recent Jobs */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Requisitions</h3>
            <Link to="/recruiter/jobs" className="text-xs font-semibold text-indigo-400 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 4).map((j) => (
              <div key={j._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{j.title}</h4>
                  <p className="text-xs text-slate-400">{j.location} • {j.jobType}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {j.applicantCount || 0} Candidates
                  </span>
                  <Link
                    to={`/recruiter/applicants?jobId=${j._id}`}
                    className="block text-[11px] font-medium text-purple-400 hover:underline mt-1"
                  >
                    View ATS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
