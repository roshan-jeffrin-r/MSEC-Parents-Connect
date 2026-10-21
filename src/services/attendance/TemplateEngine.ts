import { MessageTemplate, AlertType, NotificationChannel, SupportedLanguage } from '../../types/attendanceAlert';

export interface TemplateContext {
  studentName: string;
  studentId: string;
  date: string;
  arrivalTime?: string;
  className?: string;
  parentName?: string;
  collegeName?: string;
  collegeShortName?: string;
  contactPhone?: string;
}

export const DEFAULT_TEMPLATES: MessageTemplate[] = [
  // Absence — SMS — English
  {
    templateId: 'tpl-absent-sms-en',
    alertType: 'Absent',
    channel: 'sms',
    language: 'en',
    body: 'Dear Parent/Guardian, our attendance record indicates that [Student Name] ([Student ID]) was marked absent on [Date]. Please contact the college at [Contact Phone] if you need clarification. — [College Short Name]'
  },
  // Absence — WhatsApp — English
  {
    templateId: 'tpl-absent-wa-en',
    alertType: 'Absent',
    channel: 'whatsapp',
    language: 'en',
    body: 'Dear [Parent Name], this is an automated attendance alert from [College Name]. Our attendance muster records that your ward [Student Name] ([Student ID], [Class Name]) was marked absent on [Date]. If this record requires correction, please contact the class advisor or administrative office at [Contact Phone]. — [College Short Name]'
  },
  // Late Arrival — SMS — English
  {
    templateId: 'tpl-late-sms-en',
    alertType: 'Late',
    channel: 'sms',
    language: 'en',
    body: 'Dear Parent/Guardian, [Student Name] ([Student ID]) was recorded arriving at [Arrival Time] on [Date], later than the configured arrival time. — [College Short Name]'
  },
  // Late Arrival — WhatsApp — English
  {
    templateId: 'tpl-late-wa-en',
    alertType: 'Late',
    channel: 'whatsapp',
    language: 'en',
    body: 'Dear [Parent Name], this is an attendance notification from [College Name]. Your ward [Student Name] ([Student ID], [Class Name]) was recorded arriving on campus at [Arrival Time] on [Date], after the official commencement bell. Please advise your ward regarding punctual attendance. — [College Short Name]'
  },
  // Absence — SMS — Tamil (Preview/Architecture support)
  {
    templateId: 'tpl-absent-sms-ta',
    alertType: 'Absent',
    channel: 'sms',
    language: 'ta',
    body: 'பெற்றோர்/பாதுகாவலருக்கு வணக்கம். [Date] அன்று [Student Name] ([Student ID]) வருகைப்பதிவில் வரவில்லை என பதிவாகியுள்ளது. தொடர்பு: [Contact Phone] — [College Short Name]'
  },
  // Late Arrival — SMS — Tamil (Preview/Architecture support)
  {
    templateId: 'tpl-late-sms-ta',
    alertType: 'Late',
    channel: 'sms',
    language: 'ta',
    body: 'பெற்றோர்/பாதுகாவலருக்கு வணக்கம். [Date] அன்று [Student Name] ([Student ID]) [Arrival Time] மணிக்கு தாமதமாக கல்லூரிக்கு வந்துள்ளார். — [College Short Name]'
  }
];

export class TemplateEngine {
  private templates: MessageTemplate[];

  constructor(customTemplates?: MessageTemplate[]) {
    this.templates = customTemplates || DEFAULT_TEMPLATES;
  }

  public getTemplate(
    alertType: AlertType,
    channel: NotificationChannel,
    language: SupportedLanguage = 'en'
  ): MessageTemplate | undefined {
    return (
      this.templates.find(
        (t) => t.alertType === alertType && t.channel === channel && t.language === language
      ) ||
      this.templates.find(
        (t) => t.alertType === alertType && t.channel === channel && t.language === 'en'
      )
    );
  }

  public render(
    templateBody: string,
    context: TemplateContext
  ): { text: string; missingVariables: string[] } {
    const missing: string[] = [];

    const replacements: Record<string, string | undefined> = {
      '[Student Name]': context.studentName,
      '[Student ID]': context.studentId,
      '[Date]': context.date,
      '[Arrival Time]': context.arrivalTime || 'N/A',
      '[Class Name]': context.className || '',
      '[Parent Name]': context.parentName || 'Parent/Guardian',
      '[College Name]': context.collegeName || 'Meenakshi Sundararajan Engineering College',
      '[College Short Name]': context.collegeShortName || 'MSEC',
      '[Contact Phone]': context.contactPhone || '044-24801636'
    };

    let rendered = templateBody;

    // Detect missing mandatory variables
    if (!context.studentName) missing.push('[Student Name]');
    if (!context.studentId) missing.push('[Student ID]');
    if (!context.date) missing.push('[Date]');
    if (templateBody.includes('[Arrival Time]') && !context.arrivalTime) {
      missing.push('[Arrival Time]');
    }

    Object.entries(replacements).forEach(([token, value]) => {
      rendered = rendered.split(token).join(value || '');
    });

    return {
      text: rendered.trim(),
      missingVariables: missing
    };
  }

  public renderForAlert(
    alertType: AlertType,
    channel: NotificationChannel,
    language: SupportedLanguage,
    context: TemplateContext
  ): { text: string; missingVariables: string[] } {
    const template = this.getTemplate(alertType, channel, language);
    if (!template) {
      return {
        text: `[${alertType} Alert]: ${context.studentName} (${context.studentId}) on ${context.date}.`,
        missingVariables: []
      };
    }
    return this.render(template.body, context);
  }
}
