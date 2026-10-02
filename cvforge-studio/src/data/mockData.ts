import { ResumeData, IndustryType } from '../types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: 'Javier Arboleda',
    headline: 'Principal Design Technologist & Systems Architect',
    email: 'javier.arboleda@apple-gallery.dev',
    phone: '+34 612 345 678',
    location: 'Madrid, España / Remoto',
    website: 'https://javierarboleda.design',
    github: 'github.com/javier-arboleda',
    linkedin: 'linkedin.com/in/javier-arboleda',
    summary:
      'Líder técnico con más de 10 años definiendo la intersección entre ingeniería de software de alta concurrencia y diseño de productos de referencia. Especialista en sistemas distribuidos en TypeScript, arquitecturas limpias y sistemas de diseño sin sombras con estricto rigor suizo.',
  },
  experience: [
    {
      id: 'e1',
      company: 'Vanguard Systems & Labs',
      role: 'Principal UI/UX Architect',
      location: 'Madrid',
      startDate: '2022-01',
      endDate: 'Presente',
      isCurrent: true,
      description:
        'Lideré el diseño integral y arquitectura de la plataforma SaaS principal con Next.js y TypeScript, reduciendo la latencia de renderizado y unificando el sistema de diseño White Gallery para más de 1.4M de usuarios activos.',
      metrics: 'Reducción del 42% en First Contentful Paint y +28% en retención trimestral',
      highlights: [
        'Estandarización de componentes con radio 28px y bordes hairline silver sin dependencias de sombras paralelas.',
        'Implementación de motor de exportación vectorial de alta resolución a 300 DPI con latencia sub-segundo.',
      ],
    },
    {
      id: 'e2',
      company: 'Studio Mist Global',
      role: 'Staff Product Engineer',
      location: 'Zúrich / Remoto',
      startDate: '2019-03',
      endDate: '2021-12',
      isCurrent: false,
      description:
        'Conceptualicé y desplegué aplicaciones web críticas para clientes Fortune 500, coordinando equipos multidisciplinares de ingeniería frontend y producto.',
      metrics: 'Procesamiento de $12M+ ARR con 99.99% de uptime contable',
      highlights: [
        'Arquitectura de suscripciones PayPal y webhooks idempotentes con verificación criptográfica oficial.',
        'Optimización de First Contentful Paint a 0.4s en redes móviles 4G.',
      ],
    },
    {
      id: 'e3',
      company: 'Helvetia Digital Corp',
      role: 'Senior Software Engineer',
      location: 'Ginebra',
      startDate: '2016-06',
      endDate: '2019-02',
      isCurrent: false,
      description:
        'Desarrollo de microservicios y portales de gestión de identidades bajo estrictos protocolos de seguridad bancaria europea.',
      metrics: '+19% en tasa de conversión en flujos 2FA',
      highlights: [
        'Rediseño de flujos de verificación en dos pasos aumentando la tasa de conversión en un 19%.',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'ETH Zürich (Eidgenössische Technische Hochschule)',
      degree: 'Master of Science in Computer Science & Human-Computer Interaction',
      fieldOfStudy: 'Sistemas Distribuidos e Interfaces de Usuario',
      startDate: '2014',
      endDate: '2016',
      gpaOrHonors: 'Summa Cum Laude',
    },
    {
      id: 'ed2',
      institution: 'Universidad Politécnica de Madrid',
      degree: 'Grado en Ingeniería del Software',
      startDate: '2010',
      endDate: '2014',
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'White Gallery Core UI Kit',
      url: 'https://whitegallery.design',
      description: 'Librería de componentes reactivos con física de resorte y bordes micro-precisos.',
      technologies: ['TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
  ],
  skills: [
    'TypeScript',
    'Next.js 15 App Router',
    'React 19',
    'Supabase & PostgreSQL',
    'PayPal REST API & SDK',
    'Tailwind CSS',
    'Arquitectura Limpia & DDD',
    'Seguridad OWASP',
    'Microfrontends',
  ],
  languages: [
    { language: 'Español', level: 'Nativo' },
    { language: 'Inglés', level: 'C2 - Competencia Profesional Completa' },
    { language: 'Alemán', level: 'B2 - Intermedio Avanzado' },
  ],
  certifications: [
    { id: 'c1', name: 'AWS Certified Solutions Architect - Professional', issuer: 'Amazon Web Services', year: '2025' },
    { id: 'c2', name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2', year: '2024' },
  ],
  industry: 'tech_software',
  privacySettings: {
    hide_phone: false,
    hide_email: false,
    hide_address: false,
  },
  hasWatermark: true,
};

export const INDUSTRY_PRESETS: Record<IndustryType, Partial<ResumeData>> = {
  tech_software: {
    industry: 'tech_software',
    personalDetails: {
      fullName: 'Javier Arboleda',
      headline: 'Lead Software Architect & Full Stack Engineer',
      email: 'javier.tech@ejemplo.com',
      phone: '+34 600 112 233',
      location: 'Madrid, España (Remoto)',
      website: 'https://github.com/javier-dev',
      github: 'github.com/javier-dev',
      linkedin: 'linkedin.com/in/javier-dev',
      summary:
        'Ingeniero de software con más de 8 años construyendo arquitecturas cloud nativas y APIs de ultra baja latencia. Especialista en TypeScript, Next.js, Go y bases de datos relacionales PostgreSQL.',
    },
    skills: [
      'TypeScript',
      'React / Next.js',
      'Node.js & Go',
      'PostgreSQL & Redis',
      'Docker & Kubernetes',
      'CI/CD GitHub Actions',
      'Seguridad de APIs & OAuth',
    ],
    experience: [
      {
        id: 'tech_exp_1',
        company: 'CloudScale Technologies',
        role: 'Senior Staff Engineer',
        location: 'Remoto',
        startDate: '2022-03',
        endDate: 'Presente',
        isCurrent: true,
        description: 'Liderazgo técnico del motor central de procesamiento de eventos en tiempo real.',
        metrics: 'Reducción del 48% en latencia p99 y $140K/año de ahorro en infraestructura AWS',
        highlights: [
          'Migración de arquitectura monolítica a microservicios en contenedores con Kubernetes.',
          'Implementación de caché distribuida con Redis reduciendo carga de base de datos en un 60%.',
        ],
      },
    ],
    certifications: [
      { id: 't_c1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2025' },
      { id: 't_c2', name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', year: '2024' },
    ],
  },

  customer_support_ops: {
    industry: 'customer_support_ops',
    personalDetails: {
      fullName: 'Camila Rossi',
      headline: 'Customer Success & Operations Lead (CSAT 98.4%)',
      email: 'camila.operations@ejemplo.com',
      phone: '+34 655 443 322',
      location: 'Barcelona, España / Híbrido',
      website: 'https://linkedin.com/in/camila-cx',
      linkedin: 'linkedin.com/in/camila-cx',
      summary:
        'Líder de Operaciones y Atención al Cliente con 7+ años de experiencia escalando equipos de soporte multicanal en SaaS B2B. Experta en optimización de flujos CRM, reducción de churn y excelencia en métricas CSAT/FCR.',
    },
    skills: [
      'Zendesk Enterprise',
      'Salesforce Service Cloud',
      'HubSpot CRM & Service Hub',
      'Jira Service Management',
      'Resolución en Primer Contacto (FCR)',
      'Gestión de SLA & SLAs Críticos',
      'Análisis de Churn & NPS',
      'Liderazgo de Equipos (20+ agentes)',
    ],
    languages: [
      { language: 'Español', level: 'Nativo' },
      { language: 'Inglés', level: 'C2 - Bilingüe Profesional' },
      { language: 'Francés', level: 'B2 - Fluido en Atención al Cliente' },
      { language: 'Portugués', level: 'B1 - Comunicación Básica' },
    ],
    experience: [
      {
        id: 'cx_exp_1',
        company: 'SaaSify Global Helpdesk',
        role: 'Customer Operations Manager',
        location: 'Barcelona',
        startDate: '2021-06',
        endDate: 'Presente',
        isCurrent: true,
        description: 'Supervisión integral de equipo de 24 especialistas en soporte técnico Nivel 1 y 2.',
        metrics: 'CSAT sostenido en 98.4% y aumento del First Contact Resolution (FCR) al 86%',
        highlights: [
          'Automatización de macros y bots de clasificación con IA, reduciendo tiempo de respuesta en un 35%.',
          'Implementación de matriz de escalado en Zendesk para clientes VIP de más de $50K ARR.',
        ],
      },
    ],
    certifications: [
      { id: 'cx_c1', name: 'Zendesk Support Administrator Specialist', issuer: 'Zendesk Academy', year: '2025' },
      { id: 'cx_c2', name: 'Certified Customer Experience Professional (CCXP)', issuer: 'CXPA', year: '2024' },
    ],
  },

  finance_management: {
    industry: 'finance_management',
    personalDetails: {
      fullName: 'Alejandro Morales, CFA',
      headline: 'Senior Financial Controller & Strategy Manager',
      email: 'alejandro.morales@finanzas-corp.com',
      phone: '+34 688 990 011',
      location: 'Madrid, España',
      website: 'https://linkedin.com/in/alejandro-morales-cfa',
      linkedin: 'linkedin.com/in/alejandro-morales-cfa',
      summary:
        'Controller Financiero y Especialista en Gestión Estratégica con más de 9 años de experiencia liderando planificación presupuestaria (FP&A), control de costes y modelización de rentabilidad para empresas corporativas y fondos de inversión.',
    },
    skills: [
      'Modelización Financiera & FP&A',
      'Control de Presupuestos OPEX / CAPEX',
      'Análisis de Rentabilidad & EBITDA',
      'ERP SAP S/4HANA & NetSuite',
      'Power BI & Modelado DAX',
      'Cumplimiento Normativo IFRS / NIIF',
      'Fusiones y Adquisiciones (M&A)',
    ],
    languages: [
      { language: 'Español', level: 'Nativo' },
      { language: 'Inglés', level: 'C2 - Competencia Financiera Internacional' },
    ],
    experience: [
      {
        id: 'fin_exp_1',
        company: 'Iberia Capital & Partners',
        role: 'Senior Financial Controller',
        location: 'Madrid',
        startDate: '2020-04',
        endDate: 'Presente',
        isCurrent: true,
        description: 'Gestión y control del presupuesto global de operaciones y elaboración de informes para el Consejo.',
        metrics: 'Supervisión de presupuesto de $9.5M con ahorro del 14% en costes operativos',
        highlights: [
          'Diseño de dashboards en tiempo real con Power BI para monitoreo de flujo de caja y desviaciones.',
          'Liderazgo en la auditoría financiera anual con Big 4 sin salvedades por 4 ejercicios consecutivos.',
        ],
      },
    ],
    certifications: [
      { id: 'f_c1', name: 'CFA Charterholder', issuer: 'CFA Institute', year: '2023' },
      { id: 'f_c2', name: 'Project Management Professional (PMP)', issuer: 'PMI', year: '2024' },
    ],
  },
};

export const MOCK_ANALYTICS = {
  totalViews: 1483,
  uniqueVisitors: 942,
  qrScans: 312,
  pdfDownloads: 189,
  conversionRate: '12.7%',
  recentVisitors: [
    { company: 'Apple Inc. (Cupertino HQ)', location: 'California, US', device: 'macOS / Safari', time: 'Hace 12 min' },
    { company: 'Spotify AB', location: 'Estocolmo, SE', device: 'macOS / Chrome', time: 'Hace 45 min' },
    { company: 'PayPal EMEA HQ', location: 'Dublín, Irlanda', device: 'iOS / Safari', time: 'Hace 2 horas' },
    { company: 'Google LLC (Mountain View)', location: 'California, US', device: 'Linux / Chrome', time: 'Hace 5 horas' },
    { company: 'Revolut Ltd', location: 'Madrid, ES', device: 'Windows / Edge', time: 'Hace 1 día' },
  ],
};

