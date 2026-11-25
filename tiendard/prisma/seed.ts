// ==============================================================================
// TIENDARD — PRISMA SEED SCRIPT
// Configures:
//  - 4 RBAC Roles & 4 Pre-configured User Accounts
//  - Categories with Lucide Icon names (PascalCase)
//  - 10 Premium Tech Products (realistic weights, video previews, specs, HS codes)
//  - 3 Live Orders across distinct US-to-RD logistics stages
// ==============================================================================

import { PrismaClient, RoleKey, ShippingMethod, CourierProvider, OrderStatus, TrackingStage, PaymentStatus, Currency } from "@prisma/client";
import { quoteOrder, QuoteLineInput, USD_TO_DOP_RATE } from "../src/lib/logistics";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  console.log("🌱 Starting TiendaRD database seed...");

  // 1. Clean existing tables safely
  await prisma.trackingEvent.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  console.log("🧹 Previous records cleared.");

  // 2. Seed Roles
  const superAdminRole = await prisma.role.create({
    data: {
      key: RoleKey.SUPER_ADMIN,
      name: "Super Administrador",
      description: "Control maestro del marketplace, tipos de cambio, socios y plataforma",
      permissions: ["*"],
    },
  });

  const logisticsAdminRole = await prisma.role.create({
    data: {
      key: RoleKey.ADMIN_LOGISTICS,
      name: "Socio de Logística y Aduanas",
      description: "Socio 1: Operaciones de almacén Miami, guías aéreas y despacho DGA",
      permissions: ["orders:read", "orders:write", "tracking:write", "customs:audit"],
    },
  });

  const commercialAdminRole = await prisma.role.create({
    data: {
      key: RoleKey.ADMIN_COMMERCIAL,
      name: "Socio Comercial y Catálogo",
      description: "Socio 2: Gestión de productos, promociones, precios y alianzas de marca",
      permissions: ["products:read", "products:write", "categories:write", "analytics:read"],
    },
  });

  const customerRole = await prisma.role.create({
    data: {
      key: RoleKey.CUSTOMER,
      name: "Cliente Final",
      description: "Comprador de República Dominicana con casillero en Miami",
      permissions: ["orders:read_own", "profile:write"],
    },
  });

  console.log("✅ Roles created.");

  // 3. Seed Users (The 4 Pre-configured Demo Accounts)
  const superAdminUser = await prisma.user.create({
    data: {
      email: "superadmin@tiendard.com",
      passwordHash: hashPassword("Admin123!"),
      name: "Carlos Mendoza (Super Admin)",
      phone: "809-555-0101",
      roleId: superAdminRole.id,
      miamiSuiteCode: "TRD-MIA-0001",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  });

  const logisticsAdminUser = await prisma.user.create({
    data: {
      email: "socio1@tiendard.com",
      passwordHash: hashPassword("SocioLogistica2026!"),
      name: "Alejandro Peña (Socio Logística)",
      phone: "829-555-0102",
      roleId: logisticsAdminRole.id,
      miamiSuiteCode: "TRD-MIA-0002",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    },
  });

  const commercialAdminUser = await prisma.user.create({
    data: {
      email: "socio2@tiendard.com",
      passwordHash: hashPassword("SocioComercial2026!"),
      name: "Laura De León (Socia Comercial)",
      phone: "849-555-0103",
      roleId: commercialAdminRole.id,
      miamiSuiteCode: "TRD-MIA-0003",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "cliente.demo@tiendard.com",
      passwordHash: hashPassword("ClienteDemo2026!"),
      name: "Pedro Medina",
      phone: "809-555-8842",
      roleId: customerRole.id,
      miamiSuiteCode: "TRD-MIA-8842",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    },
  });

  console.log("✅ 4 Core User Accounts seeded.");

  // 4. Seed Addresses for Customer
  const customerAddressSantoDomingo = await prisma.address.create({
    data: {
      userId: customerUser.id,
      label: "Apartamento Piantini",
      recipientName: "Pedro Medina",
      phone: "809-555-8842",
      province: "Distrito Nacional",
      municipality: "Santo Domingo",
      sector: "Piantini",
      street: "Calle Federico Geraldino esq. Porfirio Herrera #42, Torre Altagracia, Apto 7B",
      reference: "Frente a BlueMall, portón gris",
      postalCode: "10148",
      country: "DO",
      courierProvider: CourierProvider.EPS,
      courierLockerId: "EPS-SDQ-8842",
      isDefault: true,
    },
  });

  const customerAddressSantiago = await prisma.address.create({
    data: {
      userId: customerUser.id,
      label: "Oficina Santiago",
      recipientName: "Pedro Medina / Trueshore BPO",
      phone: "829-555-4421",
      province: "Santiago",
      municipality: "Santiago de los Caballeros",
      sector: "Villa Olga",
      street: "Av. Juan Pablo Duarte #108, Edificio Corporativo Cibao, Suite 302",
      reference: "Al lado de la Sirena Bartolomé Colón",
      postalCode: "51000",
      country: "DO",
      courierProvider: CourierProvider.BM_CARGO,
      courierLockerId: "BMC-STI-9912",
      isDefault: false,
    },
  });

  console.log("✅ Addresses created.");

  // 5. Seed Categories with Lucide icon keys
  const catComputing = await prisma.category.create({
    data: {
      name: "Laptops & Computing",
      slug: "laptops-computing",
      description: "Laptops ultraportátiles, estaciones de trabajo y periféricos de alto rendimiento",
      icon: "Laptop",
      sortOrder: 1,
    },
  });

  const catAudio = await prisma.category.create({
    data: {
      name: "Audio & Spatial Sound",
      slug: "audio-spatial-sound",
      description: "Audífonos de diadema Hi-Res, earbuds con ANC híbrido y audio espacial",
      icon: "Headphones",
      sortOrder: 2,
    },
  });

  const catCharging = await prisma.category.create({
    data: {
      name: "Smart Charging & Power",
      slug: "smart-charging",
      description: "Cargadores rápidos GaN5 Pro, powerbanks magnéticas Qi2 y cables E-Marker",
      icon: "BatteryCharging",
      sortOrder: 3,
    },
  });

  const catHubs = await prisma.category.create({
    data: {
      name: "Hubs & Docks",
      slug: "hubs-docks",
      description: "Estaciones de acoplamiento Thunderbolt 4, adaptadores USB-C multipuerto y docks 8K",
      icon: "Cable",
      sortOrder: 4,
    },
  });

  const catSmartHome = await prisma.category.create({
    data: {
      name: "Smart Home & Automation",
      slug: "smart-home",
      description: "Dispositivos inteligentes para el hogar, domótica Matter y sensores ecológicos",
      icon: "House",
      sortOrder: 5,
    },
  });

  const catGaming = await prisma.category.create({
    data: {
      name: "Gaming & Content Creation",
      slug: "gaming",
      description: "Controles inalámbricos de baja latencia, consolas y accesorios de streaming",
      icon: "Gamepad2",
      sortOrder: 6,
    },
  });

  console.log("✅ 6 Categories seeded with Lucide icon names.");

  // 6. Seed 10 Premium Tech Products
  const productsData = [
    {
      sku: "TRD-MBA13-M3",
      slug: "apple-macbook-air-13-m3-midnight",
      name: "Apple MacBook Air 13\" Chip M3 (16GB RAM Unificada, 512GB SSD) Medianoche",
      brand: "Apple",
      description: "Potencia asombrosa con el chip Apple M3 de 8 núcleos de CPU y 10 núcleos de GPU. Pantalla Liquid Retina de 13.6 pulgadas con 500 nits de brillo, MagSafe 3 y hasta 18 horas de batería.",
      priceUSD: 1099.00,
      compareAtPriceUSD: 1299.00,
      weightLbs: 2.70,
      dimensions: "11.97 x 8.46 x 0.44 in",
      stock: 14,
      rating: 4.9,
      reviewCount: 382,
      badge: "⚡ M3 SILICON",
      isFeatured: true,
      categoryId: catComputing.id,
      categorySlug: "laptops-computing",
      hsCode: "8471.30.01",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      specs: {
        "Procesador": "Apple M3 (8-core CPU, 10-core GPU)",
        "Memoria": "16GB Memoria Unificada de Alta Velocidad",
        "Almacenamiento": "512GB SSD PCIe NVMe",
        "Pantalla": "13.6\" Liquid Retina (2560x1664) True Tone",
        "Batería": "Hasta 18 horas de navegación inalámbrica",
        "Puertos": "MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm",
      },
    },
    {
      sku: "TRD-SNY-WH1000XM5",
      slug: "sony-wh-1000xm5-noise-cancelling-headphones",
      name: "Sony WH-1000XM5 Audífonos Inalámbricos Hi-Res con Cancelación de Ruido Líder",
      brand: "Sony",
      description: "Audífonos de diadema premium con dos procesadores y 8 micrófonos para cancelación de ruido insuperable. Controladores de 30mm de fibra de carbono, códec LDAC y 30 horas de reproducción.",
      priceUSD: 349.99,
      compareAtPriceUSD: 399.99,
      weightLbs: 0.55,
      dimensions: "8.85 x 3.03 x 10.51 in",
      stock: 28,
      rating: 4.9,
      reviewCount: 1240,
      badge: "🎧 TOP AUDIO",
      isFeatured: true,
      categoryId: catAudio.id,
      categorySlug: "audio-spatial-sound",
      hsCode: "8518.30.20",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      specs: {
        "Cancelación": "ANC Híbrido con Procesador V1 + QN1",
        "Autonomía": "Hasta 30 horas con ANC encendido",
        "Conectividad": "Bluetooth 5.2 multipunto (2 dispositivos)",
        "Audio": "Hi-Res Audio Wireless con LDAC y DSEE Extreme",
      },
    },
    {
      sku: "TRD-BAS-GAN100W",
      slug: "baseus-gan5-pro-100w-fast-charger",
      name: "Baseus GaN5 Pro Cargador Rápido 100W (2C+2A) Plegable con Cable 100W",
      brand: "Baseus",
      description: "Tecnología de Nitruro de Galio GaN5 de 5ta generación. Carga laptops a 100W máximo, teléfono y tablet simultáneamente gracias a la distribución inteligente BPS 2.0.",
      priceUSD: 49.99,
      compareAtPriceUSD: 69.99,
      weightLbs: 0.62,
      dimensions: "2.95 x 2.16 x 1.18 in",
      stock: 95,
      rating: 4.8,
      reviewCount: 940,
      badge: "⚡ DGA EXENTO",
      isFeatured: true,
      categoryId: catCharging.id,
      categorySlug: "smart-charging",
      hsCode: "8504.40.40",
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      specs: {
        "Potencia Total": "100W Max GaN5 Architecture",
        "Puertos": "2x USB-C (100W PD) + 2x USB-A (60W QC)",
        "Compatibilidad": "MacBook Pro, iPhone 16/15, Galaxy S24, Steam Deck",
        "Accesorios": "Incluye cable USB-C a USB-C E-Marker 100W de 1.5m",
      },
    },
    {
      sku: "TRD-BAS-BLADE20K",
      slug: "baseus-blade-hd-20000mah-100w-powerbank",
      name: "Baseus Blade Ultra-Delgada 20,000mAh 100W Power Bank con Pantalla Digital",
      brand: "Baseus",
      description: "Perfil hiper-fino de apenas 18mm con pantalla digital LED con estado de voltaje, corriente y tiempo restante. Diseñada para caber en fundas de laptop.",
      priceUSD: 79.99,
      compareAtPriceUSD: 99.99,
      weightLbs: 1.08,
      dimensions: "6.38 x 5.24 x 0.71 in",
      stock: 54,
      rating: 4.9,
      reviewCount: 615,
      badge: "🔋 ULTRA DELGADA",
      isFeatured: true,
      categoryId: catCharging.id,
      categorySlug: "smart-charging",
      hsCode: "8507.60.00",
      images: [
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      specs: {
        "Capacidad": "20,000mAh / 74Wh (Apta para vuelos TSA)",
        "Salida Máxima": "100W Power Delivery bidireccional",
        "Grosor": "18mm (Diseño ultrafino para maletín)",
        "Pantalla": "Status LED de watts, voltios y minutos restantes",
      },
    },
    {
      sku: "TRD-ANK-DOCK12",
      slug: "anker-powerexpand-elite-13-in-1-thunderbolt-dock",
      name: "Anker PowerExpand Elite 13-en-1 Thunderbolt 4 Docking Station 85W Passthrough",
      brand: "Anker",
      description: "Convierte un solo puerto Thunderbolt en 13 conexiones: HDMI 4K@60Hz, DisplayPort, Ethernet Gigabit, SD/TF UHS-II, audio 3.5mm y carga rápida para tu laptop.",
      priceUSD: 189.99,
      compareAtPriceUSD: 249.99,
      weightLbs: 1.85,
      dimensions: "4.96 x 3.50 x 1.61 in",
      stock: 19,
      rating: 4.7,
      reviewCount: 420,
      badge: "⚡ DGA EXENTO",
      isFeatured: false,
      categoryId: catHubs.id,
      categorySlug: "hubs-docks",
      hsCode: "8471.80.10",
      images: [
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      specs: {
        "Puertos": "13 puertos (Thunderbolt 4, HDMI, DisplayPort, Gigabit, SD)",
        "Resolución": "Soporte dual 4K@60Hz o single 8K@30Hz",
        "Alimentación": "Fuente incluida de 180W, 85W de carga a laptop",
      },
    },
    {
      sku: "TRD-LOG-MXMASTER3S",
      slug: "logitech-mx-master-3s-performance-wireless-mouse",
      name: "Logitech MX Master 3S Mouse Inalámbrico de Rendimiento Ergonómico 8K DPI",
      brand: "Logitech",
      description: "El estándar de oro para programadores y diseñadores. Clics silenciosos, sensor Darkfield de 8,000 DPI con rastreo en cristal y rueda electromagnética MagSpeed que gira 1,000 líneas por segundo.",
      priceUSD: 99.99,
      compareAtPriceUSD: 119.99,
      weightLbs: 0.72,
      dimensions: "4.92 x 3.31 x 2.01 in",
      stock: 62,
      rating: 4.9,
      reviewCount: 2890,
      badge: "⚡ DGA EXENTO",
      isFeatured: true,
      categoryId: catComputing.id,
      categorySlug: "laptops-computing",
      hsCode: "8471.60.20",
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      specs: {
        "Sensor": "Darkfield 8000 DPI (funciona sobre cristal)",
        "Rueda de Scroll": "MagSpeed electromagnética inteligente",
        "Batería": "Hasta 70 días con carga completa USB-C",
        "Conectividad": "Bluetooth Low Energy + Logi Bolt USB",
      },
    },
    {
      sku: "TRD-SNY-DUALSENSE",
      slug: "sony-playstation-5-dualsense-wireless-controller",
      name: "Sony PlayStation 5 DualSense Wireless Controller Midnight Black",
      brand: "Sony",
      description: "Siente cada acción del juego con retroalimentación háptica inmersiva, gatillos adaptativos dinámicos con resistencia física y micrófono integrado para chat instantáneo.",
      priceUSD: 69.99,
      compareAtPriceUSD: 74.99,
      weightLbs: 0.95,
      dimensions: "6.30 x 4.17 x 2.60 in",
      stock: 45,
      rating: 4.8,
      reviewCount: 3120,
      badge: "🎮 GAMING PRO",
      isFeatured: true,
      categoryId: catGaming.id,
      categorySlug: "gaming",
      hsCode: "9504.50.00",
      images: [
        "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      specs: {
        "Gatillos": "Adaptativos con tensión variable L2/R2",
        "Vibración": "Háptica de doble accionador háptico",
        "Conexión": "Bluetooth 5.1 + USB-C a PC/Mac/PS5",
      },
    },
    {
      sku: "TRD-APL-WATCH9",
      slug: "apple-watch-series-9-gps-45mm-midnight",
      name: "Apple Watch Series 9 GPS 45mm Caja de Aluminio Medianoche",
      brand: "Apple",
      description: "Impulsado por el chip S9 SiP con control por gesto de doble toque sin tocar la pantalla. Pantalla dos veces más brillante (2000 nits) y rastreo avanzado de salud cardiaca.",
      priceUSD: 379.00,
      compareAtPriceUSD: 429.00,
      weightLbs: 0.48,
      dimensions: "1.77 x 1.50 x 0.42 in",
      stock: 22,
      rating: 4.9,
      reviewCount: 880,
      badge: "⌚ SMARTWATCH",
      isFeatured: false,
      categoryId: catComputing.id,
      categorySlug: "laptops-computing",
      hsCode: "8517.62.00",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      specs: {
        "Chip": "Apple S9 SiP de 64 bits con motor neuronal de 4 núcleos",
        "Pantalla": "OLED Retina siempre activa de hasta 2,000 nits",
        "Salud": "Sensor de oxígeno en sangre, ECG y sensor de temperatura",
      },
    },
    {
      sku: "TRD-NIN-OLED",
      slug: "nintendo-switch-oled-model-white",
      name: "Nintendo Switch Modelo OLED con Joy-Con Blanco y Pantalla de 7 Pulgadas",
      brand: "Nintendo",
      description: "Colores intensos y contraste de negros profundos en una pantalla OLED de 7 pulgadas. Soporte ancho ajustable, base con puerto LAN por cable integrado y 64GB de memoria interna.",
      priceUSD: 339.99,
      compareAtPriceUSD: 349.99,
      weightLbs: 3.20,
      dimensions: "9.50 x 4.00 x 0.55 in",
      stock: 18,
      rating: 4.9,
      reviewCount: 4210,
      badge: "⭐ TOP SELLER",
      isFeatured: true,
      categoryId: catGaming.id,
      categorySlug: "gaming",
      hsCode: "9504.50.00",
      images: [
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
      specs: {
        "Pantalla": "OLED táctil de 7.0 pulgadas (1280x720)",
        "Audio": "Altavoces integrados con audio optimizado",
        "Base": "Dock con salida HDMI, 2x USB y puerto LAN RJ45",
      },
    },
    {
      sku: "TRD-AMZ-ECHO5",
      slug: "amazon-echo-show-8-hd-smart-display",
      name: "Amazon Echo Show 8 (3ra Gen) Pantalla Táctil HD con Audio Espacial y Alexa",
      brand: "Amazon",
      description: "Pantalla táctil HD de 8 pulgadas con audio espacial que llena la habitación. Cámara de 13 MP centrada automáticamente para videollamadas nítidas y hub de domótica Zigbee/Matter.",
      priceUSD: 149.99,
      compareAtPriceUSD: 179.99,
      weightLbs: 2.30,
      dimensions: "7.90 x 5.50 x 4.20 in",
      stock: 35,
      rating: 4.7,
      reviewCount: 780,
      badge: "⚡ DGA EXENTO",
      isFeatured: false,
      categoryId: catSmartHome.id,
      categorySlug: "smart-home",
      hsCode: "8517.62.10",
      images: [
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      ],
      videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
      specs: {
        "Pantalla": "Táctil HD 8\" (1280 x 800) con ajuste de color ambiental",
        "Audio": "2 controladores de neodimio de 2\" con radiador de bajos",
        "Cámara": "13 MP con encuadre automático y cubierta física",
        "Smart Home": "Hub integrado compatible con Matter, Thread y Zigbee",
      },
    },
  ];

  const createdProducts: any[] = [];
  for (const item of productsData) {
    const p = await prisma.product.create({
      data: {
        sku: item.sku,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        description: item.description,
        priceUSD: item.priceUSD,
        compareAtPriceUSD: item.compareAtPriceUSD,
        weightLbs: item.weightLbs,
        dimensions: item.dimensions,
        stock: item.stock,
        rating: item.rating,
        reviewCount: item.reviewCount,
        badge: item.badge,
        isFeatured: item.isFeatured,
        categoryId: item.categoryId,
        hsCode: item.hsCode,
        images: item.images,
        videoUrl: item.videoUrl,
        specs: item.specs,
      },
    });
    createdProducts.push({ ...p, categorySlug: item.categorySlug });
  }

  console.log(`✅ ${createdProducts.length} Tech Products created.`);

  // 7. Seed 3 Live Orders across distinct US-to-RD Logistics stages
  // Order 1: Delivered (GaN Charger + Mouse) -> Under $200 (DGA Exempt)
  const ord1Lines: QuoteLineInput[] = [
    {
      productId: createdProducts[2].id, // Baseus GaN 100W ($49.99)
      name: createdProducts[2].name,
      unitPriceUSD: Number(createdProducts[2].priceUSD),
      unitWeightLbs: Number(createdProducts[2].weightLbs),
      quantity: 1,
      categorySlug: createdProducts[2].categorySlug,
    },
    {
      productId: createdProducts[5].id, // MX Master 3S ($99.99)
      name: createdProducts[5].name,
      unitPriceUSD: Number(createdProducts[5].priceUSD),
      unitWeightLbs: Number(createdProducts[5].weightLbs),
      quantity: 1,
      categorySlug: createdProducts[5].categorySlug,
    },
  ];

  const ord1Quote = quoteOrder(ord1Lines, ShippingMethod.AEREO_EXPRESS, USD_TO_DOP_RATE);

  const orderDelivered = await prisma.order.create({
    data: {
      orderNumber: "TRD-2026-1001",
      userId: customerUser.id,
      shippingAddressId: customerAddressSantoDomingo.id,
      shippingMethod: ShippingMethod.AEREO_EXPRESS,
      status: OrderStatus.DELIVERED,
      currentStage: TrackingStage.DELIVERED,
      currency: Currency.USD,
      exchangeRate: ord1Quote.exchangeRate,
      subtotalUSD: ord1Quote.subtotalUSD,
      shippingCostUSD: ord1Quote.shippingCostUSD,
      insuranceUSD: ord1Quote.insuranceUSD,
      dutyUSD: ord1Quote.dutyUSD,
      itbisUSD: ord1Quote.itbisUSD,
      totalUSD: ord1Quote.totalUSD,
      totalDOP: ord1Quote.totalDOP,
      totalWeightLbs: ord1Quote.totalWeightLbs,
      isDgaExempt: ord1Quote.isDgaExempt,
      airWaybill: "MIA-SDQ-778401",
      idempotencyKey: "idemp_ord_1001_seed",
      paymentStatus: PaymentStatus.COMPLETED,
      paymentIntentId: "pi_seed_1001_completed",
      estimatedDelivery: new Date("2026-10-12T16:00:00Z"),
      createdAt: new Date("2026-10-06T14:30:00Z"),
      items: {
        create: ord1Quote.lines.map((l) => ({
          productId: l.productId,
          productName: l.name,
          quantity: l.quantity,
          unitPriceUSD: l.unitPriceUSD,
          lineTotalUSD: l.lineTotalUSD,
          unitWeightLbs: l.unitWeightLbs,
        })),
      },
      trackingEvents: {
        create: [
          {
            stage: TrackingStage.ORDER_PLACED,
            title: "Pedido confirmado",
            description: "Pago aprobado vía Stripe. Casillero de destino asignado: TRD-MIA-8842.",
            location: "TiendaRD · Cloud Platform",
            facility: "WEB-CHECKOUT",
            occurredAt: new Date("2026-10-06T14:32:00Z"),
          },
          {
            stage: TrackingStage.US_WAREHOUSE_RECEIVED,
            title: "Recibido en almacén Miami, FL",
            description: "Paquete verificado y pesado en báscula certificada Doral FL (1.34 lbs).",
            location: "Doral, Miami FL 33172",
            facility: "MIA-DORAL-WH1",
            occurredAt: new Date("2026-10-07T11:15:00Z"),
          },
          {
            stage: TrackingStage.AIR_MARITIME_TRANSIT,
            title: "Despachado en vuelo de carga MIA → SDQ",
            description: "Manifiesto de carga aéreo consolidado en vuelo Amerijet AJT-402.",
            location: "Aeropuerto Internacional de Miami (MIA)",
            facility: "MIA-CARGO-BAY",
            occurredAt: new Date("2026-10-08T18:40:00Z"),
          },
          {
            stage: TrackingStage.CUSTOMS_CLEARANCE_DR,
            title: "Aduana DGA: Liberado 0% Arancel (Decreto 402-05)",
            description: "Inspección no intrusiva de rayos X completada. Subtotal $149.98 USD exento de ITBIS.",
            location: "Terminal AILA · Santo Domingo",
            facility: "SDQ-AILA-DGA",
            occurredAt: new Date("2026-10-09T09:20:00Z"),
          },
          {
            stage: TrackingStage.LOCAL_COURIER_DISPATCH,
            title: "En ruta de entrega local con EPS Courier",
            description: "Asignado a mensajería motorizada para entrega en Piantini, Distrito Nacional.",
            location: "Centro de Clasificación EPS · Av. Winston Churchill",
            facility: "EPS-SDQ-CENTRAL",
            occurredAt: new Date("2026-10-10T08:30:00Z"),
          },
          {
            stage: TrackingStage.DELIVERED,
            title: "Entregado satisfactoriamente",
            description: "Recibido en portería Torre Altagracia. Firma digital registrada por Pedro Medina.",
            location: "Piantini, Santo Domingo, D.N.",
            facility: "FINAL-DELIVERY",
            occurredAt: new Date("2026-10-10T12:45:00Z"),
          },
        ],
      },
    },
  });

  // Order 2: In Transit / Customs Clearance (Sony WH-1000XM5) -> Over $200 (DGA Tariff + ITBIS)
  const ord2Lines: QuoteLineInput[] = [
    {
      productId: createdProducts[1].id, // Sony XM5 ($349.99)
      name: createdProducts[1].name,
      unitPriceUSD: Number(createdProducts[1].priceUSD),
      unitWeightLbs: Number(createdProducts[1].weightLbs),
      quantity: 1,
      categorySlug: createdProducts[1].categorySlug,
    },
  ];

  const ord2Quote = quoteOrder(ord2Lines, ShippingMethod.PRIORITY_COURIER, USD_TO_DOP_RATE);

  const orderCustoms = await prisma.order.create({
    data: {
      orderNumber: "TRD-2026-1002",
      userId: customerUser.id,
      shippingAddressId: customerAddressSantoDomingo.id,
      shippingMethod: ShippingMethod.PRIORITY_COURIER,
      status: OrderStatus.IN_TRANSIT,
      currentStage: TrackingStage.CUSTOMS_CLEARANCE_DR,
      currency: Currency.USD,
      exchangeRate: ord2Quote.exchangeRate,
      subtotalUSD: ord2Quote.subtotalUSD,
      shippingCostUSD: ord2Quote.shippingCostUSD,
      insuranceUSD: ord2Quote.insuranceUSD,
      dutyUSD: ord2Quote.dutyUSD,
      itbisUSD: ord2Quote.itbisUSD,
      totalUSD: ord2Quote.totalUSD,
      totalDOP: ord2Quote.totalDOP,
      totalWeightLbs: ord2Quote.totalWeightLbs,
      isDgaExempt: ord2Quote.isDgaExempt,
      airWaybill: "MIA-SDQ-849202",
      idempotencyKey: "idemp_ord_1002_seed",
      paymentStatus: PaymentStatus.COMPLETED,
      paymentIntentId: "pi_seed_1002_completed",
      estimatedDelivery: new Date(Date.now() + 86400000 * 2), // in 2 days
      createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      items: {
        create: ord2Quote.lines.map((l) => ({
          productId: l.productId,
          productName: l.name,
          quantity: l.quantity,
          unitPriceUSD: l.unitPriceUSD,
          lineTotalUSD: l.lineTotalUSD,
          unitWeightLbs: l.unitWeightLbs,
        })),
      },
      trackingEvents: {
        create: [
          {
            stage: TrackingStage.ORDER_PLACED,
            title: "Pedido confirmado",
            description: "Orden recibida con modalidad Priority Courier Directo (24-48h).",
            location: "TiendaRD · Miami Gateway",
            facility: "WEB-CHECKOUT",
            occurredAt: new Date(Date.now() - 86400000 * 3),
          },
          {
            stage: TrackingStage.US_WAREHOUSE_RECEIVED,
            title: "Recibido e inventariado en Doral, FL",
            description: "Empaque original de fábrica sellado verificado. Código arancelario HS 8518.30.20 adjunto.",
            location: "Doral, Miami FL 33172",
            facility: "MIA-DORAL-WH1",
            occurredAt: new Date(Date.now() - 86400000 * 2),
          },
          {
            stage: TrackingStage.AIR_MARITIME_TRANSIT,
            title: "Arribo de vuelo de carga en AILA",
            description: "Descargado en rampa de aduanas de Santo Domingo. Guía Aérea MIA-SDQ-849202 activa.",
            location: "Aeropuerto Internacional de Las Américas (SDQ)",
            facility: "SDQ-RAMP-02",
            occurredAt: new Date(Date.now() - 86400000 * 1),
          },
          {
            stage: TrackingStage.CUSTOMS_CLEARANCE_DR,
            title: "Aduana DGA: Liquidación de Impuestos en Proceso",
            description: "Valor CIF mayor a $200 USD. Arancel de importación y 18% ITBIS pre-calculados y validados por TiendaRD.",
            location: "Dirección General de Aduanas (DGA AILA)",
            facility: "SDQ-DGA-CLEARANCE",
            occurredAt: new Date(Date.now() - 3600000 * 4),
          },
        ],
      },
    },
  });

  // Order 3: US Warehouse Received (Apple MacBook Air M3) -> Freshly Received in Miami
  const ord3Lines: QuoteLineInput[] = [
    {
      productId: createdProducts[0].id, // MacBook Air M3 ($1,099.00)
      name: createdProducts[0].name,
      unitPriceUSD: Number(createdProducts[0].priceUSD),
      unitWeightLbs: Number(createdProducts[0].weightLbs),
      quantity: 1,
      categorySlug: createdProducts[0].categorySlug,
    },
  ];

  const ord3Quote = quoteOrder(ord3Lines, ShippingMethod.AEREO_EXPRESS, USD_TO_DOP_RATE);

  const orderWarehouse = await prisma.order.create({
    data: {
      orderNumber: "TRD-2026-1003",
      userId: customerUser.id,
      shippingAddressId: customerAddressSantiago.id,
      shippingMethod: ShippingMethod.AEREO_EXPRESS,
      status: OrderStatus.PROCESSING,
      currentStage: TrackingStage.US_WAREHOUSE_RECEIVED,
      currency: Currency.USD,
      exchangeRate: ord3Quote.exchangeRate,
      subtotalUSD: ord3Quote.subtotalUSD,
      shippingCostUSD: ord3Quote.shippingCostUSD,
      insuranceUSD: ord3Quote.insuranceUSD,
      dutyUSD: ord3Quote.dutyUSD,
      itbisUSD: ord3Quote.itbisUSD,
      totalUSD: ord3Quote.totalUSD,
      totalDOP: ord3Quote.totalDOP,
      totalWeightLbs: ord3Quote.totalWeightLbs,
      isDgaExempt: ord3Quote.isDgaExempt,
      airWaybill: "MIA-STI-994103",
      idempotencyKey: "idemp_ord_1003_seed",
      paymentStatus: PaymentStatus.COMPLETED,
      paymentIntentId: "pi_seed_1003_completed",
      estimatedDelivery: new Date(Date.now() + 86400000 * 4), // in 4 days
      createdAt: new Date(Date.now() - 3600000 * 18), // 18 hours ago
      items: {
        create: ord3Quote.lines.map((l) => ({
          productId: l.productId,
          productName: l.name,
          quantity: l.quantity,
          unitPriceUSD: l.unitPriceUSD,
          lineTotalUSD: l.lineTotalUSD,
          unitWeightLbs: l.unitWeightLbs,
        })),
      },
      trackingEvents: {
        create: [
          {
            stage: TrackingStage.ORDER_PLACED,
            title: "Pedido confirmado",
            description: "Compra realizada con entrega en oficina de Santiago vía casillero BM Cargo.",
            location: "TiendaRD · Online Checkout",
            facility: "WEB-CHECKOUT",
            occurredAt: new Date(Date.now() - 3600000 * 18),
          },
          {
            stage: TrackingStage.US_WAREHOUSE_RECEIVED,
            title: "Recibido en almacén Miami FL (2.70 lbs)",
            description: "Equipo clasificado bajo HS 8471.30.01 (0% arancel computadoras). Preparando consolidación para vuelo nocturno.",
            location: "Doral, Miami FL 33172",
            facility: "MIA-DORAL-WH1",
            occurredAt: new Date(Date.now() - 3600000 * 4),
          },
        ],
      },
    },
  });

  console.log("✅ 3 Orders seeded across different logistics stages:");
  console.log(`   - ${orderDelivered.orderNumber}: DELIVERED (DGA Exempt < $200 USD)`);
  console.log(`   - ${orderCustoms.orderNumber}: CUSTOMS_CLEARANCE_DR (DGA Tariff + ITBIS)`);
  console.log(`   - ${orderWarehouse.orderNumber}: US_WAREHOUSE_RECEIVED (Miami FL Transit)`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
