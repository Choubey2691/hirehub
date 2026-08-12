import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Briefcase, FileCheck, Bookmark, Bell, Settings,
  Building2, PlusCircle, Users, ShieldAlert, BarChart3, LogOut, Menu, X, ArrowLeft
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const seekerLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
    { label: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { label: 'My Applications', path: '/dashboard/applications', icon: FileCheck },
    { label: 'Saved Jobs', path: '/dashboard/saved', icon: Bookmark },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const recruiterLinks = [
    { label: 'Dashboard', path: '/recruiter', icon: LayoutDashboard, end: true },
    { label: 'Company Profile', path: '/recruiter/company', icon: Building2 },
    { label: 'Post a New Job', path: '/recruiter/jobs/create', icon: PlusCircle },
    { label: 'Manage Jobs', path: '/recruiter/jobs', icon: Briefcase },
    { label: 'Applicants', path: '/recruiter/applicants', icon: Users },
    { label: 'Notifications', path: '/recruiter/notifications', icon: Bell },
    { label: 'Settings', path: '/recruiter/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Platform Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Companies', path: '/admin/companies', icon: Building2 },
    { label: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navLinks = user?.role === 'recruiter' 
    ? recruiterLinks 
    : user?.role === 'admin' 
    ? adminLinks 
    : seekerLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Hire<span className="text-indigo-400">Hub</span>
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {user?.role}
          </span>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden border border-indigo-400/30">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Portal
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden glass-panel border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-white">HireHub</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 p-4 space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 text-sm text-rose-400 font-medium"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
