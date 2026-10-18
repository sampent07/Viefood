"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Scale,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  MapPin,
  Clock,
} from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatVnd, CATEGORY_MAP, BADGE_MAP } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  reviews: any[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
  reviews,
}: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [itemNote, setItemNote] = useState("");

  const badges = product.badges ? product.badges.split(",") : [];

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/menu" className="hover:text-brand-600">Thực đơn</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/menu/${product.categorySlug}`} className="hover:text-brand-600">
          {CATEGORY_MAP[product.categorySlug] || product.categorySlug}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        {/* Left Column: Big Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-md">
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
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm ${badgeInfo.color}`}
                  >
                    {badgeInfo.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Specs, Ingredients, Add to cart */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="text-brand-600 font-bold uppercase tracking-wider">
                {CATEGORY_MAP[product.categorySlug] || product.categorySlug}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {product.name}
            </h1>

            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-3xl font-black text-brand-700">
                {formatVnd(product.priceVnd)}
              </span>
              {product.caloriesKcal && (
                <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                  ~{product.caloriesKcal} kcal
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Serving Specs Cards */}
            <div className="grid grid-cols-2 gap-3 mt-5 p-4 bg-brand-50/40 rounded-2xl border border-brand-100/60 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-brand-600 flex items-center justify-center shadow-sm">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Khối lượng thành phẩm</span>
                  <span className="font-bold text-gray-800">
                    {product.servingVolumeMl
                      ? `${product.servingVolumeMl} ml/chai`
                      : product.estimatedWeightG
                      ? `~${product.estimatedWeightG} g`
                      : "Ước tính"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Năng lượng tham khảo</span>
                  <span className="font-bold text-gray-800">
                    {product.caloriesKcal ? `${product.caloriesKcal} kcal` : "Đang kiểm nghiệm"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Table (Section 3.5 requirement) */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>Bảng thành phần công thức</span>
                  <span className="text-[10px] text-gray-400 font-normal">Định lượng tiêu chuẩn</span>
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="py-2.5 px-3">Thành phần</th>
                        <th className="py-2.5 px-3 text-right">Khối lượng</th>
                        <th className="py-2.5 px-3 text-right">Calo tham khảo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {product.ingredients.map((ing, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2 px-3 font-medium">{ing.name}</td>
                          <td className="py-2 px-3 text-right text-gray-600">
                            {ing.amount} {ing.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-amber-700 font-medium">
                            {ing.caloriesKcal ? `${ing.caloriesKcal} kcal` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-gray-400 italic mt-2 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>
                    Dữ liệu dinh dưỡng được ước tính từ công thức tiêu chuẩn của VieFood và có thể chênh lệch nhẹ theo kích thước nguyên liệu tự nhiên.
                  </span>
                </p>
              </div>
            )}

            {/* Custom note */}
            <div className="mt-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ghi chú cho bếp (nếu có yêu cầu riêng)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Để sốt riêng, không thêm sốt cay, không hành tây..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                className="w-full text-xs px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Action Footer: Quantity and Add button */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Số lượng khẩu phần:</span>
              <div className="flex items-center space-x-2 border border-gray-200 rounded-2xl p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-gray-900 px-4 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => addItem(product, quantity, itemNote)}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-98 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Thêm vào giỏ hàng • {formatVnd((product.priceVnd || 0) * quantity)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {reviews && reviews.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-gray-900 text-lg">Đánh giá từ khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-gray-50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900">{r.customerName}</span>
                  <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-xs text-gray-600 italic">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-gray-900">
            Món Ngon Cùng Danh Mục
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

