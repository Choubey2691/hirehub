import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { jobService } from '../../services/jobService';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Trash2, ExternalLink } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { TableSkeleton } from '../../components/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

const AdminJobsPage = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getJobs();
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job listing from the platform?')) return;
    try {
      const res = await jobService.deleteJob(jobId);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        showToast('Job listing removed successfully', 'info');
      }
    } catch (error) {
      showToast(error.message || 'Failed to remove job', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Platform Job Listings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review active and closed job requisitions published across HireHub.
        </p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job Title & Company</th>
                  <th className="px-6 py-4">Job Type & Mode</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{j.title}</div>
                      <div className="text-xs text-indigo-400 font-medium">{j.company?.name}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div>{j.jobType}</div>
                      <div className="text-slate-500">{j.workMode}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {j.location}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={j.status} />
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(j.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={`/jobs/${j._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition"
                        title="Remove Job"
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

export default AdminJobsPage;
