"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Flame, Scale, Check, X, Search, UtensilsCrossed } from "lucide-react";
import { formatVnd, CATEGORY_MAP } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editingProduct } : p))
        );
        setEditingProduct(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.categorySlug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Cơ sở dữ liệu thực đơn
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">
            Quản Lý Sản Phẩm & Công Thức Dinh Dưỡng
          </h1>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên món, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Đang tải danh sách 50 sản phẩm...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Ảnh & Tên món</th>
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4">Giá bán (VNĐ)</th>
                  <th className="py-3 px-4">Khối lượng</th>
                  <th className="py-3 px-4">Năng lượng</th>
                  <th className="py-3 px-4">Số nguyên liệu</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <span className="font-bold text-gray-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-600">{product.sku}</td>
                    <td className="py-3 px-4 font-medium text-brand-700">
                      {CATEGORY_MAP[product.categorySlug] || product.categorySlug}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{formatVnd(product.priceVnd)}</td>
                    <td className="py-3 px-4">
                      {product.servingVolumeMl
                        ? `${product.servingVolumeMl} ml`
                        : product.estimatedWeightG
                        ? `${product.estimatedWeightG} g`
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-medium">
                      {product.caloriesKcal ? `${product.caloriesKcal} kcal` : "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {product.ingredients?.length || 0} thành phần
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingProduct({ ...product })}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-700 rounded-lg text-xs font-semibold transition"
                      >
                        Sửa công thức / giá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Recipe / Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-gray-900 text-base">
                Cập Nhật Sản Phẩm & Công Thức: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tên món ăn</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    value={editingProduct.priceVnd || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceVnd: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Khối lượng thành phẩm (g hoặc ml)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.estimatedWeightG || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        estimatedWeightG: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Năng lượng (kcal)</label>
                  <input
                    type="number"
                    value={editingProduct.caloriesKcal || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        caloriesKcal: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">URL Hình ảnh</label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Mô tả món ăn</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Ingredients list editor */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">Danh sách thành phần nguyên liệu</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const current = editingProduct.ingredients || [];
                      setEditingProduct({
                        ...editingProduct,
                        ingredients: [...current, { name: "", amount: 50, unit: "g", caloriesKcal: 50 }],
                      });
                    }}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    + Thêm nguyên liệu
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.ingredients?.map((ing: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Tên nguyên liệu"
                        value={ing.name}
                        onChange={(e) => {
                          const next = [...editingProduct.ingredients];
                          next[idx].name = e.target.value;
                          setEditingProduct({ ...editingProduct, ingredients: next });
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={ing.amount}
                        onChange={(e) => {
                          const next = [...editingProduct.ingredients];
                          next[idx].amount = Number(e.target.value);
                          setEditingProduct({ ...editingProduct, ingredients: next });
                        }}
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Đơn vị (g, ml...)"
                        value={ing.unit}
                        onChange={(e) => {
                          const next = [...editingProduct.ingredients];
                          next[idx].unit = e.target.value;
                          setEditingProduct({ ...editingProduct, ingredients: next });
                        }}
                        className="w-16 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Kcal"
                        value={ing.caloriesKcal || ""}
                        onChange={(e) => {
                          const next = [...editingProduct.ingredients];
                          next[idx].caloriesKcal = e.target.value ? Number(e.target.value) : null;
                          setEditingProduct({ ...editingProduct, ingredients: next });
                        }}
                        className="w-16 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = editingProduct.ingredients.filter((_: any, i: number) => i !== idx);
                          setEditingProduct({ ...editingProduct, ingredients: next });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

