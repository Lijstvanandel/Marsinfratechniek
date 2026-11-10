import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Edit3,
  FileText,
  Lock,
  LogOut,
  Mail,
  Plus,
  Send,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type {
  ContactInquiry,
  EmailLogEntry,
  EmploymentType,
  JobApplication,
  MailConfig,
  Vacancy,
} from '../types';
import {
  ALLOWED_EMPLOYMENT_TYPES,
  validateMailConfigInput,
  validateVacancyInput,
} from '../utils/validation';

interface AdminViewProps {
  firebaseUser: User | null;
  isLocalAdminAuthenticated: boolean;
  vacancies: Vacancy[];
  applications: JobApplication[];
  inquiries: ContactInquiry[];
  mailConfig: MailConfig;
  emailLogs: EmailLogEntry[];
  onGoogleLogin: () => Promise<void>;
  onLocalAdminLogin: (username: string, password: string) => boolean;
  onLogout: () => Promise<void>;
  onSaveVacancy: (
    vacancyData: Omit<Vacancy, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => Promise<void>;
  onDeleteVacancy: (vacancyId: string) => Promise<void>;
  onUpdateApplicationStatus: (
    applicationId: string,
    status: JobApplication['status']
  ) => Promise<void>;
  onUpdateInquiryStatus: (
    inquiryId: string,
    status: ContactInquiry['status']
  ) => Promise<void>;
  onSaveMailConfig: (newConfig: MailConfig) => Promise<void>;
  onSendTestEmail: (configToTest: MailConfig) => Promise<EmailLogEntry | null>;
}

type AdminSection = 'vacatures' | 'sollicitaties' | 'contactaanvragen' | 'mailconfig';

export const AdminView: React.FC<AdminViewProps> = ({
  firebaseUser,
  isLocalAdminAuthenticated,
  vacancies,
  applications,
  inquiries,
  mailConfig,
  emailLogs,
  onGoogleLogin,
  onLocalAdminLogin,
  onLogout,
  onSaveVacancy,
  onDeleteVacancy,
  onUpdateApplicationStatus,
  onUpdateInquiryStatus,
  onSaveMailConfig,
  onSendTestEmail,
}) => {
  const isAuthenticated = Boolean(firebaseUser || isLocalAdminAuthenticated);

  // Login State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active dashboard tab
  const [activeSection, setActiveSection] = useState<AdminSection>('vacatures');

  // Vacancy Editor State
  const [isEditingVacancy, setIsEditingVacancy] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<string | undefined>(undefined);
  const [vacTitle, setVacTitle] = useState('');
  const [vacDepartment, setVacDepartment] = useState('Kabels & Leidingen');
  const [vacLocation, setVacLocation] = useState('Dalfsen / Regio Overijssel');
  const [vacEmploymentType, setVacEmploymentType] = useState<EmploymentType>('Fulltime (40 uur)');
  const [vacLevel, setVacLevel] = useState('MBO / Praktijkervaring');
  const [vacSalaryRange, setVacSalaryRange] = useState('€ 3.100 - € 3.950 bruto p/m');
  const [vacSummary, setVacSummary] = useState('');
  const [vacDescription, setVacDescription] = useState('');
  const [vacRequirements, setVacRequirements] = useState('');
  const [vacBenefits, setVacBenefits] = useState('');
  const [vacStatus, setVacStatus] = useState<'open' | 'closed'>('open');
  const [vacErrors, setVacErrors] = useState<Record<string, string>>({});
  const [vacFeedback, setVacFeedback] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Mail Configuration State
  const [cfgState, setCfgState] = useState<MailConfig>(mailConfig);
  const [cfgErrors, setCfgErrors] = useState<Record<string, string>>({});
  const [cfgSavedMessage, setCfgSavedMessage] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = onLocalAdminLogin(adminUser, adminPass);
    if (!ok) {
      setLoginError('Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw.');
    }
  };

  const openNewVacancyForm = () => {
    setEditingVacancyId(undefined);
    setVacTitle('');
    setVacDepartment('Grondwerk & Wegenbouw');
    setVacLocation('Dalfsen / Overijssel');
    setVacEmploymentType('Fulltime (40 uur)');
    setVacLevel('MBO / Ervaren Vakkracht');
    setVacSalaryRange('€ 3.200 - € 4.100 bruto p/m');
    setVacSummary('');
    setVacDescription('');
    setVacRequirements('Ervaring in de GWW of ondergrondse infra\nIn bezit van VCA en Rijbewijs B');
    setVacBenefits('Salaris conform CAO Bouw & Infra\nGoed materieel en vaste ploeg');
    setVacStatus('open');
    setVacErrors({});
    setIsEditingVacancy(true);
  };

