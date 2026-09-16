import { ProjectItem, ExperienceItem, SkillCategory, SocialLink } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Pedro Medina',
  title: 'Quality & Data Analyst | Full Stack Software Engineer',
  location: 'Santo Domingo Este, Dominican Republic',
  email: 'pedromedina1508@icloud.com',
  phone: '+1 (829) 276-0195',
  availability: 'Available for new opportunities & contracts',
  bioHeadline: 'Engineering robust web applications & translating complex operational data into executive intelligence.',
  bioSummary: 'Professional blending rigorous KPI & operational data analytics (Power BI, Python, Excel/VBA) with production-grade Full Stack Engineering (React, TypeScript, Node.js, Express, Docker). Skilled in building high-performance dashboards, auditing quality standards, and engineering pixel-perfect web interfaces.',
  stats: [
    { value: '3.6', label: 'GPA at ITLA', detail: 'Software Engineering' },
    { value: '99.2%', label: 'QA Compliance', detail: 'Healthcare Audits' },
    { value: '5+', label: 'Flagship Platforms', detail: 'Full Stack & Analytics' },
    { value: '<12ms', label: 'Engine Latency', detail: 'Real-time DAX KPIs' }
  ]
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Pmedina30',
    label: 'github.com/Pmedina30',
    iconName: 'Github'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/pedro-medina-227b12346',
    label: 'in/pedro-medina-227b12346',
    iconName: 'Linkedin'
  },
  {
    name: 'Behance',
    url: 'https://behance.net/xandermedina',
    label: 'behance.net/xandermedina',
    iconName: 'Layers'
  },
  {
    name: 'Email',
    url: 'mailto:pedromedina1508@icloud.com',
    label: 'pedromedina1508@icloud.com',
    iconName: 'Mail'
  }
];

