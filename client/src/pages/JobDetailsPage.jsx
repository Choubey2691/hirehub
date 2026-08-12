import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Clock, Calendar, CheckCircle2, 
  Share2, Bookmark, Send, AlertCircle, ArrowLeft, Users
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { savedJobService } from '../services/savedJobService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatSalary, formatDate, formatRelativeTime } from '../utils/formatters';
import ApplyModal from '../components/ApplyModal';
import { CardSkeleton } from '../components/SkeletonLoader';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobById(id);
      if (res.success) {
        setJob(res.data);
      }

      // Check if user has already applied or saved
      if (user && user.role === 'jobseeker') {
        checkUserApplication();
        checkUserSaved();
      }
    } catch (error) {
      showToast(error.message || 'Job not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkUserApplication = async () => {
    try {
      const res = await applicationService.getMyApplications();
      if (res.success && res.data) {
        const found = res.data.some((app) => app.job?._id === id || app.job === id);
        setHasApplied(found);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkUserSaved = async () => {
    try {
      const res = await savedJobService.getSavedJobs();
      if (res.success && res.data) {
        const found = res.data.some((item) => item.job?._id === id || item.job === id);
        setIsSaved(found);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      showToast('Please login as a job seeker to save jobs', 'info');
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await savedJobService.unsaveJob(id);
        setIsSaved(false);
        showToast('Job removed from saved list', 'info');
      } else {
        await savedJobService.saveJob(id);
        setIsSaved(true);
        showToast('Job saved to your bookmarks!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Error updating saved job', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <CardSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Job Listing Not Found</h2>
        <p className="text-slate-400">The job you are looking for does not exist or has been removed.</p>
        <Link to="/jobs" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium">
          Browse Jobs
        </Link>
      </div>
    );
  }

  const company = job.company || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </button>

      {/* Main Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400">
                <Link to={`/companies/${company._id}`} className="text-indigo-400 hover:underline">
                  {company.name || 'Company'}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="text-slate-400">{formatRelativeTime(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'jobseeker' && (
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-xl border transition ${
                  isSaved
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isSaved ? 'Unsave job' : 'Save job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {hasApplied ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                You have already applied
              </div>
            ) : user?.role === 'recruiter' || user?.role === 'admin' ? (
              <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-medium">
                Log in as Job Seeker to apply
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    showToast('Please login as a job seeker to apply', 'info');
                    navigate('/login');
                  } else {
                    setShowApplyModal(true);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">Salary Range</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">Job Type</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{job.jobType}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">Work Mode</span>
            <span className="text-sm font-bold text-purple-400 mt-0.5 block">{job.workMode}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">Experience Required</span>
            <span className="text-sm font-bold text-indigo-400 mt-0.5 block">{job.experience}</span>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Description & Lists */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Job */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white">Job Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-lg font-semibold text-white">Key Responsibilities</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-lg font-semibold text-white">Requirements & Qualifications</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-lg font-semibold text-white">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-lg font-semibold text-white">Perks & Benefits</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 column: Company summary card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <h3 className="text-base font-semibold text-white pb-3 border-b border-slate-800">
              About the Company
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">{company.name}</h4>
                <p className="text-xs text-indigo-400">{company.industry || 'Technology'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {company.description || 'Leading tech enterprise building innovative software products.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              {company.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{company.location}</span>
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{company.size} Employees</span>
                </div>
              )}
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="block text-center w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 transition"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setHasApplied(true);
            setShowApplyModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
