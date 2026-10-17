import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { GoogleFormStudentRecord } from '../../types';
import {
  SAMPLE_GOOGLE_FORM_CSV,
  SAMPLE_GOOGLE_FORM_JSON
} from '../../data/mockData';
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ArrowRight,
  Database,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';

export const GoogleFormSyncPage: React.FC = () => {
  const { importGoogleFormRecords } = useApp();

  const [inputFormat, setInputFormat] = useState<'csv' | 'json'>('csv');
  const [rawText, setRawText] = useState<string>(SAMPLE_GOOGLE_FORM_CSV);
  const [parsedPreview, setParsedPreview] = useState<GoogleFormStudentRecord[]>([]);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    studentsAdded: number;
    familiesCount: number;
    siblingsLinkedCount: number;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // CSV Parser
  const parseCSV = (csvText: string): GoogleFormStudentRecord[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const records: GoogleFormStudentRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < headers.length) continue;

      const rec: any = {};
      headers.forEach((h, idx) => {
        rec[h] = cols[idx];
      });

      records.push({
        registerNumber: rec.registerNumber || `REG-${i}`,
        fullName: rec.fullName || 'Student',
        department: rec.department || 'Computer Science and Engineering',
        className: rec.className || 'CSE-B',
        semester: Number(rec.semester) || 1,
        batch: rec.batch || '2025-2029',
        parentName: rec.parentName || 'Parent',
        relation: rec.relation || 'Father',
        parentPhone: rec.parentPhone || '',
        parentEmail: rec.parentEmail || ''
      });
    }

    return records;
  };

  const handleParse = () => {
    setErrorMsg('');
    try {
      if (inputFormat === 'json') {
        const parsed = JSON.parse(rawText);
        if (!Array.isArray(parsed)) throw new Error('JSON input must be an array of student records.');
        setParsedPreview(parsed);
      } else {
        const parsed = parseCSV(rawText);
        if (parsed.length === 0) throw new Error('Could not parse any valid rows from CSV. Please check formatting.');
        setParsedPreview(parsed);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Parsing error. Please verify CSV or JSON syntax.');
      setParsedPreview([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      if (file.name.endsWith('.json')) {
        setInputFormat('json');
      } else {
        setInputFormat('csv');
      }
    };
    reader.readAsText(file);
  };

  const handleCommitSync = () => {
    let toSync = parsedPreview;
    if (toSync.length === 0) {
      try {
        toSync = inputFormat === 'json' ? JSON.parse(rawText) : parseCSV(rawText);
      } catch (e: any) {
        setErrorMsg(e.message);
        return;
      }
    }

    const result = importGoogleFormRecords(toSync);
    setSyncResult(result);
  };

  // Group siblings in preview to show visual grouping
  const siblingGroups: { [key: string]: GoogleFormStudentRecord[] } = {};
  parsedPreview.forEach((p) => {
    const key = (p.parentPhone?.replace(/\D/g, '').slice(-10) || p.parentEmail?.toLowerCase() || 'single').trim();
    if (!siblingGroups[key]) siblingGroups[key] = [];
    siblingGroups[key].push(p);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Google Form Data Auto-Sorter &amp; Sibling Linker
            </h1>
            <Badge variant="primary">Onboarding Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Import Google Forms survey data, auto-sort by batch &amp; class, assign advisors, and link siblings into unified parent profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInputFormat('csv');
              setRawText(SAMPLE_GOOGLE_FORM_CSV);
              setParsedPreview(parseCSV(SAMPLE_GOOGLE_FORM_CSV));
              setSyncResult(null);
            }}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setInputFormat('json');
              setRawText(JSON.stringify(SAMPLE_GOOGLE_FORM_JSON, null, 2));
              setParsedPreview(SAMPLE_GOOGLE_FORM_JSON);
              setSyncResult(null);
            }}
            className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample JSON</span>
          </button>
        </div>
      </div>

      {/* Sync Result Banner */}
      {syncResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{syncResult.message}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/80 font-medium text-emerald-800">
            <div>Students Synced: <strong>{syncResult.studentsAdded}</strong></div>
            <div>Unique Families: <strong>{syncResult.familiesCount}</strong></div>
            <div>Siblings Linked: <strong>{syncResult.siblingsLinkedCount}</strong></div>
            <div>Assigned Advisors: <strong>Dr. Kavitha Menon &amp; Prof. S. Ramesh</strong></div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input / Upload Box */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Input Google Form Student &amp; Parent Data</span>
          </div>
        }
        subtitle="Expected fields: registerNumber, fullName, department, className, semester, batch, parentName, relation, parentPhone, parentEmail"
        action={
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV / JSON</span>
              <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700">Format:</span>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={inputFormat === 'csv'}
                onChange={() => setInputFormat('csv')}
              />
              <span>CSV (Comma-Separated)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="radio"
                name="format"
                value="json"
                checked={inputFormat === 'json'}
                onChange={() => setInputFormat('json')}
              />
              <span>JSON (Array of Objects)</span>
            </label>
          </div>

          <textarea
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your CSV or JSON data here..."
            className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleParse}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Parse &amp; Analyze Sibling Links</span>
            </button>

            <button
              type="button"
              onClick={handleCommitSync}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>Commit &amp; Sync to Portal Database</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Sibling Linker & Sorting Preview */}
      {parsedPreview.length > 0 && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-600" />
              <span>Sorted Hierarchy &amp; Sibling Groupings ({parsedPreview.length} records parsed)</span>
            </div>
          }
          subtitle="Auto-sorted by batch -> className -> fullName. Students sharing parent phone or email are unified."
        >
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Batch &amp; Class</th>
                  <th className="py-2.5 px-3">Reg No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Assigned Advisor</th>
                  <th className="py-2.5 px-3">Parent Name &amp; Phone</th>
                  <th className="py-2.5 px-3 text-center">Sibling Link Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedPreview.map((rec) => {
                  const key = (rec.parentPhone?.replace(/\D/g, '').slice(-10) || rec.parentEmail?.toLowerCase() || '').trim();
                  const isSibling = siblingGroups[key] && siblingGroups[key].length > 1;

                  const advisor = rec.className.toUpperCase().includes('ECE')
                    ? 'Prof. S. Ramesh'
                    : 'Dr. Kavitha Menon';

                  return (
                    <tr
                      key={rec.registerNumber}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSibling ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        <span className="block">{rec.className}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rec.batch} • Sem {rec.semester}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{rec.registerNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{rec.fullName}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {advisor}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-800 block">{rec.parentName} ({rec.relation})</strong>
                        <span className="text-[11px] text-slate-500">{rec.parentPhone} • {rec.parentEmail}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isSibling ? (
                          <Badge variant="success" size="sm">
                            Linked ({siblingGroups[key].length} Siblings)
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Single Student</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};