import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, TrendingUp, Building2, Users, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Award, Star, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { jobService } from '../services/jobService';
import JobCard from '../components/JobCard';
import { CardSkeleton } from '../components/SkeletonLoader';

const CATEGORIES = [
  { name: 'Engineering', count: '450+ Jobs', icon: Briefcase, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Product & Design', count: '180+ Jobs', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { name: 'Data & AI', count: '210+ Jobs', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Fintech & Finance', count: '140+ Jobs', icon: Building2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await jobService.getJobs({ limit: 6 });
      if (res.success) {
        setFeaturedJobs(res.data.jobs || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Next-Gen Full-Stack Hiring Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Find the right job. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Build your future.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore 10,000+ verified engineering, product, and data roles at top companies. Connect directly with recruiters and manage your applications seamlessly.
          </motion.p>

          {/* SEARCH BAR CARD */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="glass-panel p-3 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col md:flex-row gap-3 mt-8"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Popular Tag Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {['React.js', 'Node.js', 'Remote', 'Full Stack', 'DevOps', 'UI/UX'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              15,000+
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Active Job Listings</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              2,500+
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Verified Companies</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              85,000+
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Job Seekers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
              94%
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Hiring Success Rate</div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Top Hiring Opportunities</span>
            <h2 className="text-3xl font-bold text-white mt-1">Featured Jobs</h2>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            Explore All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Explore By Specialty</span>
          <h2 className="text-3xl font-bold text-white mt-1">Popular Job Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.name)}`)}
                className="glass-card rounded-2xl p-6 cursor-pointer border border-slate-800 hover:border-slate-700 transition space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-3xl font-bold text-white">How HireHub Works</h2>
          <p className="text-slate-400 text-sm">Getting hired or recruiting talent takes less than 3 steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-indigo-500/30">
              1
            </div>
            <h3 className="text-lg font-semibold text-white">Create Your Profile</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sign up as a job seeker or recruiter, upload your PDF resume or company logo, and set up your skills.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-purple-500/30">
              2
            </div>
            <h3 className="text-lg font-semibold text-white">Apply or Post Jobs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Search roles with advanced salary and remote filters. Submit 1-click applications with custom cover letters.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-4 relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-emerald-500/30">
              3
            </div>
            <h3 className="text-lg font-semibold text-white">Track & Get Hired</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive real-time notifications as recruiters update your application status from Under Review to Selected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-10 md:p-14 border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-slate-300 text-base">
              Join thousands of tech professionals and recruiters on HireHub today. Free setup in under 2 minutes.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register?role=jobseeker"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
              >
                Join as Job Seeker
              </Link>
              <Link
                to="/register?role=recruiter"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition border border-slate-700"
              >
                Post Jobs as Recruiter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
