import React, { useState } from 'react';
import { X, FileText, Upload, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.resume && !resumeFile) {
      showToast('Please attach or upload a PDF resume to apply', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (user?.resume) {
        formData.append('resumeUrl', user.resume);
      }

      const res = await applicationService.applyForJob(job._id, formData);

      if (res.success) {
        showToast('Application submitted successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Apply for {job.title}</h3>
            <p className="text-xs text-indigo-400 font-medium">{job.company?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Resume Option */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Resume Attachment
            </label>

            {user?.resume && !resumeFile ? (
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Profile Resume</div>
                    <div className="text-xs text-slate-400 truncate max-w-[220px]">{user.resume}</div>
                  </div>
                </div>
                <label className="text-xs text-indigo-400 hover:underline cursor-pointer font-medium">
                  Change
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center hover:border-indigo-500/50 transition">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">
                  {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF format, max 10MB</p>
                <label className="inline-block mt-3 px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-indigo-400 hover:bg-slate-700 cursor-pointer transition">
                  Browse File
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Cover Letter / Message to Recruiter (Optional)
            </label>
            <textarea
              rows="4"
              placeholder="Introduce yourself and explain why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {submitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
