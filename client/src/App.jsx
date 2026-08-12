import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Job Seeker Dashboard Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import SeekerApplications from './pages/seeker/SeekerApplications';
import SeekerSavedJobs from './pages/seeker/SeekerSavedJobs';
import SeekerNotifications from './pages/seeker/SeekerNotifications';
import SeekerSettings from './pages/seeker/SeekerSettings';

// Recruiter Portal Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterCompany from './pages/recruiter/RecruiterCompany';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Job Seeker Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<SeekerDashboard />} />
                <Route path="/dashboard/profile" element={<SeekerProfile />} />
                <Route path="/dashboard/applications" element={<SeekerApplications />} />
                <Route path="/dashboard/saved" element={<SeekerSavedJobs />} />
                <Route path="/dashboard/notifications" element={<SeekerNotifications />} />
                <Route path="/dashboard/settings" element={<SeekerSettings />} />
              </Route>
            </Route>

            {/* Recruiter Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/recruiter" element={<RecruiterDashboard />} />
                <Route path="/recruiter/company" element={<RecruiterCompany />} />
                <Route path="/recruiter/jobs" element={<ManageJobsPage />} />
                <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
                <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
                <Route path="/recruiter/notifications" element={<SeekerNotifications />} />
                <Route path="/recruiter/settings" element={<SeekerSettings />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/notifications" element={<SeekerNotifications />} />
                <Route path="/admin/settings" element={<SeekerSettings />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
