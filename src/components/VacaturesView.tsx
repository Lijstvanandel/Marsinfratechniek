import React, { useRef, useState } from 'react';
import { CheckCircle2, FileText, Phone, Upload, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/initialData';
import type { JobApplication, MailConfig, Vacancy } from '../types';
import { validateApplicationInput } from '../utils/validation';

interface VacaturesViewProps {
  vacancies: Vacancy[];
  mailConfig: MailConfig;
  onSubmitApplication: (
    app: Omit<JobApplication, 'id' | 'createdAt' | 'status' | 'emailDispatched'>
  ) => Promise<{
    ok: boolean;
    dispatched: 'sent' | 'queued' | 'failed';
    previewInfo?: string;
  }>;
}

export const VacaturesView: React.FC<VacaturesViewProps> = ({
  vacancies,
  mailConfig,
  onSubmitApplication,
}) => {
  const openVacancies = vacancies.filter((v) => v.status === 'open');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Alle Vakgebieden');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(
    openVacancies[0]?.id || 'open-sollicitatie'
  );

  // Application form fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [motivation, setMotivation] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvMimeType, setCvMimeType] = useState('');
  const [cvDataUrl, setCvDataUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    vacancyTitle: string;
    recipient: string;
    cvName: string;
    previewInfo?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const departments = [
    'Alle Vakgebieden',
    ...Array.from(new Set(openVacancies.map((v) => v.department))),
  ];

  const filteredVacancies =
    selectedDepartment === 'Alle Vakgebieden'
      ? openVacancies
      : openVacancies.filter((v) => v.department === selectedDepartment);

  const activeVacancy = openVacancies.find((v) => v.id === selectedVacancyId) || null;
  const activeVacancyTitle = activeVacancy ? activeVacancy.title : 'Open Sollicitatie GWW / Infra';

  const handleSelectVacancyForApply = (vacancyId: string) => {
    setSelectedVacancyId(vacancyId);
    setSubmitResult(null);
    const formEl = document.getElementById('sollicitatie-formulier');
    formEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 520 * 1024) {
      setErrors((prev) => ({
        ...prev,
        cv: 'Bestand is groter dan 520 KB. Kies een compacter PDF-, Word- of tekstbestand.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setCvFileName(file.name);
      setCvMimeType(file.type || 'application/pdf');
      setCvDataUrl(result);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cv;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAttachSampleCv = () => {
    const sampleContent = [
      'CURRICULUM VITAE - SOLLICITATIE MARS INFRATECHNIEK B.V.',
      'Naam: ' + (applicantName || 'Kandidaat Vakman GWW'),
      'Ervaring: 5+ jaar uitvoering Grondwerk, Wegenbouw & Kabels en Leidingen',
      'Certificaten: VCA Basis / VOL, Rijbewijs BE, Veilig Graven CROW 500',
    ].join('\n');
    const base64 = btoa(unescape(encodeURIComponent(sampleContent)));
    const safeName = (applicantName || 'Kandidaat')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    setCvFileName(`CV_${safeName}_MarsInfra.pdf`);
    setCvMimeType('application/pdf');
    setCvDataUrl(`data:application/pdf;base64,${base64}`);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.cv;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    const validation = validateApplicationInput({
      vacancyId: selectedVacancyId,
      vacancyTitle: activeVacancyTitle,
      applicantName,
      applicantEmail,
      applicantPhone,
      motivation,
      cvFileName,
      cvDataUrl,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await onSubmitApplication({
        vacancyId: selectedVacancyId,
        vacancyTitle: activeVacancyTitle,
        applicantName: applicantName.trim(),
        applicantEmail: applicantEmail.trim(),
        applicantPhone: applicantPhone.trim(),
        motivation: motivation.trim(),
        cvFileName,
        cvMimeType: cvMimeType || 'application/pdf',
        cvDataUrl,
      });

      if (res.ok) {
        setSubmitResult({
          vacancyTitle: activeVacancyTitle,
          recipient: mailConfig.recipientEmail,
          cvName: cvFileName,
          previewInfo: res.previewInfo,
        });
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
        setMotivation('');
        setCvFileName('');
        setCvMimeType('');
        setCvDataUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="bg-neutral-950 text-white border-b-2 border-[#EA580C]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                Werken bij Mars Infratechniek B.V. · {COMPANY_INFO.region}
              </div>
              <h1
                className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Openstaande Vacatures & Direct Solliciteren
              </h1>
              <p className="text-base text-neutral-300 max-w-2xl leading-relaxed">
                Werk mee aan serieuze infraprojecten met goed materieel, een vaste ploeg
                en uitstekende arbeidsvoorwaarden conform CAO Bouw & Infra. Upload
                eenvoudig je CV en solliciteer direct.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-1">
              <div className="text-xs text-neutral-400">Liever eerst telefonisch kennismaken?</div>
              <a
                href={COMPANY_INFO.phoneHref}
                className="inline-flex items-center gap-2 font-mono-tabular text-xl font-bold text-white hover:text-[#EA580C]"
              >
                <Phone className="w-4 h-4 text-[#EA580C]" />
                {COMPANY_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Vacancies List + Direct Application with CV Upload */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Department Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
            <div className="text-sm font-semibold text-neutral-900">
              {filteredVacancies.length} openstaande{' '}
              {filteredVacancies.length === 1 ? 'functie' : 'functies'}
            </div>

            <div
              role="group"
              aria-label="Filter vacatures op vakgebied"
              className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 border border-neutral-200"
            >
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedDepartment === dept
                      ? 'bg-neutral-950 text-white'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Columns: Vacancy Cards & Detailed Specs */}
            <div className="lg:col-span-7 space-y-6">
              {filteredVacancies.length === 0 ? (
                <div className="p-8 border border-neutral-200 bg-neutral-50 text-center space-y-3">
                  <h3 className="font-display text-lg font-bold text-neutral-950">
                    Geen openstaande vacatures in dit filter
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Stuur gerust een open sollicitatie met uw CV via het formulier hiernaast.
                  </p>
                </div>
              ) : (
                filteredVacancies.map((vac) => {
                  const isSelected = selectedVacancyId === vac.id;
                  const reqList = vac.requirements
                    .split('\n')
                    .map((r) => r.trim())
                    .filter(Boolean);
                  const benList = vac.benefits
                    .split('\n')
                    .map((b) => b.trim())
                    .filter(Boolean);

                  return (
                    <article
                      key={vac.id}
                      className={`border transition-colors p-6 md:p-8 space-y-5 ${
                        isSelected
                          ? 'border-neutral-950 bg-white'
                          : 'border-neutral-200 bg-neutral-50/60 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-200 pb-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tabular text-neutral-500">
                            <span className="text-[#EA580C] font-semibold whitespace-nowrap">
                              {vac.department}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">{vac.location}</span>
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">{vac.employmentType}</span>
                          </div>
                          <h2 className="font-display text-xl md:text-2xl font-bold text-neutral-950">
                            {vac.title}
                          </h2>
                        </div>
                        <div className="text-xs font-mono-tabular font-semibold text-neutral-900 whitespace-nowrap shrink-0">
                          {vac.salaryRange}
                        </div>
                      </div>

                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {vac.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <h3 className="font-display text-sm font-bold text-neutral-950">
                            Wat wij vragen
                          </h3>
                          <ul className="space-y-1.5 text-xs text-neutral-700">
                            {reqList.map((req) => (
                              <li key={req} className="flex items-start gap-2">
                                <span className="text-[#EA580C] font-bold">—</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-display text-sm font-bold text-neutral-950">
                            Wat wij bieden
                          </h3>
                          <ul className="space-y-1.5 text-xs text-neutral-700">
                            {benList.map((ben) => (
                              <li key={ben} className="flex items-start gap-2">
                                <span className="text-[#EA580C] font-bold">+</span>
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-4">
                        <span className="text-xs text-neutral-500">
                          Niveau: {vac.level}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectVacancyForApply(vac.id)}
                          className={`px-5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#EA580C] text-white'
                              : 'bg-neutral-950 text-white hover:bg-[#EA580C]'
                          }`}
                        >
                          {isSelected
                            ? 'Geselecteerd in formulier →'
                            : `Solliciteer op ${vac.title}`}
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Right 5 Columns: Direct Application & CV Upload Form */}
            <div id="sollicitatie-formulier" className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="border-2 border-neutral-950 bg-white p-6 md:p-8">
                <div className="border-b-2 border-[#EA580C] pb-4 space-y-1">
                  <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                    Direct solliciteren met CV
                  </div>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-neutral-950">
                    Sollicitatieformulier
                  </h2>
                  <p className="text-xs text-neutral-600">
                    Uw sollicitatie en CV worden direct per e-mail doorgestuurd naar{' '}
                    <strong className="font-mono-tabular text-neutral-900">
                      {mailConfig.recipientEmail}
                    </strong>
                    .
                  </p>
                </div>

                {submitResult && (
                  <div
                    role="status"
                    className="mt-5 p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Sollicitatie & CV succesvol verzonden!</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Functie: <strong>{submitResult.vacancyTitle}</strong> · CV bijlage:{' '}
                      <span className="font-mono-tabular">{submitResult.cvName}</span>
                    </p>
                    <p className="text-xs text-emerald-800">
                      Direct per e-mail doorgestuurd naar{' '}
                      <strong>{submitResult.recipient}</strong>.
                    </p>
                    {submitResult.previewInfo && (
                      <p className="text-xs font-mono-tabular text-emerald-700">
                        {submitResult.previewInfo}
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="apply-vacancy"
                      className="block text-xs font-semibold text-neutral-800 mb-1.5"
                    >
                      Kies vacature / functie *
                    </label>
                    <select
                      id="apply-vacancy"
                      value={selectedVacancyId}
                      onChange={(e) => setSelectedVacancyId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 bg-white focus:border-[#EA580C] focus:outline-none"
                    >
                      {openVacancies.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} ({v.location})
                        </option>
                      ))}
                      <option value="open-sollicitatie">
                        Open Sollicitatie (Grondwerk / Infra / Uitvoering)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="apply-name"
                      className="block text-xs font-semibold text-neutral-800 mb-1.5"
                    >
                      Volledige naam *
                    </label>
                    <input
                      id="apply-name"
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Voor- en achternaam"
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {errors.applicantName && (
                      <p className="text-xs text-red-600 mt-1">{errors.applicantName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="apply-email"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        E-mailadres *
                      </label>
                      <input
                        id="apply-email"
                        type="email"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="naam@email.nl"
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {errors.applicantEmail && (
                        <p className="text-xs text-red-600 mt-1">{errors.applicantEmail}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="apply-phone"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        Telefoonnummer *
                      </label>
                      <input
                        id="apply-phone"
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="06 - 1234 5678"
                        className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {errors.applicantPhone && (
                        <p className="text-xs text-red-600 mt-1">{errors.applicantPhone}</p>
                      )}
                    </div>
                  </div>

                  {/* CV Upload Box */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="apply-cv-upload"
                        className="block text-xs font-semibold text-neutral-800"
                      >
                        Upload uw CV (PDF, DOC, DOCX of TXT) *
                      </label>
                      <button
                        type="button"
                        onClick={handleAttachSampleCv}
                        className="text-xs text-[#EA580C] hover:underline font-semibold cursor-pointer"
                      >
                        Voorbeeld-CV koppelen
                      </button>
                    </div>

                    <div className="border border-dashed border-neutral-400 bg-neutral-50 p-4">
                      <input
                        ref={fileInputRef}
                        id="apply-cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,application/pdf,text/plain"
                        onChange={handleFileChange}
                        className="sr-only"
                      />

                      {cvFileName ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-5 h-5 text-[#EA580C] shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-semibold text-neutral-950 truncate">
                                {cvFileName}
                              </div>
                              <div className="text-[11px] text-emerald-700">
                                Gereed voor verzending als e-mailbijlage
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label="Verwijder geselecteerd CV"
                            onClick={() => {
                              setCvFileName('');
                              setCvMimeType('');
                              setCvDataUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="p-1 text-neutral-500 hover:text-neutral-950 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <Upload className="w-5 h-5 text-[#EA580C] mx-auto" />
                          <div className="text-xs text-neutral-700">
                            Selecteer een CV-bestand vanaf uw apparaat
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white border border-neutral-300 hover:border-neutral-950 cursor-pointer"
                          >
                            CV Bestand Kiezen
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.cv && (
                      <p className="text-xs text-red-600 mt-1">{errors.cv}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="apply-motivation"
                      className="block text-xs font-semibold text-neutral-800 mb-1.5"
                    >
                      Korte toelichting of ervaring *
                    </label>
                    <textarea
                      id="apply-motivation"
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Vertel kort welke ervaring u heeft of wanneer u beschikbaar bent..."
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {errors.motivation && (
                      <p className="text-xs text-red-600 mt-1">{errors.motivation}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {isSubmitting
                      ? 'Sollicitatie & CV versturen...'
                      : 'Direct Solliciteren & CV Versturen'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
