import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
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
  Pin,
  Printer,
  X
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
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              College Notices & Circulars
            </h1>
            <Badge variant="primary">Official Bulletin</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional announcements, examination timetables, holiday notices, and parent meeting circulars
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 pr-7 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Announcements Grid */}
      {filteredAnnouncements.length === 0 ? (
        <Card>
          <EmptyState
            icon={Megaphone}
            title="No Circulars Found"
            description="No college notices match your search criteria. Try selecting 'All' or clearing your search query."
            action={{
              label: 'Reset Filters',
              onClick: () => {
                setCategoryFilter('All');
                setSearchQuery('');
              }
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredAnnouncements.map((ann, idx) => (
            <div
              key={ann.announcementId}
              onClick={() => setSelectedAnnouncement(ann)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={
                        ann.priority === 'Urgent'
                          ? 'danger'
                          : ann.priority === 'Important'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="xs"
                    >
                      {ann.category}
                    </Badge>
                    {idx === 0 && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        <Pin className="w-2.5 h-2.5 text-amber-600" />
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {ann.publishedAt.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {ann.message}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
                  {ann.publishedBy}
                </span>
                <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                  {ann.attachmentName && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <FileText className="w-3 h-3" />
                      PDF
                    </span>
                  )}
                  <span>View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal to View Announcement */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="xs">{selectedAnnouncement.category}</Badge>
              <span className="text-[11px] text-slate-400 font-mono">
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
                    alert(`Simulated download: ${selectedAnnouncement.attachmentName}`)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors border border-blue-200"
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
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {selectedAnnouncement.title}
            </h2>

            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {selectedAnnouncement.message}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span>Issuing Authority: <strong className="text-slate-800">{selectedAnnouncement.publishedBy}</strong></span>
              <span>Priority: <strong className="text-slate-800">{selectedAnnouncement.priority}</strong></span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
