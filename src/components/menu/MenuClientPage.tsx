"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Flame, Filter, RotateCcw } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetailModal from "@/components/product/ProductDetailModal";

interface MenuClientPageProps {
  initialCategories: Array<{ id: string; name: string; slug: string }>;
  initialProducts: Product[];
  initialQuery?: string;
  initialCategory?: string;
  lockedCategory?: { id: string; name: string; slug: string; description?: string | null };
}

export default function MenuClientPage({
  initialCategories,
  initialProducts,
  initialQuery = "",
  initialCategory = "all",
  lockedCategory,
}: MenuClientPageProps) {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    lockedCategory ? lockedCategory.slug : initialCategory
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [calorieRange, setCalorieRange] = useState<string>("all"); // all, under-350, 350-450, over-450
  const [sortBy, setSortBy] = useState<string>("default"); // default, price-asc, price-desc, cal-asc, cal-desc
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      router.push("/menu");
    } else {
      router.push(`/menu/${slug}`);
    }
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Category check
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }

      // 2. Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchIng = product.ingredients?.some((i) => i.name.toLowerCase().includes(q));

        if (!matchName && !matchSku && !matchDesc && !matchIng) {
          return false;
        }
      }

      // 3. Calorie range check
      const cal = product.caloriesKcal || 0;
      if (calorieRange === "under-350" && cal >= 350) return false;
      if (calorieRange === "350-450" && (cal < 350 || cal > 450)) return false;
      if (calorieRange === "over-450" && cal <= 450) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.priceVnd || 0) - (b.priceVnd || 0);
      }
      if (sortBy === "price-desc") {
        return (b.priceVnd || 0) - (a.priceVnd || 0);
      }
      if (sortBy === "cal-asc") {
        return (a.caloriesKcal || 0) - (b.caloriesKcal || 0);
      }
      if (sortBy === "cal-desc") {
        return (b.caloriesKcal || 0) - (a.caloriesKcal || 0);
      }
      return a.sortOrder - b.sortOrder;
    });
  }, [initialProducts, selectedCategory, searchQuery, calorieRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setCalorieRange("all");
    setSortBy("default");
    router.push("/menu");
  };

  return (
    <div className="space-y-8">
      {/* Category Header Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Thực đơn dinh dưỡng VieFood
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          {lockedCategory ? lockedCategory.name : "Toàn Bộ Thực Đơn Healthy"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {lockedCategory?.description ||
            "Tất cả món ăn đều chế biến từ nguyên liệu tươi mới mỗi ngày, tính toán calo và định lượng chi tiết cho từng khẩu phần."}
        </p>
      </div>

      {/* Category Tabs (Section 3.3 requirement) */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Tất cả thực đơn
        </button>

        {initialCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="Tìm theo tên món, nguyên liệu (ức gà, cá hồi, tôm...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Calorie filter */}
          <div className="sm:col-span-3">
            <select
              value={calorieRange}
              onChange={(e) => setCalorieRange(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Mức năng lượng: Tất cả</option>
              <option value="under-350">Dưới 350 kcal (Thanh nhẹ)</option>
              <option value="350-450">Từ 350 – 450 kcal (Cân bằng)</option>
              <option value="over-450">Trên 450 kcal (Tăng cơ)</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="cal-asc">Calo tăng dần</option>
              <option value="cal-desc">Calo giảm dần</option>
            </select>
          </div>
        </div>

        {/* Results summary and reset */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50 px-1">
          <span>
            Tìm thấy <strong className="text-gray-900">{filteredProducts.length}</strong> món ăn phù hợp
          </span>
          {(searchQuery || calorieRange !== "all" || sortBy !== "default" || selectedCategory !== "all") && (
            <button
              onClick={resetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Không tìm thấy món ăn phù hợp</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc calo và danh mục.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition"
          >
            Xem lại tất cả món
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

