import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { 
  User, Mail, Phone, MapPin, FileText, Upload, Plus, Trash2, 
  Save, GraduationCap, Briefcase, Code, Sparkles, ExternalLink 
} from 'lucide-react';

const SeekerProfile = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    profileImage: ''
  });

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);

  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
        profileImage: user.profileImage || ''
      });
      setEducation(user.education || []);
      setExperience(user.experience || []);
      setProjects(user.projects || []);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateProfile({
        ...formData,
        education,
        experience,
        projects
      });

      if (res.success) {
        updateUserState(res.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const data = new FormData();
      data.append('resume', file);

      const res = await userService.uploadResume(data);
      if (res.success) {
        updateUserState({ resume: res.data.resume });
        showToast('Resume PDF uploaded successfully!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to upload resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Education Helpers
  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' }]);
  };
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };
  const updateEduField = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  // Experience Helpers
  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }]);
  };
  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };
  const updateExpField = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  // Project Helpers
  const addProject = () => {
    setProjects([...projects, { title: '', description: '', link: '' }]);
  };
  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const updateProjField = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white">My Candidate Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Keep your resume, skills, education, and work experience up to date for recruiters.
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-indigo-400" />
            Basic Personal Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Profile Photo URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Professional Bio / Summary
              </label>
              <textarea
                rows="3"
                placeholder="Brief description of your career expertise, passion, and engineering goals..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="w-5 h-5 text-purple-400" />
            Skills & Technologies
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Comma-Separated Skills (e.g. React.js, Node.js, TypeScript, Docker)
            </label>
            <input
              type="text"
              placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* PDF Resume Uploader */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            Resume Attachment (PDF)
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800">
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.resume ? 'Resume Attached' : 'No Resume Uploaded'}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                {user?.resume || 'Upload your PDF resume to easily apply for jobs.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user?.resume && (
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-indigo-400 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View PDF
                </a>
              )}

              <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-md shadow-indigo-600/20">
                <Upload className="w-3.5 h-3.5" />
                Upload PDF
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              Education History
            </h2>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>

          {education.map((edu, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4 relative">
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={edu.degree || ''}
                    onChange={(e) => updateEduField(idx, 'degree', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. NIT Karnataka"
                    value={edu.institution || ''}
                    onChange={(e) => updateEduField(idx, 'institution', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button Floating/Bottom */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-xl shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeekerProfile;
