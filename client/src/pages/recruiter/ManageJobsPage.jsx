import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Users, Edit, Trash2, Power, Eye, PlusCircle } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

const ManageJobsPage = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
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

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
      const res = await jobService.updateJob(job._id, { status: newStatus });
      if (res.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j))
        );
        showToast(`Job status updated to ${newStatus}`, 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update job status', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? This will also remove all associated applications.')) {
      return;
    }

    try {
      const res = await jobService.deleteJob(jobId);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        showToast('Job listing deleted successfully', 'info');
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete job', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Posted Jobs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of your active and closed job requisitions.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Job
        </Link>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          message="Create your first job listing to start receiving candidate applications."
          actionText="Post a Job Now"
          onAction={() => window.location.href = '/recruiter/jobs/create'}
        />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Location & Type</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Posted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-base">{j.title}</div>
                      <div className="text-xs text-indigo-400 font-medium">{j.company?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div>{j.location}</div>
                      <div className="text-slate-500">{j.jobType} • {j.workMode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter/applicants?jobId=${j._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {j.applicantCount || 0} Applicants
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(j.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(j)}
                        className={`p-2 rounded-lg border transition ${
                          j.status === 'Active'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                        title={j.status === 'Active' ? 'Close job' : 'Activate job'}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
