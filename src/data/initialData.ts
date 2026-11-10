import type { ContactInquiry, JobApplication, ProjectItem, ServiceItem, Vacancy } from '../types';

export const COMPANY_INFO = {
  name: 'Mars Infratechniek B.V.',
  shortName: 'MARS INFRATECHNIEK B.V.',
  phone: '0529 - 401540',
  phoneHref: 'tel:0529401540',
  email: 'info@marsinfratechniek.nl',
  emailHref: 'mailto:info@marsinfratechniek.nl',
  region: 'Regio Dalfsen · Zwolle · Overijssel & Noord-Nederland',
  address: 'Marsweg 1b, 7722 MB Dalfsen',
  kvk: 'KvK 68492015',
  certification: 'VCA** & ISO 9001 Gecertificeerd',
  logoUrl: '/assets/aistudio/image_3164f764.png',
  aboutImage: '/assets/aistudio/mars_1600208645_f11d2391.png',
  heroImage: '/assets/aistudio/Graafmachine-Mars-Infratechniek_e7ab9be3.jpg',
};

export const SERVICES: ServiceItem[] = [
  {
    number: '01.',
    id: 'aanleg-netwerken',
    title: 'Aanleg netwerken',
    subtitle: 'Elektriciteitskabels, glasvezel, WKO en rioolbuizen',
    description:
      'Mars Infratechniek BV voorziet in de aanleg van allerlei vormen van netwerken, met name:\n\n• elektriciteitskabels en telecommunicatiekabels (glasvezel)\n• PE buizen voor WKO’s en als persriool\n• PVC buizen voor rioleringen\n\nBij het aanleg van netwerken wordt het nodige grondwerk verricht, denk hierbij aan het graven en verdichten van de sleuf. Tevens wordt ook het opgebroken straatwerk professioneel terug geplaatst.',
    deliverables: [
      'Elektriciteitskabels en telecommunicatiekabels (glasvezel)',
      'PE buizen voor WKO’s en als persriool',
      'PVC buizen voor rioleringen',
      'Grondwerk, graven en verdichten van sleuven',
      'Opgebroken straatwerk professioneel terugplaatsen',
    ],
    image: '/assets/aistudio/mars_1600208645_f11d2391.png',
  },
  {
    number: '02.',
    id: 'boor-en-perswerk',
    title: 'Boor en perswerk',
    subtitle: 'Sleufloze technieken en bestuurbare boringen',
    description:
      'Waar niet gegraven kan worden, biedt Mars Infratechniek de ideale oplossing. Onze organisatie kan boringen/persingen uitvoeren middels staal met diameters van 110mm tot 400mm. Desgewenst is ook een bestuurbare boring mogelijk.',
    deliverables: [
      'Boringen en persingen middels staal',
      'Diameters van 110mm tot 400mm',
      'Bestuurbare boringen mogelijk',
      'Ideale oplossing waar niet gegraven kan worden',
    ],
    image: '/src/assets/images/project_kabels_leidingen_1793890293804.jpg',
  },
  {
    number: '03.',
    id: 'verhuur-werkmateriaal',
    title: 'Verhuur werkmateriaal inclusief bediening',
    subtitle: 'Kranen van 0,8 t/m 3,5 ton inclusief machinist',
    description:
      'Mars Infratechniek BV verhuurt kranen van 0,8 t/m 3,5 tons inclusief machinist.',
    deliverables: [
      'Kranen van 0,8 t/m 3,5 ton',
      'Altijd inclusief ervaren machinist',
      'Flexibel inzetbaar voor al uw grond- en infrawerkzaamheden',
    ],
    image: '/assets/aistudio/Graafmachine-Mars-Infratechniek_e7ab9be3.jpg',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-overijssel-n340',
    title: 'Reconstructie Parallelweg & RWS-Banden Vechtdal',
    category: 'Grondwerk & Wegenbouw',
    location: 'Dalfsen · Overijssel',
    client: 'Provincie Overijssel / Hoofdaannemer GWW',
    year: '2026',
    scopeMetric: '4,2 km wegtracé · 18.500 m³ grondverzet',
    summary:
      'Volledige reconstructie van de parallelstructuur inclusief 3D-GPS geprofileerde fundering, zware betonnen opsluitbanden en nieuwe asfaltdeklaag.',
    technicalDetails: [
      '18.500 m³ ontgraving en grondverbetering onder GPS-machinebesturing',
      '4.200 strekkende meter zware betonnen geleide- en opsluitbanden geplaatst',
      'Oplevering 2 weken vóór geplande mijlpaal met 0 verkeersincidenten',
    ],
    image: '/src/assets/images/hero_infra_excavation_1793890290861.jpg',
  },
  {
    id: 'proj-middenspanning-zwolle',
    title: 'Netverzwaring Middenspanning & Gestuurde Boring',
    category: 'Kabels & Leidingen',
    location: 'Zwolle · Hessenpoort',
    client: 'Regionaal Netbeheerder Energie',
    year: '2026',
    scopeMetric: '6,8 km MS-tracé · 340 m HDD-boring',
    summary:
      'Aanleg van een verzwaard middenspannings- en datatracé inclusief twee gestuurde boringen onder hoofdwatergangen en spoorwegkruisingen.',
    technicalDetails: [
      '6.800 meter sleufontgraving, zandbed en kabelinleg (3x 10kV + glasvezel)',
      '340 meter horizontaal gestuurde boring (HDD) met Ø 250mm HDPE mantelbuizen',
      'Volledige digitale revisie-inmeting (KLIC/DSP) conform CROW 500 richtlijnen',
    ],
    image: '/src/assets/images/project_kabels_leidingen_1793890293804.jpg',
  },
  {
    id: 'proj-bouwrijp-bedrijvenpark',
    title: 'Bouwrijp Maken Logistiek Bedrijvenpark (4,5 Hectare)',
    category: 'Grondwerk & Wegenbouw',
    location: 'Ommen · Nieuwleusen',
    client: 'Industriebouw & Ontwikkeling Oost B.V.',
    year: '2025',
    scopeMetric: '45.000 m² terrein · 32.000 ton menggranulaat',
    summary:
      'Compleet grondwerk, kavelontsluiting en zware funderingsopbouw voor een nieuw logistiek bedrijventerrein inclusief bouwwegen.',
    technicalDetails: [
      'Laser- en GPS-gestuurd profileren van 45.000 m² kavel- en wegfundering',
      'Verdichtingsmetingen en draagkrachtproeven op 32.000 ton menggranulaat',
      'Aanleg van bluswatervoorzieningen en omliggende retentiesloten',
    ],
    image: '/src/assets/images/project_grondwerk_wegenbouw_1793890294048.jpg',
  },
  {
    id: 'proj-rioolvervanging-centrum',
    title: 'Rioolvervanging Betonkokers & Klinkerherbestrating',
    category: 'Riolering & Bestrating',
    location: 'Deventer · Binnenstad Noord',
    client: 'Gemeente Deventer',
    year: '2025',
    scopeMetric: '1.150 m kokerriool · 8.400 m² gebakken klinkers',
    summary:
      'Gefaseerde vervanging van het verouderde gemengde rioolstelsel door zware prefab betonnen kokerprofielen en herinrichting met authentieke straatbaksteen.',
    technicalDetails: [
      'Hijsen en monteren van prefab betonnen HWA-kokerelementen (1200x900 mm)',
      'Afkoppeling van 145 panden naar gescheiden hemel- en vuilwaterstelsel',
      '8.400 m² herbestrating in keperverband met minimale overlast voor bewoners',
    ],
    image: '/src/assets/images/project_riolering_bestrating_1793890294533.jpg',
  },
];

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-kabels-01',
    title: 'Monteur / Grondwerker Kabels & Leidingen',
    department: 'Kabels & Leidingen',
    location: 'Dalfsen / Regio Overijssel',
    employmentType: 'Fulltime (40 uur)',
    level: 'MBO / Praktijkervaring',
    salaryRange: '€ 2.950 - € 3.750 bruto p/m',
    summary:
      'Samen met een vaste ploeg werk je dagelijks aan ondergrondse energie-, water- en glasvezelnetwerken in de regio Overijssel.',
    description:
      'Als Monteur / Grondwerker Kabels & Leidingen bij Mars Infratechniek B.V. werk je in een hecht team aan uitdagende nutstracés. Je graaft proefsleuven, legt mantelbuizen en kabels op diepte, assisteert bij gestuurde boringen en zorgt dat de sleuf na afloop strak wordt verdicht en afgewerkt. Wij houden van korte lijnen, goed gereedschap en op tijd weer thuis.',
    requirements:
      'Ervaring in het grondwerk of kabels & leidingen (of de juiste aanpakkersmentaliteit)\nIn bezit van VCA Basis (of bereid deze op onze kosten te halen)\nRijbewijs B (BE is een pluspunt)\nKennis van KLIC-meldingen en veilig graven (CROW 500)',
    benefits:
      'Uitstekend salaris tussen € 2.950 en € 3.750 bruto per maand (afhankelijk van ervaring)\nUitstekende pensioenregeling en arbeidsvoorwaarden conform CAO Bouw & Infra\nVaste ploeg, moderne bedrijfswagen en professioneel materieel\nProjecten in de eigen regio (Overijssel) — weinig reistijd',
    status: 'open',
    authorId: 'system-seed',
    createdAt: '2026-10-15T08:00:00.000Z',
    updatedAt: '2026-10-15T08:00:00.000Z',
  },
  {
    id: 'vac-machinist-02',
    title: 'Machinist Mobiele Graafmachine / Minikraan',
    department: 'Grondwerk & Wegenbouw',
    location: 'Regio Dalfsen & Zwolle',
    employmentType: 'Fulltime (40 uur)',
    level: 'Ervaren Machinist',
    salaryRange: '€ 3.300 - € 4.200 bruto p/m',
    summary:
      'Voor ons moderne machinepark zoeken wij een precieze kraanmachinist voor grondverzet, rioolaanleg en kabelsleuven.',
    description:
      'Als Machinist bij Mars Infratechniek B.V. krijg je een vaste, modern uitgeruste machine (met draaikantelstuk en 3D-GPS voorbereiding). Je werkt aan uiteenlopende GWW-projecten: van het graven van rioolsleuven en het zetten van betonputten tot het onder profiel brengen van wegfunderingen.',
    requirements:
      'Aantoonbare ervaring op de minikraan, midikraan of mobiele graafmachine\nGevoel voor maatvoering, veiligheid rondom kabels en leidingen en netjes werken\nRijbewijs B(E) of T-rijbewijs\nVCA-certificaat',
    benefits:
      'Topsalaris tussen € 3.300 en € 4.200 bruto per maand\nEen vaste eigen kraan die tot in de puntjes wordt onderhouden\nDirect een vast contract bij gebleken geschiktheid\nNuchtere werksfeer met vrijdagmiddagafsluiting op de zaak in Dalfsen',
    status: 'open',
    authorId: 'system-seed',
    createdAt: '2026-10-20T08:00:00.000Z',
    updatedAt: '2026-10-20T08:00:00.000Z',
  },
  {
    id: 'vac-uitvoerder-03',
    title: 'Voorman / Meewerkend Uitvoerder GWW',
    department: 'Grondwerk & Wegenbouw',
    location: 'Dalfsen / Projectlocaties',
    employmentType: 'Fulltime (40 uur)',
    level: 'MBO-3 / MBO-4 Civiele Techniek',
    salaryRange: '€ 3.750 - € 4.750 bruto p/m',
    summary:
      'Geef buiten op het werk leiding aan onze uitvoeringsteams en bewaak planning, maatvoering en kwaliteit zonder bureaucratie.',
    description:
      'Als Voorman / Meewerkend Uitvoerder ben jij het aanspreekpunt op onze projectlocaties. Je stuurt 1 tot 3 ploegen aan bij grond-, riool- en bestratingsprojecten, stemt direct af met de opdrachtgever of toezichthouder en zorgt dat materialen en machines op het juiste moment klaarstaan.',
    requirements:
      'Ruime praktijkervaring in de grond-, weg- en waterbouw (GWW)\nOrganisatorisch sterk, resultaatgericht en communicatief duidelijk\nIn bezit van VCA-VOL en Rijbewijs B(E)\nKunnen lezen van civiele werktekeningen en KLIC-kaarten',
    benefits:
      'Salaris van € 3.750 tot € 4.750 bruto per maand plus onkostenvergoeding\nEigen volledig ingerichte werkbus of pick-up van de zaak\nVeel vrijheid en directe beslissingsbevoegdheid zonder onnodige vergaderingen\nRuimte voor doorgroei naar volwaardig projectleider/uitvoerder',
    status: 'open',
    authorId: 'system-seed',
    createdAt: '2026-10-28T08:00:00.000Z',
    updatedAt: '2026-10-28T08:00:00.000Z',
  },
  {
    id: 'vac-straatmaker-04',
    title: 'Vakman GWW / Straatmaker',
    department: 'Riolering & Bestrating',
    location: 'Regio Overijssel',
    employmentType: 'Fulltime (40 uur)',
    level: 'Ervaren of BBL-Leerling',
    salaryRange: '€ 2.950 - € 3.850 bruto p/m',
    summary:
      'Werk mee aan zowel machinale terreinverhardingen als strak ambachtelijk straatwerk en rioolreconstructies.',
    description:
      'Voor onze bestratings- en rioleringsploeg zoeken wij een Vakman GWW / Straatmaker. Wij werken zoveel mogelijk gemechaniseerd met vacuüm- en klemunits, zodat het werk fysiek gezond blijft en de kwaliteit hoog is. Ook BBL-leerlingen die het vak in de praktijk willen leren zijn van harte welkom.',
    requirements:
      'Ervaring met straatwerk, banden stellen en/of kolken zetten (of leergierig als BBL-starter)\nTeamspeler die trots is op strak opgeleverd werk\nRijbewijs B is gewenst',
    benefits:
      'Bruto maandsalaris tussen € 2.950 en € 3.850 conform CAO Bouw & Infra\nModerne hulpmiddelen voor machinaal straten en ergonomisch werken\nVolledig pakket werkkleding en persoonlijke beschermingsmiddelen\nVast werk gedurende het hele jaar',
    status: 'open',
    authorId: 'system-seed',
    createdAt: '2026-11-01T08:00:00.000Z',
    updatedAt: '2026-11-01T08:00:00.000Z',
  },
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-demo-01',
    vacancyId: 'vac-machinist-02',
    vacancyTitle: 'Machinist Mobiele Graafmachine / Minikraan',
    applicantName: 'Bram van Dijk',
    applicantEmail: 'bram.vandijk@voorbeeld.nl',
    applicantPhone: '06 - 2481 9032',
    motivation:
      'Ik draai inmiddels 7 jaar op de mobiele kraan (Liebherr & Takeuchi) met GPS en draaikantelstuk in regio Zwolle. Ik kom graag langs in Dalfsen voor een kop koffie.',
    cvFileName: 'CV_Bram_van_Dijk_Kraanmachinist.pdf',
    cvMimeType: 'application/pdf',
    cvDataUrl:
      'data:text/plain;charset=utf-8;base64,Q1YgQnJhbSB2YW4gRGlqayAtIE1hY2hpbmlzdCBNb2JpZWxlIEdyYWFmbWFjaGluZSAoNyBqYWFyIGVydmFyaW5nIEdXVyBPdmVyaWpzc2VsKQ==',
    emailDispatched: 'sent',
    status: 'new',
    createdAt: '2026-11-04T14:20:00.000Z',
  },
];

export const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-demo-01',
    name: 'Ing. H. Meijer',
    company: 'Bouwgroep Vechtdal B.V.',
    email: 'h.meijer@bouwgroepvechtdal.nl',
    phone: '0529 - 439 110',
    subject: 'Grondwerk & Wegenbouw',
    message:
      'Voor een nieuwbouwproject van 12 bedrijfshallen in Dalfsen zoeken wij een infrapartner voor het grondwerk, de HWA/DWA riolering en 3.400 m² terreinverharding. Kunnen we deze week het bestek doornemen?',
    emailDispatched: 'sent',
    status: 'new',
    createdAt: '2026-11-04T09:45:00.000Z',
  },
];
