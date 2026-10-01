/**
 * OmniPOS Initial Database & Catalog Seed Data
 * Specialized for Tech Retail, Serialized Devices & Variant Management
 */

export const INITIAL_USERS = [
  { id: 'usr-1', name: 'Sofia Rodriguez', email: 'sofia.r@omnipos.io', role: 'CAJERO', pin: '1234', avatar: 'SR' },
  { id: 'usr-2', name: 'Carlos Mendoza', email: 'carlos.m@omnipos.io', role: 'SUPERVISOR', pin: '4321', avatar: 'CM' },
  { id: 'usr-3', name: 'Pedro Medina', email: 'p.medina@omnipos.io', role: 'ADMIN', pin: '0000', avatar: 'PM' }
];

export const INITIAL_CUSTOMERS = [
  { id: 'cust-cf', taxId: '000-0000000-0', name: 'Consumidor Final', email: '', phone: '', isWholesale: false },
  { id: 'cust-1', taxId: '131-89241-1', name: 'Tech Solutions Dominicana SRL', email: 'compras@techsolutions.com', phone: '809-555-0192', isWholesale: true },
  { id: 'cust-2', taxId: '101-76492-3', name: 'Pedro Medina (Personal)', email: 'pedro@developer.io', phone: '829-555-8831', isWholesale: false },
  { id: 'cust-3', taxId: '130-99812-4', name: 'Grupo Inversiones Alpha', email: 'finanzas@grupoalpha.do', phone: '809-555-3344', isWholesale: true }
];

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Todos los Equipos', icon: 'LayoutGrid' },
  { id: 'apple', name: 'Apple Ecosystem', icon: 'Apple' },
  { id: 'smartphones', name: 'Smartphones & 5G', icon: 'Smartphone' },
  { id: 'laptops', name: 'Laptops & Workstations', icon: 'Laptop' },
  { id: 'audio', name: 'Audio & Wearables', icon: 'Headphones' },
  { id: 'gaming', name: 'Consolas & Gaming', icon: 'Gamepad2' },
  { id: 'accessories', name: 'Accesorios & Carga', icon: 'Cable' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-iphone-15-promax',
    sku: 'APL-IP15PM',
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'apple',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    description: 'Chip A17 Pro, chasis de titanio de grado aeroespacial y sistema de cámaras Pro con zoom óptico 5x.',
    variants: [
      {
        id: 'var-ip15pm-nat-256',
        skuVariant: 'APL-IP15PM-NT-256',
        name: 'Titanio Natural - 256GB',
        color: 'Natural Titanium',
        storage: '256GB',
        condition: 'NUEVO',
        price: 1199.00,
        cost: 920.00,
        stock: 4,
        serials: ['354892110485912', '354892110485913', '354892110485914', '354892110485915']
      },
      {
        id: 'var-ip15pm-blu-512',
        skuVariant: 'APL-IP15PM-BL-512',
        name: 'Titanio Azul - 512GB',
        color: 'Blue Titanium',
        storage: '512GB',
        condition: 'NUEVO',
        price: 1399.00,
        cost: 1050.00,
        stock: 2,
        serials: ['354892110499001', '354892110499002']
      }
    ]
  },
  {
    id: 'prod-macbook-pro-16',
    sku: 'APL-MBP16-M3',
    name: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    category: 'laptops',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    description: 'CPU de 14 núcleos, GPU de 30 núcleos, 36 GB de memoria unificada y SSD de 1 TB.',
    variants: [
      {
        id: 'var-mbp16-blk-1tb',
        skuVariant: 'APL-MBP16-SB-1TB',
        name: 'Space Black - 36GB / 1TB',
        color: 'Space Black',
        storage: '1TB SSD',
        condition: 'NUEVO',
        price: 3499.00,
        cost: 2780.00,
        stock: 3,
        serials: ['C02G9012MD6R', 'C02G9013MD6S', 'C02G9014MD6T']
      }
    ]
  },
  {
    id: 'prod-ipad-pro-13-m4',
    sku: 'APL-IPAD-M4-13',
    name: 'iPad Pro 13" Chip M4 OLED',
    brand: 'Apple',
    category: 'apple',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    description: 'Pantalla Ultra Retina XDR con tecnología OLED en tándem y el nuevo lápiz Apple Pencil Pro.',
    variants: [
      {
        id: 'var-ipad13-slv-256',
        skuVariant: 'APL-IPAD13-SL-256',
        name: 'Silver - 256GB Wi-Fi',
        color: 'Plata',
        storage: '256GB',
        condition: 'NUEVO',
        price: 1299.00,
        cost: 1010.00,
        stock: 5,
        serials: ['DMPG7008Q16M', 'DMPG7008Q16N', 'DMPG7008Q16O', 'DMPG7008Q16P', 'DMPG7008Q16Q']
      }
    ]
  },
  {
    id: 'prod-galaxy-s24-ultra',
    sku: 'SAM-S24U-512',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    description: 'Galaxy AI incorporado, marco de titanio, pantalla plana Dynamic AMOLED 2X y S Pen integrado.',
    variants: [
      {
        id: 'var-s24u-gry-512',
        skuVariant: 'SAM-S24U-TG-512',
        name: 'Titanium Gray - 512GB',
        color: 'Titanium Gray',
        storage: '512GB',
        condition: 'NUEVO',
        price: 1299.00,
        cost: 980.00,
        stock: 3,
        serials: ['359871049281745', '359871049281746', '359871049281747']
      },
      {
        id: 'var-s24u-blk-256-rb',
        skuVariant: 'SAM-S24U-TB-256-RB',
        name: 'Titanium Black - 256GB (Reacondicionado A)',
        color: 'Titanium Black',
        storage: '256GB',
        condition: 'REACONDICIONADO_A',
        price: 949.00,
        cost: 650.00,
        stock: 1, // Alerta stock bajo
        serials: ['359871049299901']
      }
    ]
  },
  {
    id: 'prod-ps5-slim',
    sku: 'SONY-PS5-SLIM',
    name: 'PlayStation 5 Slim 1TB',
    brand: 'Sony',
    category: 'gaming',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80',
    description: 'Diseño más delgado con lector de discos Ultra HD Blu-ray y 1 TB de almacenamiento SSD ultra rápido.',
    variants: [
      {
        id: 'var-ps5-disc-1tb',
        skuVariant: 'SONY-PS5-SLIM-DISC',
        name: 'Edición Disco - 1TB',
        color: 'Blanco / Negro',
        storage: '1TB',
        condition: 'NUEVO',
        price: 499.00,
        cost: 410.00,
        stock: 6,
        serials: ['AK1982736412', 'AK1982736413', 'AK1982736414', 'AK1982736415', 'AK1982736416', 'AK1982736417']
      }
    ]
  },
  {
    id: 'prod-airpods-pro-2',
    sku: 'APL-APP2-USBC',
    name: 'AirPods Pro (2da Generación)',
    brand: 'Apple',
    category: 'audio',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
    description: 'Cancelación Activa de Ruido 2x superior, audio adaptativo y estuche MagSafe USB-C.',
    variants: [
      {
        id: 'var-app2-usbc',
        skuVariant: 'APL-APP2-USBC-WHT',
        name: 'Estuche MagSafe USB-C',
        color: 'Blanco',
        storage: 'N/A',
        condition: 'NUEVO',
        price: 249.00,
        cost: 175.00,
        stock: 8,
        serials: ['H93G189028', 'H93G189029', 'H93G189030', 'H93G189031', 'H93G189032', 'H93G189033', 'H93G189034', 'H93G189035']
      }
    ]
  },
  {
    id: 'prod-sony-wh1000xm5',
    sku: 'SONY-WH1000XM5',
    name: 'Sony WH-1000XM5 Noise Canceling',
    brand: 'Sony',
    category: 'audio',
    hasSerial: true,
    warrantyDays: 365,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    description: 'Los auriculares premium con la mejor cancelación de ruido de la industria y 30 horas de batería.',
    variants: [
      {
        id: 'var-xm5-blk',
        skuVariant: 'SONY-WH1000XM5-BLK',
        name: 'Negro Mate',
        color: 'Negro',
        storage: 'N/A',
        condition: 'NUEVO',
        price: 399.00,
        cost: 265.00,
        stock: 4,
        serials: ['SN58190281', 'SN58190282', 'SN58190283', 'SN58190284']
      }
    ]
  },
  {
    id: 'prod-anker-prime-20k',
    sku: 'ANK-PRIME-20K',
    name: 'Anker Prime 20,000mAh 200W',
    brand: 'Anker',
    category: 'accessories',
    hasSerial: false,
    warrantyDays: 180,
    imageUrl: 'https://images.unsplash.com/photo-1609592424368-2321c17e0892?w=400&q=80',
    description: 'Batería externa de alta potencia con pantalla digital inteligente y salida ultrarrápida de 200W.',
    variants: [
      {
        id: 'var-ank20k-gry',
        skuVariant: 'ANK-PRIME-20K-GRY',
        name: 'Gris Grafito',
        color: 'Gris',
        storage: '20,000 mAh',
        condition: 'NUEVO',
        price: 129.99,
        cost: 78.50,
        stock: 12,
        serials: []
      }
    ]
  }
];

