import * as THREE from '../vendor/three.module.min.js';

export const PORTFOLIO_APPS = [
  {
    id: 'APP-01',
    slug: 'tiendard',
    name: 'TiendaRD Marketplace',
    category: 'fintech',
    badge: 'E-COMMERCE & LOGISTICS',
    url: 'https://tiendard.pedromedina.dev',
    launcher: 'run_tiendard.bat',
    port: 'localhost:3000',
    stack: ['Next.js 15', 'React 19', 'Prisma', 'Zustand'],
    desc: 'Cross-border USA to Dominican Republic marketplace with real-time air freight and DGA $200 USD customs exemption engine.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>USD → DOP LOGISTICS</span><span class="preview-pill-ok">DGA EXEMPT</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">RD$ 9,750</span>
          <span class="mono-label tabular-nums">$145 USD · 3.0 lb</span>
        </div>
        <div style="height:6px; border-radius:999px; background:var(--bg-elevated); overflow:hidden;">
          <div style="width:72%; height:100%; background:#10B981; border-radius:999px;"></div>
        </div>
      </div>
    `,
    demoType: 'tiendard'
  },
  {
    id: 'APP-02',
    slug: 'apexlend',
    name: 'ApexLend FinTech',
    category: 'fintech',
    badge: 'INSTITUTIONAL LENDING',
    url: 'https://apexlend.pedromedina.dev',
    launcher: 'run_apexlend.bat',
    port: 'localhost:5181',
    stack: ['React 18', 'TypeScript', 'Tailwind CSS'],
    desc: 'Precision credit underwriting and instant loan amortization studio inspired by Wise and Lightspark.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>CREDIT UNDERWRITING</span><span class="preview-pill-brand">12.5% APR</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">$501.80<span style="font-size:0.75rem; font-weight:500; color:var(--text-muted);">/mo</span></span>
          <span class="preview-pill-ok">PRIME A+</span>
        </div>
        <div class="mono-label tabular-nums">Principal $15,000 · 36 Months</div>
      </div>
    `,
    demoType: 'apexlend'
  },
  {
    id: 'APP-03',
    slug: 'finpulse-mobile',
    name: 'FinPulse & Mobile Wallet',
    category: 'fintech',
    badge: 'MULTI-CURRENCY FINTECH',
    url: 'https://finpulse.pedromedina.dev',
    launcher: 'run_finpulse_frontend.bat',
    port: 'localhost:5183',
    stack: ['React 18', 'Flutter / Dart', 'FX Telemetry'],
    desc: 'Revolut & Wise-inspired multi-currency treasury dashboard and companion Flutter mobile wallet with instant FX conversion.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>GLOBAL TREASURY</span><span class="preview-pill-ok">+4.8% MTD</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">$48,920.00</span>
          <span class="mono-label">USD · EUR · DOP</span>
        </div>
        <div class="preview-bars">
          <div class="preview-bar" style="height:45%"></div>
          <div class="preview-bar" style="height:60%"></div>
          <div class="preview-bar" style="height:52%"></div>
          <div class="preview-bar" style="height:78%"></div>
          <div class="preview-bar" style="height:86%"></div>
          <div class="preview-bar highlight" style="height:100%"></div>
        </div>
      </div>
    `,
    demoType: 'finpulse'
  },
  {
    id: 'APP-04',
    slug: 'executive-studio',
    name: 'Executive BI Studio',
    category: 'analytics',
    badge: 'PRODUCT & OPS ANALYTICS',
    url: 'https://bi-studio.pedromedina.dev',
    launcher: 'run_executive_studio.bat',
    port: 'localhost:5180',
    stack: ['React 18', 'TypeScript', 'DAX Kernel', 'SheetJS'],
    desc: 'Mixpanel-grade executive intelligence platform computing aviation OTP, healthcare SLA compliance, and CSV/XLSX models in <12ms.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>DAX ENGINE · 6.8ms</span><span class="preview-pill-ok">99.2% SLA</span></div>
      <div class="preview-mini-window">
        <div class="preview-bars">
          <div class="preview-bar" style="height:62%"></div>
          <div class="preview-bar" style="height:74%"></div>
          <div class="preview-bar" style="height:68%"></div>
          <div class="preview-bar" style="height:88%"></div>
          <div class="preview-bar" style="height:92%"></div>
          <div class="preview-bar highlight" style="height:98%"></div>
        </div>
        <div class="mono-label tabular-nums">1,420 Audits · OTP 94.6%</div>
      </div>
    `,
    demoType: 'exec-kpi'
  },
  {
    id: 'APP-05',
    slug: 'omnipos',
    name: 'OmniPOS Terminal',
    category: 'fintech',
    badge: 'OFFLINE-FIRST POS',
    url: 'https://omnipos.pedromedina.dev',
    launcher: 'run_omnipos.bat',
    port: 'localhost:5176',
    stack: ['React 18', 'IndexedDB', '80mm Thermal'],
    desc: 'Zero-downtime retail point-of-sale terminal with IndexedDB offline queue, ITBIS 18% tax engine, and 80mm receipt generation.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>TERMINAL #01</span><span class="preview-pill-ok">SYNCED</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">RD$ 1,475</span>
          <span class="mono-label tabular-nums">ITBIS 18% INCL.</span>
        </div>
        <div class="mono-label">Invoice #B0200001084 · Cash / Card</div>
      </div>
    `,
    demoType: 'omnipos'
  },
  {
    id: 'APP-06',
    slug: 'colmadopro',
    name: 'ColmadoPro Suite',
    category: 'fintech',
    badge: 'RETAIL & INVENTORY',
    url: 'https://colmadopro.pedromedina.dev',
    launcher: 'run_colmado.bat',
    port: 'localhost:5175',
    stack: ['React 18', 'Firestore', 'Recharts', 'Tailwind'],
    desc: 'Commercial inventory, margin analytics, and fast checkout suite for Dominican retail stores with dual cloud/local sync.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>STOCK HEALTH</span><span class="preview-pill-brand">24.8% MARGIN</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span style="font-size:0.8125rem; font-weight:600;">Active SKUs (148)</span>
          <span class="preview-pill-ok">98% IN STOCK</span>
        </div>
        <div style="display:grid; grid-template-columns:3fr 1fr; gap:4px; height:6px;">
          <div style="background:#10B981; border-radius:99px;"></div>
          <div style="background:#F59E0B; border-radius:99px;"></div>
        </div>
      </div>
    `,
    demoType: 'colmado'
  },
  {
    id: 'APP-07',
    slug: 'taxi-sdq',
    name: 'taxi. Operations SDQ',
    category: 'analytics',
    badge: 'GEOSPATIAL DISPATCH',
    url: 'https://taxi-ops.pedromedina.dev',
    launcher: 'run_taxi.bat',
    port: 'localhost:5182',
    stack: ['React 18', 'TypeScript', 'Google Maps', 'PostGIS'],
    desc: 'Real-time urban mobility & dispatch command center tracking 310+ active drivers across Santo Domingo.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>SDQ LIVE RADAR</span><span class="preview-pill-ok">310 ONLINE</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">RD$ 488,428</span>
          <span class="mono-label tabular-nums">ETA 2m 14s</span>
        </div>
        <div class="mono-label">Piantini · Naco · Zona Colonial</div>
      </div>
    `,
    demoType: 'taxi'
  },
  {
    id: 'APP-08',
    slug: 'cvforge-studio',
    name: 'CVForge Studio',
    category: 'studio3d',
    badge: 'SAAS DOCUMENT ENGINE',
    url: 'https://cvforge.pedromedina.dev',
    launcher: 'run_cvforge_studio.bat',
    port: 'localhost:5178',
    stack: ['React 18', 'Framer Motion', 'PayPal SDK', 'Supabase'],
    desc: 'Executive resume publishing platform with real-time split editor, Swiss/Cupertino templates, and 300 DPI vector A4 export.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>A4 VECTOR STUDIO</span><span class="preview-pill-brand">300 DPI</span></div>
      <div class="preview-mini-window">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:0.8125rem;">Zurich Executive CV</strong>
          <span class="preview-pill-ok">ATS 98%</span>
        </div>
        <div style="height:4px; width:85%; background:var(--border-strong); border-radius:4px;"></div>
        <div style="height:4px; width:60%; background:var(--border-subtle); border-radius:4px;"></div>
      </div>
    `,
    demoType: 'cvforge'
  },
  {
    id: 'APP-09',
    slug: 'nexus-3d',
    name: 'NEXUS-01 3D Studio',
    category: 'studio3d',
    badge: 'WEBGL PBR SHOWCASE',
    url: 'https://nexus3d.pedromedina.dev',
    launcher: 'run_nexus.bat',
    port: 'localhost:5174',
    stack: ['React 18', 'Three.js PBR', 'Web Audio API'],
    desc: 'Hardware product launch experience featuring scroll-driven exploded 3D views, studio lighting, and real-time PBR finishes.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>THREE.JS R170</span><span class="preview-pill-brand">60 FPS PBR</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span style="font-size:0.875rem; font-weight:600;">360° Orbital Mesh</span>
          <div style="display:flex; gap:4px;">
            <span style="width:12px; height:12px; border-radius:50%; background:#18181B; border:1px solid var(--border-strong);"></span>
            <span style="width:12px; height:12px; border-radius:50%; background:#D4D4D8;"></span>
            <span style="width:12px; height:12px; border-radius:50%; background:#2563EB;"></span>
          </div>
        </div>
        <div class="mono-label">Interactive Material Customizer</div>
      </div>
    `,
    demoType: '3d-nexus'
  },
  {
    id: 'APP-10',
    slug: 'cosmoslens',
    name: 'CosmosLens 3D',
    category: 'studio3d',
    badge: 'SPATIAL TELEMETRY',
    url: 'https://cosmoslens.pedromedina.dev',
    launcher: 'run_cosmoslens.bat',
    port: 'localhost:5179',
    stack: ['React 18', 'Three.js Shaders', 'Framer Motion'],
    desc: 'Interactive orbital mechanics and spatial shader visualizer with multi-ring coordinate tracking.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>ORBITAL SHADERS</span><span class="preview-pill-ok">WEBGL 2.0</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">3 Orbits</span>
          <span class="mono-label">ACES FILMIC</span>
        </div>
        <div class="mono-label">Real-Time Coordinate Lattice</div>
      </div>
    `,
    demoType: '3d-cosmos'
  },
  {
    id: 'APP-11',
    slug: 'portfolio-monograph',
    name: 'Portfolio Monograph SPA',
    category: 'studio3d',
    badge: 'REACT + THREE.JS',
    url: 'https://pedromedina.dev',
    launcher: 'run_portfolio.bat',
    port: 'localhost:5177',
    stack: ['React 18', 'TypeScript', 'Three.js', 'Cmd+K'],
    desc: 'Standalone React/TypeScript architectural monograph with Cmd+K command palette, bilingual EN/ES switch, and 3D monolith.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>MONOGRAPH SPA</span><span class="preview-pill-brand">CMD + K</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span style="font-size:0.875rem; font-weight:600;">EN / ES Bilingual</span>
          <span class="preview-pill-ok">3D ACTIVE</span>
        </div>
        <div class="mono-label">Interactive System Blueprints</div>
      </div>
    `,
    demoType: '3d-monolith'
  },
  {
    id: 'APP-12',
    slug: 'smilecraft-dental',
    name: 'SmileCraft Clinical',
    category: 'infra',
    badge: 'HEALTHCARE SAAS',
    url: 'https://smilecraft.pedromedina.dev',
    launcher: 'run_dental.bat',
    port: 'localhost:5173',
    stack: ['React 18', 'Python Flask', 'SQLite', 'JWT'],
    desc: 'Full-stack dental practice management platform with role-based JWT security, specialist scheduling, and treatment quotes.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>CLINICAL PORTAL</span><span class="preview-pill-ok">HIPAA / JWT</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span style="font-size:0.875rem; font-weight:600;">14 Appointments</span>
          <span class="mono-label tabular-nums">Today · 100%</span>
        </div>
        <div class="mono-label">Patient &amp; Doctor Role Separation</div>
      </div>
    `,
    demoType: 'dental'
  },
  {
    id: 'APP-13',
    slug: 'pulseops-pystack',
    name: 'PulseOps & PyStack Core',
    category: 'infra',
    badge: 'INFRASTRUCTURE & AUTH',
    url: 'http://127.0.0.1:5000',
    launcher: 'run_pulseops_frontend.bat',
    port: '127.0.0.1:5000',
    stack: ['Python Flask', 'SQLite', 'PBKDF2-SHA256'],
    desc: 'Observability and cryptographic authentication core featuring HTTP header hardening, incident SLA tracking, and sub-12ms latency.',
    previewHtml: `
      <div class="preview-chrome-bar"><span>CLUSTER STATUS</span><span class="preview-pill-ok">99.98% SLA</span></div>
      <div class="preview-mini-window">
        <div class="preview-kpi-row">
          <span class="preview-kpi-big tabular-nums">4.1 ms</span>
          <span class="mono-label">SHA-256 GUARD</span>
        </div>
        <div class="mono-label">Zero Unhandled Exceptions</div>
      </div>
    `,
    demoType: 'pulseops'
  }
];

