import {
  StudentAttendanceRecord,
  AlertStudent,
  CSVImportResult,
  AttendanceRecordStatus
} from '../../types/attendanceAlert';

export const SAMPLE_ATTENDANCE_CSV = `student_id,attendance_date,attendance_status,arrival_time
STU-001,2026-10-21,Absent,
STU-002,2026-10-21,Late,09:24 AM
STU-003,2026-10-21,Present,08:22 AM
STU-004,2026-10-21,Late,09:18 AM
STU-005,2026-10-21,Absent,
STU-006,2026-10-21,Present,08:26 AM
STU-007,2026-10-21,Absent,
STU-008,2026-10-21,Present,08:20 AM`;

export class CSVImportAdapter {
  /**
   * Parse CSV string into raw lines and columns, handling quotes and trim.
   */
  public parseRaw(csvText: string): { headers: string[]; rows: string[][] } {
    const lines = csvText.trim().split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[\s_-]/g, ''));
    const rows = lines.slice(1).map(parseLine);

    return { headers, rows };
  }

  /**
   * Validate CSV columns and process records with detailed error tracking.
   */
  public process(
    csvText: string,
    existingStudents: AlertStudent[],
    existingRecords: StudentAttendanceRecord[] = []
  ): CSVImportResult {
    const { headers, rows } = this.parseRaw(csvText);

    const errors: CSVImportResult['errors'] = [];
    const validRecords: StudentAttendanceRecord[] = [];
    let skippedRows = 0;

    // Check required columns
    const idIdx = headers.findIndex((h) => h === 'studentid' || h === 'student_id' || h === 'id' || h === 'registernumber');
    const dateIdx = headers.findIndex((h) => h === 'attendancedate' || h === 'attendance_date' || h === 'date');
    const statusIdx = headers.findIndex((h) => h === 'attendancestatus' || h === 'attendance_status' || h === 'status');
    const timeIdx = headers.findIndex((h) => h === 'arrivaltime' || h === 'arrival_time' || h === 'time');

    if (idIdx === -1 || dateIdx === -1 || statusIdx === -1) {
      errors.push({
        row: 1,
        rawText: headers.join(','),
        reason: 'Missing required CSV headers: student_id, attendance_date, attendance_status.'
      });

      return {
        totalRows: rows.length,
        acceptedRows: 0,
        skippedRows: 0,
        errorRows: rows.length,
        records: [],
        alertsGenerated: 0,
        errors,
        timestamp: new Date().toISOString()
      };
    }

    // Keep track of duplicates within the same CSV file
    const seenInFile = new Set<string>();

    rows.forEach((rowCols, index) => {
      const rowNumber = index + 2; // 1-indexed, header is row 1
      const rawText = rowCols.join(',');

      if (rowCols.length < 3 || rowCols.every((c) => !c.trim())) {
        skippedRows++;
        return;
      }

      const studentId = (rowCols[idIdx] || '').trim();
      const dateStr = (rowCols[dateIdx] || '').trim();
      const rawStatus = (rowCols[statusIdx] || '').trim().toLowerCase();
      const arrivalTime = timeIdx !== -1 ? (rowCols[timeIdx] || '').trim() : undefined;

      // Validate student ID
      if (!studentId) {
        errors.push({ row: rowNumber, rawText, reason: 'Empty student ID column.' });
        return;
      }

      const studentExists = existingStudents.some(
        (s) => s.studentId.toLowerCase() === studentId.toLowerCase() ||
               s.registerNumber.toLowerCase() === studentId.toLowerCase()
      );

      if (!studentExists) {
        errors.push({
          row: rowNumber,
          rawText,
          reason: `Student ID "${studentId}" not found in local Student and Guardian Directory.`
        });
        return;
      }

      // Validate date (YYYY-MM-DD format or ISO)
      if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        errors.push({
          row: rowNumber,
          rawText,
          reason: `Invalid date format "${dateStr}". Expected YYYY-MM-DD.`
        });
        return;
      }

      // Validate status
      let status: AttendanceRecordStatus | null = null;
      if (rawStatus === 'present' || rawStatus === 'p') status = 'Present';
      else if (rawStatus === 'absent' || rawStatus === 'a') status = 'Absent';
      else if (rawStatus === 'late' || rawStatus === 'l') status = 'Late';

      if (!status) {
        errors.push({
          row: rowNumber,
          rawText,
          reason: `Invalid attendance status "${rowCols[statusIdx]}". Must be Present, Absent, or Late.`
        });
        return;
      }

      // Check duplicate in same file
      const fileKey = `${studentId.toUpperCase()}_${dateStr}`;
      if (seenInFile.has(fileKey)) {
        errors.push({
          row: rowNumber,
          rawText,
          reason: `Duplicate row in CSV: student ${studentId} already listed for date ${dateStr}.`
        });
        return;
      }
      seenInFile.add(fileKey);

      // Check duplicate against existing records
      const alreadyInDb = existingRecords.some(
        (r) => (r.studentId.toUpperCase() === studentId.toUpperCase()) && r.date === dateStr
      );

      if (alreadyInDb) {
        skippedRows++;
        return; // Idempotent skip: already present in database
      }

      // Matched student canonical ID
      const matchedStudent = existingStudents.find(
        (s) => s.studentId.toLowerCase() === studentId.toLowerCase() ||
               s.registerNumber.toLowerCase() === studentId.toLowerCase()
      );

      validRecords.push({
        recordId: `REC-${dateStr}-${studentId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentId: matchedStudent ? matchedStudent.studentId : studentId,
        date: dateStr,
        status,
        arrivalTime: arrivalTime || undefined,
        source: 'csv_import',
        recordedAt: new Date().toISOString(),
        notes: `Imported via CSV file.`
      });
    });

    return {
      totalRows: rows.length,
      acceptedRows: validRecords.length,
      skippedRows,
      errorRows: errors.length,
      records: validRecords,
      alertsGenerated: 0,
      errors,
      timestamp: new Date().toISOString()
    };
  }
}
