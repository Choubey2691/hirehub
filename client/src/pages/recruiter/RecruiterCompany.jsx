import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import { useToast } from '../../context/ToastContext';
import { Building2, Save, Globe, MapPin, Users, Sparkles } from 'lucide-react';

const RecruiterCompany = () => {
  const { showToast } = useToast();

  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    size: '50-100'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanies();
      if (res.success && res.data) {
        // Find company where recruiter equals logged in user
        // Or pick first company for demo
        if (res.data.length > 0) {
          const comp = res.data[0];
          setCompanyId(comp._id);
          setFormData({
            name: comp.name || '',
            logo: comp.logo || '',
            description: comp.description || '',
            website: comp.website || '',
            industry: comp.industry || '',
            location: comp.location || '',
            size: comp.size || '50-100'
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Company name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      let res;
      if (companyId) {
        res = await companyService.updateCompany(companyId, formData);
      } else {
        res = await companyService.createCompany(formData);
      }

      if (res.success) {
        showToast('Company profile saved successfully!', 'success');
        if (res.data._id) setCompanyId(res.data._id);
      }
    } catch (error) {
      showToast(error.message || 'Failed to save company profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Employer Company Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Set up your organization brand page to display on job postings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-indigo-400" />
          Company Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. InnovateX Technologies"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Logo Image URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Industry Sector
            </label>
            <input
              type="text"
              placeholder="e.g. Software & SaaS, Fintech, AI"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Headquarters Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, India"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Size
            </label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="50-200">50-200 Employees</option>
              <option value="200-500">200-500 Employees</option>
              <option value="500-1000">500-1000 Employees</option>
              <option value="1000+">1000+ Enterprise</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Description & Mission
            </label>
            <textarea
              rows="4"
              placeholder="Overview of your company culture, technology stack, products, and mission statement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Company Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecruiterCompany;
