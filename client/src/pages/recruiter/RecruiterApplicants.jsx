import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Filter, Eye, FileText } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import ApplicantDetailsModal from './ApplicantDetailsModal';
import { TableSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/formatters';

const RecruiterApplicants = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      fetchApplicants();
    }
  }, [selectedJobId, statusFilter, jobs]);

  const fetchRecruiterJobs = async () => {
    try {
      const res = await jobService.getRecruiterJobs();
      if (res.success && res.data) {
        setJobs(res.data);
        if (!selectedJobId && res.data.length > 0) {
          setSelectedJobId(res.data[0]._id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplicants = async () => {
    if (!selectedJobId) return;
    try {
      setLoading(true);
      const res = await applicationService.getJobApplicants(selectedJobId, {
        status: statusFilter,
        search: searchQuery
      });
      if (res.success) {
        setApplicants(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await applicationService.updateStatus(applicationId, newStatus);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
        );
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
        }
        showToast(`Application status updated to "${newStatus}"! Candidate notified.`, 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Applicant Tracking System (ATS)</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review candidates, evaluate resumes, and update hiring pipeline status.
        </p>
      </div>

      {/* Controls Bar: Job Select, Search, Status Filter */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Select Job */}
        <div className="w-full md:w-auto flex-1 max-w-xs">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Select Job Requisition</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.applicantCount || 0} applicants)
              </option>
            ))}
          </select>
        </div>

        {/* Search Candidate */}
        <div className="w-full md:w-auto flex-1 max-w-xs">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Search Candidate</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchApplicants()}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto flex-1 max-w-xs">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants List Table */}
      {loading ? (
        <TableSkeleton />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          message="No job applications match your selected filter criteria."
        />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Candidate Profile</th>
                  <th className="px-6 py-4">Skills & Location</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status & Action</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {applicants.map((app) => {
                  const candidate = app.applicant || {};
                  return (
                    <tr key={app._id} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                            {candidate.profileImage ? (
                              <img src={candidate.profileImage} alt={candidate.name} className="w-full h-full object-cover" />
                            ) : (
                              candidate.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{candidate.name}</div>
                            <div className="text-xs text-slate-400">{candidate.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-300">
                        <div>{candidate.location || 'Location unlisted'}</div>
                        <div className="text-indigo-400 font-medium truncate max-w-[200px] mt-0.5">
                          {candidate.skills?.slice(0, 3).join(', ')}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {formatDate(app.appliedAt || app.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 ml-auto transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant Full Detail Modal */}
      {selectedApplication && (
        <ApplicantDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default RecruiterApplicants;
