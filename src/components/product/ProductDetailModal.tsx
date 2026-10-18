"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, Flame, Scale, ShoppingBag, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatVnd, CATEGORY_MAP, BADGE_MAP } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [itemNote, setItemNote] = useState("");

  if (!product) return null;

  const badges = product.badges ? product.badges.split(",") : [];

  const handleAddToCart = () => {
    addItem(product, quantity, itemNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-gray-500 hover:text-gray-800 shadow-md flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image & Badges */}
          <div className="relative bg-gray-100 aspect-square md:aspect-auto">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {badges.map((b) => {
                const badgeInfo = BADGE_MAP[b.trim()];
                if (!badgeInfo) return null;
                return (
                  <span
                    key={b}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${badgeInfo.color}`}
                  >
                    {badgeInfo.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right Column: Details & Ingredients */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                <span className="text-brand-600 font-bold uppercase tracking-wider">
                  {CATEGORY_MAP[product.categorySlug] || product.categorySlug}
                </span>
                <span>Mã SKU: {product.sku}</span>
              </div>

              {/* Title & Price */}
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mt-1">
                {product.name}
              </h2>

              <div className="flex items-baseline space-x-3 mt-2">
                <span className="text-2xl font-extrabold text-brand-700">
                  {formatVnd(product.priceVnd)}
                </span>
                {product.caloriesKcal && (
                  <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                    ~{product.caloriesKcal} kcal
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Weight & Serving Specs */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-gray-50 rounded-2xl text-xs text-gray-700">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-brand-600" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Khối lượng thành phẩm</span>
                    <span className="font-bold">
                      {product.servingVolumeMl
                        ? `${product.servingVolumeMl} ml / chai`
                        : product.estimatedWeightG
                        ? `Khoảng ${product.estimatedWeightG} g`
                        : "Đang cập nhật"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Năng lượng ước tính</span>
                    <span className="font-bold">{product.caloriesKcal ? `${product.caloriesKcal} kcal` : "Đang kiểm nghiệm"}</span>
                  </div>
                </div>
              </div>

              {/* Ingredients Table (Section 3.5 spec requirement) */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Bảng thành phần công thức</span>
                    <span className="text-[10px] text-gray-400 font-normal">Định lượng tiêu chuẩn</span>
                  </h4>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-semibold">
                        <tr>
                          <th className="py-2 px-3">Thành phần</th>
                          <th className="py-2 px-3 text-right">Khối lượng</th>
                          <th className="py-2 px-3 text-right">Calo tham khảo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {product.ingredients.map((ing, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-1.5 px-3 font-medium">{ing.name}</td>
                            <td className="py-1.5 px-3 text-right text-gray-600">
                              {ing.amount} {ing.unit}
                            </td>
                            <td className="py-1.5 px-3 text-right text-amber-700 font-medium">
                              {ing.caloriesKcal ? `${ing.caloriesKcal} kcal` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-400 italic mt-1.5 flex items-center space-x-1">
                    <Info className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span>Số liệu dinh dưỡng là ước tính ban đầu từ công thức chuẩn của VieFood.</span>
                  </p>
                </div>
              )}

              {/* Dish Customization Note */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú cho bếp (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Để sốt riêng, không thêm sốt cay, ít ớt..."
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Quantity and Add to Cart action */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Chọn số lượng:</span>
                <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-gray-900 px-3 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="py-3 px-4 border border-gray-200 text-gray-700 text-xs font-bold rounded-2xl text-center hover:bg-gray-50 transition"
                >
                  Trang chi tiết
                </Link>
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-95 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm • {formatVnd((product.priceVnd || 0) * quantity)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