let activeCleanup = null;

function mountInteractive3D(containerId, variant) {
  const container = document.getElementById(containerId);
  if (!container) return () => {};

  const w = container.clientWidth || 640;
  const h = container.clientHeight || 280;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(0, 0.25, 4.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3b82f6, 1.8);
  rim.position.set(-5, -2, 3);
  scene.add(rim);

  const group = new THREE.Group();
  scene.add(group);

  let primaryMat = null;
  if (variant === 'nexus') {
    primaryMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85, roughness: 0.18 });
    group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.85, 0.24, 128, 24), primaryMat));
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.014, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
    );
    halo.rotation.x = Math.PI / 2.3;
    group.add(halo);
  } else if (variant === 'cosmos') {
    group.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.88, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6, roughness: 0.25, wireframe: true })
      )
    );
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.28 + i * 0.26, 0.01, 12, 100),
        new THREE.MeshBasicMaterial({ color: i === 1 ? 0x10b981 : 0x71717a, transparent: true, opacity: 0.75 })
      );
      ring.rotation.x = Math.PI / (2.1 + i * 0.35);
      ring.rotation.y = i * 0.55;
      group.add(ring);
    }
  } else {
    group.add(
      new THREE.Mesh(
        new THREE.OctahedronGeometry(1.05, 1),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.22, flatShading: true })
      )
    );
    group.add(
      new THREE.Mesh(
        new THREE.OctahedronGeometry(1.34, 1),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.45 })
      )
    );
  }

  let rotX = 0.2, rotY = 0.35, dragging = false, px = 0, py = 0;
  const dom = renderer.domElement;
  dom.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; });
  const onMove = (e) => {
    if (!dragging) return;
    rotY += (e.clientX - px) * 0.01;
    rotX += (e.clientY - py) * 0.01;
    px = e.clientX; py = e.clientY;
  };
  const onUp = () => { dragging = false; };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  if (primaryMat) {
    document.querySelectorAll('[data-pbr-hex]').forEach((btn) => {
      btn.addEventListener('click', () => {
        primaryMat.color.setHex(parseInt(btn.getAttribute('data-pbr-hex'), 16));
      });
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const clock = new THREE.Clock();
  function animate() {
    raf = requestAnimationFrame(animate);
    const t = prefersReduced ? 0 : clock.getElapsedTime();
    group.rotation.y = rotY + t * 0.32;
    group.rotation.x = rotX + Math.sin(t * 0.6) * 0.08;
    renderer.render(scene, camera);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    renderer.dispose();
  };
}

function renderInteractivePreview(app, mountEl) {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  if (app.demoType.startsWith('3d-')) {
    const variant = app.demoType.replace('3d-', '');
    mountEl.innerHTML = `
      <div class="demo-canvas-3d" id="studio-3d-canvas"></div>
      <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-top:14px;">
        <span class="mono-label">DRAG TO ORBIT 360° · WEBGL R170 ENGINE</span>
        ${variant === 'nexus' ? `
          <div class="swatch-group" aria-label="Material Finish">
            <button type="button" class="swatch-circle" data-pbr-hex="0x18181b" style="background:#18181b" title="Obsidian"></button>
            <button type="button" class="swatch-circle" data-pbr-hex="0xe4e4e7" style="background:#e4e4e7" title="Titanium"></button>
            <button type="button" class="swatch-circle" data-pbr-hex="0x2563eb" style="background:#2563eb" title="Cobalt"></button>
            <button type="button" class="swatch-circle" data-pbr-hex="0xea580c" style="background:#ea580c" title="Vermilion"></button>
          </div>
        ` : `<span class="preview-pill-ok">60 FPS ACTIVE</span>`}
      </div>
    `;
    activeCleanup = mountInteractive3D('studio-3d-canvas', variant);
    return;
  }

  if (app.demoType === 'tiendard') {
    mountEl.innerHTML = `
      <div class="demo-grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label" for="td-usd">Order Value (USD)</label>
          <input id="td-usd" type="number" class="form-input tabular-nums" value="165" min="1" max="5000" />
        </div>
        <div>
          <label class="form-label" for="td-lbs">Package Weight (lbs)</label>
          <input id="td-lbs" type="number" class="form-input tabular-nums" value="3.5" min="0.5" step="0.5" max="100" />
        </div>
      </div>
      <div class="demo-grid-3">
        <div class="demo-metric-box">
          <span class="mono-label">Air Freight (EPS)</span>
          <div id="td-out-freight" class="demo-metric-val tabular-nums">RD$ 1,225</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">DGA Customs Duty</span>
          <div id="td-out-duty" class="demo-metric-val tabular-nums" style="color:var(--status-success);">RD$ 0 (Exempt)</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">Total Landed (DOP)</span>
          <div id="td-out-total" class="demo-metric-val tabular-nums">RD$ 11,125</div>
        </div>
      </div>
    `;
    const recalc = () => {
      const usd = Math.max(1, Number(document.getElementById('td-usd').value) || 0);
      const lbs = Math.max(0.5, Number(document.getElementById('td-lbs').value) || 1);
      const freight = Math.round(lbs * 350);
      const exempt = usd <= 200;
      const duty = exempt ? 0 : Math.round(usd * 60 * 0.18);
      const total = Math.round(usd * 60) + freight + duty;
      document.getElementById('td-out-freight').textContent = `RD$ ${freight.toLocaleString()}`;
      const dutyEl = document.getElementById('td-out-duty');
      dutyEl.textContent = exempt ? 'RD$ 0 (Exempt)' : `RD$ ${duty.toLocaleString()}`;
      dutyEl.style.color = exempt ? 'var(--status-success)' : 'var(--status-warning)';
      document.getElementById('td-out-total').textContent = `RD$ ${total.toLocaleString()}`;
    };
    document.getElementById('td-usd').addEventListener('input', recalc);
    document.getElementById('td-lbs').addEventListener('input', recalc);
    recalc();
    return;
  }

  if (app.demoType === 'apexlend') {
    mountEl.innerHTML = `
      <div class="demo-grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label" for="al-p">Loan Principal (USD)</label>
          <input id="al-p" type="number" class="form-input tabular-nums" value="15000" min="1000" step="500" />
        </div>
        <div>
          <label class="form-label" for="al-n">Term (Months)</label>
          <input id="al-n" type="number" class="form-input tabular-nums" value="36" min="6" max="84" step="6" />
        </div>
      </div>
      <div class="demo-grid-3">
        <div class="demo-metric-box">
          <span class="mono-label">Monthly Payment</span>
          <div id="al-mo" class="demo-metric-val tabular-nums">$501.80</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">Total Interest (12.5%)</span>
          <div id="al-int" class="demo-metric-val tabular-nums">$3,064.89</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">Approval Status</span>
          <div class="demo-metric-val" style="color:var(--status-success);">Instant · Prime A+</div>
        </div>
      </div>
    `;
    const calc = () => {
      const P = Math.max(500, Number(document.getElementById('al-p').value) || 1000);
      const n = Math.max(6, Number(document.getElementById('al-n').value) || 12);
      const r = 0.125 / 12;
      const mo = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      document.getElementById('al-mo').textContent = `$${mo.toFixed(2)}`;
      document.getElementById('al-int').textContent = `$${(mo * n - P).toFixed(2)}`;
    };
    document.getElementById('al-p').addEventListener('input', calc);
    document.getElementById('al-n').addEventListener('input', calc);
    calc();
    return;
  }

  if (app.demoType === 'finpulse') {
    mountEl.innerHTML = `
      <div class="demo-grid-2" style="margin-bottom:16px;">
        <div>
          <label class="form-label" for="fx-send">You Send (USD — Wise FX Engine)</label>
          <input id="fx-send" type="number" class="form-input tabular-nums" value="1000" min="1" step="50" />
        </div>
        <div>
          <label class="form-label" for="fx-curr">Target Currency</label>
          <select id="fx-curr" class="form-input">
            <option value="60.15|DOP">DOP — Dominican Peso (60.15)</option>
            <option value="0.92|EUR">EUR — Euro (0.92)</option>
            <option value="0.79|GBP">GBP — British Pound (0.79)</option>
          </select>
        </div>
      </div>
      <div class="demo-grid-3">
        <div class="demo-metric-box">
          <span class="mono-label">Recipient Gets</span>
          <div id="fx-out" class="demo-metric-val tabular-nums">60,150.00 DOP</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">Platform Fee (0.35%)</span>
          <div id="fx-fee" class="demo-metric-val tabular-nums">$3.50 USD</div>
        </div>
        <div class="demo-metric-box">
          <span class="mono-label">Settlement Speed</span>
          <div class="demo-metric-val" style="color:var(--status-success);">&lt; 8 Seconds</div>
        </div>
      </div>
    `;
    const updateFx = () => {
      const amt = Math.max(0, Number(document.getElementById('fx-send').value) || 0);
      const [rateStr, code] = document.getElementById('fx-curr').value.split('|');
      const rate = Number(rateStr);
      const fee = amt * 0.0035;
      const net = (amt - fee) * rate;
      document.getElementById('fx-fee').textContent = `$${fee.toFixed(2)} USD`;
      document.getElementById('fx-out').textContent = `${net.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${code}`;
    };
    document.getElementById('fx-send').addEventListener('input', updateFx);
    document.getElementById('fx-curr').addEventListener('change', updateFx);
    updateFx();
    return;
  }

  if (app.demoType === 'omnipos') {
    let sub = 760;
    mountEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="mono-label">TAP PRODUCT TO ADD TO LIVE TICKET</span>
        <button type="button" id="pos-reset" class="btn btn-secondary btn-sm">Clear Ticket</button>
      </div>
      <div class="demo-grid-2" style="margin-bottom:16px;">
        <button type="button" class="btn btn-secondary btn-rect pos-sku" data-p="240">Specialty Latte · RD$ 240</button>
        <button type="button" class="btn btn-secondary btn-rect pos-sku" data-p="320">Artisan Sandwich · RD$ 320</button>
        <button type="button" class="btn btn-secondary btn-rect pos-sku" data-p="200">Almond Croissant · RD$ 200</button>
        <button type="button" class="btn btn-secondary btn-rect pos-sku" data-p="290">Matcha Cold Foam · RD$ 290</button>
      </div>
      <div class="demo-grid-3">
        <div class="demo-metric-box"><span class="mono-label">Subtotal</span><div id="pos-s" class="demo-metric-val tabular-nums">RD$ 760</div></div>
        <div class="demo-metric-box"><span class="mono-label">ITBIS (18%)</span><div id="pos-t" class="demo-metric-val tabular-nums">RD$ 137</div></div>
        <div class="demo-metric-box"><span class="mono-label">Total Due</span><div id="pos-tot" class="demo-metric-val tabular-nums">RD$ 897</div></div>
      </div>
    `;
    const renderPos = () => {
      const tax = Math.round(sub * 0.18);
      document.getElementById('pos-s').textContent = `RD$ ${sub.toLocaleString()}`;
      document.getElementById('pos-t').textContent = `RD$ ${tax.toLocaleString()}`;
      document.getElementById('pos-tot').textContent = `RD$ ${(sub + tax).toLocaleString()}`;
    };
    mountEl.querySelectorAll('.pos-sku').forEach((b) => {
      b.addEventListener('click', () => { sub += Number(b.getAttribute('data-p')); renderPos(); });
    });
    document.getElementById('pos-reset').addEventListener('click', () => { sub = 0; renderPos(); });
    return;
  }

  if (app.demoType === 'exec-kpi') {
    const scenarios = {
      nominal: { otp: '94.6%', sla: '99.2%', lat: '6.8 ms', bars: [68, 75, 82, 79, 91, 95] },
      surge: { otp: '89.4%', sla: '98.8%', lat: '9.1 ms', bars: [85, 92, 96, 100, 94, 98] },
      audit: { otp: '100%', sla: '99.7%', lat: '4.2 ms', bars: [94, 96, 98, 99, 100, 100] }
    };
    mountEl.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        <button type="button" class="filter-pill active bi-scen" data-s="nominal">Nominal Operations</button>
        <button type="button" class="filter-pill bi-scen" data-s="surge">Peak Rush Surge</button>
        <button type="button" class="filter-pill bi-scen" data-s="audit">Healthcare QA Batch</button>
      </div>
      <div class="demo-grid-3" style="margin-bottom:16px;">
        <div class="demo-metric-box"><span class="mono-label">On-Time Rate</span><div id="bi-otp" class="demo-metric-val tabular-nums">94.6%</div></div>
        <div class="demo-metric-box"><span class="mono-label">QA SLA Precision</span><div id="bi-sla" class="demo-metric-val tabular-nums" style="color:var(--status-success);">99.2%</div></div>
        <div class="demo-metric-box"><span class="mono-label">DAX Compute</span><div id="bi-lat" class="demo-metric-val tabular-nums">6.8 ms</div></div>
      </div>
      <div id="bi-chart" style="display:flex; align-items:flex-end; gap:8px; height:68px; padding:12px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:10px;"></div>
    `;
    const draw = (key) => {
      const s = scenarios[key];
      document.getElementById('bi-otp').textContent = s.otp;
      document.getElementById('bi-sla').textContent = s.sla;
      document.getElementById('bi-lat').textContent = s.lat;
      document.getElementById('bi-chart').innerHTML = s.bars
        .map((v, i) => `<div style="flex:1; height:${v}%; border-radius:4px 4px 0 0; background:${i === 5 ? 'var(--accent-brand)' : 'var(--border-strong)'};"></div>`)
        .join('');
    };
    mountEl.querySelectorAll('.bi-scen').forEach((btn) => {
      btn.addEventListener('click', () => {
        mountEl.querySelectorAll('.bi-scen').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        draw(btn.getAttribute('data-s'));
      });
    });
    draw('nominal');
    return;
  }

  if (app.demoType === 'cvforge') {
    mountEl.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        <button type="button" class="filter-pill active cv-btn" data-t="Zurich Minimal">Zurich Minimal</button>
        <button type="button" class="filter-pill cv-btn" data-t="Cupertino Clean">Cupertino Clean</button>
        <button type="button" class="filter-pill cv-btn" data-t="Geneva Executive">Geneva Executive</button>
      </div>
      <div class="demo-metric-box" style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-subtle); padding-bottom:12px; margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-display); font-weight:700; font-size:1.125rem;">PEDRO MEDINA</div>
            <div class="mono-label">FULL-STACK ENGINEER &amp; DATA ARCHITECT</div>
          </div>
          <span id="cv-badge" class="preview-pill-brand">Zurich Minimal</span>
        </div>
        <p style="font-size:0.875rem; color:var(--text-secondary);">
          Architected 13+ full-stack web, FinTech, geospatial, and 3D WebGL systems with 99.2% operational QA accuracy.
        </p>
      </div>
    `;
    mountEl.querySelectorAll('.cv-btn').forEach((b) => {
      b.addEventListener('click', () => {
        mountEl.querySelectorAll('.cv-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        document.getElementById('cv-badge').textContent = b.getAttribute('data-t');
      });
    });
    return;
  }

  // Interactive Operational List Console (taxi, colmado, dental, pulseops)
  const configs = {
    taxi: {
      heading: 'SANTO DOMINGO ACTIVE FLEET UNITS',
      cta: 'Dispatch Nearest Unit',
      confirmed: 'Unit #104 Dispatched · WebSocket ETA 1m 45s',
      rows: [
        ['Unit #104 · Toyota Corolla Hybrid', 'Piantini · 0.6 km'],
        ['Unit #219 · Hyundai Sonata', 'Naco · 1.1 km'],
        ['Unit #087 · Kia K5', 'Zona Colonial · 2.4 km']
      ]
    },
    colmado: {
      heading: 'CRITICAL INVENTORY REPLENISHMENT',
      cta: 'Auto-Restock Low SKUs',
      confirmed: 'Purchase Order Sent · All SKUs Restocked to 100%',
      rows: [
        ['Arroz Premium 10 lb', 'Low Stock (4 units)'],
        ['Aceite Vegetal 64 oz', 'Optimal (32 units)'],
        ['Café Molido Santo Domingo', 'Reorder Triggered']
      ]
    },
    dental: {
      heading: 'TODAY CLINICAL SCHEDULE (DR. MEDINA)',
      cta: 'Confirm Next Patient Check-In',
      confirmed: 'Patient Checked In · JWT Clinical Session Active',
      rows: [
        ['09:30 AM · María Fernández', '3D Panoramic Scan'],
        ['11:00 AM · Carlos Gómez', 'Ceramic Crown Fit'],
        ['03:15 PM · Laura Díaz', 'Routine Prophylaxis']
      ]
    },
    pulseops: {
      heading: 'PRODUCTION CLUSTER HEALTH CHECK',
      cta: 'Run Security & Latency Probe',
      confirmed: 'All Nodes Verified · 4.1ms Avg · Headers Hardened',
      rows: [
        ['Flask Auth & Session Guard', '200 OK · PBKDF2-SHA256'],
        ['SQLite Relational Engine', 'Healthy · Zero Locks'],
        ['HTTP Security Headers', 'X-Frame DENY · nosniff']
      ]
    }
  };

  const cfg = configs[app.demoType] || configs.pulseops;
  mountEl.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px;">
      <span class="mono-label">${cfg.heading}</span>
      <button type="button" id="ops-action-btn" class="btn btn-primary btn-sm">${cfg.cta}</button>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${cfg.rows.map((r) => `<div class="demo-row-item"><strong>${r[0]}</strong><span class="mono-label tabular-nums">${r[1]}</span></div>`).join('')}
    </div>
    <div id="ops-status-msg" class="mono-label" style="margin-top:12px;">READY · CLICK ACTION ABOVE TO TEST WORKFLOW</div>
  `;
  document.getElementById('ops-action-btn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.textContent = 'Completed';
    const msg = document.getElementById('ops-status-msg');
    msg.textContent = cfg.confirmed;
    msg.style.color = 'var(--status-success)';
  });
}

