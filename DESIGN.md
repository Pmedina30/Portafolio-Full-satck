# DESIGN.md — Master Design System & UI/UX Architecture
**Portfolio Ecosystem — Pedro Medina (`Portafolio-Full-satck`)**

---

## 1. Dirección Artística General y Personalidad del Producto

Inspirado directamente en las referencias visuales de **Dovetail**, **Mixpanel**, **Revolut**, **Wise**, **Lightspark**, **Arrakis** y **Set Space**, el ecosistema abandona por completo cualquier estética genérica de plantilla o "IA básica" (gradientes neón saturados, emojis como iconos, sombras pesadas o tarjetas sobrecargadas) para adoptar un lenguaje **"Institutional FinTech & Intelligence SaaS" ($50k+ Agency Grade)**.

### Pilares Visuales
1. **Dualidad Intencional de Superficie (Light Gallery & Obsidian Grid):**
   - **Modo Oscuro Elegante (Estilo Dovetail / Arrakis / Set Space):** Lienzo `#09090B` con retícula arquitectónica ultrafina (`1px` a `4%` de opacidad), tarjetas `#111114` con bordes de `1px solid rgba(255,255,255,0.08)`, tipografía blanca pura `#FAFAFA` y CTAs principales en píldora blanca de máximo contraste (`#FFFFFF` con texto `#09090B`).
   - **Modo Claro Minimalista (Estilo Wise / Mixpanel / Lightspark / Revolut):** Lienzo `#FFFFFF` / `#FAFAFA`, superficies secundarias `#F4F4F5`, bordes finos `#E4E4E7`, titulares en negro profundo `#09090B` con tracking cerrado (`-0.035em` a `-0.04em`) y CTAs principales en píldora negra (`#09090B` con texto `#FFFFFF`) o acento institucional.
2. **Espacio en Blanco Estratégico:**
   - Reducción radical del ruido visual: cada vista prioriza **1 acción primaria por pantalla**, titulares contundentes de 2–3 líneas máximo y tarjetas flotantes limpias con métricas verificables.
3. **Jerarquía Visual Estricta (Orden de Lectura):**
   - **Nivel 1 (0.5s):** Badge superior de contexto/confianza + Titular Display (`H1`) de alto contraste + CTA primario en formato píldora (`rounded-full`).
   - **Nivel 2 (2.0s):** Artefacto interactivo principal (Viewport 3D WebGL / Mockup SaaS interactivo / KPIs clave con `tabular-nums`).
   - **Nivel 3 (5.0s+):** Módulos Bento, tablas operativas, filtros y metadatos técnicos.

---

## 2. Sistema de Color (Regla Estricta 60-30-10 & WCAG AA)

### Modo Oscuro ("Dovetail / Arrakis Obsidian")
| Rol | Proporción | Token CSS | Valor Hex / RGBA | Contraste WCAG |
| :--- | :---: | :--- | :--- | :--- |
| **Fondo Principal (Canvas)** | **60%** | `--bg-canvas` | `#09090B` | Base |
| **Superficies / Tarjetas / Modales** | **30%** | `--bg-surface` | `#111113` | Elevación N1 |
| **Superficie Elevada / Hover** | — | `--bg-elevated` | `#18181B` | Elevación N2 |
| **CTA Primario (Alto Contraste)** | **10%** | `--accent-primary` | `#FAFAFA` (Texto `#09090B`) | **19.4:1 (AAA)** |
| **Acento de Marca / Señal Activa** | — | `--accent-brand` | `#2563EB` / `#FF4F18` | **>= 4.6:1 (AA)** |
| **Texto Principal** | — | `--text-primary` | `#FAFAFA` | **19.4:1 (AAA)** |
| **Texto Secundario (`text-muted`)** | — | `--text-muted` | `#A1A1AA` | **7.8:1 (AAA)** |
| **Borde Sutil (`1px`)** | — | `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Separador estructural |
| **Borde Hover / Focus** | — | `--border-strong` | `rgba(255, 255, 255, 0.22)` | Estado interactivo |

### Modo Claro ("Mixpanel / Wise / Lightspark Gallery")
| Rol | Proporción | Token CSS | Valor Hex / RGBA | Contraste WCAG |
| :--- | :---: | :--- | :--- | :--- |
| **Fondo Principal (Canvas)** | **60%** | `--bg-canvas` | `#FFFFFF` | Base |
| **Superficies / Tarjetas / Paneles** | **30%** | `--bg-surface` | `#F8FAFC` / `#F4F4F5` | Elevación N1 |
| **Superficie Elevada / Tarjeta Flotante** | — | `--bg-elevated` | `#FFFFFF` | Elevación N2 |
| **CTA Primario (Alto Contraste)** | **10%** | `--accent-primary` | `#09090B` (Texto `#FFFFFF`) | **19.8:1 (AAA)** |
| **Acento Secundario FinTech** | — | `--accent-brand` | `#2563EB` (Texto `#FFFFFF`) | **5.17:1 (AA)** |
| **Texto Principal** | — | `--text-primary` | `#09090B` | **19.8:1 (AAA)** |
| **Texto Secundario (`text-muted`)** | — | `--text-muted` | `#52525B` | **7.4:1 (AAA)** |
| **Borde Sutil (`1px`)** | — | `--border-subtle` | `#E4E4E7` | Separador estructural |

