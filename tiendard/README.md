# 🇩🇴 TiendaRD — Cross-Border E-Commerce Platform (USA to Dominican Republic)

> **Producción MVP**: Marketplace de comercio electrónico transfronterizo diseñado específicamente para consumidores de la República Dominicana que adquieren artículos importados desde Estados Unidos, con cálculo dinámico de flete en tiempo real, exención arancelaria aduanal DGA (**Decreto 402-05 Categoría B** para compras menores a **$200 USD**), soporte para casilleros y couriers dominicanos (**EPS, BM Cargo, Aeropaq, Domex**), y seguimiento visual de envíos (**Miami &rarr; Caucedo/AILA &rarr; Entrega Local**).

---

## 🚀 1. Demo Login Credentials & Roles (RBAC)

El sistema cuenta con 4 cuentas pre-configuradas con Control de Acceso Basado en Roles (**RBAC**) y protección a nivel de middleware:

| Rol | Correo Electrónico | Contraseña Demo | Perfil & Responsabilidades |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `superadmin@tiendard.com` | `Admin123!` | Control maestro de socios, tasas de cambio USD/DOP, auditoría y métricas globales. |
| **ADMIN_LOGISTICS** | `socio1@tiendard.com` | `SocioLogistica2026!` | **Socio 1**: Recepción en almacén Doral Miami (FL 33172), escaneo de guías aéreas (AWB) y liquidación aduanal DGA. |
| **ADMIN_COMMERCIAL** | `socio2@tiendard.com` | `SocioComercial2026!` | **Socio 2**: Catálogo de productos, demos en video, promociones y analítica de ventas. |
| **CUSTOMER** | `cliente.demo@tiendard.com` | `ClienteDemo2026!` | **Pedro Medina**: Comprador con casillero asignado en Miami (`TRD-MIA-8842`) y entrega en Distrito Nacional / Santiago. |

---

## 🏛️ 2. Arquitectura de Cloud & Base de Datos (Vercel + Supabase)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VERCEL EDGE NETWORK                           │
│  Next.js 15 App Router · Middleware RBAC · In-Memory Token Bucket Limiter│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Serverless Functions
                 ┌──────────────────┴──────────────────┐
                 │                                     │
                 ▼ (Port 6543)                         ▼ (Port 5432)
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│   SUPABASE SUPAVISOR / PGBOUNCER  │ │      SUPABASE DIRECT SESSION     │
│   DATABASE_URL (Transaction Pool) │ │      DIRECT_URL (Prisma CLI DDL) │
│   ?pgbouncer=true                 │ │      Migraciones y Prisma Studio │
└─────────────────┬─────────────────┘ └──────────────────┬───────────────┘
                  │                                      │
                  └──────────────────┬───────────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │    SUPABASE POSTGRESQL DB    │
                      │  User, Role, Address,        │
                      │  Product, Category, Order,   │
                      │  OrderItem, TrackingEvent    │
                      └──────────────────────────────┘
```

### Dual Connection Pooling con Prisma:
- **`DATABASE_URL` (Puerto 6543)**: Utiliza el pooler transaccional PgBouncer / Supavisor de Supabase con `?pgbouncer=true&connection_limit=15` para evitar el agotamiento de conexiones en entornos serverless efímeros de Vercel.
- **`DIRECT_URL` (Puerto 5432)**: Conexión directa a PostgreSQL para la ejecución segura de migraciones (`prisma db push`, `prisma migrate`) y preparación de esquemas DDL.

---

## 📦 3. Motor Logístico y Cumplimiento Aduanal Dominicano (DGA)

### 🛡️ Exención Arancelaria DGA (Decreto 402-05 Categoría B):
- **Compras &lt; $200 USD (Valor FOB)**: El sistema aplica automáticamente un **0% de arancel de aduanas** y **0% de ITBIS (18%)**, mostrando el sello de confianza:
  > `✓ Exento de Impuestos DGA (< $200 USD)`
- **Compras &ge; $200 USD**: El motor calcula y desglosa en tiempo real el **gravamen arancelario** según la partida arancelaria (ej. 0% en computadoras bajo HS 8471, 20% en electrónica de consumo) más el **18% de ITBIS** calculado sobre el valor CIF más arancel.

### ✈️ Opciones Dinámicas de Envío (USA &rarr; RD):
1. **Standard Marítimo**: 10–15 días laborables · **US$ 1.25 / lb** (mínimo $12.00) — Ideal para artículos pesados o voluminosos.
2. **Express Aéreo**: 3–5 días laborables · **US$ 3.25 / lb** (mínimo $6.00) — Tarifa estándar de vuelo Miami &rarr; AILA.
3. **Priority Courier Directo**: 24–48 horas laborables · **US$ 5.50 / lb + $9.99 base** — Entrega VIP de máxima prioridad.

### 🇩🇴 Soporte Geográfico Nacional y Couriers Locales:
- Selección de las 32 Provincias de la República Dominicana (Distrito Nacional, Santiago, La Altagracia, etc.) y Sectores (Piantini, Naco, Bella Vista, Villa Olga...).
- Compatibilidad directa con casilleros de couriers locales: **EPS, BM Cargo, Aeropaq, Domex, POBOX** y entrega directa puerta a puerta **TiendaRD Directo**.

---

## 🎨 4. Sistema de Diseño UI/UX (Marketplace Moderno)

- **Paleta de Colores**:
  - Fondo Primario: Alabastro Nítido (`#F8FAFC`) con tarjetas de superficie Blanca Pura (`#FFFFFF`) y modo oscuro profundo (`#0B0C0E` / `#0F172A`).
  - Cabecera: Azul Medianoche Profundo (`#0F172A`) con sub-navegación translúcida efecto vidrio esmerilado (`bg-white/80 backdrop-blur-md`).
  - Acento de Confianza: Azul Real Eléctrico (`#2563EB`).
  - Disparador de Alta Conversión (CTA): Ámbar Vibrante (`#F59E0B` hover `#D97706`).
