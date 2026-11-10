import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, ShieldCheck, X } from 'lucide-react';
import { COMPANY_INFO, PROJECTS, SERVICES } from '../data/initialData';
import type { ContactInquiry, MailConfig, ProjectItem } from '../types';
import { validateContactInput } from '../utils/validation';
import type { ActiveTab } from './Navbar';

interface HomeViewProps {
  openVacanciesCount: number;
  mailConfig: MailConfig;
  onNavigate: (tab: ActiveTab, sectionId?: string) => void;
  onSubmitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status' | 'emailDispatched'>) => Promise<{
    ok: boolean;
    dispatched: 'sent' | 'queued' | 'failed';
    previewInfo?: string;
  }>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  openVacanciesCount,
  mailConfig,
  onNavigate,
  onSubmitInquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle Projecten');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);

  // Contact Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Grondwerk & Wegenbouw');
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    recipient: string;
    previewInfo?: string;
  } | null>(null);

  const categories = [
    'Alle Projecten',
    'Grondwerk & Wegenbouw',
    'Kabels & Leidingen',
    'Riolering & Bestrating',
  ];

  const filteredProjects =
    selectedCategory === 'Alle Projecten'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setSubject(serviceTitle);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);

    const validation = validateContactInput({
      name,
      company,
      email,
      phone,
      subject,
      message,
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const result = await onSubmitInquiry({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (result.ok) {
        setSubmitSuccess({
          recipient: mailConfig.recipientEmail,
          previewInfo: result.previewInfo,
        });
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION — High-Impact Project Photography & Direct Contact */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Value Proposition & Direct Contact Coordinates */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-5">
                <div className="text-xs font-mono-tabular text-neutral-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>Regio Dalfsen, Zwolle & Overijssel</span>
                  <span className="text-[#EA580C]" aria-hidden="true">·</span>
                  <span>{COMPANY_INFO.certification}</span>
                </div>

                <div className="border-y-2 border-[#EA580C] py-2.5 sm:py-3">
                  <h1
                    className="font-display font-bold tracking-tight text-white leading-[1.1]"
                    style={{
                      fontSize: 'clamp(1.85rem, 3.8vw, 3.5rem)',
                      textWrap: 'balance',
                    }}
                  >
                    Strakke uitvoering in grondwerk, wegenbouw en ondergrondse infra.
                  </h1>
                </div>

                <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-xl">
                  Mars Infratechniek B.V. realiseert civieltechnische projecten voor
                  gemeenten, netbeheerders, bouwbedrijven en industrie. Korte lijnen,
                  eigen modern materieel en afspraak is afspraak.
                </p>
              </div>

              {/* Direct Contact Bar inspired directly by the logo */}
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 bg-neutral-900 border border-neutral-800">
                  <div>
                    <div className="text-xs text-neutral-400">Direct telefonisch overleg</div>
                    <a
                      href={COMPANY_INFO.phoneHref}
                      className="mt-1 inline-flex items-center gap-2 font-mono-tabular text-base sm:text-lg font-bold text-white hover:text-[#EA580C] transition-colors min-h-[38px]"
                    >
                      <Phone className="w-4 h-4 text-[#EA580C]" />
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">Bestek of offerteaanvraag</div>
                    <a
                      href={COMPANY_INFO.emailHref}
                      className="mt-1 inline-flex items-center gap-2 font-mono-tabular text-xs sm:text-sm font-semibold text-white hover:text-[#EA580C] transition-colors break-all min-h-[38px]"
                    >
                      <Mail className="w-4 h-4 text-[#EA580C] shrink-0" />
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('contact');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer"
                  >
                    Project of Offerte Bespreken
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('vacatures')}
                    className="w-full sm:w-auto px-5 py-3.5 text-sm font-semibold text-neutral-200 border border-neutral-700 hover:border-white hover:text-white transition-colors whitespace-nowrap min-h-[44px] inline-flex items-center justify-center cursor-pointer"
                  >
                    Bekijk Vacatures ({openVacanciesCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Dominant 16:9 Project / Equipment Carrier */}
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[440px] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <img
                src={COMPANY_INFO.heroImage}
                alt="Mars Infratechniek B.V. Takeuchi minikraan met machinist"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6">
                <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                  Materieel in beeld · Regio Overijssel
                </div>
                <div className="font-display text-lg font-bold text-white mt-0.5">
                  Takeuchi Minigraver met Machinist
                </div>
                <div className="text-xs text-neutral-300 mt-1">
                  Precisie ontgravingen · Kabel- en leidingtracés · Grondwerk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Strip Below Hero */}
        <div className="border-t border-neutral-800 bg-neutral-900/70">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono-tabular">
                100% VCA**
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Veiligheid &amp; CROW 500 gecertificeerd werken
              </div>
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white font-mono-tabular">
                0,8 - 3,5t
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Kranenverhuur inclusief vakkundige bediening
              </div>
            </div>
            <div>
              <a
                href={COMPANY_INFO.phoneHref}
                className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-[#EA580C] font-mono-tabular block transition-colors"
                title="Direct bellen"
              >
                {COMPANY_INFO.phone}
              </a>
              <div className="text-xs text-neutral-400 mt-1">
                Eén vast aanspreekpunt van offerte tot oplevering
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigate('vacatures')}
                className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#EA580C] hover:text-[#C2410C] font-mono-tabular block text-left transition-colors cursor-pointer"
              >
                {openVacanciesCount} Vacatures
              </button>
              <div className="text-xs text-neutral-400 mt-1">
                Direct solliciteren met CV-upload
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJECTEN SECTION (Kan via beheer/admin in- of uitgeschakeld worden) */}
      {mailConfig.showProjects && (
        <section id="projecten" className="py-16 lg:py-20 bg-white border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-neutral-200">
              <div className="space-y-2">
                <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                  Uitgevoerd werk in beeld
                </div>
                <h2
                  className="font-display text-2xl md:text-4xl font-bold text-neutral-950 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Projecten
                </h2>
                <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
                  Een realistisch beeld van onze dagelijkse werkzaamheden.
                </p>
              </div>

            {/* Interactive Filter Controls */}
            <div
              role="group"
              aria-label="Filter projecten op discipline"
              className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 border border-neutral-200"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-950 text-white'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group border border-neutral-200 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-5">
                      <div className="text-xs font-mono-tabular text-white">
                        <span>{project.category}</span>
                        <span className="mx-2" aria-hidden="true">·</span>
                        <span>{project.location}</span>
                        <span className="mx-2" aria-hidden="true">·</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                      {project.scopeMetric}
                    </div>
                    <h3 className="font-display text-xl font-bold text-neutral-950">
                      {project.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
                  <span className="text-xs text-neutral-500 truncate">
                    Opdrachtgever: {project.client}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveProjectModal(project)}
                    className="text-xs font-semibold text-neutral-950 hover:text-[#EA580C] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Specificaties & Foto
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 3. ONZE DIENSTEN SECTION (Asymmetric Editorial Numbered List) */}
      <section id="diensten" className="py-12 lg:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-2 pb-8 sm:pb-10">
            <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
              Kernactiviteiten GWW &amp; Ondergrondse Infra
            </div>
            <h2
              className="font-display text-2xl md:text-4xl font-bold text-neutral-950 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Onze Diensten
            </h2>
            <p className="text-sm md:text-base text-neutral-600">
              Wij voeren projecten uit in eigen beheer en als gespecialiseerde
              onderaannemer. Helder geoffreerd, veilig uitgevoerd en strak opgeleverd.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {SERVICES.map((service, index) => {
              const spanClass =
                index === 0 || index === 3 ? 'lg:col-span-7' : 'lg:col-span-5';
              return (
                <div
                  key={service.id}
                  className={`${spanClass} bg-white border border-neutral-200 p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-6`}
                >
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-3">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-neutral-950">
                        <span className="text-[#EA580C] mr-2">{service.number}</span>
                        {service.title}
                      </h3>
                    </div>
                    <div className="text-xs font-semibold text-neutral-500">
                      {service.subtitle}
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                      {service.description}
                    </p>
                    <ul className="space-y-2 pt-2 text-sm text-neutral-700">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="text-[#EA580C] font-bold">—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <span className="text-xs font-mono-tabular text-neutral-500">
                      Direct inzetbaar in Overijssel &amp; Noord-NL
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectServiceForQuote(service.title)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-950 border border-neutral-300 hover:border-[#EA580C] hover:text-[#EA580C] transition-colors whitespace-nowrap min-h-[40px] inline-flex items-center justify-center cursor-pointer"
                    >
                      Offerte voor {service.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OVER ONS SECTION */}
      <section id="over-ons" className="py-16 lg:py-20 bg-white border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Story & No-nonsense Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                Over Mars Infratechniek B.V.
              </div>
              <h2
                className="font-display text-2xl md:text-4xl font-bold text-neutral-950 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Nuchter vakmanschap, modern materieel en één woord.
              </h2>
              <p className="text-base text-neutral-700 leading-relaxed">
                Vanuit onze uitvalsbasis in Dalfsen werkt Mars Infratechniek B.V.
                dagelijks aan de boven- en ondergrondse infrastructuur van Nederland.
                Wij geloven niet in dikke rapporten of onnodige tussenlagen, maar in
                ervaren vakmensen die weten wat er buiten op het werk nodig is.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Of het nu gaat om een spoedreparatie aan een leidingtracé, het compleet
                bouwrijp maken van een bedrijventerrein of het reconstrueren van een
                binnenstedelijke rioolstraat: onze opdrachtgevers hebben rechtstreeks
                contact met de uitvoering via{' '}
                <strong className="text-neutral-950 font-mono-tabular">
                  {COMPANY_INFO.phone}
                </strong>
                .
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="font-display font-bold text-neutral-950">
                    Korte Lijnen
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Direct schakelen met beslissers en uitvoerders zonder vertraging.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="font-display font-bold text-neutral-950">
                    Eigen Machinepark
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Mobiele kranen, minigravers, shovels en verdichtingsmaterieel in eigen beheer.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="font-display font-bold text-neutral-950">
                    Veilig & Schadevrij
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Strikt werken volgens VCA** en CROW 500 richtlijnen bij elke ontgraving.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Attached Photo & Direct Coordinates Widget */}
            <div className="lg:col-span-5">
              <div className="border-2 border-neutral-950 bg-white p-6 md:p-8 space-y-6">
                <div className="bg-neutral-100 border border-neutral-200 overflow-hidden">
                  <img
                    src={COMPANY_INFO.aboutImage}
                    alt="Mars Infratechniek B.V. bedrijfswagen met haspelwagen bij het bedrijfspand in Dalfsen"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover block"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-neutral-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Telefoonnummer:</span>
                    <a
                      href={COMPANY_INFO.phoneHref}
                      className="font-mono-tabular font-bold text-neutral-950 hover:text-[#EA580C]"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">E-mailadres:</span>
                    <a
                      href={COMPANY_INFO.emailHref}
                      className="font-mono-tabular font-semibold text-neutral-950 hover:text-[#EA580C]"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Vestiging:</span>
                    <span className="font-semibold text-neutral-950">
                      {COMPANY_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('vacatures')}
                    className="w-full py-3 px-4 text-xs font-semibold text-center text-neutral-950 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Werken bij Mars Infratechniek ({openVacanciesCount} vacatures)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & OFFERTE SECTION */}
      <section id="contact" className="py-12 lg:py-20 bg-neutral-950 text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Direct Contact Details */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <div className="text-xs font-mono-tabular text-[#EA580C] font-semibold">
                  Direct schakelen
                </div>
                <h2
                  className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Contact &amp; Offerteaanvraag
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Heeft u een bestek, grondwerkproject of capaciteitsvraagstuk? Bel ons
                  rechtstreeks of stuur uw aanvraag via het formulier. Uw bericht wordt
                  direct per e-mail doorgestuurd naar{' '}
                  <span className="font-mono-tabular text-white font-semibold">
                    {mailConfig.recipientEmail}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-4 border-y-2 border-[#EA580C] py-5 sm:py-6">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <Phone className="w-5 h-5 text-[#EA580C] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-neutral-400">Telefoon (Werkdagen 07:00 – 17:30 &amp; 24/7 storingsdienst)</div>
                    <a
                      href={COMPANY_INFO.phoneHref}
                      className="font-mono-tabular text-xl sm:text-2xl font-bold text-white hover:text-[#EA580C] transition-colors min-h-[40px] flex items-center"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-4">
                  <Mail className="w-5 h-5 text-[#EA580C] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-neutral-400">E-mailadres</div>
                    <a
                      href={COMPANY_INFO.emailHref}
                      className="font-mono-tabular text-sm sm:text-base font-semibold text-white hover:text-[#EA580C] transition-colors break-all min-h-[36px] flex items-center"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 sm:gap-4">
                  <MapPin className="w-5 h-5 text-[#EA580C] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-neutral-400">Bezoek- &amp; Materieeladres</div>
                    <a
                      href="https://maps.google.com/?q=Marsweg+1b,+7722+MB+Dalfsen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-semibold text-white hover:text-[#EA580C] min-h-[36px] flex items-center underline decoration-[#EA580C]/40 underline-offset-4"
                      title="Route bekijken op Google Maps"
                    >
                      {COMPANY_INFO.address}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <div>
                  Aanvragen via dit formulier worden direct opgeslagen én per e-mail
                  afgeleverd op <strong className="text-white">{mailConfig.recipientEmail}</strong>.
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white text-neutral-950 p-6 md:p-8 border border-neutral-200">
                <h3 className="font-display text-xl font-bold text-neutral-950 pb-4 border-b border-neutral-200">
                  Stuur direct een bericht of offerteaanvraag
                </h3>

                {submitSuccess && (
                  <div
                    role="status"
                    className="mt-5 p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Uw aanvraag is ontvangen en direct per e-mail doorgestuurd.</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Verzonden naar <strong>{submitSuccess.recipient}</strong>. Wij nemen
                      zo spoedig mogelijk contact met u op.
                    </p>
                    {submitSuccess.previewInfo && (
                      <p className="text-xs font-mono-tabular text-emerald-700">
                        Status: {submitSuccess.previewInfo}
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} noValidate className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        Uw naam *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Bijv. J. de Vries"
                        className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        Bedrijf / Gemeente (optioneel)
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Bijv. Gemeente Dalfsen"
                        className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {formErrors.company && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        E-mailadres *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="naam@bedrijf.nl"
                        className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-neutral-800 mb-1.5"
                      >
                        Telefoonnummer *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 - 1234 5678 of 0529 - ..."
                        className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-neutral-800 mb-1.5"
                    >
                      Onderwerp / Discipline *
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 bg-white focus:border-[#EA580C] focus:outline-none"
                    >
                      <option value="Aanleg netwerken">Aanleg netwerken (Kabels &amp; Leidingen / Glasvezel)</option>
                      <option value="Boor en perswerk">Boor en perswerk (110mm - 400mm / Bestuurbare boring)</option>
                      <option value="Verhuur werkmateriaal inclusief bediening">Verhuur werkmateriaal (0,8 - 3,5t kranen met machinist)</option>
                      <option value="Grondwerk & Wegenbouw">Grondwerk &amp; Wegenbouw</option>
                      <option value="Riolering & Waterhuishouding">Riolering &amp; Waterhuishouding</option>
                      <option value="Algemene vraag / Overig">Algemene vraag / Overig</option>
                    </select>
                    {formErrors.subject && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-neutral-800 mb-1.5"
                    >
                      Projectomschrijving of vraag *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Beschrijf kort de locatie, gewenste werkzaamheden en planning..."
                      className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-neutral-300 focus:border-[#EA580C] focus:outline-none"
                    />
                    {formErrors.message && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs text-neutral-500">
                      Directe e-maildoorsturing naar {mailConfig.recipientEmail}
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-60 transition-colors whitespace-nowrap min-h-[48px] inline-flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? 'Aanvraag versturen...' : 'Aanvraag Versturen'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Photography Detail Modal */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div className="bg-white max-w-3xl w-full border border-neutral-300 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 text-white border-b-2 border-[#EA580C]">
              <div>
                <div className="text-xs font-mono-tabular text-[#EA580C]">
                  {activeProjectModal.category} · {activeProjectModal.location}
                </div>
                <h3 id="modal-project-title" className="font-display text-lg font-bold">
                  {activeProjectModal.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Sluit projectdetails"
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="aspect-[16/9] bg-neutral-900 overflow-hidden">
                <img
                  src={activeProjectModal.image}
                  alt={activeProjectModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 border border-neutral-200 text-xs">
                <div>
                  <span className="text-neutral-500 block">Opdrachtgever</span>
                  <strong className="text-neutral-950">{activeProjectModal.client}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Omvang</span>
                  <strong className="text-neutral-950 font-mono-tabular">
                    {activeProjectModal.scopeMetric}
                  </strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Uitvoeringsjaar</span>
                  <strong className="text-neutral-950 font-mono-tabular">
                    {activeProjectModal.year}
                  </strong>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-display font-bold text-neutral-950">
                  Werkzaamheden & Resultaat
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {activeProjectModal.summary}
                </p>
                <ul className="space-y-1.5 pt-2 text-sm text-neutral-700">
                  {activeProjectModal.technicalDetails.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="text-[#EA580C] font-bold">—</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 hover:bg-neutral-100 cursor-pointer"
              >
                Sluiten
              </button>
              <button
                type="button"
                onClick={() => {
                  const category = activeProjectModal.category;
                  setActiveProjectModal(null);
                  handleSelectServiceForQuote(category);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] cursor-pointer"
              >
                Vergelijkbaar project bespreken
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
