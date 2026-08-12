import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import JobFilterSidebar from '../components/JobFilterSidebar';
import { CardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ totalJobs: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    workMode: searchParams.get('workMode') || '',
    experience: searchParams.get('experience') || '',
    minSalary: searchParams.get('minSalary') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobs(filters);
      if (res.success) {
        setJobs(res.data.jobs || []);
        setPagination(res.data.pagination || { totalJobs: 0, totalPages: 1, currentPage: 1 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      location: '',
      jobType: '',
      workMode: '',
      experience: '',
      minSalary: '',
      sort: 'latest',
      page: 1
    };
    setFilters(reset);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Find Your Next Role</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse through {pagination.totalJobs || 0} active job postings from top technology employers.
          </p>
        </div>

        {/* Live Search Inputs Bar */}
        <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800">
            <Search className="w-5 h-5 text-indigo-400 shrink-0" />
            <input
              type="text"
              placeholder="Search title, skills, keywords..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800">
            <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
            <input
              type="text"
              placeholder="Location e.g. Bengaluru, Remote..."
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value, page: 1 }))}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-1">
          <JobFilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <JobFilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Job Cards Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Controls Bar: Sort & Count */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>
              Showing <strong className="text-white">{jobs.length}</strong> of{' '}
              <strong className="text-white">{pagination.totalJobs}</strong> jobs
            </span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 hidden sm:inline">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="latest">Latest First</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Job List / Loader / Empty */}
          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No matching jobs found"
              message="Try broadening your search query or removing location/job type filters."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-medium text-slate-400">
                Page <strong className="text-white">{pagination.currentPage}</strong> of{' '}
                <strong className="text-white">{pagination.totalPages}</strong>
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
