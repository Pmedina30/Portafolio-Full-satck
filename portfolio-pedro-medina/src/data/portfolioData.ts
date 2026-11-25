import {
  ProjectItem,
  ExperienceItem,
  CapabilityDomain,
  SocialLink,
  WorkspaceAppEntry
} from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Pedro Medina',
  monogram: 'PM // 26',
  coordinates: "18°29'09\"N 69°53'36\"W",
  city: 'Santo Domingo Este, DO',
  email: 'pedromedina1508@icloud.com',
  phone: '+1 (829) 276-0195',
  githubUrl: 'https://github.com/Pmedina30',
  linkedinUrl: 'https://linkedin.com/in/pedro-medina-227b12346',
  behanceUrl: 'https://behance.net/xandermedina',
  roleBadge: {
    en: 'FULL-STACK ENGINEER & OPERATIONAL DATA ARCHITECT',
    es: 'INGENIERO FULL-STACK & ARQUITECTO DE DATOS OPERACIONALES'
  },
  availability: {
    en: 'Available for Full-Stack Engineering & Data Architecture roles',
    es: 'Disponible para roles de Ingeniería Full-Stack y Arquitectura de Datos'
  },
  heroTitle: {
    en: 'Systems that compute with rigor and move with precision.',
    es: 'Sistemas que calculan con rigor y responden con precisión.'
  },
  heroSubtitle: {
    en: 'I architect full-stack web platforms, real-time geospatial & aviation telemetry studios, and automated healthcare QA engines—bridging raw operational data with tactile interfaces.',
    es: 'Diseño plataformas web full-stack, estudios de telemetría geoespacial y de aviación en tiempo real, y motores automatizados de auditoría QA—uniendo datos operativos con interfaces táctiles.'
  },
  stats: [
    {
      value: '12',
      unit: 'SYS',
      label: { en: 'Production Platforms', es: 'Plataformas en Producción' },
      detail: { en: 'Full-Stack, BI, 3D & FinTech', es: 'Full-Stack, BI, 3D y FinTech' }
    },
    {
      value: '99.2',
      unit: '%',
      label: { en: 'QA Audit Precision', es: 'Precisión de Auditoría QA' },
      detail: { en: 'CenterWell Healthcare SLA', es: 'SLA Salud CenterWell' }
    },
    {
      value: '<12',
      unit: 'ms',
      label: { en: 'Client DAX Latency', es: 'Latencia Motor DAX' },
      detail: { en: 'Real-time KPI Computation', es: 'Cálculo KPI en Tiempo Real' }
    },
    {
      value: '3.6',
      unit: '/4.0',
      label: { en: 'ITLA Honors GPA', es: 'Índice Académico ITLA' },
      detail: { en: 'Software Engineering', es: 'Tecnólogo en Software' }
    }
  ]
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Pmedina30',
    handle: '@Pmedina30',
    iconName: 'Github'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/pedro-medina-227b12346',
    handle: '/in/pedro-medina',
    iconName: 'Linkedin'
  },
  {
    name: 'Behance',
    url: 'https://behance.net/xandermedina',
    handle: '@xandermedina',
    iconName: 'Layers'
  },
  {
    name: 'Email',
    url: 'mailto:pedromedina1508@icloud.com',
    handle: 'pedromedina1508@icloud.com',
    iconName: 'Mail'
  }
];