export function initPortfolioDemos() {
  const grid = document.getElementById('appsShowcaseGrid');
  const emptyBox = document.getElementById('appsEmptyState');
  const searchInput = document.getElementById('appSearchInput');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const modal = document.getElementById('system-demo-modal');

  if (!grid || !modal) return;

  let activeCat = 'all';
  let query = '';

  const openModal = (slug) => {
    const app = PORTFOLIO_APPS.find((a) => a.slug === slug);
    if (!app) return;
    document.getElementById('demo-url-text').textContent = app.url;
    document.getElementById('demo-modal-badge').textContent = `${app.id} · ${app.badge}`;
    document.getElementById('demo-modal-title').textContent = app.name;
    document.getElementById('demo-modal-desc').textContent = app.desc;
    document.getElementById('demo-modal-stack').innerHTML = app.stack
      .map((s) => `<span class="stack-tag">${s}</span>`)
      .join('');

    const copyBtn = document.getElementById('demo-copy-launcher');
    copyBtn.textContent = `Copy ${app.launcher}`;
    copyBtn.onclick = () => {
      navigator.clipboard?.writeText(app.launcher);
      copyBtn.textContent = 'Copied Command';
      setTimeout(() => { copyBtn.textContent = `Copy ${app.launcher}`; }, 1800);
    };

    renderInteractivePreview(app, document.getElementById('demo-modal-workspace'));
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
  };

  const renderCards = () => {
    const filtered = PORTFOLIO_APPS.filter((app) => {
      const catOk = activeCat === 'all' || app.category === activeCat;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.desc.toLowerCase().includes(q) ||
        app.stack.some((s) => s.toLowerCase().includes(q));
      return catOk && qOk;
    });

    if (filtered.length === 0) {
      grid.style.display = 'none';
      emptyBox.classList.add('visible');
      return;
    }

    grid.style.display = 'grid';
    emptyBox.classList.remove('visible');

    grid.innerHTML = filtered
      .map(
        (app) => `
      <button type="button" class="app-showcase-card" data-open-app="${app.slug}" aria-label="Open interactive preview of ${app.name}">
        <div class="app-card-preview">
          ${app.previewHtml}
        </div>
        <div class="app-card-body">
          <div>
            <div class="app-card-meta">
              <span class="mono-label">${app.id} · ${app.badge}</span>
              <span class="mono-label tabular-nums">${app.port}</span>
            </div>
            <h3 class="app-card-title">${app.name}</h3>
            <p class="app-card-desc">${app.desc}</p>
          </div>
          <div class="app-card-footer">
            <div class="stack-tags">
              ${app.stack.slice(0, 3).map((t) => `<span class="stack-tag">${t}</span>`).join('')}
            </div>
            <span class="open-preview-cta">
              <span>Live Preview</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </button>
    `
      )
      .join('');

    grid.querySelectorAll('[data-open-app]').forEach((card) => {
      card.addEventListener('click', () => openModal(card.getAttribute('data-open-app')));
    });
  };

  document.querySelectorAll('[data-cat-filter]').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-cat-filter]').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.getAttribute('data-cat-filter');
      renderCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value;
      renderCards();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCat = 'all';
      query = '';
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('[data-cat-filter]').forEach((p) => {
        p.classList.toggle('active', p.getAttribute('data-cat-filter') === 'all');
      });
      renderCards();
    });
  }

  document.getElementById('demo-modal-close')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  renderCards();
}
