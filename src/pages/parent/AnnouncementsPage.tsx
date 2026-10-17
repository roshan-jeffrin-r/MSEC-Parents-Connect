import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Announcement } from '../../types';
import {
  Megaphone,
  Calendar,
  FileText,
  Search,
  Filter,
  Download,
  AlertCircle,
  Clock,
  Pin
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const categories = ['All', 'Examination', 'Event', 'Holiday', 'Administration', 'Academic'];

  const filteredAnnouncements = announcements.filter((ann) => {
    if (categoryFilter !== 'All' && ann.category !== categoryFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ann.title.toLowerCase().includes(q) ||
        ann.message.toLowerCase().includes(q) ||
        ann.publishedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              College Notices & Circulars
            </h1>
            <Badge variant="primary">Official Bulletin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional announcements, examination timetables, holiday notices, and parent meeting circulars
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.map((ann, idx) => (
          <div
            key={ann.announcementId}
            onClick={() => setSelectedAnnouncement(ann)}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      ann.priority === 'Urgent'
                        ? 'danger'
                        : ann.priority === 'Important'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {ann.category}
                  </Badge>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {ann.publishedAt.split(' ')[0]}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {ann.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                {ann.message}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                {ann.publishedBy}
              </span>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
                {ann.attachmentName && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <FileText className="w-3.5 h-3.5" />
                    Attachment
                  </span>
                )}
                <span>Read Full Circular →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal to View Announcement */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={
            <div className="flex items-center gap-2">
              <Badge variant="primary">{selectedAnnouncement.category}</Badge>
              <span className="text-xs text-slate-400 font-normal">
                {selectedAnnouncement.publishedAt}
              </span>
            </div>
          }
          maxWidth="lg"
          footer={
            <div className="w-full flex items-center justify-between">
              {selectedAnnouncement.attachmentName ? (
                <button
                  type="button"
                  onClick={() =>
                    alert(`Downloading simulated file: ${selectedAnnouncement.attachmentName}`)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {selectedAnnouncement.attachmentName}</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {selectedAnnouncement.title}
            </h2>

            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedAnnouncement.message}
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Authority: <strong className="text-slate-800">{selectedAnnouncement.publishedBy}</strong></span>
              <span>Priority: <strong className="text-slate-800">{selectedAnnouncement.priority}</strong></span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
