import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { FileCheck, Search, Filter, ExternalLink, Calendar } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getMyApplications();
      if (res.success) {
        setApplications(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Applications</h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor your job application pipeline and track live review status.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {['', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              statusFilter === st
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {st === '' ? 'All Applications' : st}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      {loading ? (
        <TableSkeleton />
      ) : filteredApps.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No applications found"
          message={statusFilter ? `No applications with status "${statusFilter}"` : "You haven't applied to any jobs yet."}
          actionText="Find Jobs to Apply"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job Title & Company</th>
                  <th className="px-6 py-4">Date Applied</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white text-base">{app.job?.title || 'Job'}</div>
                      <div className="text-xs text-indigo-400 font-medium mt-0.5">{app.job?.company?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(app.appliedAt || app.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.job && (
                        <Link
                          to={`/jobs/${app.job._id || app.job}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:underline"
                        >
                          View Job Details
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
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

export default SeekerApplications;
