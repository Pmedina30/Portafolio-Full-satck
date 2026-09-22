# PulseOps - B2B Operational Intelligence Platform (Linear / Vercel Aesthetic) ⚡📊

**PulseOps** es un MVP de Inteligencia Operacional B2B de alto rendimiento diseñado para monitorear SLAs, volumen de tickets y rendimiento de turnos en tiempo real mediante WebSockets, PostgreSQL con funciones de ventana y un diseño ultra moderno inspirado en Linear y Vercel.

---

## 🏛️ 1. Arquitectura Modular del MVP

```text
pulseops/
├── database/
│   └── schema.sql                  # DDL PostgreSQL: Enums, Tablas, Índices B-Tree/GIN, y Vistas Materializadas
├── backend/                        # API REST + WebSocket Server (Clean Architecture)
│   ├── package.json
│   └── src/
│       ├── server.ts               # Express con Helmet, Rate-Limit, CORS y Socket.io
│       ├── middleware/
│       │   └── auth.middleware.ts  # JWT en cookies httpOnly y RBAC (SuperAdmin, OperationsLead, Analyst)
│       └── websocket/
│           └── socket.handler.ts   # Handshake seguro y telemetría periódica push a salas por equipo
└── frontend/                       # Next.js App Router (TypeScript + Tailwind + Recharts)
    └── src/
        ├── types/
        │   └── pulseops.ts         # Contratos tipados de métricas, turnos y eventos
        └── components/
            ├── MetricKpiCard.tsx   # Card minimalista con micro-sparkline SVG y tendencia
            ├── InteractiveViewFilters.tsx # Filtro popover interactivo (Team, Shift, Range)
            ├── PulseTimeSeriesChart.tsx   # Gráfico de series temporales con tabs y dark tooltip
            └── PulseOpsDashboard.tsx      # Dashboard maestro con feed de incidentes en vivo
```

---

## 🔒 2. Seguridad Mandatoria (OWASP Top 10)

1. **Tokens en Cookies `httpOnly`:**
   - La cookie de acceso se firma con las banderas `httpOnly: true`, `sameSite: 'strict'` y `secure: true` en producción, bloqueando ataques de Cross-Site Scripting (XSS).
2. **Control de Acceso Basado en Roles (RBAC):**
   - Matriz de permisos estricta: `SuperAdmin` (gestión de equipos y configuración), `OperationsLead` (triage y reasignación de incidentes), `Analyst` (lectura y telemetría operativa).
3. **Hardening de Cabeceras con Helmet:**
   - HSTS configurado para 1 año, protección de Content-Security-Policy (CSP), prevención de Clickjacking (`X-Frame-Options: DENY`) y sniffing MIME.
4. **Protección contra Inyección SQL:**
   - Consultas parametrizadas con ORM / Query Builder y agregaciones sobre vistas materializadas indexadas.

---

## 🚀 3. Puesta en Marcha Rápida

### Backend (API & WebSockets)
```bash
cd pulseops/backend
npm install
npm run dev # Corre en http://localhost:5050
```

### Frontend (Next.js Dashboard)
```bash
cd pulseops/frontend
npm install
npm run dev # Corre en http://localhost:3000
```

