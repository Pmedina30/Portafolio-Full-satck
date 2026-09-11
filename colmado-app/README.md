# 🏪 ColmadoPro — Sistema Integral de Ventas, Inventario & KPIs

**ColmadoPro** es una aplicación web full-stack diseñada especialmente para la gestión operativa y financiera de colmados y tiendas de conveniencia. Integra punto de venta (POS) ultra rápido, gestión de inventario con alertas de existencias críticas, y un panel de control con métricas financieras en tiempo real.

---

## 🚀 Características Principales

- **🔐 Autenticación con Firebase & Power User:**
  - Login con Correo/Contraseña vía Firebase Auth.
  - Login con Google (1 click).
  - Acceso instantáneo **Power User (Pablo Medina - Admin)** con privilegios completos de administrador.
  - Modo demostración de roles (Admin vs. Cajero) para evaluar control de acceso.

- **📊 Dashboard de Inteligencia Comercial:**
  - Métricas clave: Facturación bruta (RD$), margen de ganancia estimado, volumen de órdenes y tickets promedio.
  - Gráfico interactivo con **Recharts** con ventas diarias de los últimos 7 días.
  - Alertas automáticas de reposición para productos cuyo stock es menor o igual al mínimo.
  - Historial de transacciones recientes en tiempo real.

- **🛒 Punto de Venta (POS) con Facturación Rápida:**
  - Catálogo interactivo de productos con búsqueda predictiva y filtros por categoría.
  - Carrito de compras con control dinámico de unidades y validación contra existencias.
  - Múltiples métodos de pago: Efectivo (con calculadora de devuelta/cambio), Tarjeta y Transferencia.
  - Comprobante/recibo digital con botón de impresión.
  - Descuento automático de inventario al cobrar.

- **📦 Gestión y Control de Inventario:**
  - Catálogo con más de 20 productos típicos de colmados dominicanos preconfigurados.
  - Alta, edición y baja de artículos (CRUD).
  - Entrada rápida de mercancía (+ stock de suplidor).
  - Indicadores visuales de estado: 🟢 Normal, 🟡 Stock Crítico, 🔴 Agotado.
  - Cálculo automático de margen de utilidad por artículo.
  - Exportación completa del inventario a archivo CSV.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, Vite, React Router v6
- **Estilos & UI:** Tailwind CSS, Lucide Icons, Plus Jakarta Sans
- **Gráficas:** Recharts
- **Backend & Almacenamiento:** Cloud Firestore / Firebase Authentication con fallback offline sincronizado
- **Scripts:** Batch launcher `run_colmado.bat`

---

## ⚙️ Conexión con Firebase (Opcional para modo nube)

Si deseas conectar tu propio proyecto de Firebase:
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita **Authentication** (Correo/Contraseña y Google).
3. Habilita **Cloud Firestore**.
4. Copia tus credenciales en el archivo `.env`:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
*(Si no configuras las claves, la app funciona de manera 100% interactiva en modo local persistente).*

---

## 🏃‍♂️ Cómo Ejecutar la Aplicación

Simplemente haz doble clic en `run_colmado.bat` en la raíz del proyecto, o ejecuta:

```bash
cd colmado-app
npm install
npm run dev
```

La aplicación abrirá en: **http://localhost:5175**

