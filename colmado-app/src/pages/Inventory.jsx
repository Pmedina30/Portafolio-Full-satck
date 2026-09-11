import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Download, 
  AlertTriangle, 
  ArrowUpDown, 
  Check, 
  X,
  Boxes,
  TrendingUp
} from "lucide-react";
import { dataService } from "../services/dataService";
import { CATEGORIES } from "../data/initialData";
import { useAuth } from "../contexts/AuthContext";

export default function Inventory() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Víveres y Granos",
    code: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "10",
    unit: "unidad",
    image: "📦"
  });

  const loadProducts = async () => {
    const list = await dataService.getProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === "Todos" || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      category: "Víveres y Granos",
      code: `COL-${Math.floor(100 + Math.random() * 900)}`,
      price: "",
      cost: "",
      stock: "",
      minStock: "10",
      unit: "unidad",
      image: "📦"
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setCurrentProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      code: p.code || "",
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit || "unidad",
      image: p.image || "📦"
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (currentProduct) {
      await dataService.updateProduct(currentProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock, 10),
        minStock: parseInt(formData.minStock, 10)
      });
    } else {
      await dataService.addProduct(formData);
    }
    setModalOpen(false);
    loadProducts();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar "${name}" del inventario?`)) {
      await dataService.deleteProduct(id);
      loadProducts();
    }
  };

  const handleOpenStockAdjust = (p) => {
    setCurrentProduct(p);
    setStockAdjustment("");
    setStockModalOpen(true);
  };

  const handleApplyStockAdjust = async (e) => {
    e.preventDefault();
    const qty = parseInt(stockAdjustment, 10);
    if (isNaN(qty) || !currentProduct) return;

    const newTotal = Math.max(0, currentProduct.stock + qty);
    await dataService.updateProduct(currentProduct.id, { stock: newTotal });
    setStockModalOpen(false);
    loadProducts();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Código,Nombre,Categoría,Precio (RD$),Costo (RD$),Stock,Mínimo,Unidad"];
    const rows = products.map((p) => 
      `"${p.code || ''}","${p.name}","${p.category}",${p.price},${p.cost},${p.stock},${p.minStock},"${p.unit}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inventario_Colmado_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Catálogo & Existencias
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total de {products.length} productos registrados en inventario
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Costo</th>
                <th className="px-6 py-4">Venta</th>
                <th className="px-6 py-4">Margen</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p) => {
                const margin = p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : 0;
                const isOutOfStock = p.stock <= 0;
                const isLow = p.stock <= p.minStock && !isOutOfStock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1.5 bg-slate-50 rounded-lg">{p.image || "📦"}</span>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.code || "COL-ITEM"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {p.category}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-500">
                      RD$ {p.cost?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      RD$ {p.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        +{margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                        isOutOfStock 
                          ? "bg-red-50 text-red-600 border border-red-200" 
                          : isLow 
                            ? "bg-amber-50 text-amber-700 border border-amber-200" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenStockAdjust(p)}
                          title="Entrada rápida de mercancía"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Boxes className="w-4 h-4" />
                        </button>

                        {currentUser?.role === "admin" && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              title="Editar producto"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              title="Eliminar del catálogo"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {currentProduct ? "Editar Producto" : "Nuevo Producto en Catálogo"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Arroz Canilla 5lb"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-1 focus:ring-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Ícono Emoji</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="🍚, 🍺, 🥩, 🥤"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Precio Costo (RD$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Precio Venta (RD$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Stock Actual</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Unidad</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="libra, unidad, lata"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {stockModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Entrada de Mercancía: {currentProduct.name}
            </h3>
            <p className="text-xs text-slate-500">
              Stock actual: <strong>{currentProduct.stock} {currentProduct.unit}</strong>
            </p>

            <form onSubmit={handleApplyStockAdjust} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cantidad a Agregar (o restar si es negativo)
                </label>
                <input
                  type="number"
                  required
                  placeholder="ej. 24"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

