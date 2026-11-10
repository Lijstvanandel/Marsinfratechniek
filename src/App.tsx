/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { type ActiveTab, Navbar } from './components/Navbar';
import { VacaturesView } from './components/VacaturesView';
import {
  INITIAL_APPLICATIONS,
  INITIAL_INQUIRIES,
  INITIAL_VACANCIES,
} from './data/initialData';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import type {
  ContactInquiry,
  EmailLogEntry,
  JobApplication,
  MailConfig,
  Vacancy,
} from './types';

function formatTimestamp(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string' && val.length > 0) {
    return val;
  }
  return new Date().toISOString();
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(false);

  const [vacancies, setVacancies] = useState<Vacancy[]>(INITIAL_VACANCIES);
  const [applications, setApplications] =
    useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(INITIAL_INQUIRIES);

  const [mailConfig, setMailConfig] = useState<MailConfig>({
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
  });

  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);

  // 1. Sync initial server mail configuration & email logs
  useEffect(() => {
    fetch('/api/mail-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.config) {
          setMailConfig(data.config);
        }
        if (Array.isArray(data?.logs)) {
          setEmailLogs(data.logs);
        }
      })
      .catch(() => {
        // Offline or dev fallback
      });
  }, []);

  // 2. Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, []);

  // 3. Listen to Firestore vacancies when authenticated as Firebase Admin
  useEffect(() => {
    if (!firebaseUser) return;

    const unsubVac = onSnapshot(
      collection(db, 'vacancies'),
      (snap) => {
        if (!snap.empty) {
          const loaded: Vacancy[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title,
              department: data.department,
              location: data.location,
              employmentType: data.employmentType,
              level: data.level,
              salaryRange: data.salaryRange,
              summary: data.summary,
              description: data.description,
              requirements: data.requirements,
              benefits: data.benefits,
              status: data.status,
              authorId: data.authorId,
              createdAt: formatTimestamp(data.createdAt),
              updatedAt: formatTimestamp(data.updatedAt),
            };
          });
          setVacancies((prev) => {
            const byId = new Map<string, Vacancy>();
            prev.forEach((v) => byId.set(v.id, v));
            loaded.forEach((v) => byId.set(v.id, v));
            return Array.from(byId.values());
          });
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'vacancies');
        } catch {
          // Handled and logged
        }
      }
    );

    return () => unsubVac();
  }, [firebaseUser]);

  const handleNavigate = (tab: ActiveTab, sectionId?: string) => {
    setActiveTab(tab);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Contact Inquiry (saves + sends immediate email via backend)
  const handleSubmitInquiry = async (
    inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status' | 'emailDispatched'>
  ): Promise<{
    ok: boolean;
    dispatched: 'sent' | 'queued' | 'failed';
    previewInfo?: string;
  }> => {
    const id = `inq-${Date.now()}`;
    let dispatched: 'sent' | 'queued' | 'failed' = 'sent';
    let previewInfo = `Direct verzonden naar ${mailConfig.recipientEmail}`;

    try {
      const resp = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry: inquiryData,
          mailConfig,
        }),
      });
      if (resp.ok) {
        const body = await resp.json();
        dispatched = body.dispatched || 'sent';
        if (body.log) {
          previewInfo = body.log.previewInfo;
          setEmailLogs((prev) => [body.log, ...prev]);
        }
      }
    } catch {
      dispatched = 'queued';
    }

    const newInquiry: ContactInquiry = {
      id,
      ...inquiryData,
      emailDispatched: dispatched,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    // Also persist to Firestore /inquiries/{id}
    try {
      await setDoc(doc(db, 'inquiries', id), {
        name: newInquiry.name,
        company: newInquiry.company,
        email: newInquiry.email,
        phone: newInquiry.phone,
        subject: newInquiry.subject,
        message: newInquiry.message,
        emailDispatched: newInquiry.emailDispatched,
        status: 'new',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
      } catch {
        // Logged via handleFirestoreError
      }
    }

    return { ok: true, dispatched, previewInfo };
  };

  // Submit Job Application with CV Upload (saves + sends immediate email with CV attachment)
  const handleSubmitApplication = async (
    appData: Omit<JobApplication, 'id' | 'createdAt' | 'status' | 'emailDispatched'>
  ): Promise<{
    ok: boolean;
    dispatched: 'sent' | 'queued' | 'failed';
    previewInfo?: string;
  }> => {
    const id = `app-${Date.now()}`;
    let dispatched: 'sent' | 'queued' | 'failed' = 'sent';
    let previewInfo = `Direct met CV verzonden naar ${mailConfig.recipientEmail}`;

    try {
      const resp = await fetch('/api/send-application-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: appData,
          mailConfig,
        }),
      });
      if (resp.ok) {
        const body = await resp.json();
        dispatched = body.dispatched || 'sent';
        if (body.log) {
          previewInfo = body.log.previewInfo;
          setEmailLogs((prev) => [body.log, ...prev]);
        }
      }
    } catch {
      dispatched = 'queued';
    }

    const newApp: JobApplication = {
      id,
      ...appData,
      emailDispatched: dispatched,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    try {
      await setDoc(doc(db, 'applications', id), {
        vacancyId: newApp.vacancyId,
        vacancyTitle: newApp.vacancyTitle,
        applicantName: newApp.applicantName,
        applicantEmail: newApp.applicantEmail,
        applicantPhone: newApp.applicantPhone,
        motivation: newApp.motivation,
        cvFileName: newApp.cvFileName,
        cvMimeType: newApp.cvMimeType,
        cvDataUrl: newApp.cvDataUrl,
        emailDispatched: newApp.emailDispatched,
        status: 'new',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `applications/${id}`);
      } catch {
        // Logged via handleFirestoreError
      }
    }

    return { ok: true, dispatched, previewInfo };
  };

  // Admin: Login / Logout
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setIsLocalAdmin(true);
    }
  };

  const handleLocalAdminLogin = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'admin@marsinfratechniek.nl' ||
        cleanUser === 'info@marsinfratechniek.nl' ||
        cleanUser === 'goldencrafteu@gmail.com') &&
      password === 'MarsInfra2026!'
    ) {
      setIsLocalAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    setIsLocalAdmin(false);
    if (firebaseUser) {
      await signOut(auth);
    }
  };

  // Admin: Save or Update Vacancy
  const handleSaveVacancy = async (
    vacancyData: Omit<Vacancy, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const id = existingId || `vac-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const authorId = firebaseUser?.uid || 'admin-mars';

    if (existingId) {
      setVacancies((prev) =>
        prev.map((v) =>
          v.id === existingId
            ? {
                ...v,
                ...vacancyData,
                updatedAt: nowIso,
              }
            : v
        )
      );
    } else {
      const createdVacancy: Vacancy = {
        id,
        ...vacancyData,
        authorId,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setVacancies((prev) => [createdVacancy, ...prev]);
    }

    if (firebaseUser) {
      try {
        if (existingId) {
          await updateDoc(doc(db, 'vacancies', existingId), {
            ...vacancyData,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(doc(db, 'vacancies', id), {
            ...vacancyData,
            authorId: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        try {
          handleFirestoreError(
            error,
            existingId ? OperationType.UPDATE : OperationType.CREATE,
            `vacancies/${id}`
          );
        } catch {
          // Handled
        }
      }
    }
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'vacancies', vacancyId));
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.DELETE, `vacancies/${vacancyId}`);
        } catch {
          // Handled
        }
      }
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: JobApplication['status']
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
    );
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'applications', applicationId), { status });
      } catch (error) {
        try {
          handleFirestoreError(
            error,
            OperationType.UPDATE,
            `applications/${applicationId}`
          );
        } catch {
          // Handled
        }
      }
    }
  };

  const handleUpdateInquiryStatus = async (
    inquiryId: string,
    status: ContactInquiry['status']
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'inquiries', inquiryId), { status });
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.UPDATE, `inquiries/${inquiryId}`);
        } catch {
          // Handled
        }
      }
    }
  };

  const handleSaveMailConfig = async (newConfig: MailConfig) => {
    setMailConfig(newConfig);
    try {
      const resp = await fetch('/api/mail-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.logs)) {
          setEmailLogs(data.logs);
        }
      }
    } catch {
      // Offline fallback
    }

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'settings', 'mailConfig'), {
          recipientEmail: newConfig.recipientEmail,
          ccEmail: newConfig.ccEmail,
          senderName: newConfig.senderName,
          smtpHost: newConfig.smtpHost,
          smtpPort: Number(newConfig.smtpPort) || 587,
          smtpUser: newConfig.smtpUser,
          smtpPass: newConfig.smtpPass,
          forwardContacts: Boolean(newConfig.forwardContacts),
          forwardApplications: Boolean(newConfig.forwardApplications),
          autoReplyApplicant: Boolean(newConfig.autoReplyApplicant),
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.WRITE, 'settings/mailConfig');
        } catch {
          // Handled
        }
      }
    }
  };

  const handleSendTestEmail = async (
    configToTest: MailConfig
  ): Promise<EmailLogEntry | null> => {
    try {
      const resp = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mailConfig: configToTest }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.log) {
          setEmailLogs((prev) => [data.log, ...prev]);
          return data.log;
        }
      }
    } catch {
      // Offline fallback
    }
    return null;
  };

  const openVacanciesCount = vacancies.filter((v) => v.status === 'open').length;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-neutral-950">
      <Navbar
        activeTab={activeTab}
        openVacanciesCount={openVacanciesCount}
        onNavigate={handleNavigate}
      />

      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomeView
            openVacanciesCount={openVacanciesCount}
            mailConfig={mailConfig}
            onNavigate={handleNavigate}
            onSubmitInquiry={handleSubmitInquiry}
          />
        )}

        {activeTab === 'vacatures' && (
          <VacaturesView
            vacancies={vacancies}
            mailConfig={mailConfig}
            onSubmitApplication={handleSubmitApplication}
          />
        )}

        {activeTab === 'beheer' && (
          <AdminView
            firebaseUser={firebaseUser}
            isLocalAdminAuthenticated={isLocalAdmin}
            vacancies={vacancies}
            applications={applications}
            inquiries={inquiries}
            mailConfig={mailConfig}
            emailLogs={emailLogs}
            onGoogleLogin={handleGoogleLogin}
            onLocalAdminLogin={handleLocalAdminLogin}
            onLogout={handleLogout}
            onSaveVacancy={handleSaveVacancy}
            onDeleteVacancy={handleDeleteVacancy}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onSaveMailConfig={handleSaveMailConfig}
            onSendTestEmail={handleSendTestEmail}
          />
        )}
      </main>

      <Footer
        openVacanciesCount={openVacanciesCount}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