export const INITIAL_CASH_REGISTER = {
  id: 'reg-01',
  terminalName: 'iPad Pro Command Terminal #1',
  userId: 'usr-1',
  openingFloat: 250.00, // $250.00 fondo de caja
  openedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  isClosed: false,
  transactions: [
    {
      id: 'tx-0',
      type: 'APERTURA_FONDO',
      amount: 250.00,
      justification: 'Fondo de apertura de turno matutino',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString()
    },
    {
      id: 'tx-1',
      type: 'VENTA_EFECTIVO',
      amount: 249.00,
      justification: 'Venta Factura #B0200001080 (AirPods Pro)',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toLocaleTimeString()
    }
  ]
};

export const INITIAL_SALES_HISTORY = [
  {
    id: 'inv-1080',
    invoiceNumber: 'B0200001080',
    invoiceType: 'TICKET_CONSUMIDOR_FINAL',
    cashierName: 'Sofia Rodriguez',
    customerName: 'Consumidor Final',
    subtotal: 211.02,
    taxAmount: 37.98,
    discountAmount: 0.00,
    total: 249.00,
    paymentMethod: 'EFECTIVO',
    cashPaid: 250.00,
    cardPaid: 0.00,
    changeGiven: 1.00,
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'it-1',
        name: 'AirPods Pro (2da Gen) - USB-C',
        quantity: 1,
        unitPrice: 249.00,
        unitCost: 175.00,
        serialNumber: 'H93G189028',
        lineTotal: 249.00
      }
    ]
  },
  {
    id: 'inv-1081',
    invoiceNumber: 'B0200001081',
    invoiceType: 'CREDITO_FISCAL_B01',
    cashierName: 'Sofia Rodriguez',
    customerName: 'Tech Solutions Dominicana SRL',
    subtotal: 2965.25,
    taxAmount: 533.75,
    discountAmount: 0.00,
    total: 3499.00,
    paymentMethod: 'TARJETA_CREDITO',
    cashPaid: 0.00,
    cardPaid: 3499.00,
    changeGiven: 0.00,
    createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'it-2',
        name: 'MacBook Pro 16" M3 Max - 36GB / 1TB',
        quantity: 1,
        unitPrice: 3499.00,
        unitCost: 2780.00,
        serialNumber: 'C02G9012MD6R',
        lineTotal: 3499.00
      }
    ]
  }
];
