import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Building2, Globe, MapPin, Users } from 'lucide-react';
import { TableSkeleton } from '../../components/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCompanies();
      if (res.success) {
        setCompanies(res.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Employer Companies</h1>
        <p className="text-slate-400 text-sm mt-1">
          Registered company profiles and hiring recruiter associations.
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
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Industry & Size</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Recruiter Account</th>
                  <th className="px-6 py-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0 overflow-hidden">
                          {c.logo ? (
                            <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">
                              {c.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div className="font-medium text-white">{c.industry || 'Technology'}</div>
                      <div className="text-slate-400">{c.size || '50-100'} employees</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {c.location || 'Unspecified'}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-300">
                      {c.recruiter?.name || 'Recruiter'}
                      <div className="text-slate-500">{c.recruiter?.email}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(c.createdAt)}
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

export default AdminCompaniesPage;
