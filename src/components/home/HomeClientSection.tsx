"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetailModal from "@/components/product/ProductDetailModal";

interface HomeClientSectionProps {
  bestSellers: Product[];
}

export default function HomeClientSection({ bestSellers }: HomeClientSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase block">
            Lựa chọn yêu thích
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Món Bán Chạy Trong Tuần
          </h2>
        </div>
        <Link
          href="/menu"
          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center space-x-1 mt-2 sm:mt-0"
        >
          <span>Xem tất cả thực đơn</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

