
import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// /api hata kar actual backend/server URL nikalo
// http://localhost:5000/api -> http://localhost:5000
const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const ApplicantDetailsModal = ({
  application,
  onClose,
  onStatusChange
}) => {
  if (!application) return null;

  const applicant = application.applicant || {};
  const job = application.job || {};

  // ============================================
  // RESUME URL
  // ============================================
  const getResumeUrl = () => {
    if (!application.resume) {
      return null;
    }

    // Agar backend already complete URL bhej raha hai
    if (
      application.resume.startsWith('http://') ||
      application.resume.startsWith('https://')
    ) {
      return application.resume;
    }

    // Ensure path "/" se start ho
    const resumePath = application.resume.startsWith('/')
      ? application.resume
      : `/${application.resume}`;

    return `${FILE_BASE_URL}${resumePath}`;
  };

  const resumeUrl = getResumeUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">

      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 relative border border-slate-700 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">

              {applicant.profileImage ? (
                <img
                  src={applicant.profileImage}
                  alt={applicant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                applicant.name?.charAt(0).toUpperCase()
              )}

            </div>

            <div>

              <h3 className="text-xl font-bold text-white">
                {applicant.name}
              </h3>

              <p className="text-xs text-indigo-400 font-medium">
                Applied for: {job.title}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>
                  Applied:{' '}
                  {formatDate(
                    application.appliedAt || application.createdAt
                  )}
                </span>
              </div>

            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Status Dropdown Action Bar */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <span className="text-xs font-semibold text-slate-400 uppercase">
              Current Status:
            </span>

            <StatusBadge status={application.status} />

          </div>

          <div className="flex items-center gap-2">

            <span className="text-xs font-semibold text-slate-300">
              Change Status:
            </span>

            <select
              value={application.status}
              onChange={(e) =>
                onStatusChange(application._id, e.target.value)
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>

        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">

          {/* Email */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">

            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />

            <span className="truncate">
              {applicant.email || 'Not provided'}
            </span>

          </div>

          {/* Phone */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">

            <Phone className="w-4 h-4 text-purple-400 shrink-0" />

            <span>
              {applicant.phone || 'Not provided'}
            </span>

          </div>

          {/* Location */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">

            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />

            <span>
              {applicant.location || 'Not provided'}
            </span>

          </div>

        </div>

        {/* ============================================
             Resume PDF Viewer / Download
           ============================================ */}

        {application.resume && (

          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">

                <FileText className="w-5 h-5" />

              </div>

              <div>

                <h4 className="text-sm font-semibold text-white">
                  Candidate PDF Resume
                </h4>

                <p className="text-xs text-slate-400 truncate max-w-sm">
                  {application.resume}
                </p>

              </div>

            </div>

            {/* FIXED VIEW PDF BUTTON */}
            {resumeUrl && (

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
              >

                <ExternalLink className="w-3.5 h-3.5" />

                View PDF

              </a>

            )}

          </div>

        )}

        {/* Cover Letter */}
        {application.coverLetter && (

          <div className="space-y-2">

            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Cover Letter
            </h4>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-line">
              {application.coverLetter}
            </div>

          </div>

        )}

        {/* Candidate Skills */}
        {applicant.skills && applicant.skills.length > 0 && (

          <div className="space-y-2">

            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">

              <Code className="w-4 h-4 text-purple-400" />

              Skills & Tech Stack

            </h4>

            <div className="flex flex-wrap gap-1.5">

              {applicant.skills.map((sk, i) => (

                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {sk}
                </span>

              ))}

            </div>

          </div>

        )}

        {/* Education History */}
        {applicant.education && applicant.education.length > 0 && (

          <div className="space-y-3">

            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">

              <GraduationCap className="w-4 h-4 text-amber-400" />

              Education

            </h4>

            <div className="space-y-2">

              {applicant.education.map((edu, i) => (

                <div
                  key={i}
                  className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs"
                >

                  <div className="font-semibold text-white">
                    {edu.degree}
                  </div>

                  <div className="text-slate-400">
                    {edu.institution} • {edu.fieldOfStudy}
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default ApplicantDetailsModal;
