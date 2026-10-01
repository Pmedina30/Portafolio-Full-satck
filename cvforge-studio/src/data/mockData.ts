import { ResumeData } from '../types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalDetails: {
    fullName: 'Javier Arboleda',
    headline: 'Principal Design Technologist & Systems Architect',
    email: 'javier.arboleda@apple-gallery.dev',
    phone: '+34 612 345 678',
    location: 'Madrid, España / Remoto',
    website: 'https://javierarboleda.design',
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
        'Lideré el diseño integral y arquitectura de la plataforma SaaS principal con Next.js y TypeScript, reduciendo la latencia de renderizado en un 42% y unificando el sistema de diseño White Gallery para más de 1.4M de usuarios activos.',
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
      highlights: [
        'Arquitectura de suscripciones Stripe y webhooks idempotentes con cero fallos de sincronización contable.',
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
      highlights: [
        'Rediseño de flujos de verificación en dos pasos aumentando la tasa de conversión en un 19%.',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'Universidad Politécnica de Madrid (UPM)',
      degree: 'Grado en Ingeniería de Software e Interacción Humano-Computador',
      startDate: '2012-09',
      endDate: '2016-06',
      gpaOrHonors: 'Matrícula de Honor en Arquitectura de Software y Sistemas Distribuidos',
    },
    {
      id: 'ed2',
      institution: 'ETH Zürich (Executive Education)',
      degree: 'Advanced Certificate in Distributed Systems & HCI',
      startDate: '2018-02',
      endDate: '2018-08',
      gpaOrHonors: 'Distinction Award',
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'White Gallery Design Tokens',
      url: 'https://tokens.whitegallery.internal',
      description: 'Librería abierta de tokens cromáticos y ritmo vertical estricto para productos ejecutivos.',
      technologies: ['TypeScript', 'Tailwind CSS', 'CSS Variables'],
    },
    {
      id: 'p2',
      name: 'CVForge Engine',
      url: 'https://cvforge.app',
      description: 'Motor de renderizado y publicación en tiempo real de currículums de alta gama.',
      technologies: ['React', 'Next.js', 'PostgreSQL', 'Stripe API'],
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'PostgreSQL',
    'Clean Architecture',
    'Stripe Checkout & Webhooks',
    'Framer Motion',
    'HCI & Swiss Design',
    'CI/CD & Cloud Edge'
  ],
  languages: [
    'Español (Nativo)',
    'Inglés (C2 - Fluidez ejecutiva profesional)',
    'Alemán (B2 - Intermedio técnico)'
  ],
};

export const MOCK_ANALYTICS = {
  totalViews: 1482,
  uniqueVisitors: 934,
  qrScans: 312,
  pdfDownloads: 198,
  conversionRate: '21.2%',
  recentVisitors: [
    { company: 'Apple Inc.', location: 'Cupertino, CA, EE.UU.', time: 'Hace 8 min', device: 'macOS / Safari' },
    { company: 'Vercel EMEA', location: 'Londres, Reino Unido', time: 'Hace 24 min', device: 'iOS / Chrome' },
    { company: 'Stripe Europe', location: 'Dublín, Irlanda', time: 'Hace 1 hora', device: 'macOS / Arc' },
    { company: 'Linear App', location: 'San Francisco, CA, EE.UU.', time: 'Hace 3 horas', device: 'macOS / Safari' },
    { company: 'Figma Design Group', location: 'Nueva York, EE.UU.', time: 'Hace 5 horas', device: 'Windows / Chrome' },
  ],
};
