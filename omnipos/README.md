# 🍎 OmniPOS — Cloud Retail & Tech Inventory Command
### Modern Operating POS & Enterprise ERP • Apple iPadOS Split View & macOS Window System

**OmniPOS** is an enterprise-grade Point of Sale (POS) and inventory command system engineered with the design language of **Apple iPadOS Pro** and **macOS**. Built for high-volume consumer tech retail, it features mandatory serial/IMEI hardware tracking, Weighted Average Costing (Kardex CPP), shift cash register controls (Corte X / Corte Z), immutable audit trails, and PWA Offline-First reliability with IndexedDB.

---

## 🖥️ 1. Design Language: iPadOS Split View & macOS Window System

- **Two-Panel Split Workspace**:
  - **Left Panel (Quick Product Catalog)**: Responsive catalog grid with spotlight quick search, category filter pills, variant selectors (Color, Storage, Condition), and real-time stock alert badges.
  - **Right Panel (Live Fiscal Ticket)**: Itemized order summary, quantity steppers, fiscal customer selection (RNC / RFC), tax breakdown (18% ITBIS / IVA), discounts (% or $), and large touch targets.
- **Dynamic Island Haptic Banner**:
  - Centered floating status pill that expands to signal critical operational events:
    - `✅ Venta Confirmada (#B0200001082) ($1,499.00)`
    - `⚠️ Alerta de Stock Crítico (Quedan 2 unidades)`
    - `💵 Entrada / Retiro de Caja Justificado`
    - `📡 Modo Offline-First Activado (IndexedDB)`
    - `🔄 Sincronización en Segundo Plano Completada`
- **Translucent Frosted Surfaces (`backdrop-blur-2xl`)**:
  - Deep glassmorphism modals with subpixel border specular reflections and smooth entrance physics.

---

## ⚙️ 2. Módulos Operativos y Reglas de Negocio

### A. Facturación y Cobro Fiscal
- **Pagos Mixtos y Multimoneda**: Soporte para Efectivo, Tarjeta con código de voucher, Transferencia bancaria y pagos combinados (Split: Efectivo + Tarjeta).
- **Cálculo de Cambio y Denominaciones Rápidas**: Teclas táctiles para $20, $50, $100, $200, $500, $1000 y monto exacto.
- **Formatos de Impresión Dual**:
  - **Ticket Térmico (80mm)**: Optimizado para impresoras de rollo de 80mm con corte de papel, desglose de ITBIS, código de barras y QR fiscal.
  - **Factura Formal A4 / PDF**: Para clientes corporativos con comprobante de Crédito Fiscal (B01) o Gubernamental (B15).
- **Trazabilidad Obligatoria de IMEI / Números de Serie**: Asignación requerida de número de serie único al vender smartphones, laptops o consolas en garantía (365 días).

### B. Gestión de Inventario & Kardex
- **Control por Variantes**: Desglose por color, capacidad y condición (*Nuevo, Reacondicionado A, Open Box*).
- **Entrada de Mercancía con Costo Promedio Ponderado (CPP)**:
  $$\text{Nuevo CPP} = \frac{(\text{Stock Actual} \times \text{Costo Actual}) + (\text{Cantidad Recibida} \times \text{Costo Compra})}{\text{Stock Actual} + \text{Cantidad Recibida}}$$
- **Monitoreo de Margen Comercial**: Visualización del margen de ganancia proyectado en tiempo real.
- **Alertas Visuales de Stock**:
  - Verde: Stock normal (> 3 unidades).
  - Ámbar: Stock crítico ($\le 2$ unidades).
  - Rojo: Agotado (0 unidades, bloquea adición al ticket).

### C. Control y Cuadre de Caja (Cash Management)
- **Fondo de Apertura**: Registro del float inicial ($250.00).
- **Movimientos de Efectivo Justificados**: Entradas y salidas rápidas con motivo obligatorio.
- **Corte X (En Vivo)**: Lectura parcial del efectivo acumulado sin cerrar turno.
- **Corte Z (Cierre Definitivo)**:
  - Arqueo físico de gaveta con conteo real.
  - Cálculo instantáneo de discrepancias (*Sobrante / Faltante / Cuadre Perfecto*).
  - Autorización obligatoria mediante PIN de Supervisor.

### D. Panel de Reportes & Analítica Financiera
- **Métricas Clave**: Ventas brutas, margen comercial neto, ticket promedio (AOV) y volumen de transacciones.
- **Gráfica de Ventas por Hora**: Distribución horaria de ventas para detectar horas pico de tráfico en tienda.
- **Top Sellers**: Ranking de productos con mayor rotación e ingresos generados.
- **Exportación NIIF**: Descarga inmediata a formato Excel (.CSV) e impresión de reporte ejecutivo.

---

## 🔒 3. Estándares de Seguridad Corporativa & RBAC

| Rol | Permisos Operativos |
| :--- | :--- |
| **CAJERO** | Apertura de turno, facturación, cobro y consulta de catálogo |
| **SUPERVISOR** | Autorización de descuentos comerciales, retiros de caja y aprobación de Corte Z |
| **ADMIN** | Acceso irrestricto a costos de compra (CPP), reportes de rentabilidad y auditoría |

### Transacciones ACID (`server/schema.prisma` & `server/index.js`)
- Uso del patrón transaccional `prisma.$transaction`:
  1. Verificación atómica de existencia y bloqueo de fila de stock.
  2. Asignación y marcado de IMEI/Serial a estado `VENDIDO`.
  3. Creación de factura e ítems asociados.
  4. Registro en el cajón de efectivo activo.
  5. Escritura de registro inmutable en el **Audit Trail**.

---

## 📶 4. Modo Offline-First (PWA)

- Detección automática del estado de red (`online` / `offline`).
- Almacenamiento local de facturas en **IndexedDB** (`omnipos_offline_db`) cuando se interrumpe la conexión a internet.
- Sincronización transparente en segundo plano al restablecer la conectividad con confirmación háptica en la **Dynamic Island**.

---

## ⌨️ Atajos de Teclado Rápidos

- <kbd>⌘ Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>: Abrir **Spotlight Search** global.
- <kbd>F2</kbd>: Pasar inmediatamente a cobrar factura actual.
- <kbd>Esc</kbd>: Cerrar cualquier modal abierto.

---

## 🚀 Inicio Rápido

### Lanzador en Windows (Un Clic)
Doble clic en:
```cmd
run_omnipos.bat
```

### Línea de Comandos
```bash
cd omnipos
node node_modules\vite\bin\vite.js --port 3001 --host
```
Acceder a [http://localhost:3001](http://localhost:3001).
