import { firebaseRest, isFirebaseConfigured } from "../firebase/config";
import { INITIAL_PRODUCTS, INITIAL_SALES } from "../data/initialData";

const STORAGE_KEYS = {
  PRODUCTS: "colmadopro_products",
  SALES: "colmadopro_sales",
};

// Initialize localStorage with initial data if empty
const initLocalStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
  }
};

initLocalStore();

export const dataService = {
  // PRODUCTS
  async getProducts() {
    if (isFirebaseConfigured) {
      const cloudProds = await firebaseRest.getFirestoreDocuments("products");
      if (cloudProds && cloudProds.length > 0) return cloudProds;
    }
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  },

  async addProduct(product) {
    const newProd = {
      ...product,
      price: parseFloat(product.price) || 0,
      cost: parseFloat(product.cost) || 0,
      stock: parseInt(product.stock, 10) || 0,
      minStock: parseInt(product.minStock, 10) || 5,
      createdAt: new Date().toISOString()
    };

    const products = await this.getProducts();
    const withId = { id: `prod-${Date.now()}`, ...newProd };
    products.unshift(withId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return withId;
  },

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
  },

  // SALES
  async getSales() {
    if (isFirebaseConfigured) {
      const cloudSales = await firebaseRest.getFirestoreDocuments("sales");
      if (cloudSales && cloudSales.length > 0) return cloudSales;
    }
    const local = localStorage.getItem(STORAGE_KEYS.SALES);
    return local ? JSON.parse(local) : INITIAL_SALES;
  },

  async registerSale(saleData) {
    const newSale = {
      ...saleData,
      id: `VTA-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    };

    // Calculate total cost and profit
    const totalCost = newSale.items.reduce((sum, item) => sum + (item.cost || (item.price * 0.75)) * item.qty, 0);
    newSale.profit = Number((newSale.total - totalCost).toFixed(2));

    const sales = await this.getSales();
    sales.unshift(newSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

    // Reduce Stock for each item sold
    const products = await this.getProducts();
    newSale.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, (prod.stock || 0) - item.qty);
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    return newSale;
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    return { products: INITIAL_PRODUCTS, sales: INITIAL_SALES };
  }
};

