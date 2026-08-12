
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { applicationService } from "../../services/applicationService";
import { savedJobService } from "../../services/savedJobService";
import {
  FileCheck,
  Bookmark,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { CardSkeleton } from "../../components/SkeletonLoader";
import { formatDate } from "../../utils/formatters";

const SeekerDashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [appRes, savedRes] = await Promise.all([
        applicationService.getMyApplications(),
        savedJobService.getSavedJobs(),
      ]);

      if (appRes?.success) {
        setApplications(appRes.data || []);
      }

      if (savedRes?.success) {
        setSavedJobsCount(savedRes.data?.length || 0);
      }
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalApps = applications.length;

  const shortlistedApps = applications.filter(
    (app) =>
      app.status === "Shortlisted" ||
      app.status === "Interview" ||
      app.status === "Selected"
  ).length;

  const underReviewApps = applications.filter(
    (app) =>
      app.status === "Under Review" ||
      app.status === "Applied"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Job Seeker Portal
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || "Job Seeker"}! 👋
          </h1>

          <p className="text-slate-400 text-sm">
            Track your submitted job applications and explore new hiring
            opportunities.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 shrink-0 self-start md:self-auto"
        >
          Explore New Jobs
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Applied */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Applied
            </span>

            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="text-3xl font-extrabold text-white">
            {totalApps}
          </div>
        </div>

        {/* Under Review */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Under Review
            </span>

            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="text-3xl font-extrabold text-purple-400">
            {underReviewApps}
          </div>
        </div>

        {/* Shortlisted */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Shortlisted / Interview
            </span>

            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="text-3xl font-extrabold text-emerald-400">
            {shortlistedApps}
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Saved Jobs
            </span>

            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>

          <div className="text-3xl font-extrabold text-amber-400">
            {savedJobsCount}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Recent Applications
            </h2>

            <p className="text-xs text-slate-400">
              Track application progress and status changes
            </p>
          </div>

          <Link
            to="/dashboard/applications"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            You haven't applied to any jobs yet.{" "}
            <Link
              to="/jobs"
              className="text-indigo-400 underline font-medium"
            >
              Browse jobs now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">
                    Job Title & Company
                  </th>

                  <th className="px-4 py-3">
                    Applied On
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {applications.slice(0, 5).map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-900/40 transition"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {app.job?.title || "Job Listing"}
                      </div>

                      <div className="text-xs text-indigo-400">
                        {app.job?.company?.name || "Company"}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      {formatDate(app.appliedAt || app.createdAt)}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {app.job && (
                        <Link
                          to={`/jobs/${app.job._id || app.job}`}
                          className="text-xs font-semibold text-indigo-400 hover:underline"
                        >
                          View Job
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;