### Tokens Semánticos Globales
- **Éxito (`--status-success`):** `#10B981` (fondo suave `rgba(16, 185, 129, 0.12)`, texto accesible `#047857` en claro / `#34D399` en oscuro)
- **Advertencia (`--status-warning`):** `#F59E0B` (texto `#B45309` en claro / `#FBBF24` en oscuro)
- **Error / Destructivo (`--status-danger`):** `#EF4444` (texto `#B91C1C` en claro / `#F87171` en oscuro)
- **Info (`--status-info`):** `#3B82F6` (texto `#1D4ED8` en claro / `#60A5FA` en oscuro)

---

## 3. Escala Tipográfica Estricta

- **Display / Titulares (`--font-display`):** `'Plus Jakarta Sans'`, `'Inter'`, `system-ui`, `sans-serif`
- **Editorial Contrast (`--font-serif`):** `'Instrument Serif'`, `Georgia`, `serif` *(uso puntual estilo Set Space para énfasis editorial)*
- **Cuerpo / UI (`--font-sans`):** `'Inter'`, `system-ui`, `-apple-system`, `sans-serif`
- **Datos, Código y Monedas (`--font-mono`):** `'JetBrains Mono'`, `monospace` + `font-variant-numeric: tabular-nums` obligatorio en todos los KPIs, precios, tablas y contadores.

| Nivel | Tamaño Desktop / Mobile | Peso | Line-Height | Tracking | Uso |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Display Hero (`H1`)** | `56px–64px` / `36px` | `700` | `1.04` | `-0.035em` | Titular principal de impacto (Revolut / Dovetail / Wise) |
| **Section Title (`H2`)** | `36px–40px` / `28px` | `600` | `1.12` | `-0.03em` | Encabezados de sección |
| **Card / Modal Title (`H3`)** | `20px` / `18px` | `600` | `1.25` | `-0.02em` | Títulos de módulos, tarjetas y modales |
| **KPI / Metric Value** | `28px–36px` / `24px` | `700` | `1.1` | `-0.025em` | Saldos, métricas y tasas (`tabular-nums`) |
| **Body Regular** | `16px` / `15px` | `400` | `1.6` | `-0.005em` | Descripciones y lectura principal (`max-width: 60ch`) |
| **UI / Button / Nav** | `14px` | `500–600` | `1.2` | `-0.01em` | Botones, enlaces de navegación, inputs |
| **Caption / Label / Badge** | `12px` | `500–600` | `1.3` | `+0.04em` | Etiquetas de formulario, metadatos, pills de estado |

---

## 4. Espaciado, Grid y Estructura Global (Sistema 4px / 8px)

- **Unidad Base:** `4px` (`4, 8, 12, 16, 24, 32, 48, 64, 80, 96px`).
- **Contenedor Global (`Container`):** `max-width: 1280px`, centrado, padding lateral `24px` (mobile `16px`, desktop `32px`).
- **Header / Navbar:**
  - Altura fija `64px` (`4rem`), `position: sticky; top: 0; z-index: 50`.
  - Fondo translúcido con `backdrop-filter: blur(16px)` y borde inferior `1px solid var(--border-subtle)`.
  - Distribución en 3 zonas limpias (estilo Revolut / Dovetail / Mixpanel): **Izquierda:** Marca tipográfica limpia sin emojis | **Centro:** Navegación con indicador de estado `active` | **Derecha:** Selector de tema, acceso secundario (`Log in`) y CTA primario en píldora (`Sign up` / `Get Started`).
  - En móvil (`390px`): Drawer desplegable limpio con botones táctiles de altura mínima `44px`.