export const TECH_STACK_TICKER = [
  { name: 'TypeScript 5', category: 'Core' },
  { name: 'React 18', category: 'UI Runtime' },
  { name: 'Next.js', category: 'Full-Stack' },
  { name: 'Python 3 / Flask', category: 'Backend & Data' },
  { name: 'Power BI & DAX', category: 'Executive BI' },
  { name: 'Node.js & Express', category: 'API Layer' },
  { name: 'Three.js / WebGL', category: '3D Spatial' },
  { name: 'Google Maps & PostGIS', category: 'Geospatial' },
  { name: 'Cloud Firestore', category: 'Real-Time DB' },
  { name: 'PostgreSQL & SQLite', category: 'Relational' },
  { name: 'Excel VBA Automation', category: 'QA Pipelines' },
  { name: 'Docker Containers', category: 'Infrastructure' },
  { name: 'Tailwind CSS', category: 'Design Tokens' }
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'taxi-operations',
    index: '01',
    title: 'taxi. Operations Command',
    subtitle: {
      en: 'Real-Time Urban Mobility Dispatch & Geospatial Telemetry (Santo Domingo)',
      es: 'Despacho de Movilidad Urbana y Telemetría Geoespacial en Tiempo Real (Santo Domingo)'
    },
    category: 'Data & Telemetry',
    summary: {
      en: 'High-density fleet control center tracking 310+ active drivers across Santo Domingo polygons (Piantini, Naco, Bella Vista, Zona Colonial) with dual Google Maps Traffic Layer & Leaflet cartography, live RD$ gross/commission ledger, and INTRANT/PGR compliance auditing.',
      es: 'Centro de control de flota de alta densidad monitoreando 310+ conductores activos en polígonos de Santo Domingo (Piantini, Naco, Bella Vista, Zona Colonial) con cartografía dual Google Maps Traffic Layer + Leaflet, libro mayor en RD$ y validación INTRANT/PGR.'
    },
    problemSolved: {
      en: 'Eliminated blind spots in peak-hour urban dispatch by combining live arterial traffic telemetry with automated driver credential verification.',
      es: 'Eliminó puntos ciegos en el despacho urbano de hora pico combinando telemetría de tráfico arterial en vivo con verificación automatizada de credenciales.'
    },
    impactMetrics: {
      en: [
        '310 concurrent active units tracked across 5 Santo Domingo operational zones',
        'RD$ 488,428 daily gross volume ledger with real-time 20% platform commission split (RD$ 97,686)',
        '2m 14s mean dispatch assignment latency with INTRANT license & PGR background verification'
      ],
      es: [
        '310 unidades activas concurrentes monitoreadas en 5 zonas operativas de Santo Domingo',
        'Facturación diaria de RD$ 488,428 con cálculo automático de comisión del 20% (RD$ 97,686)',
        'Tiempo promedio de asignación de 2m 14s con validación de licencias INTRANT y antecedentes PGR'
      ]
    },
    tags: ['React 18', 'TypeScript', 'Google Maps API', 'Leaflet', 'PostGIS', 'WebSockets', 'Tailwind CSS'],
    localPort: 'http://localhost:5182',
    launcherCmd: 'run_taxi.bat',
    liveUrl: 'http://localhost:5182',
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'vermilion',
    statusBadge: 'PORT 5182 // LIVE TELEMETRY',
    simulationType: 'taxi',
    architecture: [
      {
        layer: 'Geospatial Engine',
        tech: 'Google Maps JS API + Traffic Layer + Leaflet Fallback',
        detail: {
          en: 'Vector dark/light cartography rendering Av. 27 de Febrero, Winston Churchill & JFK corridors with live congestion overlays.',
          es: 'Cartografía vectorial renderizando corredores Av. 27 de Febrero, Winston Churchill y JFK con capas de congestión en vivo.'
        }
      },
      {
        layer: 'Dispatch Stream',
        tech: 'Reactive Event Bus & Polygon Telemetry',
        detail: {
          en: 'Sub-second state synchronization for ride matching, fare surging, and driver compliance gating (INTRANT / PGR).',
          es: 'Sincronización de estado sub-segundo para emparejamiento de viajes, tarifas dinámicas y validación INTRANT / PGR.'
        }
      },
      {
        layer: 'Financial Ledger',
        tech: 'RD$ Settlement Aggregator',
        detail: {
          en: 'Automated split accounting between gross passenger fares, 20% platform take-rate, and driver payouts.',
          es: 'Contabilidad automatizada de división entre tarifa bruta, comisión del 20% de plataforma y liquidación a conductores.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'dispatchTelemetry.ts',
      language: 'typescript',
      code: `export function computeZoneCommission(grossRD: number, takeRate = 0.20) {
  const netCommission = Math.round(grossRD * takeRate);
  const driverPayout = grossRD - netCommission;
  return { grossRD, netCommission, driverPayout, currency: 'DOP' };
}`
    }
  },
  {
    id: 'iocc-aviation-studio',
    index: '02',
    title: 'IOCC Aviation Executive Studio',
    subtitle: {
      en: 'Airline Integrated Operations Control & Client-Side DAX Engine',
      es: 'Centro de Control de Operaciones Aéreas (IOCC) y Motor DAX en Cliente'
    },
    category: 'Data & Telemetry',
    summary: {
      en: 'C-Suite 1080p operational intelligence workstation engineered for airline Integrated Operations Control Centers. Computes On-Time Performance (OTP), IATA delay Pareto (80/20), fleet turnaround status, and geospatial flight corridors in under 12ms.',
      es: 'Estación de inteligencia operativa C-Suite 1080p diseñada para Centros de Control de Operaciones Aéreas (IOCC). Calcula puntualidad (OTP), Pareto de demoras IATA (80/20), disponibilidad de flota y corredores de vuelo en menos de 12ms.'
    },
    problemSolved: {
      en: 'Replaced sluggish spreadsheet exports with an instant client-side DAX computation engine that ingests raw CSV/Excel flight logs via heuristic schema mapping.',
      es: 'Reemplazó exportaciones lentas por un motor de cómputo DAX en cliente que procesa bitácoras de vuelo CSV/Excel mediante mapeo heurístico de esquemas.'
    },
    impactMetrics: {
      en: [
        '<12ms client-side DAX measure evaluation across multi-corridor flight datasets',
        'Automated 80/20 Pareto root-cause isolation across Weather, Maintenance, Crew, and ATC',
        'Zero-scroll 1080p executive canvas with heuristic CSV/XLSX ingestion pipeline'
      ],
      es: [
        '<12ms en evaluación de medidas DAX en cliente sobre múltiples corredores de vuelo',
        'Aislamiento automático Pareto 80/20 en causas de demora (Clima, Mantenimiento, Tripulación, ATC)',
        'Lienzo ejecutivo 1080p sin scroll con ingesta heurística de archivos CSV/XLSX'
      ]
    },
    tags: ['React 18', 'TypeScript', 'DAX Engine', 'Power BI Patterns', 'Geospatial SVG', 'Operational BI'],
    localPort: 'http://localhost:5176',
    launcherCmd: 'run_executive_studio.bat',
    liveUrl: 'http://localhost:5176',
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'cyan',
    statusBadge: 'PORT 5176 // <12MS DAX',
    simulationType: 'aviation',
    architecture: [
      {
        layer: 'Heuristic Ingestion',
        tech: 'Schema Auto-Mapper (CSV / Excel)',
        detail: {
          en: 'Detects tail numbers, departure/arrival timestamps, IATA delay codes, and gate turnarounds automatically.',
          es: 'Detecta matrículas, tiempos de salida/llegada, códigos de demora IATA y rotaciones en puerta automáticamente.'
        }
      },
      {
        layer: 'In-Memory DAX Kernel',
        tech: 'Typed Vector Aggregations',
        detail: {
          en: 'Recomputes OTP%, Block Hours, Completion Factor, and Pareto cumulative curves in <12ms on filter change.',
          es: 'Recalcula OTP%, Horas Bloque, Factor de Cumplimiento y curvas acumuladas de Pareto en <12ms al filtrar.'
        }
      },
      {
        layer: 'C-Suite Canvas',
        tech: '1080p Locked Aspect Grid',
        detail: {
          en: 'Boardroom-ready telemetry layout with interactive corridor arcs and turnaround alerts.',
          es: 'Diseño de telemetría listo para sala de juntas con arcos de corredores interactivos y alertas de rotación.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'daxKernel.ts',
      language: 'typescript',
      code: `export const evaluateOTP = (flights: FlightLeg[], thresholdMin = 15) => {
  const onTime = flights.filter(f => f.ArrivalDelayMin <= thresholdMin).length;
  return flights.length ? Number(((onTime / flights.length) * 100).toFixed(1)) : 100;
};`
    }
  },
  {
    id: 'omnipos-colmadopro',
    index: '03',
    title: 'OmniPOS & ColmadoPro Suite',
    subtitle: {
      en: 'Cloud Retail ERP, Point-of-Sale & Dual-Sync Inventory Architecture',
      es: 'ERP Comercial en la Nube, Punto de Venta e Inventario de Sincronización Dual'
    },
    category: 'Full Stack & Cloud',
    summary: {
      en: 'Production retail management and point-of-sale ecosystem built for high-throughput Dominican commerce and tech retail. Features real-time Cloud Firestore + offline local persistence, predictive barcode/SKU catalog, ITBIS tax engine, and automated critical stock alerts.',
      es: 'Ecosistema de punto de venta y gestión comercial construido para comercios de alto tráfico en RD y tiendas tecnológicas. Incluye sincronización dual Cloud Firestore + persistencia local offline, catálogo predictivo SKU, motor de ITBIS y alertas de stock crítico.'
    },
    problemSolved: {
      en: 'Guaranteed zero-downtime checkout operations even during internet outages through a dual Cloud Firestore + Indexed/Local persistence state machine.',
      es: 'Garantizó operaciones de caja sin interrupciones incluso ante caídas de internet mediante una máquina de estados dual Cloud Firestore + persistencia local.'
    },
    impactMetrics: {
      en: [
        'Dual-sync engine: seamless failover between Google Cloud Firestore and persistent local storage',
        'Multi-tender checkout (Cash with instant RD$ change calculation, Card, Transfer) + printable thermal receipt',
        'Real-time margin & revenue analytics in Dominican Pesos (RD$) with 1-click CSV inventory export'
      ],
      es: [
        'Motor de sincronización dual: conmutación transparente entre Cloud Firestore y almacenamiento local persistente',
        'Cobro multimétodo (Efectivo con cálculo de devuelta en RD$, Tarjeta, Transferencia) + recibo térmico imprimible',
        'Analítica de márgenes y facturación en Pesos Dominicanos (RD$) con exportación de inventario a CSV en 1 clic'
      ]
    },
    tags: ['React 18', 'Firebase Auth', 'Cloud Firestore', 'Recharts', 'Tailwind CSS', 'POS Architecture'],
    localPort: 'http://localhost:5175',
    launcherCmd: 'run_colmado.bat / run_omnipos.bat',
    liveUrl: 'http://localhost:5175',
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'emerald',
    statusBadge: 'PORTS 5175 & 3001 // DUAL-SYNC',
    simulationType: 'pos',
    architecture: [
      {
        layer: 'Authentication & RBAC',
        tech: 'Firebase Auth + Power-Admin Instant Session',
        detail: {
          en: 'Supports Google Sign-In, Email/Password, and 1-click Admin audit session for rapid evaluation.',
          es: 'Soporta Google Sign-In, Email/Contraseña y sesión de auditoría Admin en 1 clic para evaluación inmediata.'
        }
      },
      {
        layer: 'Persistence Engine',
        tech: 'Cloud Firestore + Local Fallback Adapter',
        detail: {
          en: 'Synchronizes SKUs, stock mutations, and sales ledgers across cloud and local storage without blocking the cashier.',
          es: 'Sincroniza SKUs, movimientos de inventario y libro de ventas entre la nube y almacenamiento local sin bloquear caja.'
        }
      },
      {
        layer: 'Executive KPIs',
        tech: 'Recharts Margin & Stock Velocity Engine',
        detail: {
          en: 'Tracks daily gross RD$, net profit margin, and triggers automated Yellow/Red stock depletion alerts.',
          es: 'Rastrea facturación bruta en RD$, margen neto y dispara alertas automáticas Amarillas/Rojas de agotamiento.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'posCheckout.ts',
      language: 'typescript',
      code: `export function settleOrderRD(items: CartItem[], cashTendered: number) {
  const subtotal = items.reduce((acc, i) => acc + i.priceRD * i.qty, 0);
  const itbis = Math.round(subtotal * 0.18);
  const total = subtotal + itbis;
  return { subtotal, itbis, total, changeDue: Math.max(0, cashTendered - total) };
}`
    }
  },
  {
    id: 'centerwell-qa-engine',
    index: '04',
    title: 'CenterWell Healthcare QA & KPI Engine',
    subtitle: {
      en: 'Automated Quality Auditing, SLA Telemetry & VBA/Python Reporting Pipeline',
      es: 'Auditoría Automatizada de Calidad, Telemetría SLA y Pipeline Python/VBA'
    },
    category: 'QA & FinTech',
    summary: {
      en: 'Operational quality assurance and executive reporting system engineered for healthcare support operations at Trueshore (CenterWell Campaign). Automates monthly QA audit form generation, tracks agent SLA adherence, and models defect distributions in Power BI.',
      es: 'Sistema de aseguramiento de calidad operativo y reportería ejecutiva desarrollado para operaciones de salud en Trueshore (Campaña CenterWell). Automatiza la generación mensual de formularios QA, mide adherencia a SLAs y modela distribuciones de defectos en Power BI.'
    },
    problemSolved: {
      en: 'Cut monthly manual QA form preparation and consolidation time by 65% while maintaining 99.2% audit accuracy across healthcare compliance rubrics.',
      es: 'Redujo en un 65% el tiempo manual de preparación y consolidación mensual de auditorías QA manteniendo un 99.2% de precisión en cumplimiento de salud.'
    },
    impactMetrics: {
      en: [
        '65% reduction in manual monthly reporting turnaround via Python & Excel/VBA automation routines',
        '99.2% QA audit compliance accuracy across regulated healthcare support interactions',
        'Executive Power BI scorecards tracking AHT, CSAT, FCR, and critical compliance rubrics'
      ],
      es: [
        '65% de reducción en tiempos de reportería mensual mediante rutinas automatizadas en Python y Excel/VBA',
        '99.2% de precisión en cumplimiento de auditorías QA en interacciones reguladas del sector salud',
        'Scorecards ejecutivos en Power BI monitoreando AHT, CSAT, FCR y rúbricas críticas de cumplimiento'
      ]
    },
    tags: ['Power BI', 'Python', 'DAX', 'Excel / VBA', 'Healthcare QA', 'SLA Telemetry'],
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'amber',
    statusBadge: 'PRODUCTION // 99.2% SLA',
    simulationType: 'qa',
    architecture: [
      {
        layer: 'Ingestion & Cleansing',
        tech: 'Python Pandas + VBA Macro Pipeline',
        detail: {
          en: 'Extracts raw interaction logs, normalizes agent identifiers, and validates mandatory HIPAA/healthcare rubric fields.',
          es: 'Extrae registros crudos de interacciones, normaliza identificadores de agentes y valida campos obligatorios de salud.'
        }
      },
      {
        layer: 'Semantic BI Model',
        tech: 'Power BI Star Schema & DAX Measures',
        detail: {
          en: 'Computes rolling 30-day QA pass rates, coaching impact deltas, and defect Pareto categories.',
          es: 'Calcula tasas de aprobación QA móviles de 30 días, impacto de coaching y categorías Pareto de defectos.'
        }
      },
      {
        layer: 'Automated Distribution',
        tech: '1-Click Scorecard Generator',
        detail: {
          en: 'Generates individual agent coaching packets and supervisor executive summaries automatically.',
          es: 'Genera paquetes individuales de retroalimentación y resúmenes ejecutivos para supervisores automáticamente.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'qaAuditPipeline.py',
      language: 'python',
      code: `def compute_campaign_sla(df):
    critical_pass = (df['hipaa_verified'] & (df['rubric_score'] >= 90)).mean()
    weighted_qa = (df['rubric_score'] * df['call_weight']).sum() / df['call_weight'].sum()
    return {"sla_compliance": round(critical_pass * 100, 2), "qa_index": round(weighted_qa, 1)}`
    }
  },
  {
    id: 'nexus-cosmos-3d',
    index: '05',
    title: 'NEXUS-01 & CosmosLens 3D Spatial',
    subtitle: {
      en: 'WebGL Scroll-Driven Hardware Exploded View & Orbital Telemetry Explorer',
      es: 'Desensamble 3D WebGL Controlado por Scroll y Explorador de Telemetría Orbital'
    },
    category: '3D & Spatial UI',
    summary: {
      en: 'Pair of GPU-accelerated 3D web experiences: NEXUS-01 features scroll-driven exploded hardware inspection, real-time PBR shader customization, and procedural Web Audio synthesis; CosmosLens delivers a visionOS spatial glass deep-space telemetry explorer.',
      es: 'Dúo de experiencias web 3D aceleradas por GPU: NEXUS-01 integra desensamble de hardware sincronizado con scroll, personalizador de materiales PBR en tiempo real y síntesis Web Audio procedimental; CosmosLens ofrece un explorador espacial estilo visionOS.'
    },
    problemSolved: {
      en: 'Engineered 60fps procedural 3D hardware and orbital visualizations directly in the browser without multi-megabyte external asset bottlenecks.',
      es: 'Logró visualizaciones 3D procedimentales y orbitales a 60fps directamente en el navegador sin cuellos de botella por descargas pesadas.'
    },
    impactMetrics: {
      en: [
        '60fps WebGL / Three.js rendering with real-time PBR metallic/roughness shader switching',
        'Scroll-synchronized mechanical disassembly revealing titanium acoustic drivers & neural DSP core',
        'Procedural Web Audio API synthesizer generating interactive spatial soundscapes without external MP3s'
      ],
      es: [
        'Renderizado WebGL / Three.js a 60fps con cambio instantáneo de shaders PBR metálicos',
        'Desensamble mecánico sincronizado con scroll revelando diafragmas de titanio y núcleo neuronal DSP',
        'Sintetizador procedimental con Web Audio API generando paisajes sonoros interactivos sin archivos externos'
      ]
    },
    tags: ['Three.js', 'WebGL', 'React 18', 'Web Audio API', 'PBR Shaders', 'Spatial UI'],
    localPort: 'http://localhost:5174',
    launcherCmd: 'run_nexus.bat / run_cosmoslens.bat',
    liveUrl: 'http://localhost:5174',
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'vermilion',
    statusBadge: 'PORTS 5174 & 3000 // WEBGL 60FPS',
    simulationType: 'spatial3d',
    architecture: [
      {
        layer: 'Scene Graph & Shaders',
        tech: 'Three.js + Custom PBR Materials',
        detail: {
          en: 'Dynamic studio lighting rig with instant material presets (Obsidian Cyber, Titanium Silver, Neon Cyan).',
          es: 'Iluminación de estudio dinámica con preajustes instantáneos de materiales (Obsidian Cyber, Titanium Silver, Neon Cyan).'
        }
      },
      {
        layer: 'Kinematic Scroll Solver',
        tech: 'Interpolated Exploded-View Vectors',
        detail: {
          en: 'Smoothly separates acoustic chassis components along axial vectors proportional to scroll progress.',
          es: 'Separa suavemente los componentes del chasis acústico sobre vectores axiales proporcionales al progreso de scroll.'
        }
      },
      {
        layer: 'Acoustic DSP',
        tech: 'Web Audio API Oscillator Graph',
        detail: {
          en: 'Synthesizes real-time harmonic feedback and sub-bass resonance directly in browser memory.',
          es: 'Sintetiza retroalimentación armónica y resonancia sub-grave en tiempo real directamente en memoria del navegador.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'explodedKinematics.ts',
      language: 'typescript',
      code: `export function interpolateExplosion(scrollRatio: number, baseOffset: number) {
  const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, scrollRatio)), 3);
  return Number((baseOffset * eased * 2.4).toFixed(3));
}`
    }
  },
  {
    id: 'finpulse-tiendard-fintech',
    index: '06',
    title: 'FinPulse, ApexLend & TiendaRD',
    subtitle: {
      en: 'Corporate Expense Anomaly Detection, Loan Amortization & Cross-Border Commerce',
      es: 'Detección de Anomalías en Gastos, Amortización de Préstamos y Comercio Transfronterizo'
    },
    category: 'QA & FinTech',
    summary: {
      en: 'Financial engineering and cross-border commerce suite: FinPulse audits corporate expenses for policy anomalies; ApexLend computes precision French/German loan amortization schedules; TiendaRD orchestrates US-to-Dominican Republic courier & customs pricing.',
      es: 'Suite de ingeniería financiera y comercio transfronterizo: FinPulse audita gastos corporativos detectando anomalías; ApexLend calcula tablas de amortización precisas; TiendaRD orquesta comercio electrónico de EE.UU. hacia República Dominicana con aranceles y courier.'
    },
    problemSolved: {
      en: 'Unified complex financial compliance rules—corporate audit thresholds, loan interest curves, and DR customs/courier tariffs—into transparent interactive calculators.',
      es: 'Unificó reglas financieras complejas—umbrales de auditoría corporativa, curvas de interés y aranceles aduanales en RD—en calculadoras interactivas transparentes.'
    },
    impactMetrics: {
      en: [
        'Automated flagging of duplicate invoices, weekend out-of-policy spend, and threshold splitting in FinPulse',
        'Exact French amortization schedules with early principal prepayment simulation in ApexLend',
        'End-to-end USD to DOP landed-cost calculator (CIF + DGA customs duty + courier weight) in TiendaRD'
      ],
      es: [
        'Detección automática de facturas duplicadas, gastos fuera de política en fin de semana y fraccionamiento en FinPulse',
        'Tablas de amortización exactas con simulación de abonos extraordinarios a capital en ApexLend',
        'Calculadora de costo puesto en RD de USD a DOP (CIF + arancel DGA + peso courier) en TiendaRD'
      ]
    },
    tags: ['TypeScript', 'React 18', 'Financial Modeling', 'Anomaly Detection', 'Python Flask', 'SQLite'],
    localPort: 'http://localhost:5179',
    launcherCmd: 'run_finpulse_frontend.bat / run_tiendard.bat',
    liveUrl: 'http://localhost:5179',
    githubUrl: 'https://github.com/Pmedina30',
    featured: true,
    accentColor: 'emerald',
    statusBadge: 'PORTS 5179 & 5180 // FINTECH SUITE',
    simulationType: 'fintech',
    architecture: [
      {
        layer: 'Anomaly Heuristic Engine',
        tech: 'Z-Score & Policy Rule Evaluator',
        detail: {
          en: 'Scores corporate expense transactions against department baselines and flags receipt discrepancies.',
          es: 'Evalúa transacciones corporativas frente a líneas base por departamento y marca discrepancias en recibos.'
        }
      },
      {
        layer: 'Amortization Solver',
        tech: 'Precision Decimal Financial Math',
        detail: {
          en: 'Generates period-by-period principal vs. interest breakdowns and total interest savings under extra payments.',
          es: 'Genera desgloses período por período de capital vs. interés y ahorro total ante pagos extraordinarios.'
        }
      },
      {
        layer: 'Cross-Border Tariff Engine',
        tech: 'USD/DOP Landed Cost Calculator',
        detail: {
          en: 'Computes Law 146-00 de minimis exemptions ($200 USD threshold), ITBIS, and per-pound Miami-SDQ freight.',
          es: 'Calcula exenciones de minimis bajo Ley 146-00 (umbral US$200), ITBIS y flete por libra Miami-SDQ.'
        }
      }
    ],
    keyCodeSnippet: {
      filename: 'landedCostDR.ts',
      language: 'typescript',
      code: `export function computeLandedCostRD(fobUSD: number, weightLbs: number, fx = 60.5) {
  const freightUSD = weightLbs * 3.25;
  const dutyUSD = fobUSD > 200 ? (fobUSD + freightUSD) * 0.38 : 0;
  return Math.round((fobUSD + freightUSD + dutyUSD) * fx);
}`
    }
  }
];

export const WORKSPACE_APPS_INDEX: WorkspaceAppEntry[] = [
  {
    id: 'app-taxi',
    name: 'taxi. Operations SDQ',
    domain: { en: 'Geospatial Fleet & Dispatch Telemetry', es: 'Flota Geoespacial y Telemetría de Despacho' },
    stack: ['React 18', 'TypeScript', 'Google Maps API', 'Leaflet', 'PostGIS'],
    port: '5182',
    launcher: 'run_taxi.bat',
    liveUrl: 'http://localhost:5182',
    highlight: { en: '310 units live across Santo Domingo + INTRANT/PGR verification', es: '310 unidades en vivo en Santo Domingo + validación INTRANT/PGR' }
  },
  {
    id: 'app-iocc',
    name: 'Executive Dashboard Studio (IOCC)',
    domain: { en: 'Aviation C-Suite BI & Client DAX Engine', es: 'BI Ejecutivo de Aviación y Motor DAX en Cliente' },
    stack: ['React 18', 'TypeScript', 'DAX Engine', 'Tailwind CSS'],
    port: '5176',
    launcher: 'run_executive_studio.bat',
    liveUrl: 'http://localhost:5176',
    highlight: { en: '<12ms OTP & IATA Delay Pareto 80/20 computation', es: 'Cálculo de OTP y Pareto 80/20 de demoras IATA en <12ms' }
  },
  {
    id: 'app-colmado',
    name: 'ColmadoPro POS & ERP',
    domain: { en: 'Retail Point-of-Sale & Cloud Inventory', es: 'Punto de Venta Comercial e Inventario en la Nube' },
    stack: ['React 18', 'Firebase Auth', 'Cloud Firestore', 'Recharts'],
    port: '5175',
    launcher: 'run_colmado.bat',
    liveUrl: 'http://localhost:5175',
    highlight: { en: 'Dual Cloud/Local sync + RD$ thermal receipt & CSV export', es: 'Sincronización dual Nube/Local + recibo térmico en RD$ y CSV' }
  },
  {
    id: 'app-omnipos',
    name: 'OmniPOS Command',
    domain: { en: 'iPadOS Split-View Retail Operating System', es: 'Sistema Operativo Retail estilo iPadOS Split-View' },
    stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS'],
    port: '3001',
    launcher: 'run_omnipos.bat',
    liveUrl: 'http://localhost:3001',
    highlight: { en: 'Multi-window POS terminal & hardware inventory command', es: 'Terminal POS multi-ventana y comando de inventario tecnológico' }
  },
  {
    id: 'app-nexus',
    name: 'NEXUS-01 Cybernetic Audio',
    domain: { en: '3D WebGL Hardware Exploded-View Experience', es: 'Experiencia 3D WebGL con Vista Explotada de Hardware' },
    stack: ['Three.js', 'WebGL', 'Web Audio API', 'React 18'],
    port: '5174',
    launcher: 'run_nexus.bat',
    liveUrl: 'http://localhost:5174',
    highlight: { en: 'Scroll-driven 3D disassembly + real-time PBR shaders', es: 'Desensamble 3D por scroll + shaders PBR en tiempo real' }
  },
  {
    id: 'app-cosmos',
    name: 'CosmosLens Orbital',
    domain: { en: 'visionOS Spatial Glass Deep-Space Telemetry', es: 'Telemetría Espacial Profunda estilo visionOS' },
    stack: ['Three.js', 'React 18', 'TypeScript', 'Spatial UI'],
    port: '3000',
    launcher: 'run_cosmoslens.bat',
    liveUrl: 'http://localhost:3000',
    highlight: { en: 'Orbital trajectory visualizer & exoplanet telemetry', es: 'Visualizador de trayectorias orbitales y telemetría exoplanetaria' }
  },
  {
    id: 'app-finpulse',
    name: 'FinPulse Corporate Audit',
    domain: { en: 'Expense Auditing & Anomaly Detection', es: 'Auditoría de Gastos y Detección de Anomalías' },
    stack: ['React 18', 'TypeScript', 'Python API', 'Tailwind CSS'],
    port: '5179',
    launcher: 'run_finpulse_frontend.bat',
    liveUrl: 'http://localhost:5179',
    highlight: { en: 'Automated policy violation & duplicate invoice flagging', es: 'Detección automática de violaciones de política y facturas duplicadas' }
  },
  {
    id: 'app-pulseops',
    name: 'PulseOps B2B Intelligence',
    domain: { en: 'Real-Time B2B SLA & Incident Telemetry', es: 'Telemetría B2B de Incidentes y SLAs en Tiempo Real' },
    stack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Lucide'],
    port: '5178',
    launcher: 'run_pulseops_frontend.bat',
    liveUrl: 'http://localhost:5178',
    highlight: { en: 'High-density operational observability & queue health', es: 'Observabilidad operativa de alta densidad y salud de colas' }
  },
  {
    id: 'app-cvforge',
    name: 'CVForge Studio',
    domain: { en: 'Editorial Resume & ATS Document Engine', es: 'Motor Editorial de CV y Documentos ATS' },
    stack: ['React 18', 'TypeScript', 'Print CSS', 'Tailwind CSS'],
    port: '5180',
    launcher: 'run_cvforge_studio.bat',
    liveUrl: 'http://localhost:5180',
    highlight: { en: 'Live split-pane typographic resume builder & PDF export', es: 'Constructor tipográfico en vivo a doble panel y exportación PDF' }
  },
  {
    id: 'app-apexlend',
    name: 'ApexLend Financial Suite',
    domain: { en: 'Loan Origination & Amortization Engine', es: 'Originación de Préstamos y Motor de Amortización' },
    stack: ['React 18', 'TypeScript', 'Financial Math', 'Tailwind CSS'],
    port: '5180',
    launcher: 'run_apexlend.bat',
    liveUrl: 'http://localhost:5180',
    highlight: { en: 'Interactive amortization curves & early-payoff simulator', es: 'Curvas de amortización interactivas y simulador de abono a capital' }
  },
  {
    id: 'app-tiendard',
    name: 'TiendaRD Cross-Border',
    domain: { en: 'USA-to-DR E-Commerce & Customs Calculator', es: 'Comercio Electrónico EE.UU. a RD y Calculadora Aduanal' },
    stack: ['React 18', 'TypeScript', 'Courier Tariff Engine'],
    port: '3000',
    launcher: 'run_tiendard.bat',
    liveUrl: 'http://localhost:3000',
    highlight: { en: 'Real-time USD/DOP landed cost with Law 146-00 customs rules', es: 'Costo puesto en RD en tiempo real bajo reglas aduanales Ley 146-00' }
  },
  {
    id: 'app-dental',
    name: 'SmileCraft Dental & PyStack',
    domain: { en: 'Full-Stack Clinical Portal & Python Auth Core', es: 'Portal Clínico Full-Stack y Núcleo de Autenticación Python' },
    stack: ['Python Flask', 'SQLite', 'JWT / PBKDF2', 'React 18'],
    port: '5173 / 5000',
    launcher: 'run_dental.bat / run.bat',
    liveUrl: 'http://localhost:5173',
    highlight: { en: 'Decoupled Flask REST API + PBKDF2-SHA256 cryptographic auth', es: 'API REST Flask desacoplada + autenticación criptográfica PBKDF2-SHA256' }
  }
];

export const TIMELINE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-trueshore-da',
    index: '01',
    role: {
      en: 'Operational Data & Quality Analyst',
      es: 'Analista de Datos Operacionales y Calidad (QA)'
    },
    company: 'Trueshore (CenterWell Healthcare Campaign)',
    period: {
      en: 'May 2026 — Present',
      es: 'Mayo 2026 — Presente'
    },
    location: 'Santo Domingo, DO',
    summary: {
      en: 'Leading operational data modeling, SLA adherence telemetry, and automated QA auditing workflows for regulated healthcare support operations.',
      es: 'Liderando el modelado de datos operacionales, telemetría de cumplimiento SLA y flujos automatizados de auditoría QA para operaciones reguladas del sector salud.'
    },
    achievements: {
      en: [
        'Architected executive Power BI dashboards with custom DAX measures tracking AHT, FCR, CSAT, and healthcare compliance SLAs across multi-team operations.',
        'Engineered automated Python and Excel/VBA auditing pipelines that reduced monthly QA form generation and consolidation time by 65%.',
        'Established data validation gates that elevated quality audit reliability to 99.2% across regulated patient/member workflows.'
      ],
      es: [
        'Diseñé dashboards ejecutivos en Power BI con medidas DAX personalizadas para seguimiento de AHT, FCR, CSAT y SLAs de cumplimiento en salud.',
        'Construí pipelines automatizados en Python y Excel/VBA que redujeron en 65% el tiempo mensual de generación y consolidación de auditorías QA.',
        'Establecí compuertas de validación de datos que elevaron la precisión de auditoría de calidad a 99.2% en flujos regulados de pacientes.'
      ]
    },
    metrics: [
      { value: '-65%', label: { en: 'Manual Reporting Time', es: 'Tiempo Manual de Reportes' } },
      { value: '99.2%', label: { en: 'Audit Compliance Rate', es: 'Tasa de Precisión QA' } }
    ],
    keyTechnologies: ['Power BI', 'DAX', 'Python (Pandas)', 'Excel / VBA', 'KPI Modeling', 'Healthcare QA'],
    badge: { en: 'CURRENT ROLE', es: 'ROL ACTUAL' },
    type: 'experience'
  },
  {
    id: 'exp-talendig-fe',
    index: '02',
    role: {
      en: 'Front-End Software Engineer',
      es: 'Ingeniero de Software Front-End'
    },
    company: 'Talendig',
    period: {
      en: 'Jan 2025 — Dec 2025',
      es: 'Ene 2025 — Dic 2025'
    },
    location: 'Santo Domingo, DO',
    summary: {
      en: 'Engineered responsive, high-throughput web interfaces and modular component architectures integrated with RESTful backend services.',
      es: 'Desarrollé interfaces web responsivas de alto rendimiento y arquitecturas modulares de componentes integradas con servicios backend RESTful.'
    },
    achievements: {
      en: [
        'Built reusable TypeScript and React component systems with strict state predictability, keyboard accessibility, and zero-layout-shift rendering.',
        'Integrated asynchronous REST APIs with optimistic UI updates, structured error boundaries, and client-side caching.',
        'Collaborated in Agile Scrum sprints with rigorous Git code review standards and containerized deployment workflows.'
      ],
      es: [
        'Construí sistemas de componentes reutilizables en TypeScript y React con estado predecible, accesibilidad por teclado y renderizado fluido.',
        'Integré APIs REST asíncronas con actualizaciones optimistas de interfaz, manejo estructurado de errores y caché en cliente.',
        'Colaboré en sprints ágiles Scrum con estándares rigurosos de revisión de código en Git y flujos de despliegue contenerizados.'
      ]
    },
    metrics: [
      { value: '100%', label: { en: 'Typed Component Coverage', es: 'Cobertura Tipada TS' } },
      { value: '<50ms', label: { en: 'UI Interaction Response', es: 'Respuesta de Interacción' } }
    ],
    keyTechnologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git / GitHub', 'Agile Scrum'],
    badge: { en: 'SOFTWARE ENGINEERING', es: 'INGENIERÍA DE SOFTWARE' },
    type: 'experience'
  },
  {
    id: 'exp-trueshore-ops',
    index: '03',
    role: {
      en: 'Senior Operations & Technical Specialist',
      es: 'Especialista Senior de Operaciones y Soporte'
    },
    company: 'Trueshore',
    period: {
      en: 'Dec 2023 — May 2026',
      es: 'Dic 2023 — Mayo 2026'
    },
    location: 'Santo Domingo, DO',
    summary: {
      en: 'Frontline operational resolution and root-cause bottleneck analysis that catalyzed internal tooling and QA automation initiatives.',
      es: 'Resolución operativa de primera línea y análisis de cuellos de botella que impulsaron la creación de herramientas internas y automatización QA.'
    },
    achievements: {
      en: [
        'Maintained top-decile SLA adherence and resolution accuracy in high-volume bilingual support queues.',
        'Identified recurring workflow friction points and prototyped automated tracking templates that led to promotion into Data & Quality Analytics.'
      ],
      es: [
        'Mantuve adherencia SLA y precisión de resolución en el decil superior dentro de colas bilingües de alto volumen.',
        'Identifiqué fricciones recurrentes en flujos operativos y prototipé plantillas automatizadas que impulsaron la promoción hacia Analítica de Datos y Calidad.'
      ]
    },
    metrics: [
      { value: 'Top 5%', label: { en: 'Operational SLA Ranking', es: 'Ranking Operativo SLA' } }
    ],
    keyTechnologies: ['Root-Cause Analysis', 'SLA Adherence', 'Process Mapping', 'Bilingual Operations'],
    badge: { en: 'OPERATIONS FOUNDATION', es: 'BASE OPERATIVA' },
    type: 'experience'
  },
  {
    id: 'edu-talendig-bootcamp',
    index: '04',
    role: {
      en: 'Full-Stack Software Development Specialization',
      es: 'Especialización Intensiva en Desarrollo Full-Stack'
    },
    company: 'Talendig',
    period: {
      en: '2025',
      es: '2025'
    },
    location: 'Santo Domingo, DO',
    summary: {
      en: 'Intensive full-stack engineering residency focused on distributed web architectures, Node.js/Express APIs, MongoDB, and Docker.',
      es: 'Residencia intensiva de ingeniería full-stack enfocada en arquitecturas web distribuidas, APIs Node.js/Express, MongoDB y Docker.'
    },
    achievements: {
      en: [
        'Architected and deployed containerized MERN & Next.js platforms with JWT rotation, role-based access control, and automated testing.'
      ],
      es: [
        'Diseñé y desplegué plataformas MERN y Next.js contenerizadas con rotación JWT, control de acceso basado en roles y pruebas automatizadas.'
      ]
    },
    metrics: [
      { value: 'MERN + Docker', label: { en: 'Production Stack', es: 'Stack de Producción' } }
    ],
    keyTechnologies: ['Node.js', 'Express', 'MongoDB', 'React', 'Docker', 'JWT Security'],
    badge: { en: 'FELLOWSHIP', es: 'ESPECIALIZACIÓN' },
    type: 'education'
  },
  {
    id: 'edu-itla',
    index: '05',
    role: {
      en: "Associate's Degree in Software Engineering (Tecnólogo en Desarrollo de Software)",
      es: 'Tecnólogo en Desarrollo de Software (Associate Degree)'
    },
    company: 'Instituto Tecnológico de Las Américas (ITLA)',
    period: {
      en: '2019 — 2023',
      es: '2019 — 2023'
    },
    location: 'La Caleta, DO',
    summary: {
      en: 'Graduated with Academic Honors (GPA 3.6 / 4.0) from the premier technology institute in the Dominican Republic.',
      es: 'Graduado con Honores Académicos (Índice 3.6 / 4.0) de la principal institución tecnológica de la República Dominicana.'
    },
    achievements: {
      en: [
        'Rigorous engineering foundation in Data Structures & Algorithms, Object-Oriented Architecture, Relational Database Design (SQL), and Full-Stack Web Engineering.'
      ],
      es: [
        'Formación rigurosa en Estructuras de Datos y Algoritmos, Arquitectura Orientada a Objetos, Diseño de Bases de Datos Relacionales (SQL) e Ingeniería Web.'
      ]
    },
    metrics: [
      { value: '3.6 / 4.0', label: { en: 'Honors GPA', es: 'Índice de Honor' } }
    ],
    keyTechnologies: ['Data Structures', 'Software Architecture', 'SQL Server / PostgreSQL', 'C# / .NET', 'Algorithms'],
    badge: { en: 'HONORS GPA 3.6', es: 'HONORES 3.6 / 4.0' },
    type: 'education'
  }
];

export const CAPABILITY_DOMAINS: CapabilityDomain[] = [
  {
    id: 'domain-fullstack',
    code: 'SYS // 01',
    title: {
      en: 'Full-Stack Web & Cloud Architecture',
      es: 'Arquitectura Web Full-Stack y Nube'
    },
    subtitle: {
      en: 'End-to-end production systems from reactive TypeScript frontends to hardened REST APIs.',
      es: 'Sistemas de producción de extremo a extremo desde frontends reactivos en TypeScript hasta APIs REST seguras.'
    },
    description: {
      en: 'I build interfaces that feel instantaneous and backends that enforce strict data integrity—using optimistic state updates, dual cloud/local persistence, and cryptographic authentication.',
      es: 'Construyo interfaces que se sienten instantáneas y backends que garantizan integridad estricta de datos—usando estado optimista, persistencia dual nube/local y autenticación criptográfica.'
    },
    deliverables: {
      en: [
        'Modular React 18 & TypeScript applications with zero-latency state machines',
        'Decoupled REST APIs in Node.js/Express and Python/Flask with JWT & PBKDF2-SHA256 auth',
        'Dual-sync persistence engines combining Cloud Firestore, PostgreSQL/PostGIS, SQLite & MongoDB'
      ],
      es: [
        'Aplicaciones modulares en React 18 y TypeScript con máquinas de estado de latencia cero',
        'APIs REST desacopladas en Node.js/Express y Python/Flask con seguridad JWT y PBKDF2-SHA256',
        'Motores de persistencia dual combinando Cloud Firestore, PostgreSQL/PostGIS, SQLite y MongoDB'
      ]
    },
    tools: [
      {
        name: 'React 18 & TypeScript 5',
        role: { en: 'Primary UI & State Architecture', es: 'Arquitectura Principal de UI y Estado' },
        productionSystem: 'taxi. Operations / IOCC Studio / OmniPOS'
      },
      {
        name: 'Node.js, Express & Python Flask',
        role: { en: 'REST APIs, Auth & Server Controllers', es: 'APIs REST, Autenticación y Controladores' },
        productionSystem: 'SmileCraft Dental / PyStack / FinPulse'
      },
      {
        name: 'Cloud Firestore, SQL & MongoDB',
        role: { en: 'Real-Time NoSQL & Relational Persistence', es: 'Persistencia NoSQL en Tiempo Real y Relacional' },
        productionSystem: 'ColmadoPro / taxi. PostGIS / PyStack'
      },
      {
        name: 'Docker & Vite Build Pipelines',
        role: { en: 'Containerized Packaging & Fast HMR', es: 'Empaquetado en Contenedores y Compilación' },
        productionSystem: 'All 12 Workspace Systems'
      }
    ]
  },
  {
    id: 'domain-data-bi',
    code: 'DAT // 02',
    title: {
      en: 'Operational Data, BI & Telemetry',
      es: 'Datos Operacionales, BI y Telemetría'
    },
    subtitle: {
      en: 'Translating high-volume operational logs into executive decision systems.',
      es: 'Transformando registros operativos de alto volumen en sistemas ejecutivos de decisión.'
    },
    description: {
      en: 'Whether modeling healthcare SLA adherence in Power BI or computing airline OTP and Pareto delay curves in the browser, I treat every metric as an auditable engineering contract.',
      es: 'Ya sea modelando cumplimiento SLA de salud en Power BI o calculando curvas Pareto y OTP de aerolíneas en el navegador, trato cada métrica como un contrato auditable.'
    },
    deliverables: {
      en: [
        'Executive Power BI star schemas & complex DAX measures (rolling SLA, Pareto 80/20, variance)',
        'Automated Python (Pandas) & Excel/VBA pipelines eliminating repetitive manual reporting',
        'Real-time geospatial & operational command centers with live anomaly alerting'
      ],
      es: [
        'Esquemas estrella en Power BI y medidas DAX avanzadas (SLA móvil, Pareto 80/20, varianza)',
        'Pipelines automatizados en Python (Pandas) y Excel/VBA eliminando reportería manual repetitiva',
        'Centros de comando geoespaciales y operativos en tiempo real con alertas de anomalías'
      ]
    },
    tools: [
      {
        name: 'Power BI & Advanced DAX',
        role: { en: 'Executive Scorecards & Semantic Modeling', es: 'Scorecards Ejecutivos y Modelado Semántico' },
        productionSystem: 'CenterWell Campaign / IOCC Aviation Studio'
      },
      {
        name: 'Python (Pandas / Data Pipelines)',
        role: { en: 'ETL Cleansing & Anomaly Scoring', es: 'Limpieza ETL y Detección de Anomalías' },
        productionSystem: 'CenterWell QA Engine / FinPulse Audit'
      },
      {
        name: 'Excel / VBA Automation',
        role: { en: 'Automated QA Form & Report Generation', es: 'Generación Automatizada de Auditorías y Reportes' },
        productionSystem: 'CenterWell QA (-65% Manual Time)'
      },
      {
        name: 'Google Maps Platform & Leaflet',
        role: { en: 'Live Polygon Telemetry & Traffic Layers', es: 'Telemetría de Polígonos y Capas de Tráfico' },
        productionSystem: 'taxi. Operations Santo Domingo'
      }
    ]
  },
  {
    id: 'domain-spatial-ui',
    code: 'UX // 03',
    title: {
      en: 'Interactive 3D, Spatial UI & Design Systems',
      es: '3D Interactivo, UI Espacial y Sistemas de Diseño'
    },
    subtitle: {
      en: 'Tactile micro-interactions, 60fps WebGL scenes, and Swiss typographic precision.',
      es: 'Microinteracciones táctiles, escenas WebGL a 60fps y precisión tipográfica suiza.'
    },
    description: {
      en: 'Great software should never feel generic or fragile. I engineer custom WebGL/Three.js scenes, procedural Web Audio feedback, and high-contrast editorial design systems.',
      es: 'El gran software nunca debe sentirse genérico ni frágil. Construyo escenas WebGL/Three.js a medida, audio procedimental y sistemas de diseño editoriales de alto contraste.'
    },
    deliverables: {
      en: [
        'Scroll-driven 3D exploded views and real-time PBR shader customizers in Three.js',
        'High-density 1080p C-Suite interfaces and split-pane document editors',
        'Accessible dark/light design tokens with spring-physics micro-interactions'
      ],
      es: [
        'Vistas explotadas 3D por scroll y personalizadores de shaders PBR en tiempo real con Three.js',
        'Interfaces ejecutivas 1080p de alta densidad y editores de documentos a doble panel',
        'Tokens de diseño oscuro/claro accesibles con microinteracciones físicas fluidas'
      ]
    },
    tools: [
      {
        name: 'Three.js & WebGL Shaders',
        role: { en: 'Real-Time 3D Hardware & Orbital Rendering', es: 'Renderizado 3D de Hardware y Órbitas en Tiempo Real' },
        productionSystem: 'NEXUS-01 Audio / CosmosLens Orbital'
      },
      {
        name: 'Tailwind CSS & Design Tokens',
        role: { en: 'Swiss Grid & Tactile Surface Systems', es: 'Retícula Suiza y Sistemas de Superficie Táctil' },
        productionSystem: 'CVForge Studio / PulseOps / Portfolio'
      },
      {
        name: 'Web Audio API',
        role: { en: 'Procedural Browser Sound Synthesis', es: 'Síntesis Sonora Procedimental en Navegador' },
        productionSystem: 'NEXUS-01 Acoustic Engine'
      },
      {
        name: 'Figma & Behance Visual Systems',
        role: { en: 'UI Prototyping & Editorial Art Direction', es: 'Prototipado UI y Dirección de Arte Editorial' },
        productionSystem: 'behance.net/xandermedina'
      }
    ]
  }
];