  const openEditVacancyForm = (vac: Vacancy) => {
    setEditingVacancyId(vac.id);
    setVacTitle(vac.title);
    setVacDepartment(vac.department);
    setVacLocation(vac.location);
    setVacEmploymentType(vac.employmentType);
    setVacLevel(vac.level);
    setVacSalaryRange(vac.salaryRange);
    setVacSummary(vac.summary);
    setVacDescription(vac.description);
    setVacRequirements(vac.requirements);
    setVacBenefits(vac.benefits);
    setVacStatus(vac.status);
    setVacErrors({});
    setIsEditingVacancy(true);
  };

  const handleVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVacFeedback('');

    const validation = validateVacancyInput({
      title: vacTitle,
      department: vacDepartment,
      location: vacLocation,
      employmentType: vacEmploymentType,
      level: vacLevel,
      salaryRange: vacSalaryRange,
      summary: vacSummary,
      description: vacDescription,
      requirements: vacRequirements,
      benefits: vacBenefits,
      status: vacStatus,
    });

    if (!validation.valid) {
      setVacErrors(validation.errors);
      return;
    }

    setVacErrors({});
    await onSaveVacancy(
      {
        title: vacTitle.trim(),
        department: vacDepartment.trim(),
        location: vacLocation.trim(),
        employmentType: vacEmploymentType,
        level: vacLevel.trim(),
        salaryRange: vacSalaryRange.trim(),
        summary: vacSummary.trim(),
        description: vacDescription.trim(),
        requirements: vacRequirements.trim(),
        benefits: vacBenefits.trim(),
        status: vacStatus,
      },
      editingVacancyId
    );

