import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { TemplateEngine } from '../../services/attendance/TemplateEngine';
import {
  Sliders,
  FileText,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Server,
  Globe,
  Layers,
  Phone
} from 'lucide-react';

export const TemplatesSettingsPage: React.FC = () => {
  const {
    templates,
    settings,
    updateSettings,
    updateTemplate,
    resetSandboxData,
    students
  } = useAlertSystem();

  const [savedBanner, setSavedBanner] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.templateId || 'tpl-absent-sms-en');
  const [templateBody, setTemplateBody] = useState(
    templates.find((t) => t.templateId === selectedTemplateId)?.body || ''
  );

  // Settings state
  const [expectedTime, setExpectedTime] = useState(settings.expectedArrivalTime);
  const [gracePeriod, setGracePeriod] = useState(settings.gracePeriodMinutes);
  const [collegeShortName, setCollegeShortName] = useState(settings.collegeShortName);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);

  // Live test preview student
  const [testStudentId, setTestStudentId] = useState(students[0]?.studentId || '');
  const testStudent = students.find((s) => s.studentId === testStudentId);

  const selectedTemplate = templates.find((t) => t.templateId === selectedTemplateId);
  const templateEngine = new TemplateEngine();

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
    const found = templates.find((t) => t.templateId === id);
    if (found) {
      setTemplateBody(found.body);
    }
  };

  const handleSaveTemplate = () => {
    updateTemplate(selectedTemplateId, templateBody);
    setSavedBanner('Template updated successfully!');
    setTimeout(() => setSavedBanner(''), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      expectedArrivalTime: expectedTime,
      gracePeriodMinutes: Number(gracePeriod),
      collegeShortName,
      contactPhone
    });
    setSavedBanner('System thresholds and alert rules saved!');
    setTimeout(() => setSavedBanner(''), 3000);
  };

  const handleResetSandbox = () => {
    if (confirm('Restore all attendance records, directory profiles, and alerts to the factory demonstration baseline?')) {
      resetSandboxData();
      setSavedBanner('Sandbox restored to factory demo state.');
      setTimeout(() => setSavedBanner(''), 3000);
    }
  };

  // Render live preview
  const previewContext = {
    studentName: testStudent?.fullName || 'Aarav Kumar',
    studentId: testStudent?.studentId || 'STU-001',
    date: '2026-10-21',
    arrivalTime: '09:18 AM',
    className: testStudent?.className || 'CSE-B',
    parentName: 'Rajesh Kumar',
    collegeName: settings.collegeName,
    collegeShortName,
    contactPhone
  };

  const renderedPreview = templateEngine.render(templateBody, previewContext);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Message Templates, Alert Thresholds &amp; Architecture
          </h1>
          <Badge variant="primary">Rule Configuration</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure SMS and WhatsApp message formats, expected arrival times, grace periods, and review production deployment notes
        </p>
      </div>

      {savedBanner && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Templates Editor & Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            density="compact"
            accent="blue"
            title={
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Configurable Notification Templates</span>
              </div>
            }
            subtitle="Select a template, customize tokenized message body, and preview live variable replacement"
          >
            <div className="space-y-3 text-xs">
              {/* Template Selector Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {templates.map((tpl) => (
                  <button
                    key={tpl.templateId}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.templateId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedTemplateId === tpl.templateId
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tpl.alertType} ({tpl.channel.toUpperCase()} - {tpl.language.toUpperCase()})
                  </button>
                ))}
              </div>

              {/* Supported Tokens Pill Strip */}
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Supported Template Variables (Click to copy):
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {[
                    '[Student Name]',
                    '[Student ID]',
                    '[Date]',
                    '[Arrival Time]',
                    '[Class Name]',
                    '[Parent Name]',
                    '[College Short Name]',
                    '[Contact Phone]'
                  ].map((token) => (
                    <code
                      key={token}
                      onClick={() => setTemplateBody((prev) => `${prev} ${token}`)}
                      className="cursor-pointer bg-white px-1.5 py-0.5 rounded border border-slate-200 hover:border-blue-400 text-blue-800"
                      title="Click to insert at end"
                    >
                      {token}
                    </code>
                  ))}
                </div>
              </div>

              {/* Template Textarea */}
              <div>
                <label htmlFor="tpl-body-edit" className="block font-bold text-slate-800 mb-1">
                  Template Body:
                </label>
                <textarea
                  id="tpl-body-edit"
                  rows={4}
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  className="w-full p-2.5 font-sans text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Length: <strong className="text-slate-700 font-mono">{templateBody.length}</strong> chars
                </span>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </button>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Live Rendered Preview for Guardian</span>
                  </span>
                  <select
                    value={testStudentId}
                    onChange={(e) => setTestStudentId(e.target.value)}
                    className="px-2 py-0.5 rounded border border-slate-300 text-[11px] font-semibold bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.studentId} value={s.studentId}>
                        Preview: {s.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans shadow-2xs">
                  "{renderedPreview.text}"
                </div>

                {renderedPreview.missingVariables.length > 0 && (
                  <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Missing tokens: {renderedPreview.missingVariables.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* System Thresholds & Production Architecture Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Threshold Settings */}
          <Card
            density="compact"
            accent="amber"
            title={
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Attendance Alert Thresholds</span>
              </div>
            }
          >
            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="set-exp-time" className="block font-bold text-slate-800 mb-0.5">
                    Expected Arrival Time
                  </label>
                  <input
                    id="set-exp-time"
                    type="time"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="set-grace-mins" className="block font-bold text-slate-800 mb-0.5">
                    Grace Period (Minutes)
                  </label>
                  <input
                    id="set-grace-mins"
                    type="number"
                    min={0}
                    max={60}
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900">
                Rule: Students arriving after <strong>{expectedTime}</strong> + <strong>{gracePeriod} mins</strong> are flagged as <strong>Late Arrival</strong>.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="set-coll-short" className="block font-bold text-slate-800 mb-0.5">
                    College Short Tag
                  </label>
                  <input
                    id="set-coll-short"
                    type="text"
                    value={collegeShortName}
                    onChange={(e) => setCollegeShortName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="set-cont-phone" className="block font-bold text-slate-800 mb-0.5">
                    Inquiry Contact Phone
                  </label>
                  <input
                    id="set-cont-phone"
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Rule Settings</span>
              </button>
            </form>
          </Card>

          {/* Production Integration Notes */}
          <Card
            density="compact"
            accent="indigo"
            title={
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Future Integration Architecture</span>
              </div>
            }
          >
            <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <p>
                This prototype runs with <code>MockSMSProvider</code> and <code>MockWhatsAppProvider</code> in a decoupled architecture.
              </p>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1">
                <div>• <strong>SMS Adapter:</strong> Implements <code>INotificationProvider</code>. Swap mock provider with AWS SNS / Twilio SDK in <code>NotificationService.ts</code>.</div>
                <div>• <strong>WhatsApp Adapter:</strong> Swap mock provider with Meta WhatsApp Cloud API / Gupshup webhook handler.</div>
                <div>• <strong>Attendance Source:</strong> Currently powered by <code>CSVImportAdapter</code>. Replace with college attendance SQL database connector / webhook when API is authorized.</div>
              </div>
            </div>
          </Card>

          {/* Reset Sandbox Data */}
          <Card
            density="compact"
            accent="rose"
            title={
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reset Sandbox Baseline</span>
              </div>
            }
          >
            <div className="space-y-2 text-xs">
              <p className="text-[11px] text-slate-600">
                Wipe all test records, mock delivery logs, and imported CSVs, and restore the initial sample dataset.
              </p>
              <button
                type="button"
                onClick={handleResetSandbox}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Baseline</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
