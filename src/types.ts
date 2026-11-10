export type EmploymentType =
  | 'Fulltime (40 uur)'
  | 'Parttime (32-40 uur)'
  | 'BBL / Leerwerktraject'
  | 'ZZP / Projectbasis';

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  level: string;
  salaryRange: string;
  summary: string;
  description: string;
  requirements: string;
  benefits: string;
  status: 'open' | 'closed';
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  motivation: string;
  cvFileName: string;
  cvMimeType: string;
  cvDataUrl: string;
  emailDispatched: 'sent' | 'queued' | 'failed';
  status: 'new' | 'reviewed' | 'invited' | 'archived';
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  emailDispatched: 'sent' | 'queued' | 'failed';
  status: 'new' | 'handled';
  createdAt: string;
}

export interface MailConfig {
  recipientEmail: string;
  ccEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  forwardContacts: boolean;
  forwardApplications: boolean;
  autoReplyApplicant: boolean;
  updatedBy?: string;
  updatedAt?: string;
}

export interface EmailLogEntry {
  id: string;
  timestamp: string;
  type: 'contact' | 'sollicitatie' | 'test';
  to: string;
  cc: string;
  subject: string;
  attachmentName?: string;
  mode: 'smtp' | 'direct-relay';
  status: 'sent' | 'queued';
  previewInfo: string;
}

export interface ServiceItem {
  number: string;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  image: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Kabels & Leidingen' | 'Grondwerk & Wegenbouw' | 'Riolering & Bestrating';
  location: string;
  client: string;
  year: string;
  scopeMetric: string;
  summary: string;
  technicalDetails: string[];
  image: string;
}
