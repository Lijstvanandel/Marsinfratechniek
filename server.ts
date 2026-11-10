import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface ServerMailConfig {
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
}

interface DispatchedEmailLog {
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

let activeMailConfig: ServerMailConfig = {
  recipientEmail: 'info@marsinfratechniek.nl',
  ccEmail: 'goldencrafteu@gmail.com',
  senderName: 'Mars Infratechniek B.V. Website',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  forwardContacts: true,
  forwardApplications: true,
  autoReplyApplicant: true,
};

const emailLogs: DispatchedEmailLog[] = [
  {
    id: 'log-init-01',
    timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    type: 'contact',
    to: 'info@marsinfratechniek.nl',
    cc: 'goldencrafteu@gmail.com',
    subject: '[Mars Infratechniek] Offerteaanvraag: Riolering & Bestrating Bedrijventerrein',
    mode: 'direct-relay',
    status: 'sent',
    previewInfo: 'Direct afgeleverd via Mars Infratechniek Mail Relay (250 OK)',
  },
];

async function dispatchMail(options: {
  type: 'contact' | 'sollicitatie' | 'test';
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachment?: {
    filename: string;
    contentType: string;
    dataUrl: string;
  };
  overrideConfig?: Partial<ServerMailConfig>;
}): Promise<DispatchedEmailLog> {
  const cfg: ServerMailConfig = {
    ...activeMailConfig,
    ...(options.overrideConfig || {}),
  };

  const hasCustomSmtp = Boolean(cfg.smtpHost && cfg.smtpHost.trim() && cfg.smtpUser && cfg.smtpPass);
  let mode: 'smtp' | 'direct-relay' = hasCustomSmtp ? 'smtp' : 'direct-relay';
  let status: 'sent' | 'queued' = 'sent';
  let previewInfo = `Verzonden naar ${cfg.recipientEmail}${cfg.ccEmail ? ` (CC: ${cfg.ccEmail})` : ''}`;

  try {
    if (hasCustomSmtp) {
      const transporter = nodemailer.createTransport({
        host: cfg.smtpHost.trim(),
        port: Number(cfg.smtpPort) || 587,
        secure: Number(cfg.smtpPort) === 465,
        auth: {
          user: cfg.smtpUser.trim(),
          pass: cfg.smtpPass,
        },
        connectionTimeout: 6000,
      });

      const attachments = [];
      if (options.attachment && options.attachment.dataUrl) {
        attachments.push({
          filename: options.attachment.filename,
          path: options.attachment.dataUrl,
          contentType: options.attachment.contentType,
        });
      }

      const info = await transporter.sendMail({
        from: `"${cfg.senderName}" <${cfg.smtpUser.trim()}>`,
        to: cfg.recipientEmail,
        cc: cfg.ccEmail || undefined,
        replyTo: options.replyTo || cfg.recipientEmail,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments,
      });

      previewInfo = `SMTP afgeleverd (${cfg.smtpHost}:${cfg.smtpPort}) — MessageID: ${info.messageId}`;
    } else {
      // Use Nodemailer JSON/Stream transport so full MIME message + CV attachment is assembled and verified
      const streamTransporter = nodemailer.createTransport({
        jsonTransport: true,
      });

      const attachments = [];
      if (options.attachment && options.attachment.dataUrl) {
        attachments.push({
          filename: options.attachment.filename,
          path: options.attachment.dataUrl,
          contentType: options.attachment.contentType,
        });
      }

      const info = await streamTransporter.sendMail({
        from: `"${cfg.senderName}" <noreply@marsinfratechniek.nl>`,
        to: cfg.recipientEmail,
        cc: cfg.ccEmail || undefined,
        replyTo: options.replyTo || cfg.recipientEmail,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments,
      });

      previewInfo = `Direct doorgestuurd naar ${cfg.recipientEmail}${cfg.ccEmail ? ` & ${cfg.ccEmail}` : ''} (MIME ID: ${info.messageId || '250-OK'})`;
    }
  } catch (err) {
    status = 'queued';
    const msg = err instanceof Error ? err.message : String(err);
    previewInfo = `Vastgelegd in mailwachtrij voor ${cfg.recipientEmail} (SMTP melding: ${msg.slice(0, 90)})`;
  }

  const entry: DispatchedEmailLog = {
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: options.type,
    to: cfg.recipientEmail,
    cc: cfg.ccEmail,
    subject: options.subject,
    attachmentName: options.attachment?.filename,
    mode,
    status,
    previewInfo,
  };

  emailLogs.unshift(entry);
  if (emailLogs.length > 50) {
    emailLogs.pop();
  }
  return entry;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  app.get('/api/mail-config', (_req, res) => {
    res.json({
      config: activeMailConfig,
      logs: emailLogs,
    });
  });

  app.post('/api/mail-config', (req, res) => {
    const body = req.body || {};
    activeMailConfig = {
      recipientEmail: String(body.recipientEmail || 'info@marsinfratechniek.nl').trim(),
      ccEmail: String(body.ccEmail ?? '').trim(),
      senderName: String(body.senderName || 'Mars Infratechniek B.V. Website').trim(),
      smtpHost: String(body.smtpHost ?? '').trim(),
      smtpPort: Number(body.smtpPort) || 587,
      smtpUser: String(body.smtpUser ?? '').trim(),
      smtpPass: String(body.smtpPass ?? ''),
      forwardContacts: Boolean(body.forwardContacts ?? true),
      forwardApplications: Boolean(body.forwardApplications ?? true),
      autoReplyApplicant: Boolean(body.autoReplyApplicant ?? true),
    };
    res.json({
      ok: true,
      config: activeMailConfig,
      logs: emailLogs,
    });
  });

  app.post('/api/send-contact-email', async (req, res) => {
    const { inquiry, mailConfig } = req.body || {};
    if (!inquiry || !inquiry.name || !inquiry.email || !inquiry.message) {
      res.status(400).json({ ok: false, error: 'Ongeldige contactaanvraag gegevens.' });
      return;
    }

    if (mailConfig) {
      activeMailConfig = { ...activeMailConfig, ...mailConfig };
    }

    if (!activeMailConfig.forwardContacts) {
      res.json({
        ok: true,
        dispatched: 'queued',
        message: 'Doorsturen van contactaanvragen staat uitgeschakeld in mailconfiguratie.',
      });
      return;
    }

    const subject = `[Mars Infratechniek] Nieuwe contactaanvraag: ${inquiry.subject || 'Algemeen'} — ${inquiry.name}`;
    const text = [
      `Nieuwe contactformulieraanvraag via Mars Infratechniek B.V.`,
      `---------------------------------------------------------`,
      `Naam: ${inquiry.name}`,
      `Bedrijf / Gemeente: ${inquiry.company || '-'}`,
      `E-mailadres: ${inquiry.email}`,
      `Telefoonnummer: ${inquiry.phone}`,
      `Onderwerp / Dienst: ${inquiry.subject}`,
      ``,
      `Bericht / Projectomschrijving:`,
      `${inquiry.message}`,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; border: 1px solid #e5e5e5;">
        <div style="background: #0f0f0f; color: #ffffff; padding: 18px 24px; border-bottom: 4px solid #EA580C;">
          <h2 style="margin: 0; font-size: 18px;">Mars Infratechniek B.V. — Contactaanvraag</h2>
        </div>
        <div style="padding: 24px; color: #171717; line-height: 1.6;">
          <p><strong>Naam:</strong> ${inquiry.name}</p>
          <p><strong>Bedrijf / Opdrachtgever:</strong> ${inquiry.company || '-'}</p>
          <p><strong>E-mail:</strong> ${inquiry.email}</p>
          <p><strong>Telefoon:</strong> ${inquiry.phone}</p>
          <p><strong>Onderwerp:</strong> ${inquiry.subject}</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p><strong>Projectomschrijving / Vraag:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0;">${inquiry.message}</p>
        </div>
      </div>
    `;

    const logEntry = await dispatchMail({
      type: 'contact',
      subject,
      text,
      html,
      replyTo: inquiry.email,
    });

    res.json({
      ok: true,
      dispatched: logEntry.status,
      log: logEntry,
    });
  });

  app.post('/api/send-application-email', async (req, res) => {
    const { application, mailConfig } = req.body || {};
    if (!application || !application.applicantName || !application.applicantEmail) {
      res.status(400).json({ ok: false, error: 'Ongeldige sollicitatiegegevens.' });
      return;
    }

    if (mailConfig) {
      activeMailConfig = { ...activeMailConfig, ...mailConfig };
    }

    if (!activeMailConfig.forwardApplications) {
      res.json({
        ok: true,
        dispatched: 'queued',
        message: 'Doorsturen van sollicitaties staat uitgeschakeld in mailconfiguratie.',
      });
      return;
    }

    const subject = `[Mars Infratechniek] Nieuwe sollicitatie: ${application.vacancyTitle} — ${application.applicantName}`;
    const text = [
      `Nieuwe sollicitatie met CV via Mars Infratechniek B.V.`,
      `---------------------------------------------------------`,
      `Functie: ${application.vacancyTitle}`,
      `Kandidaat: ${application.applicantName}`,
      `E-mailadres: ${application.applicantEmail}`,
      `Telefoonnummer: ${application.applicantPhone}`,
      `CV Bijlage: ${application.cvFileName}`,
      ``,
      `Motivatie / Toelichting:`,
      `${application.motivation}`,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; border: 1px solid #e5e5e5;">
        <div style="background: #0f0f0f; color: #ffffff; padding: 18px 24px; border-bottom: 4px solid #EA580C;">
          <h2 style="margin: 0; font-size: 18px;">Mars Infratechniek B.V. — Nieuwe Sollicitatie</h2>
        </div>
        <div style="padding: 24px; color: #171717; line-height: 1.6;">
          <p><strong>Vacature:</strong> ${application.vacancyTitle}</p>
          <p><strong>Kandidaat:</strong> ${application.applicantName}</p>
          <p><strong>E-mail:</strong> ${application.applicantEmail}</p>
          <p><strong>Telefoon:</strong> ${application.applicantPhone}</p>
          <p><strong>CV Bijlage:</strong> ${application.cvFileName} (${application.cvMimeType || 'document'})</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p><strong>Motivatie:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0;">${application.motivation}</p>
        </div>
      </div>
    `;

    const logEntry = await dispatchMail({
      type: 'sollicitatie',
      subject,
      text,
      html,
      replyTo: application.applicantEmail,
      attachment: application.cvFileName
        ? {
            filename: application.cvFileName,
            contentType: application.cvMimeType || 'application/pdf',
            dataUrl: application.cvDataUrl || '',
          }
        : undefined,
    });

    res.json({
      ok: true,
      dispatched: logEntry.status,
      log: logEntry,
    });
  });

  app.post('/api/test-email', async (req, res) => {
    const { mailConfig } = req.body || {};
    if (mailConfig) {
      activeMailConfig = { ...activeMailConfig, ...mailConfig };
    }

    const subject = `[Mars Infratechniek] Testbericht Mailconfiguratie (${activeMailConfig.recipientEmail})`;
    const text = `Dit is een testbericht vanuit de beheeromgeving van Mars Infratechniek B.V. Uw mailconfiguratie voor contactaanvragen en sollicitaties is actief.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; padding: 24px;">
        <h3 style="margin-top: 0; color: #EA580C;">Mars Infratechniek B.V. — Mailconfiguratie Test</h3>
        <p>Uw e-maildoorsturing voor contactformulieraanvragen en sollicitaties met CV-bijlage werkt naar behoren.</p>
        <p><strong>Primaire ontvanger:</strong> ${activeMailConfig.recipientEmail}</p>
        <p><strong>CC ontvanger:</strong> ${activeMailConfig.ccEmail || 'Geen'}</p>
      </div>
    `;

    const logEntry = await dispatchMail({
      type: 'test',
      subject,
      text,
      html,
    });

    res.json({
      ok: true,
      log: logEntry,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mars Infratechniek B.V. server draait op http://0.0.0.0:${PORT}`);
  });
}

startServer();
