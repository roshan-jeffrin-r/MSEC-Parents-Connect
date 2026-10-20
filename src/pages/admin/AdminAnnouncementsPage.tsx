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
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Campus Circulars &amp; Broadcasts
          </h1>
          <Badge variant="primary">Official Communication</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Publish official notices, timetables, and meeting schedules to parent and faculty dashboards
        </p>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Grid: Create Announcement Form & Existing List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Creator Form (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            density="compact"
            accent="blue"
            title={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Publish New Circular</span>
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label htmlFor="circular-title" className="block font-bold text-slate-800 mb-0.5">
                  Circular Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="circular-title"
                  type="text"
                  required
                  placeholder="e.g. Schedule for Lab Practical Examinations..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="circular-category" className="block font-bold text-slate-800 mb-0.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="circular-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event / Meeting</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Administration">Administration &amp; Fee</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="circular-priority" className="block font-bold text-slate-800 mb-0.5">
                    Priority Flag
                  </label>
                  <select
                    id="circular-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="circular-auth" className="block font-bold text-slate-800 mb-0.5">
                  Issuing Authority
                </label>
                <input
                  id="circular-auth"
                  type="text"
                  value={publishedBy}
                  onChange={(e) => setPublishedBy(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="circular-msg" className="block font-bold text-slate-800 mb-0.5">
                  Circular Message / Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="circular-msg"
                  required
                  rows={3}
                  placeholder="Enter full notice text..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="circular-attachment" className="block font-bold text-slate-800 mb-0.5">
                  Attachment Name (Optional)
                </label>
                <input
                  id="circular-attachment"
                  type="text"
                  placeholder="e.g. Schedule_Nov2026.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 mt-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast to Parents</span>
              </button>
            </form>
          </Card>
        </div>

        {/* Existing Announcements (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            density="compact"
            title={
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Live Published Circulars ({announcements.length})</span>
              </div>
            }
          >
            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div key={ann.announcementId} className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="primary" size="sm">{ann.category}</Badge>
                      <Badge variant={ann.priority === 'Urgent' ? 'danger' : 'neutral'} size="sm">
                        {ann.priority}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{ann.publishedAt}</span>
                  </div>

                  <strong className="text-slate-900 text-xs font-bold block">{ann.title}</strong>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.message}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <span>Issued By: <strong className="text-slate-700">{ann.publishedBy}</strong></span>
                    {ann.attachmentName && (
                      <span className="flex items-center gap-1 text-blue-700 font-mono text-[10px] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60">
                        <FileText className="w-3 h-3 text-blue-600" />
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
