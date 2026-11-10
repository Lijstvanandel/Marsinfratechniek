import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidDocumentId,
  isValidEmailAddress,
  validateApplicationInput,
  validateContactInput,
  validateMailConfigInput,
  validateVacancyInput,
} from './validation';

test('isValidDocumentId accepts safe alphanumeric IDs and rejects poisoned IDs', () => {
  assert.equal(isValidDocumentId('vac-kabels-01'), true);
  assert.equal(isValidDocumentId('open_sollicitatie_2026'), true);
  assert.equal(isValidDocumentId(''), false);
  assert.equal(isValidDocumentId('bad/id/with/slashes'), false);
  assert.equal(isValidDocumentId('a'.repeat(129)), false);
});

test('validateContactInput validates required contact form fields', () => {
  const validResult = validateContactInput({
    name: 'Jan de Vries',
    company: 'Gemeente Dalfsen',
    email: 'j.devries@dalfsen.nl',
    phone: '0529 - 401540',
    subject: 'Grondwerk & Wegenbouw',
    message: 'Graag ontvangen wij een vrijblijvende offerte voor het bouwrijp maken van 4 kavels.',
  });
  assert.equal(validResult.valid, true);

  const invalidResult = validateContactInput({
    name: 'J',
    email: 'geen-email',
    phone: '123',
    subject: '',
    message: 'Te kort',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.message);
});

test('validateApplicationInput enforces CV upload and candidate details', () => {
  const missingCv = validateApplicationInput({
    vacancyId: 'vac-kabels-01',
    vacancyTitle: 'Monteur Kabels & Leidingen',
    applicantName: 'Koen Jansen',
    applicantEmail: 'koen@example.nl',
    applicantPhone: '0612345678',
    motivation: 'Ik heb 6 jaar ervaring in de ondergrondse infra.',
    cvFileName: '',
    cvDataUrl: '',
  });
  assert.equal(missingCv.valid, false);
  assert.ok(missingCv.errors.cv);

  const validApp = validateApplicationInput({
    vacancyId: 'vac-kabels-01',
    vacancyTitle: 'Monteur Kabels & Leidingen',
    applicantName: 'Koen Jansen',
    applicantEmail: 'koen@example.nl',
    applicantPhone: '0612345678',
    motivation: 'Ik heb 6 jaar ervaring in de ondergrondse infra.',
    cvFileName: 'CV_Koen_Jansen.pdf',
    cvDataUrl: 'data:application/pdf;base64,JVBERi0xLjQK',
  });
  assert.equal(validApp.valid, true);
});

test('validateVacancyInput and validateMailConfigInput enforce blueprint boundaries', () => {
  const vacResult = validateVacancyInput({
    title: 'Senior Uitvoerder GWW',
    department: 'Grondwerk & Wegenbouw',
    location: 'Dalfsen / Overijssel',
    employmentType: 'Fulltime (40 uur)',
    level: 'MBO-4 Civiele Techniek',
    salaryRange: '€ 3.800 - € 4.750 bruto p/m',
    summary: 'Aansturen van grond-, weg- en waterbouwprojecten in regio Overijssel.',
    description: 'Als uitvoerder ben je verantwoordelijk voor de dagelijkse gang van zaken op onze projectlocaties.',
    requirements: 'MBO werk- en denkniveau\nVCA-VOL gecertificeerd\nRijbewijs B(E)',
    benefits: 'Uitstekend salaris conform CAO Bouw & Infra\nEigen werkbus en telefoon',
    status: 'open',
  });
  assert.equal(vacResult.valid, true);

  const mailResult = validateMailConfigInput({
    recipientEmail: 'info@marsinfratechniek.nl',
    ccEmail: 'goldencrafteu@gmail.com',
    senderName: 'Mars Infratechniek Website',
    smtpHost: 'smtp.marsinfratechniek.nl',
    smtpPort: 587,
    smtpUser: 'info@marsinfratechniek.nl',
    smtpPass: 'geheim',
    forwardContacts: true,
    forwardApplications: true,
    autoReplyApplicant: true,
  });
  assert.equal(mailResult.valid, true);
  assert.equal(isValidEmailAddress('info@marsinfratechniek.nl'), true);
});
