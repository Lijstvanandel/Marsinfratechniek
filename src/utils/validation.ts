import type { EmploymentType, MailConfig } from '../types';

export const ALLOWED_EMPLOYMENT_TYPES: EmploymentType[] = [
  'Fulltime (40 uur)',
  'Parttime (32-40 uur)',
  'BBL / Leerwerktraject',
  'ZZP / Projectbasis',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

export function isValidDocumentId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && ID_REGEX.test(id);
}

export function isValidEmailAddress(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length >= 5 && trimmed.length <= 160 && EMAIL_REGEX.test(trimmed);
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateContactInput(input: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const name = (input.name || '').trim();
  const company = (input.company || '').trim();
  const email = (input.email || '').trim();
  const phone = (input.phone || '').trim();
  const subject = (input.subject || '').trim();
  const message = (input.message || '').trim();

  if (name.length < 2 || name.length > 120) {
    errors.name = 'Vul een geldige naam in (2 tot 120 tekens).';
  }
  if (company.length > 120) {
    errors.company = 'Bedrijfsnaam mag maximaal 120 tekens bevatten.';
  }
  if (!isValidEmailAddress(email)) {
    errors.email = 'Vul een geldig e-mailadres in.';
  }
  if (phone.length < 6 || phone.length > 40) {
    errors.phone = 'Vul een geldig telefoonnummer in (minimaal 6 cijfers).';
  }
  if (subject.length < 2 || subject.length > 120) {
    errors.subject = 'Selecteer of vul een onderwerp in.';
  }
  if (message.length < 10 || message.length > 3000) {
    errors.message = 'Beschrijf uw aanvraag of vraag (minimaal 10 tekens).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateApplicationInput(input: {
  vacancyId: string;
  vacancyTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  motivation: string;
  cvFileName: string;
  cvDataUrl: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const vacancyId = (input.vacancyId || '').trim();
  const vacancyTitle = (input.vacancyTitle || '').trim();
  const applicantName = (input.applicantName || '').trim();
  const applicantEmail = (input.applicantEmail || '').trim();
  const applicantPhone = (input.applicantPhone || '').trim();
  const motivation = (input.motivation || '').trim();
  const cvFileName = (input.cvFileName || '').trim();
  const cvDataUrl = (input.cvDataUrl || '').trim();

  if (!isValidDocumentId(vacancyId)) {
    errors.vacancyId = 'Selecteer een geldige vacature.';
  }
  if (vacancyTitle.length < 2 || vacancyTitle.length > 120) {
    errors.vacancyTitle = 'Vacaturetitel ontbreekt.';
  }
  if (applicantName.length < 2 || applicantName.length > 120) {
    errors.applicantName = 'Vul uw volledige naam in (2 tot 120 tekens).';
  }
  if (!isValidEmailAddress(applicantEmail)) {
    errors.applicantEmail = 'Vul een geldig e-mailadres in.';
  }
  if (applicantPhone.length < 6 || applicantPhone.length > 40) {
    errors.applicantPhone = 'Vul een geldig telefoonnummer in.';
  }
  if (motivation.length < 5 || motivation.length > 3000) {
    errors.motivation = 'Vul een korte toelichting of motivatie in (minimaal 5 tekens).';
  }
  if (cvFileName.length < 1 || cvFileName.length > 200 || cvDataUrl.length < 5) {
    errors.cv = 'Upload uw CV (PDF, Word of tekstbestand) om te solliciteren.';
  }
  if (cvDataUrl.length > 750000) {
    errors.cv = 'Het geüploade CV-bestand is te groot (maximaal ~550 KB voor directe database-opslag).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVacancyInput(input: {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  level: string;
  salaryRange: string;
  summary: string;
  description: string;
  requirements: string;
  benefits: string;
  status: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if ((input.title || '').trim().length < 2 || (input.title || '').trim().length > 120) {
    errors.title = 'Functietitel moet tussen 2 en 120 tekens zijn.';
  }
  if ((input.department || '').trim().length < 2 || (input.department || '').trim().length > 80) {
    errors.department = 'Afdeling / vakgebied is verplicht (2-80 tekens).';
  }
  if ((input.location || '').trim().length < 2 || (input.location || '').trim().length > 80) {
    errors.location = 'Locatie / regio is verplicht (2-80 tekens).';
  }
  if (!ALLOWED_EMPLOYMENT_TYPES.includes(input.employmentType as EmploymentType)) {
    errors.employmentType = 'Kies een geldig dienstverband.';
  }
  if ((input.level || '').trim().length < 2 || (input.level || '').trim().length > 60) {
    errors.level = 'Vul een ervarings- of opleidingsniveau in.';
  }
  if ((input.salaryRange || '').trim().length < 2 || (input.salaryRange || '').trim().length > 80) {
    errors.salaryRange = 'Vul een salarisindicatie in.';
  }
  if ((input.summary || '').trim().length < 10 || (input.summary || '').trim().length > 400) {
    errors.summary = 'Korte samenvatting moet tussen 10 en 400 tekens zijn.';
  }
  if ((input.description || '').trim().length < 10 || (input.description || '').trim().length > 3000) {
    errors.description = 'Uitgebreide functieomschrijving moet tussen 10 en 3000 tekens zijn.';
  }
  if ((input.requirements || '').trim().length < 5 || (input.requirements || '').trim().length > 1500) {
    errors.requirements = 'Functie-eisen moeten tussen 5 en 1500 tekens zijn.';
  }
  if ((input.benefits || '').trim().length < 5 || (input.benefits || '').trim().length > 1500) {
    errors.benefits = 'Arbeidsvoorwaarden moeten tussen 5 en 1500 tekens zijn.';
  }
  if (input.status !== 'open' && input.status !== 'closed') {
    errors.status = 'Status moet open of closed zijn.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateMailConfigInput(config: MailConfig): ValidationResult {
  const errors: Record<string, string> = {};
  if (!isValidEmailAddress(config.recipientEmail || '')) {
    errors.recipientEmail = 'Vul een geldig primair ontvanger e-mailadres in.';
  }
  if (config.ccEmail && config.ccEmail.trim().length > 0 && !isValidEmailAddress(config.ccEmail)) {
    errors.ccEmail = 'Vul een geldig CC e-mailadres in of laat dit veld leeg.';
  }
  if ((config.senderName || '').trim().length < 2 || (config.senderName || '').trim().length > 120) {
    errors.senderName = 'Afzendernaam moet tussen 2 en 120 tekens zijn.';
  }
  const port = Number(config.smtpPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.smtpPort = 'SMTP-poort moet tussen 1 en 65535 liggen (bijv. 587 of 465).';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