- **Secciones Principales:** Separación vertical `80px–96px` en desktop y `56px` en móvil.

---

## 5. Estándar de Componentes e Interacciones

### Botones y CTAs (Firma Revolut / Wise / Mixpanel / Dovetail)
- **Forma:** Píldora (`border-radius: 9999px`) para CTAs de navegación y conversión principal; `border-radius: 10px` para acciones densas dentro de tablas/herramientas.
- **Altura mínima:** `44px` en controles táctiles y formularios (`36px` solo en acciones compactas de escritorio con área clicable expandida).
- **Variantes estandarizadas:**
  1. `Primary`: Fondo `--accent-primary`, texto inverso, `hover` con ligera elevación y opacidad `90%`.
  2. `Secondary`: Fondo `--bg-surface`, borde `1px solid var(--border-subtle)`, `hover` con `--bg-elevated` y `--border-strong`.
  3. `Ghost`: Transparente, texto `--text-muted`, `hover` texto `--text-primary` y fondo sutil.
  4. `Destructive`: Fondo `rgba(239, 68, 68, 0.12)`, borde `rgba(239, 68, 68, 0.3)`, texto `#EF4444` (`hover` sólido `#EF4444` con texto `#FFFFFF`).
- **Estados obligatorios:** `:hover` (`150ms cubic-bezier(0.16, 1, 0.3, 1)`), `:active` (`scale(0.98)`), `:focus-visible` (anillo accesible `2px solid var(--accent-brand)` con `offset: 2px`), `:disabled` (`opacity: 0.45; cursor: not-allowed`), y `.is-loading` (spinner SVG integrado sin desplazar el ancho del botón).

### Tarjetas, Tablas, Formularios y Estados Vacíos
- **Tarjetas Bento & SaaS Mockups:** Padding uniforme `24px`, `border-radius: 16px`, borde `1px solid var(--border-subtle)`, sombra difuminada ultra-suave (`0 8px 30px rgba(0,0,0,0.04)` en claro / `0 16px 40px rgba(0,0,0,0.35)` en oscuro).
- **Iconografía Unificada:** **Cero emojis** en toda la interfaz. Uso exclusivo de iconos vectoriales SVG estilo **Lucide** (`stroke-width: 1.75`, tamaños `16px`, `18px`, `20px`).
- **Estados de Interfaz:**
  - `Skeleton`: Bloques animados sutiles para carga de datos/3D.
  - `Empty State`: Contenedor con borde punteado fino, icono vectorial centrado, título conciso, descripción en `--text-muted` y CTA de acción inmediata.
  - `Error / Flash Banner`: Alerta estructurada con icono SVG semántico, contraste WCAG AA y botón de cierre de `44x44px`.
- **Accesibilidad de Movimiento:** Regla global `@media (prefers-reduced-motion: reduce)` que desactiva animaciones continuas y reduce transiciones a cambios instantáneos.

---

## 6. Mapeo Visual por Aplicación del Portafolio

1. **Hub Central & PyStack (`templates/`, `static/`):** Hero editorial estilo **Dovetail / Lightspark** con viewport 3D WebGL interactivo, Bento Showcase de las 12 aplicaciones con previsualizaciones tipo **Mixpanel / Revolut**, pantallas de `Login` y `Register` estilo **Linear / Stripe Auth** (con toggle SVG de contraseña, estados `loading` al enviar y auto-fill limpio), y `Dashboard` ejecutivo sin emojis ni estilos inline heredados.
2. **TiendaRD (`tiendard/`):** Estética **Revolut / Wise Cross-Border Marketplace** — calculadora aduanal DGA con números tabulares, tarjetas limpias de alto contraste y tracking logístico impecable.
3. **OmniPOS & ColmadoPro (`omnipos/`, `colmado-app/`):** Terminal operativa de alta precisión con paneles de `1px`, contraste limpio y recibo térmico intacto.
4. **CVForge Studio (`cvforge-studio/`):** Galería limpia estilo **Lightspark / Apple Studio** sin blobs de colores difusos, centrada en el documento A4 y controles táctiles refinados.
5. **Apps Analíticas y FinTech (`executive-dashboard-studio/`, `apexlend/`, `finpulse/`, `pulseops/`, `taxi-dashboard/`, `dental-app/`, `nexus-tech-3d/`, `cosmoslens/`, `portfolio-pedro-medina/`):** Cohesión total bajo los tokens de `DESIGN.md` respetando su naturaleza clara (Wise/Mixpanel) u oscura (Dovetail/Arrakis).