    setIsEditingVacancy(false);
    setVacFeedback(
      editingVacancyId
        ? `Vacature "${vacTitle.trim()}" is bijgewerkt.`
        : `Nieuwe vacature "${vacTitle.trim()}" is toegevoegd en gepubliceerd.`
    );
  };

  const handleMailConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCfgSavedMessage('');
    const validation = validateMailConfigInput(cfgState);
    if (!validation.valid) {
      setCfgErrors(validation.errors);
      return;
    }
    setCfgErrors({});
    await onSaveMailConfig(cfgState);
    setCfgSavedMessage(
      `Mailconfiguratie opgeslagen. Aanvragen en sollicitaties worden direct doorgestuurd naar ${cfgState.recipientEmail}.`
    );
  };

  const handleTriggerTestEmail = async () => {
    setCfgSavedMessage('');
    const validation = validateMailConfigInput(cfgState);
    if (!validation.valid) {
      setCfgErrors(validation.errors);
      return;
    }
    setCfgErrors({});
    setIsSendingTest(true);
    try {
      const log = await onSendTestEmail(cfgState);
      if (log) {
        setCfgSavedMessage(`Testmail verzonden: ${log.previewInfo}`);
      }
    } finally {
      setIsSendingTest(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-neutral-100 py-16 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border-2 border-neutral-950 p-8 space-y-6">
          <div className="border-b-2 border-[#EA580C] pb-4 space-y-1">
            <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
              Mars Infratechniek B.V.
            </div>
            <h1 className="font-display text-2xl font-bold text-neutral-950">
              Login
            </h1>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-300 text-xs text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-neutral-800 mb-1"
              >
                Beheerder E-mailadres
              </label>
              <input
                id="admin-email"
                type="email"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-neutral-800 mb-1"
              >
                Wachtwoord
              </label>
              <input
                id="admin-password"
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Inloggen als Beheerder
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="shrink-0 mx-3 text-xs text-neutral-400">of via Google Auth</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Inloggen met Google Beheerdersaccount
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Top Header */}
      <section className="bg-neutral-950 text-white border-b-2 border-[#EA580C]">
        <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
              Beheerportaal · Ingelogd als{' '}
              {firebaseUser?.email || 'admin@marsinfratechniek.nl'}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">
              Vacaturebeheer, Sollicitaties & Mailconfiguratie
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 text-xs font-semibold text-neutral-200 border border-neutral-700 hover:border-white inline-flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Uitloggen
            </button>
          </div>
        </div>
      </section>

      {/* Admin Sub-Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-2 overflow-x-auto py-3">
          <button
            type="button"
            onClick={() => setActiveSection('vacatures')}
            className={`px-4 py-2 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'vacatures'
                ? 'bg-neutral-950 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Vacatures Beheren ({vacancies.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('sollicitaties')}
            className={`px-4 py-2 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'sollicitaties'
                ? 'bg-neutral-950 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Sollicitaties & CV’s ({applications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('contactaanvragen')}
            className={`px-4 py-2 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'contactaanvragen'
                ? 'bg-neutral-950 text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contactaanvragen ({inquiries.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('mailconfig')}
            className={`px-4 py-2 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'mailconfig'
                ? 'bg-[#EA580C] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Mailconfiguratie ({mailConfig.recipientEmail})
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {/* TAB 1: VACATURES BEHEREN */}
        {activeSection === 'vacatures' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <h2 className="font-display text-xl font-bold text-neutral-950">
                  Vacatures Overzicht & Beheer
                </h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Voeg nieuwe vacatures toe of pas bestaande functies en statussen aan.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewVacancyForm}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Nieuwe Vacature Toevoegen
              </button>
            </div>

            {vacFeedback && (
              <div
                role="status"
                className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{vacFeedback}</span>
              </div>
            )}

            {/* Add / Edit Vacancy Form Panel */}
            {isEditingVacancy && (
              <div className="bg-white border-2 border-neutral-950 p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <h3 className="font-display text-lg font-bold text-neutral-950">
                    {editingVacancyId ? 'Vacature Aanpassen' : 'Nieuwe Vacature Toevoegen'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingVacancy(false)}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-950 cursor-pointer"
                  >
                    Annuleren
                  </button>
                </div>

                <form onSubmit={handleVacancySubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="vac-title"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Functietitel *
                      </label>
                      <input
                        id="vac-title"
                        type="text"
                        value={vacTitle}
                        onChange={(e) => setVacTitle(e.target.value)}
                        placeholder="Bijv. Uitvoerder Kabels & Leidingen"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {vacErrors.title && (
                        <p className="text-xs text-red-600 mt-1">{vacErrors.title}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="vac-status"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Publicatiestatus *
                      </label>
                      <select
                        id="vac-status"
                        value={vacStatus}
                        onChange={(e) => setVacStatus(e.target.value as 'open' | 'closed')}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 bg-white focus:border-[#EA580C] focus:outline-none"
                      >
                        <option value="open">Open (Zichtbaar op website)</option>
                        <option value="closed">Gesloten (Archief)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label
                        htmlFor="vac-department"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Vakgebied *
                      </label>
                      <input
                        id="vac-department"
                        type="text"
                        value={vacDepartment}
                        onChange={(e) => setVacDepartment(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="vac-location"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Locatie / Regio *
                      </label>
                      <input
                        id="vac-location"
                        type="text"
                        value={vacLocation}
                        onChange={(e) => setVacLocation(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="vac-employment"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Dienstverband *
                      </label>
                      <select
                        id="vac-employment"
                        value={vacEmploymentType}
                        onChange={(e) => setVacEmploymentType(e.target.value as EmploymentType)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 bg-white focus:border-[#EA580C] focus:outline-none"
                      >
                        {ALLOWED_EMPLOYMENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="vac-salary"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Salarisindicatie *
                      </label>
                      <input
                        id="vac-salary"
                        type="text"
                        value={vacSalaryRange}
                        onChange={(e) => setVacSalaryRange(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="vac-level"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Ervarings- / Opleidingsniveau *
                      </label>
                      <input
                        id="vac-level"
                        type="text"
                        value={vacLevel}
                        onChange={(e) => setVacLevel(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="vac-summary"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Korte introductie (1-2 zinnen) *
                      </label>
                      <input
                        id="vac-summary"
                        type="text"
                        value={vacSummary}
                        onChange={(e) => setVacSummary(e.target.value)}
                        placeholder="Korte samenvatting voor het vacatureoverzicht..."
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {vacErrors.summary && (
                        <p className="text-xs text-red-600 mt-1">{vacErrors.summary}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="vac-description"
                      className="block text-xs font-semibold text-neutral-800 mb-1"
                    >
                      Uitgebreide functieomschrijving *
                    </label>
                    <textarea
                      id="vac-description"
                      rows={3}
                      value={vacDescription}
                      onChange={(e) => setVacDescription(e.target.value)}
                      placeholder="Beschrijf de dagelijkse werkzaamheden en het team..."
                      className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {vacErrors.description && (
                      <p className="text-xs text-red-600 mt-1">{vacErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="vac-requirements"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Wat wij vragen (één punt per regel) *
                      </label>
                      <textarea
                        id="vac-requirements"
                        rows={3}
                        value={vacRequirements}
                        onChange={(e) => setVacRequirements(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="vac-benefits"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Wat wij bieden (één punt per regel) *
                      </label>
                      <textarea
                        id="vac-benefits"
                        rows={3}
                        value={vacBenefits}
                        onChange={(e) => setVacBenefits(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingVacancy(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 hover:bg-neutral-100 cursor-pointer"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] cursor-pointer"
                    >
                      Vacature Opslaan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Vacancies Table */}
            <div className="bg-white border border-neutral-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-700">
                    <th className="py-3.5 px-4">Functietitel</th>
                    <th className="py-3.5 px-4">Vakgebied & Locatie</th>
                    <th className="py-3.5 px-4">Salarisindicatie</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {vacancies.map((vac) => (
                    <tr key={vac.id} className="hover:bg-neutral-50">
                      <td className="py-4 px-4 font-semibold text-neutral-950">
                        {vac.title}
                        <div className="text-xs font-normal text-neutral-500">
                          {vac.employmentType} · {vac.level}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-neutral-700">
                        <span className="font-semibold text-neutral-900">
                          {vac.department}
                        </span>{' '}
                        · {vac.location}
                      </td>
                      <td className="py-4 px-4 text-xs font-mono-tabular text-neutral-800">
                        {vac.salaryRange}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold">
                        {vac.status === 'open' ? (
                          <span className="text-emerald-700">Open (Actief)</span>
                        ) : (
                          <span className="text-neutral-500">Gesloten</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditVacancyForm(vac)}
                          className="px-3 py-1.5 text-xs font-semibold text-neutral-900 border border-neutral-300 hover:border-neutral-950 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Bewerken
                        </button>
                        {confirmDeleteId === vac.id ? (
                          <button
                            type="button"
                            onClick={async () => {
                              await onDeleteVacancy(vac.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                          >
                            Bevestig Verwijderen
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Verwijder vacature ${vac.title}`}
                            onClick={() => setConfirmDeleteId(vac.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SOLLICITATIES & CV'S */}
        {activeSection === 'sollicitaties' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-950">
                Ingekomen Sollicitaties & Geüploade CV’s
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Overzicht van kandidaten die via de website hebben gesolliciteerd. Alle
                sollicitaties worden tevens direct per e-mail doorgestuurd naar{' '}
                <strong className="font-mono-tabular">{mailConfig.recipientEmail}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="text-xs font-mono-tabular text-neutral-500">
                      <span className="text-[#EA580C] font-semibold">
                        {app.vacancyTitle}
                      </span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>{new Date(app.createdAt).toLocaleString('nl-NL')}</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>
                        E-mail doorsturing:{' '}
                        {app.emailDispatched === 'sent' ? 'Verzonden' : 'In wachtrij'}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-neutral-950">
                      {app.applicantName}
                    </h3>
                    <div className="text-xs font-mono-tabular text-neutral-700">
                      E-mail: {app.applicantEmail} · Tel: {app.applicantPhone}
                    </div>
                    <p className="text-sm text-neutral-700 bg-neutral-50 p-3 border border-neutral-200">
                      {app.motivation}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0">
                    <a
                      href={app.cvDataUrl}
                      download={app.cvFileName}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-neutral-950 hover:bg-[#EA580C] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CV ({app.cvFileName})
                    </a>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`status-${app.id}`}
                        className="text-xs text-neutral-500"
                      >
                        Status:
                      </label>
                      <select
                        id={`status-${app.id}`}
                        value={app.status}
                        onChange={(e) =>
                          onUpdateApplicationStatus(
                            app.id,
                            e.target.value as JobApplication['status']
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold border border-neutral-300 bg-white"
                      >
                        <option value="new">Nieuw</option>
                        <option value="reviewed">In behandeling</option>
                        <option value="invited">Uitgenodigd voor gesprek</option>
                        <option value="archived">Gearchiveerd</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONTACTAANVRAGEN */}
        {activeSection === 'contactaanvragen' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-neutral-950">
                Ingekomen Contact- & Offerteaanvragen
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Berichten verstuurd via het contactformulier op de homepage (direct
                doorgestuurd naar{' '}
                <strong className="font-mono-tabular">{mailConfig.recipientEmail}</strong>).
              </p>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="text-xs font-mono-tabular text-neutral-500">
                      <span className="text-[#EA580C] font-semibold">{inq.subject}</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>{new Date(inq.createdAt).toLocaleString('nl-NL')}</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>
                        E-mail doorsturing:{' '}
                        {inq.emailDispatched === 'sent' ? 'Direct verzonden' : 'In wachtrij'}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-neutral-950">
                      {inq.name} {inq.company ? `— ${inq.company}` : ''}
                    </h3>
                    <div className="text-xs font-mono-tabular text-neutral-700">
                      E-mail: {inq.email} · Tel: {inq.phone}
                    </div>
                    <p className="text-sm text-neutral-700 bg-neutral-50 p-3 border border-neutral-200">
                      {inq.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label
                      htmlFor={`inq-status-${inq.id}`}
                      className="text-xs text-neutral-500"
                    >
                      Status:
                    </label>
                    <select
                      id={`inq-status-${inq.id}`}
                      value={inq.status}
                      onChange={(e) =>
                        onUpdateInquiryStatus(
                          inq.id,
                          e.target.value as ContactInquiry['status']
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold border border-neutral-300 bg-white"
                    >
                      <option value="new">Nieuw / Open</option>
                      <option value="handled">Afgehandeld</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MAILCONFIGURATIE */}
        {activeSection === 'mailconfig' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border-2 border-neutral-950 p-6 md:p-8 space-y-6">
              <div className="border-b-2 border-[#EA580C] pb-4 space-y-1">
                <h2 className="font-display text-xl font-bold text-neutral-950">
                  E-mail Doorsturing & SMTP Configuratie
                </h2>
                <p className="text-xs text-neutral-600">
                  Stel in naar welk e-mailadres contactformulieraanvragen en sollicitaties
                  (inclusief CV-bijlage) direct worden doorgestuurd.
                </p>
              </div>

              {cfgSavedMessage && (
                <div
                  role="status"
                  className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{cfgSavedMessage}</span>
                </div>
              )}

              <form onSubmit={handleMailConfigSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cfg-recipient"
                      className="block text-xs font-semibold text-neutral-800 mb-1"
                    >
                      Primair Ontvanger E-mailadres *
                    </label>
                    <input
                      id="cfg-recipient"
                      type="email"
                      value={cfgState.recipientEmail}
                      onChange={(e) =>
                        setCfgState({ ...cfgState, recipientEmail: e.target.value })
                      }
                      placeholder="info@marsinfratechniek.nl"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {cfgErrors.recipientEmail && (
                      <p className="text-xs text-red-600 mt-1">
                        {cfgErrors.recipientEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cfg-cc"
                      className="block text-xs font-semibold text-neutral-800 mb-1"
                    >
                      CC E-mailadres (Kopie ontvanger)
                    </label>
                    <input
                      id="cfg-cc"
                      type="email"
                      value={cfgState.ccEmail}
                      onChange={(e) =>
                        setCfgState({ ...cfgState, ccEmail: e.target.value })
                      }
                      placeholder="directie@marsinfratechniek.nl"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {cfgErrors.ccEmail && (
                      <p className="text-xs text-red-600 mt-1">{cfgErrors.ccEmail}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cfg-sender"
                    className="block text-xs font-semibold text-neutral-800 mb-1"
                  >
                    Afzendernaam bij uitgaande e-mails *
                  </label>
                  <input
                    id="cfg-sender"
                    type="text"
                    value={cfgState.senderName}
                    onChange={(e) =>
                      setCfgState({ ...cfgState, senderName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                  />
                  {cfgErrors.senderName && (
                    <p className="text-xs text-red-600 mt-1">{cfgErrors.senderName}</p>
                  )}
                </div>

                {/* Forwarding Toggles */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="font-display text-sm font-bold text-neutral-950">
                    Automatische Doorstuurregels
                  </div>

                  <label className="flex items-center gap-3 text-xs text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfgState.forwardContacts}
                      onChange={(e) =>
                        setCfgState({ ...cfgState, forwardContacts: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#EA580C]"
                    />
                    <span>
                      Contactformulieraanvragen direct per e-mail doorsturen
                    </span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfgState.forwardApplications}
                      onChange={(e) =>
                        setCfgState({
                          ...cfgState,
                          forwardApplications: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#EA580C]"
                    />
                    <span>
                      Sollicitaties inclusief geüpload CV direct per e-mail doorsturen
                    </span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfgState.autoReplyApplicant}
                      onChange={(e) =>
                        setCfgState({
                          ...cfgState,
                          autoReplyApplicant: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#EA580C]"
                    />
                    <span>
                      Stuur automatische ontvangstbevestiging naar aanvrager / sollicitant
                    </span>
                  </label>
                </div>

                {/* Optional Custom SMTP Server */}
                <div className="space-y-4 pt-2 border-t border-neutral-200">
                  <div>
                    <div className="font-display text-sm font-bold text-neutral-950">
                      Eigen SMTP-server (Optioneel — laat leeg voor standaard Direct Mail Relay)
                    </div>
                    <p className="text-xs text-neutral-500">
                      Vul uw eigen SMTP-gegevens in (bijv. Microsoft 365 / MijnDomein /
                      TransIP) of gebruik de ingebouwde mailrelay.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="cfg-smtp-host"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        SMTP Host
                      </label>
                      <input
                        id="cfg-smtp-host"
                        type="text"
                        value={cfgState.smtpHost}
                        onChange={(e) =>
                          setCfgState({ ...cfgState, smtpHost: e.target.value })
                        }
                        placeholder="smtp.marsinfratechniek.nl"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cfg-smtp-port"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        Poort
                      </label>
                      <input
                        id="cfg-smtp-port"
                        type="number"
                        value={cfgState.smtpPort}
                        onChange={(e) =>
                          setCfgState({
                            ...cfgState,
                            smtpPort: Number(e.target.value) || 587,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {cfgErrors.smtpPort && (
                        <p className="text-xs text-red-600 mt-1">{cfgErrors.smtpPort}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cfg-smtp-user"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        SMTP Gebruikersnaam
                      </label>
                      <input
                        id="cfg-smtp-user"
                        type="text"
                        value={cfgState.smtpUser}
                        onChange={(e) =>
                          setCfgState({ ...cfgState, smtpUser: e.target.value })
                        }
                        placeholder="info@marsinfratechniek.nl"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cfg-smtp-pass"
                        className="block text-xs font-semibold text-neutral-800 mb-1"
                      >
                        SMTP Wachtwoord / App-wachtwoord
                      </label>
                      <input
                        id="cfg-smtp-pass"
                        type="password"
                        value={cfgState.smtpPass}
                        onChange={(e) =>
                          setCfgState({ ...cfgState, smtpPass: e.target.value })
                        }
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {cfgSavedMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{cfgSavedMessage}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={isSendingTest}
                    onClick={handleTriggerTestEmail}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-950 border border-neutral-400 hover:border-neutral-950 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#EA580C]" />
                    {isSendingTest ? 'Testmail verzenden...' : 'Verstuur Testmail'}
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] cursor-pointer"
                  >
                    Mailconfiguratie Opslaan
                  </button>
                </div>
              </form>
            </div>

            {/* Right 5 Columns: Live Verzendlogboek */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 p-6 space-y-4">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="font-display text-base font-bold text-neutral-950">
                  Verzendlogboek Uitgaande E-mails
                </h3>
                <p className="text-xs text-neutral-500">
                  Realtime overzicht van doorgestuurde contactaanvragen en sollicitaties.
                </p>
              </div>

              <div className="space-y-3 max-h-[540px] overflow-y-auto">
                {emailLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono-tabular text-neutral-500">
                      <span className="text-[#EA580C] font-semibold uppercase">
                        {log.type}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleTimeString('nl-NL')}</span>
                    </div>
                    <div className="font-semibold text-neutral-950">{log.subject}</div>
                    <div className="text-neutral-600 font-mono-tabular">
                      Aan: {log.to} {log.cc ? `(CC: ${log.cc})` : ''}
                    </div>
                    {log.attachmentName && (
                      <div className="text-neutral-700 font-semibold">
                        Bijlage: {log.attachmentName}
                      </div>
                    )}
                    <div className="text-emerald-700 font-mono-tabular pt-0.5">
                      {log.previewInfo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