export const TECH_STACK_TICKER = [
  { name: 'TypeScript', category: 'Language' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'Python', category: 'Analytics' },
  { name: 'Power BI', category: 'BI & DAX' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Excel / VBA', category: 'Automation' },
  { name: 'REST APIs', category: 'Architecture' },
  { name: 'Git & GitHub', category: 'VCS' },
  { name: 'PostgreSQL', category: 'Database' }
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'project-1',
    title: 'IOCC Airline Operational Performance Dashboard',
    subtitle: 'Aviation C-Suite Intelligence Studio & DAX Engine',
    category: 'Data & Analytics',
    description: 'Tablero interactivo de control de operaciones de vuelo C-Suite para monitoreo de OTP (On-Time Performance), causas de retraso (Pareto 80/20), corredores de vuelo geoespaciales y disponibilidad de flota a resolución 1080p.',
    impactMetrics: [
      'Motor DAX en cliente con <12ms de latencia',
      'Mapa geoespacial interactivo de corredores de vuelo',
      'Mapeo heurístico inteligente de archivos CSV y Excel'
    ],
    tags: ['Power BI', 'DAX', 'React', 'TypeScript', 'Operational Analytics', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Pmedina30',
    liveUrl: 'http://localhost:5176',
    featured: true,
    accentGlow: 'blue',
    statsBadge: 'Aviation Standard'
  },
  {
    id: 'project-2',
    title: 'Full Stack Production Web Platform',
    subtitle: 'Containerized Modular Web Architecture',
    category: 'Full Stack',
    description: 'Arquitectura full-stack robusta construida con React y TypeScript en frontend, Node.js/Express en backend, persistencia con MongoDB y autenticación segura basada en JWT, empaquetada y desplegada con Docker.',
    impactMetrics: [
      'Arquitectura desacoplada en microservicios listos para producción',
      'Autenticación JWT con rotación segura de tokens',
      'Empaquetado y orquestación multi-contenedor con Docker'
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Docker'],
    githubUrl: 'https://github.com/Pmedina30',
    liveUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentGlow: 'purple',
    statsBadge: 'Production Ready'
  },
  {
    id: 'project-3',
    title: 'CenterWell Healthcare QA Automation & KPI Engine',
    subtitle: 'Automated Auditing & Operational Reporting',
    category: 'QA & Automation',
    description: 'Sistema de auditoría y reportes analíticos mensuales para métricas operativas de agentes, incorporando automatización en VBA para acelerar la generación de formularios de control de calidad y reducir tiempos de procesamiento.',
    impactMetrics: [
      'Automatización de reportes mensuales reduciendo tiempos manuales en 65%',
      'Scorecards operativos con seguimiento de cumplimiento SLA',
      'Auditoría y trazabilidad rigurosa de calidad de datos'
    ],
    tags: ['Excel / VBA', 'Python', 'Data Auditing', 'Performance Analysis', 'Process Optimization'],
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentGlow: 'emerald',
    statsBadge: '99.2% Accuracy'
  },
  {
    id: 'project-4',
    title: 'Responsive Component Systems & UI Showcase',
    subtitle: 'Modern Design Systems with Microinteractions',
    category: 'UI/UX Design',
    description: 'Portafolio de sistemas de diseño responsivos, layouts con diseño pixel-perfect, estados interactivos y microinteracciones de alto impacto publicadas en Behance y GitHub.',
    impactMetrics: [
      'Componentes reutilizables con soporte nativo Dark/Light mode',
      'Microinteracciones suaves y accesibilidad AA/AAA',
      'Documentación visual de sistemas de diseño'
    ],
    tags: ['UI/UX', 'Tailwind CSS', 'Framer Motion', 'Design Systems', 'Behance'],
    githubUrl: 'https://github.com/Pmedina30',
    liveUrl: 'https://behance.net/xandermedina',
    featured: true,
    accentGlow: 'amber',
    statsBadge: 'Design System'
  }
];

export const TIMELINE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Data Analyst',
    company: 'Trueshore (CenterWell Campaign)',
    period: 'May 2026 - Present',
    location: 'Santo Domingo, Dominican Republic',
    description: [
      'Extracción, transformación y modelado de datos operacionales de soporte y control de calidad en campañas del sector salud.',
      'Construcción y mantenimiento de dashboards ejecutivos en Power BI para el seguimiento de SLAs y productividad.',
      'Creación de rutinas automatizadas en Python y Excel/VBA para auditorías de calidad mensuales.'
    ],
    keyTechnologies: ['Power BI', 'Python', 'Excel/VBA', 'DAX', 'Data Modeling', 'KPI Auditing'],
    badge: 'Current Role',
    type: 'experience'
  },
  {
    id: 'exp-2',
    role: 'Front-End Developer',
    company: 'Talendig',
    period: 'Jan 2025 - Dec 2025',
    location: 'Santo Domingo, Dominican Republic',
    description: [
      'Desarrollo de interfaces de usuario modernas, responsivas y de alto rendimiento utilizando React.js, TypeScript y Tailwind CSS.',
      'Integración con servicios backend mediante APIs RESTful y optimización de renderizado en el cliente.',
      'Colaboración ágil en equipos multidisciplinarios bajo metodologías Scrum/Git.'
    ],
    keyTechnologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Agile'],
    badge: 'Frontend Engineering',
    type: 'experience'
  },
  {
    id: 'exp-3',
    role: 'Customer Representative',
    company: 'Trueshore',
    period: 'Dec 2023 - May 2026',
    location: 'Santo Domingo, Dominican Republic',
    description: [
      'Resolución de incidencias complejas y soporte técnico con altos estándares de satisfacción al cliente.',
      'Identificación de cuellos de botella operativos que impulsaron la transición hacia analítica de calidad y automatización de procesos.'
    ],
    keyTechnologies: ['Operations', 'Problem Solving', 'SLA Adherence', 'Quality Assurance'],
    badge: 'Operations',
    type: 'experience'
  },
  {
    id: 'edu-1',
    role: "Associate's Degree in Software Engineering",
    company: 'Instituto Tecnológico de Las Américas (ITLA)',
    period: '2019 - 2023',
    location: 'La Caleta, Dominican Republic',
    description: [
      'Graduado con índice de honor sobresaliente (GPA 3.6 / 4.0).',
      'Formación rigurosa en estructuras de datos, algoritmos, arquitectura de software, bases de datos relacionales y desarrollo web.'
    ],
    keyTechnologies: ['Software Architecture', 'Data Structures', 'C#', 'SQL', 'Web Development'],
    badge: 'GPA 3.6 / 4.0',
    type: 'education'
  },
  {
    id: 'edu-2',
    role: 'Full Stack Development Bootcamp',
    company: 'Talendig',
    period: '2025',
    location: 'Santo Domingo, Dominican Republic',
    description: [
      'Especialización intensiva en desarrollo full-stack moderno: React, Node.js, Express, MongoDB y despliegue continuo.'
    ],
    keyTechnologies: ['MERN Stack', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Next.js'],
    badge: 'Bootcamp Graduate',
    type: 'education'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Core Analytics & Quality',
    description: 'Transformación de datos crudos en inteligencia de negocio y automatización de procesos operativos.',
    skills: [
      { name: 'KPI & Performance Analysis', level: 'Expert', percentage: 95 },
      { name: 'Power BI & DAX Modeling', level: 'Expert', percentage: 92 },
      { name: 'Excel / VBA & Macros', level: 'Expert', percentage: 94 },
      { name: 'Python (Pandas / Analytics)', level: 'Advanced', percentage: 88 },
      { name: 'QA Evaluation & Auditing', level: 'Expert', percentage: 96 }
    ]
  },
  {
    title: 'Frontend Engineering',
    description: 'Construcción de interfaces web pixel-perfect, reactivas, accesibles y con microinteracciones fluidas.',
    skills: [
      { name: 'React.js & Hooks', level: 'Expert', percentage: 93 },
      { name: 'TypeScript', level: 'Advanced', percentage: 90 },
      { name: 'Next.js & App Router', level: 'Advanced', percentage: 85 },
      { name: 'Tailwind CSS', level: 'Expert', percentage: 96 },
      { name: 'UI/UX Design Systems', level: 'Advanced', percentage: 88 }
    ]
  },
  {
    title: 'Backend & DevOps',
    description: 'Arquitecturas de servidor robustas, bases de datos optimizadas y flujos de despliegue contenerizado.',
    skills: [
      { name: 'Node.js & Express', level: 'Advanced', percentage: 86 },
      { name: 'RESTful API Architecture', level: 'Expert', percentage: 90 },
      { name: 'MongoDB & NoSQL', level: 'Advanced', percentage: 84 },
      { name: 'Docker & Containers', level: 'Proficient', percentage: 80 },
      { name: 'Git & Version Control', level: 'Expert', percentage: 94 }
    ]
  }
];

// Convenience aliases
export const personalInfo = PERSONAL_INFO;
export const socialLinks = SOCIAL_LINKS;
export const featuredProjects = FEATURED_PROJECTS;
export const timelineItems = TIMELINE_ITEMS;
export const skillCategories = SKILL_CATEGORIES;
export const techStackTicker = TECH_STACK_TICKER;

