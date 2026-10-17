import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Announcement } from '../../types';
import {
  Megaphone,
  Plus,
  Send,
  CheckCircle2,
  FileText,
  Trash2
} from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { announcements, createAnnouncement } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Examination');
  const [priority, setPriority] = useState<Announcement['priority']>('Important');
  const [publishedBy, setPublishedBy] = useState('Dr. R. Ramanathan (Controller of Examinations)');
  const [attachmentName, setAttachmentName] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !message) return;

    createAnnouncement({
      title,
      message,
      category,
      priority,
      publishedBy,
      attachmentName: attachmentName || undefined
    });

    setSuccessBanner('Official circular published and broadcasted to all parent portals!');
    setTitle('');
    setMessage('');
    setAttachmentName('');
    setTimeout(() => setSuccessBanner(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Circulars & Broadcasts
          </h1>
          <Badge variant="primary">Official Communication</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish official notices, timetables, and meeting schedules to parent and faculty dashboards
        </p>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Grid: Create Announcement Form & Existing List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Form */}
        <div className="lg:col-span-1">
          <Card
            title={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Publish New Circular</span>
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Circular Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Lab Practical Examinations..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                >
                  <option value="Examination">Examination</option>
                  <option value="Academic">Academic</option>
                  <option value="Event">Event / Meeting</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Administration">Administration & Fee</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Priority Flag
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  value={publishedBy}
                  onChange={(e) => setPublishedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Circular Message / Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full notice text..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Attachment Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule_Nov2026.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Parents</span>
              </button>
            </form>
          </Card>
        </div>

        {/* Existing Announcements */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Live Published Circulars ({announcements.length})</span>
              </div>
            }
          >
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.announcementId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">{ann.category}</Badge>
                      <Badge variant={ann.priority === 'Urgent' ? 'danger' : 'neutral'} size="sm">
                        {ann.priority}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{ann.publishedAt}</span>
                  </div>

                  <strong className="text-slate-900 text-xs sm:text-sm block">{ann.title}</strong>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.message}</p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Issued By: <strong className="text-slate-700">{ann.publishedBy}</strong></span>
                    {ann.attachmentName && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <FileText className="w-3.5 h-3.5" />
                        {ann.attachmentName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
