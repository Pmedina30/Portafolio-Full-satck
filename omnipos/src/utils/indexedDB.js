/**
 * OmniPOS PWA Offline-First Engine
 * IndexedDB persistence layer with automatic background sync when reconnected.
 */

const DB_NAME = 'omnipos_offline_db';
const DB_VERSION = 1;
const STORE_SALES_QUEUE = 'offline_sales_queue';
const STORE_AUDIT_LOGS = 'offline_audit_logs';

export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('IndexedDB no soportado en este navegador');
      return resolve(null);
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_SALES_QUEUE)) {
        db.createObjectStore(STORE_SALES_QUEUE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_AUDIT_LOGS)) {
        db.createObjectStore(STORE_AUDIT_LOGS, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (err) => reject(err);
  });
}

/**
 * Queue a sale in local IndexedDB when operating offline
 */
export async function queueOfflineSale(invoice) {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SALES_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_SALES_QUEUE);
    const item = {
      ...invoice,
      isOfflinePending: true,
      queuedAt: new Date().toISOString()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e);
  });
}

/**
 * Retrieve all pending offline sales
 */
export async function getPendingOfflineSales() {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_SALES_QUEUE, 'readonly');
    const store = tx.objectStore(STORE_SALES_QUEUE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

/**
 * Clear synchronized sales from local queue
 */
export async function clearOfflineSale(id) {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_SALES_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_SALES_QUEUE);
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
  });
}
