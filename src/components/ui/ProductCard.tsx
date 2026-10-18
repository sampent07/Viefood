"use client";

import React from "react";
import Link from "next/link";
import { Plus, Eye, Flame, Scale } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatVnd, CATEGORY_MAP, BADGE_MAP } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();

  const badges = product.badges ? product.badges.split(",") : [];

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 hover:border-brand-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {badges.map((b) => {
            const badgeInfo = BADGE_MAP[b.trim()];
            if (!badgeInfo) return null;
            return (
              <span
                key={b}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${badgeInfo.color}`}
              >
                {badgeInfo.label}
              </span>
            );
          })}
        </div>

        {/* Quick view button overlay */}
        <button
          onClick={() => onQuickView && onQuickView(product)}
          className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-brand-600 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Xem chi tiết"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category tag */}
          <div className="text-[11px] font-semibold text-brand-600 tracking-wide uppercase mb-1">
            {CATEGORY_MAP[product.categorySlug] || product.categorySlug}
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block font-bold text-gray-900 group-hover:text-brand-600 transition text-base leading-snug line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Short description */}
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Weight & Kcal Pills */}
          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-3 pt-2.5 border-t border-gray-50">
            <div className="flex items-center space-x-1" title="Khối lượng hộp ước tính">
              <Scale className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {product.servingVolumeMl
                  ? `${product.servingVolumeMl} ml`
                  : product.estimatedWeightG
                  ? `~${product.estimatedWeightG} g`
                  : "Đang ước tính"}
              </span>
            </div>

            <span className="text-gray-300">•</span>

            <div className="flex items-center space-x-1 text-amber-700 font-medium" title="Năng lượng tham khảo">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.caloriesKcal ? `${product.caloriesKcal} kcal` : "Calo tham khảo"}</span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5">Giá bán</span>
            <span className="text-base sm:text-lg font-extrabold text-brand-700">
              {formatVnd(product.priceVnd)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onQuickView && onQuickView(product)}
              className="px-2.5 py-2 text-xs font-semibold text-gray-600 hover:text-brand-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
            >
              Chi tiết
            </button>
            <button
              onClick={() => addItem(product, 1)}
              className="p-2 sm:px-3 sm:py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-md shadow-brand-500/20 active:scale-95 transition"
              title="Thêm vào giỏ"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