- **Hero Bento Grid Asimétrico**:
  - Banner fotográfico principal de estilo de vida tecnológico.
  - Tarjetas destacadas laterales: *"Envío Aéreo Express 72h a RD"* y *"0% Impuestos Aduanales bajo $200 USD"*.
- **Tarjetas de Producto (`ProductCard.tsx`)**:
  - Contenedor neutral suave (`#F1F5F9`) donde los productos resaltan con micro-escalado al pasar el cursor (`group-hover:scale-105`).
  - **Reproductor de Video Interactivo integrado**: clips de demostración automáticos al colocar el cursor con control de sonido.
  - Distintivo Rose (`-25%`) y distintivo verde esmeralda de exención aduanal DGA.
  - Botón dual: icono para adición rápida al carrito + botón de ancho completo *"Comprar Ahora"*.
- **Rastreador de Pedidos Interactivo (`OrderTrackingTimeline.tsx`)**:
  - Stepper animado con Framer Motion y pulso en el estado activo:
    `1. ORDER_PLACED` &rarr; `2. US_WAREHOUSE_RECEIVED` &rarr; `3. AIR_MARITIME_TRANSIT` &rarr; `4. CUSTOMS_CLEARANCE_DR` &rarr; `5. LOCAL_COURIER_DISPATCH` &rarr; `6. DELIVERED`.

---

## 🛠️ 5. Guía de Despliegue Paso a Paso (Vercel + Supabase)

### Paso 1: Clonar e Instalar Dependencias
```bash
git clone <tu-repositorio>
cd tiendard
npm install
```

### Paso 2: Crear Proyecto en Supabase
1. Ingresa a [supabase.com](https://supabase.com) y crea un proyecto nuevo (ej. `tiendard-prod`).
2. Ve a **Project Settings &rarr; Database &rarr; Connection String**:
   - Copia la URL del **Connection Pooler** (Modo Transaction, Puerto `6543`).
   - Copia la URL de **Direct Connection** (Puerto `5432`).

### Paso 3: Configurar Variables de Entorno (`.env`)
Crea un archivo `.env` basado en `.env.example`:
```env
# Conexión agrupada para Serverless (Vercel)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=15"

# Conexión directa para migraciones Prisma
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Tasa de cambio de referencia
NEXT_PUBLIC_USD_TO_DOP_RATE="59.50"
```

### Paso 4: Ejecutar Migraciones y Seed en la Base de Datos
```bash
# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el esquema con Supabase
npx prisma db push

# Poblar la base de datos con las 4 cuentas, 10 productos tecnológicos y 3 pedidos
npm run prisma:seed
```

### Paso 5: Despliegue en Vercel
1. Instala el CLI de Vercel o conecta tu repositorio de GitHub en [vercel.com](https://vercel.com).
2. En el panel de configuración de proyecto en Vercel, agrega las variables de entorno:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_USD_TO_DOP_RATE`
3. Haz clic en **Deploy**. ¡Tu plataforma estará lista en producción global en menos de 2 minutos!

---

## 💻 6. Ejecución Local Rápida

Puedes iniciar la plataforma en tu entorno local con el script incluido:
```bash
# Doble clic o ejecutar en terminal desde la raíz:
run_tiendard.bat
```
O manualmente:
```bash
cd tiendard
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)
