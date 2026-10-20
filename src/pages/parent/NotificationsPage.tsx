import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
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
  Filter,
  CheckCheck
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
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <Badge variant="danger" dot>{unreadCount} Unread</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time activity alerts for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.className})
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Prototype Simulated Push Notification Notice */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong className="block font-bold">Automated Attendance & Academic Event Dispatcher:</strong>
          These triggers demonstrate instant college-to-parent alerts. In production, attendance muster and exam publications automatically broadcast via college SMS gateway and Firebase Cloud Messaging (FCM).
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unread')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'unread'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Attendance Alerts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'academic'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Academic Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('leave')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'leave'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Leave Sanctions
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <Card>
            <EmptyState
              icon={Bell}
              title="No Notifications Found"
              description="You have no notifications or alerts matching the selected category."
            />
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            let icon = <Bell className="w-4 h-4 text-blue-600" />;
            let categoryBadgeVariant: 'primary' | 'warning' | 'danger' | 'success' | 'info' = 'primary';

            if (notif.category === 'attendance') {
              if (notif.title.includes('Late')) {
                icon = <Clock className="w-4 h-4 text-amber-600" />;
                categoryBadgeVariant = 'warning';
              } else {
                icon = <AlertTriangle className="w-4 h-4 text-rose-600" />;
                categoryBadgeVariant = 'danger';
              }
            } else if (notif.category === 'academic') {
              icon = <BookOpen className="w-4 h-4 text-blue-600" />;
              categoryBadgeVariant = 'info';
            } else if (notif.category === 'leave') {
              icon = <Calendar className="w-4 h-4 text-emerald-600" />;
              categoryBadgeVariant = 'success';
            }

            return (
              <div
                key={notif.notificationId}
                className={`p-3.5 rounded-xl border transition-all ${
                  !notif.readStatus
                    ? 'bg-white border-blue-200/90 shadow-2xs ring-1 ring-blue-100'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3
                          className={`text-xs font-bold leading-tight ${
                            !notif.readStatus ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {notif.title}
                        </h3>
                        <Badge variant={categoryBadgeVariant} size="xs">
                          {notif.category}
                        </Badge>
                        {!notif.readStatus && (
                          <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                        Dispatched: {notif.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!notif.readStatus && (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notif.notificationId)}
                        className="text-xs text-slate-500 hover:text-blue-700 font-semibold px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    {notif.actionUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationAsRead(notif.notificationId);
                          navigate(notif.actionUrl!);
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
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
