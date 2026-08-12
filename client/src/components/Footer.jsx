import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Hire<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              HireHub is the next-generation full-stack job platform connecting top engineering talent with leading tech companies worldwide.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 bg-slate-900 hover:text-white hover:bg-slate-800 rounded-lg transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:text-white hover:bg-slate-800 rounded-lg transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:text-white hover:bg-slate-800 rounded-lg transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Job Seekers</h4>
            <ul className="space-y-2.5">
              <li><Link to="/jobs" className="hover:text-indigo-400 transition">Browse All Jobs</Link></li>
              <li><Link to="/jobs?workMode=Remote" className="hover:text-indigo-400 transition">Remote Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-indigo-400 transition">Top Companies</Link></li>
              <li><Link to="/dashboard/saved" className="hover:text-indigo-400 transition">Saved Bookmarks</Link></li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Recruiters</h4>
            <ul className="space-y-2.5">
              <li><Link to="/recruiter/jobs/create" className="hover:text-indigo-400 transition">Post a Job</Link></li>
              <li><Link to="/recruiter" className="hover:text-indigo-400 transition">Recruiter Dashboard</Link></li>
              <li><Link to="/recruiter/company" className="hover:text-indigo-400 transition">Company Profile</Link></li>
              <li><Link to="/register?role=recruiter" className="hover:text-indigo-400 transition">Hire Talent</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">HireHub</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HireHub Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern tech hiring.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
