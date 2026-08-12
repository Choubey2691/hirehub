import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { Bell, CheckCheck, Circle, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const SeekerNotifications = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        showToast('All notifications marked as read', 'success');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time updates on your job applications and system alerts.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-white">No notifications</p>
          <p className="text-xs text-slate-500 mt-1">You will receive alerts here when recruiters review your applications.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              className={`p-4 rounded-2xl border transition flex items-start gap-4 cursor-pointer ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-indigo-950/20 border-indigo-500/30'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${n.isRead ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${n.isRead ? 'text-slate-200' : 'text-white'}`}>{n.title}</h4>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerNotifications;
