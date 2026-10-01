import React, { useState, useEffect } from 'react';
import TopMenuBar from './components/TopMenuBar';
import DynamicIsland from './components/DynamicIsland';
import ProductCatalog from './components/ProductCatalog';
import LiveTicket from './components/LiveTicket';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import InventoryModal from './components/InventoryModal';
import CashManagementModal from './components/CashManagementModal';
import AnalyticsModal from './components/AnalyticsModal';
import AuditTrailModal from './components/AuditTrailModal';
import SpotlightSearch from './components/SpotlightSearch';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_CASH_REGISTER, 
  INITIAL_SALES_HISTORY 
} from './data/initialData';

import { 
  queueOfflineSale, 
  getPendingOfflineSales, 
  clearOfflineSale 
} from './utils/indexedDB';

export default function App() {
  // Core Operational States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeUser, setActiveUser] = useState(INITIAL_USERS[0]); // Sofia Rodriguez (Cajero)
  const [selectedCustomer, setSelectedCustomer] = useState(INITIAL_CUSTOMERS[0]); // Consumidor Final
  const [invoiceType, setInvoiceType] = useState('TICKET_CONSUMIDOR_FINAL');
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });

  // Cash Register & Sales History
  const [cashRegister, setCashRegister] = useState(INITIAL_CASH_REGISTER);
  const [salesHistory, setSalesHistory] = useState(INITIAL_SALES_HISTORY);
  
  // Audit Trail Records
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString(),
      userName: 'Sofia Rodriguez',
      role: 'CAJERO',
      action: 'APERTURA_CAJA',
      resource: 'Gaveta Terminal #1',
      details: 'Fondo Inicial de Caja: $250.00',
      hash: 'a8b1c4e920d3f821'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toLocaleTimeString(),
      userName: 'Sofia Rodriguez',
      role: 'CAJERO',
      action: 'EMISION_FACTURA',
      resource: 'Invoice #B0200001080',
      details: 'AirPods Pro 2 - Total: $249.00 (EFECTIVO)',
      hash: '3f7a1c8900d2b144'
    }
  ]);

  // Dynamic Island Notification
  const [notification, setNotification] = useState(null);

  // Modals Visibility
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptInvoice, setActiveReceiptInvoice] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCashManagementOpen, setIsCashManagementOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Offline-First PWA State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Calculate live cash in drawer
  const cashSalesTotal = cashRegister.transactions
    .filter(t => t.type === 'VENTA_EFECTIVO')
    .reduce((sum, t) => sum + t.amount, 0);
  const cashInTotal = cashRegister.transactions
    .filter(t => t.type === 'ENTRADA_AJUSTE')
    .reduce((sum, t) => sum + t.amount, 0);
  const cashOutTotal = cashRegister.transactions
    .filter(t => t.type === 'RETIRO_JUSTIFICADO')
    .reduce((sum, t) => sum + t.amount, 0);
  const cashInDrawer = +(cashRegister.openingFloat + cashSalesTotal + cashInTotal - cashOutTotal).toFixed(2);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K for Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
      // Esc to dismiss modals
      if (e.key === 'Escape') {
        setIsCheckoutOpen(false);
        setIsReceiptOpen(false);
        setIsInventoryOpen(false);
        setIsCashManagementOpen(false);
        setIsAnalyticsOpen(false);
        setIsAuditOpen(false);
        setIsSpotlightOpen(false);
      }
      // F2 to quick checkout
      if (e.key === 'F2' && cart.length > 0) {
        e.preventDefault();
        setIsCheckoutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  // Monitor Network Online/Offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerBackgroundSync();
    };
    const handleOffline = () => {
      setIsOffline(true);
      setNotification({
        type: 'offline',
        title: 'Modo Offline Activado',
        message: 'Las ventas se guardarán en caché IndexedDB localmente.',
        duration: 4000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync queued offline sales to memory/cloud
  const triggerBackgroundSync = async () => {
    const pending = await getPendingOfflineSales();
    if (pending.length > 0) {
      setNotification({
        type: 'sync',
        title: 'Sincronización PWA en Curso',
        message: `Subiendo ${pending.length} venta(s) guardadas en caché local...`,
        duration: 3500
      });

      for (const item of pending) {
        await clearOfflineSale(item.id);
      }

      setOfflineQueueCount(0);
      setNotification({
        type: 'success',
        title: 'Sincronización Completada',
        message: 'Todas las transacciones offline fueron consolidadas.',
        duration: 4000
      });
    }
  };

  const handleToggleOfflineSimulator = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (!nextState) {
      triggerBackgroundSync();
    } else {
      setNotification({
        type: 'offline',
        title: 'Simulación de Desconexión',
        message: 'OmniPOS operando en modo Offline-First con IndexedDB.',
        duration: 3500
      });
    }
  };

  // Add Item to Cart with Serial Selection
  const handleAddToCart = (product, variant) => {
    if (variant.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) {
        if (existing.quantity >= variant.stock) return prev;
        return prev.map(item => 
          item.variantId === variant.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Assign first available serial if required
      const defaultSerial = variant.serials && variant.serials.length > 0 ? variant.serials[0] : null;

      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
          price: variant.price,
          cost: variant.cost,
          stock: variant.stock,
          hasSerial: product.hasSerial,
          availableSerials: variant.serials || [],
          selectedSerial: defaultSerial,
          quantity: 1
        }
      ];
    });

    setNotification({
      type: 'success',
      title: 'Producto Agregado',
      message: `${product.name} (${variant.name})`,
      amount: `$${variant.price.toFixed(2)}`,
      duration: 2500
    });
  };

  const handleUpdateQuantity = (variantId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(variantId);
      return;
    }
    setCart(prev => prev.map(it => it.variantId === variantId ? { ...it, quantity: newQty } : it));
  };

  const handleRemoveItem = (variantId) => {
    setCart(prev => prev.filter(it => it.variantId !== variantId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAssignSerial = (variantId, serialNumber) => {
    setCart(prev => prev.map(it => 
      it.variantId === variantId ? { ...it, selectedSerial: serialNumber } : it
    ));
  };

  // Atomic Checkout Process Execution (ACID)
  const handleProcessSale = async (paymentDetails) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let calculatedDiscount = 0;
    if (discount.type === 'percent') {
      calculatedDiscount = subtotal * (discount.value / 100);
    } else {
      calculatedDiscount = Math.min(subtotal, discount.value);
    }
    const taxableBase = Math.max(0, subtotal - calculatedDiscount);
    const taxAmount = +(taxableBase * 0.18).toFixed(2);
    const total = +(taxableBase + taxAmount).toFixed(2);

    const invoiceNumber = `B020000${(salesHistory.length + 1082).toString()}`;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      invoiceType,
      cashierName: activeUser.name,
      customerName: selectedCustomer.name,
      customerTaxId: selectedCustomer.taxId !== '000-0000000-0' ? selectedCustomer.taxId : null,
      subtotal,
      taxAmount,
      discountAmount: calculatedDiscount,
      total,
      paymentMethod: paymentDetails.paymentMethod,
      cashPaid: paymentDetails.cashPaid,
      cardPaid: paymentDetails.cardPaid,
      transferPaid: paymentDetails.transferPaid,
      changeGiven: paymentDetails.changeGiven,
      createdAt: new Date().toISOString(),
      items: cart.map(it => ({
        id: `item-${Date.now()}-${it.variantId}`,
        name: `${it.productName} - ${it.variantName}`,
        quantity: it.quantity,
        unitPrice: it.price,
        unitCost: it.cost,
        lineTotal: it.price * it.quantity,
        serialNumber: it.selectedSerial || null
      }))
    };

    // Deduct Stock from Products & Variants Atomically
    setProducts(prevProducts => 
      prevProducts.map(p => ({
        ...p,
        variants: p.variants.map(v => {
          const cartItem = cart.find(ci => ci.variantId === v.id);
          if (!cartItem) return v;

          const updatedStock = Math.max(0, v.stock - cartItem.quantity);
          const remainingSerials = v.serials ? v.serials.filter(s => s !== cartItem.selectedSerial) : [];

          // Trigger Low-stock notification if stock <= 2
          if (updatedStock <= 2 && updatedStock > 0) {
            setTimeout(() => {
              setNotification({
                type: 'warning',
                title: 'Alerta de Stock Crítico',
                message: `${p.name} (${v.name}): Quedan ${updatedStock} unidades.`,
                duration: 5000
              });
            }, 800);
          }

          return {
            ...v,
            stock: updatedStock,
            serials: remainingSerials
          };
        })
      }))
    );

    // Update Cash Register if cash was tendered
    if (paymentDetails.cashPaid > 0) {
      setCashRegister(prev => ({
        ...prev,
        transactions: [
          ...prev.transactions,
          {
            id: `tx-${Date.now()}`,
            type: 'VENTA_EFECTIVO',
            amount: Math.min(paymentDetails.cashPaid, total),
            justification: `Venta Factura #${invoiceNumber}`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      }));
    }

    // Add Audit Log
    const auditEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userName: activeUser.name,
      role: activeUser.role,
      action: 'EMISION_FACTURA',
      resource: `Invoice #${invoiceNumber}`,
      details: `Total: $${total.toFixed(2)} (${paymentDetails.paymentMethod})`,
      hash: Math.random().toString(36).substr(2, 16)
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    // Handle Offline-First Persistence vs Online
    if (isOffline) {
      await queueOfflineSale(newInvoice);
      setOfflineQueueCount(prev => prev + 1);
      setNotification({
        type: 'warning',
        title: `Venta Guardada Offline (#${invoiceNumber})`,
        message: 'Registrada en caché IndexedDB. Se sincronizará al conectar.',
        amount: `$${total.toFixed(2)}`,
        duration: 4000
      });
    } else {
      setNotification({
        type: 'success',
        title: `Venta Exitosa (#${invoiceNumber})`,
        message: `Cliente: ${selectedCustomer.name}`,
        amount: `$${total.toFixed(2)}`,
        duration: 4000
      });
    }

    // Store in Sales History & Reset Cart
    setSalesHistory(prev => [newInvoice, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);

    // Open Receipt Preview
    setActiveReceiptInvoice(newInvoice);
    setIsReceiptOpen(true);
  };

  // Stock Intake handler from Inventory Modal
  const handleStockIntake = (data) => {
    setProducts(prevProducts =>
      prevProducts.map(p => ({
        ...p,
        variants: p.variants.map(v => {
          if (v.id !== data.variantId) return v;
          const mergedSerials = [...(v.serials || []), ...data.serials];
          return {
            ...v,
            stock: v.stock + data.quantityReceived,
            cost: data.newWeightedAvgCost,
            price: data.newSalePrice || v.price,
            serials: mergedSerials
          };
        })
      }))
    );

    // Add to Audit Log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        userName: activeUser.name,
        role: activeUser.role,
        action: 'ENTRADA_KARDEX',
        resource: `Variante ID ${data.variantId}`,
        details: `Entrada: +${data.quantityReceived} uds @ $${data.unitCostPaid} (Nuevo CPP: $${data.newWeightedAvgCost})`,
        hash: Math.random().toString(36).substr(2, 16)
      },
      ...prev
    ]);

    setNotification({
      type: 'success',
      title: 'Inventario Reabastecido',
      message: `Entrada de ${data.quantityReceived} unidades registrada en Kardex.`,
      duration: 3500
    });
  };

  // Cash movement handler
  const handleCashMovement = (movement) => {
    setCashRegister(prev => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        {
          id: `tx-${Date.now()}`,
          type: movement.type,
          amount: movement.amount,
          justification: movement.justification,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        userName: activeUser.name,
        role: activeUser.role,
        action: 'MOVIMIENTO_CAJA',
        resource: 'Gaveta Terminal #1',
        details: `${movement.type === 'ENTRADA_AJUSTE' ? 'Entrada' : 'Retiro'}: $${movement.amount} (${movement.justification})`,
        hash: Math.random().toString(36).substr(2, 16)
      },
      ...prev
    ]);

    setNotification({
      type: movement.type === 'ENTRADA_AJUSTE' ? 'cash-in' : 'cash-out',
      title: movement.type === 'ENTRADA_AJUSTE' ? 'Entrada de Efectivo' : 'Retiro Justificado',
      message: movement.justification,
      amount: `$${movement.amount.toFixed(2)}`,
      duration: 3500
    });
  };

  // Shift close (Corte Z) handler
  const handleCloseShift = (corteZData) => {
    setCashRegister(prev => ({
      ...prev,
      isClosed: true,
      expectedCash: corteZData.expectedCash,
      actualCash: corteZData.actualCash,
      discrepancy: corteZData.discrepancy,
      closureNotes: corteZData.closureNotes
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        userName: activeUser.name,
        role: activeUser.role,
        action: 'CIERRE_CORTE_Z',
        resource: 'Terminal #1',
        details: `Real: $${corteZData.actualCash} vs Esperado: $${corteZData.expectedCash} (Discrepancia: $${corteZData.discrepancy})`,
        hash: Math.random().toString(36).substr(2, 16)
      },
      ...prev
    ]);

    setNotification({
      type: corteZData.discrepancy === 0 ? 'success' : 'warning',
      title: 'Turno Cerrado (Corte Z)',
      message: `Discrepancia: ${corteZData.discrepancy > 0 ? `+$${corteZData.discrepancy}` : `$${corteZData.discrepancy}`}`,
      amount: `$${corteZData.actualCash.toFixed(2)}`,
      duration: 5000
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#121214] text-slate-100 select-none overflow-hidden relative">
      
      {/* Top macOS Menu Bar */}
      <TopMenuBar
        activeUser={activeUser}
        users={users}
        onSwitchUser={(user) => {
          setActiveUser(user);
          setNotification({
            type: 'security',
            title: 'Sesión Actualizada',
            message: `Operando como ${user.name} (${user.role})`,
            duration: 3000
          });
        }}
        isOffline={isOffline}
        onToggleOffline={handleToggleOfflineSimulator}
        cashInDrawer={cashInDrawer}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenCashManagement={() => setIsCashManagementOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        offlineQueueCount={offlineQueueCount}
      />

      {/* Floating Dynamic Island Notification */}
      <DynamicIsland
        notification={notification}
        onDismiss={() => setNotification(null)}
      />

      {/* iPadOS Split View Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Panel: Quick Product Catalog */}
        <ProductCatalog
          products={products}
          onAddToCart={handleAddToCart}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Right Panel: Live Ticket & Fiscal Breakdown */}
        <LiveTicket
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          invoiceType={invoiceType}
          setInvoiceType={setInvoiceType}
          discount={discount}
          setDiscount={setDiscount}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onAssignSerial={handleAssignSerial}
        />
      </main>

      {/* Modals & Subsystems */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totals={{
          subtotal: cart.reduce((acc, it) => acc + (it.price * it.quantity), 0),
          calculatedDiscount: discount.type === 'percent' 
            ? cart.reduce((acc, it) => acc + (it.price * it.quantity), 0) * (discount.value / 100)
            : Math.min(cart.reduce((acc, it) => acc + (it.price * it.quantity), 0), discount.value),
          taxAmount: +(Math.max(0, cart.reduce((acc, it) => acc + (it.price * it.quantity), 0) - (discount.type === 'percent' ? cart.reduce((acc, it) => acc + (it.price * it.quantity), 0) * (discount.value / 100) : discount.value)) * 0.18).toFixed(2),
          total: +(Math.max(0, cart.reduce((acc, it) => acc + (it.price * it.quantity), 0) - (discount.type === 'percent' ? cart.reduce((acc, it) => acc + (it.price * it.quantity), 0) * (discount.value / 100) : discount.value)) * 1.18).toFixed(2)
        }}
        selectedCustomer={selectedCustomer}
        invoiceType={invoiceType}
        cart={cart}
        onProcessSale={handleProcessSale}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        invoice={activeReceiptInvoice}
        onNewSale={() => {
          setActiveReceiptInvoice(null);
          setIsReceiptOpen(false);
        }}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        products={products}
        onStockIntake={handleStockIntake}
      />

      <CashManagementModal
        isOpen={isCashManagementOpen}
        onClose={() => setIsCashManagementOpen(false)}
        cashRegister={cashRegister}
        onCashMovement={handleCashMovement}
        onCloseShift={handleCloseShift}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        salesHistory={salesHistory}
      />

      <AuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditLogs={auditLogs}
      />

      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        products={products}
        customers={INITIAL_CUSTOMERS}
        onSelectProduct={(p, v) => handleAddToCart(p, v)}
        onSelectCustomer={(c) => setSelectedCustomer(c)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenCash={() => setIsCashManagementOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />
    </div>
  );
}
