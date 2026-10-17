import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Calendar,
  Send,
  Info,
  ShieldAlert,
  ArrowRight,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentStudent
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('all');

  const unreadCount = notifications.filter((n) => !n.readStatus).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.readStatus;
    if (activeTab === 'attendance') return n.category === 'attendance';
    if (activeTab === 'academic') return n.category === 'academic';
    if (activeTab === 'leave') return n.category === 'leave';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <Badge variant="danger">{unreadCount} Unread Alerts</Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time activity feed for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.className})
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Prototype Simulated Push Notification Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-semibold">Simulated In-App Notification Stream</strong>
          These alerts demonstrate the parent communication workflow for the faculty prototype. In the proposed production integration, these triggers would automatically dispatch SMS alerts via the college SMS gateway and push notifications through Firebase Cloud Messaging (FCM).
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'unread'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Attendance Alerts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'academic'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Academic Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leave')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'leave'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Leave Status
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            let icon = <Bell className="w-5 h-5 text-blue-600" />;
            let categoryBadgeVariant: 'primary' | 'warning' | 'danger' | 'success' | 'info' = 'primary';

            if (notif.category === 'attendance') {
              if (notif.title.includes('Late')) {
                icon = <Clock className="w-5 h-5 text-amber-600" />;
                categoryBadgeVariant = 'warning';
              } else {
                icon = <AlertTriangle className="w-5 h-5 text-rose-600" />;
                categoryBadgeVariant = 'danger';
              }
            } else if (notif.category === 'academic') {
              icon = <BookOpen className="w-5 h-5 text-blue-600" />;
              categoryBadgeVariant = 'info';
            } else if (notif.category === 'leave') {
              icon = <Calendar className="w-5 h-5 text-emerald-600" />;
              categoryBadgeVariant = 'success';
            }

            return (
              <div
                key={notif.notificationId}
                className={`p-4 rounded-xl border transition-all ${
                  !notif.readStatus
                    ? 'bg-white border-blue-200 shadow-xs ring-1 ring-blue-100'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-xs sm:text-sm font-bold ${!notif.readStatus ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </h3>
                        <Badge variant={categoryBadgeVariant} size="sm">
                          {notif.category}
                        </Badge>
                        {!notif.readStatus && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                        Dispatched: {notif.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.readStatus && (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notif.notificationId)}
                        className="text-xs text-slate-500 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    {notif.actionUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationAsRead(notif.notificationId);
                          navigate(notif.actionUrl!);
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
