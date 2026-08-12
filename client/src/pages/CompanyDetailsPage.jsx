import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Users, Globe, Briefcase } from 'lucide-react';
import { companyService } from '../services/companyService';
import JobCard from '../components/JobCard';
import { CardSkeleton } from '../components/SkeletonLoader';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetail();
  }, [id]);

  const fetchCompanyDetail = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanyById(id);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <CardSkeleton />
      </div>
    );
  }

  if (!data || !data.company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-white">
        Company not found.
      </div>
    );
  }

  const { company, jobs = [] } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Company Header Panel */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white">{company.name}</h1>
            <p className="text-sm font-semibold text-indigo-400">{company.industry || 'Technology Solutions'}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {company.location}
                </span>
              )}
              {company.size && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {company.size} employees
                </span>
              )}
            </div>
          </div>
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-sm flex items-center gap-2 border border-slate-700"
          >
            <Globe className="w-4 h-4" />
            Visit Website
          </a>
        )}
      </div>

      {/* Description */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="text-lg font-semibold text-white">About {company.name}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {company.description || 'Pioneering technology solutions provider building enterprise products.'}
        </p>
      </div>

      {/* Active Jobs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Active Job Openings ({jobs.length})
          </h2>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
            No active job openings at this company right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, company }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
