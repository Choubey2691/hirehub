import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Bookmark, Building2, ChevronRight, Briefcase } from 'lucide-react';
import { formatSalary, formatRelativeTime } from '../utils/formatters';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const JobCard = ({ job, isSavedInitial = false, onUnsave }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please login as a job seeker to save jobs', 'info');
      navigate('/login');
      return;
    }

    if (user.role !== 'jobseeker') {
      showToast('Only job seekers can save jobs', 'info');
      return;
    }

    try {
      setLoadingSave(true);
      if (isSaved) {
        await savedJobService.unsaveJob(job._id);
        setIsSaved(false);
        showToast('Job removed from saved list', 'info');
        if (onUnsave) onUnsave(job._id);
      } else {
        await savedJobService.saveJob(job._id);
        setIsSaved(true);
        showToast('Job saved to your bookmarks!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Error updating saved job', 'error');
    } finally {
      setLoadingSave(false);
    }
  };

  const companyName = job.company?.name || 'Company';
  const companyLogo = job.company?.logo;

  return (
    <div className="glass-card rounded-2xl p-6 relative flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <Link
                to={`/jobs/${job._id}`}
                className="text-lg font-semibold text-white group-hover:text-indigo-400 transition line-clamp-1"
              >
                {job.title}
              </Link>
              <div className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{companyName}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          {user?.role === 'jobseeker' && (
            <button
              onClick={handleToggleSave}
              disabled={loadingSave}
              className={`p-2.5 rounded-xl border transition ${
                isSaved
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
              title={isSaved ? 'Unsave job' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges & Pills */}
        <div className="flex flex-wrap items-center gap-2 my-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {job.jobType}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {job.workMode}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          {job.experience && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {job.experience}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skills Tag Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatRelativeTime(job.createdAt)}</span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition group-hover:translate-x-1 duration-200"
        >
          View Job
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
