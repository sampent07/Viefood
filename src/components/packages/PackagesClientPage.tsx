"use client";

import React, { useState } from "react";
import {
  Calendar,
  Flame,
  CheckCircle2,
  Scale,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  PhoneCall,
  Info,
} from "lucide-react";
import { Package } from "@/lib/types";
import { formatVnd } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import ConsultationModal from "@/components/packages/ConsultationModal";

interface PackagesClientPageProps {
  packages: Package[];
}

export default function PackagesClientPage({ packages }: PackagesClientPageProps) {
  const { addItem, showToast } = useCart();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [isConsultOpen, setIsConsultOpen] = useState<boolean>(false);
  const [consultPackageName, setConsultPackageName] = useState<string>("Gói ăn chuyên sâu 1 Tháng");

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "ALL") return true;
    return pkg.type === activeTab;
  });

  const handleOpenConsultation = (pkgName: string) => {
    setConsultPackageName(pkgName);
    setIsConsultOpen(true);
  };

  const handleAddSetToCart = (pkg: Package) => {
    // Treat as package purchase item
    const pseudoProduct: any = {
      id: pkg.id,
      sku: pkg.code,
      slug: pkg.slug,
      name: pkg.name,
      categorySlug: "meal-prep",
      description: pkg.description,
      priceVnd: pkg.priceVnd,
      estimatedWeightG: pkg.totalBoxes * 380,
      caloriesKcal: pkg.avgKcalPerDay,
      imageUrl: pkg.imageUrl,
      isAvailable: true,
      sortOrder: 1,
    };
    addItem(pseudoProduct, 1, `Gói ăn: ${pkg.name}`);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Giải pháp dinh dưỡng dài hạn
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Các Gói Ăn Định Kỳ VieFood
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Ăn uống khoa học không còn là gánh nặng. Đội ngũ VieFood tính toán calo chuẩn macro, nấu tươi mỗi ngày và giao đúng giờ hẹn tới tận tay bạn.
        </p>

        {/* Tab filters */}
        <div className="flex items-center justify-center gap-2 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "Tất cả các gói" },
            { id: "FULL_SET", label: "Set đầy đủ trong ngày" },
            { id: "THREE_DAYS", label: "Gói 3 ngày khởi động" },
            { id: "WEEKLY", label: "Gói chuẩn Macro 1 tuần" },
            { id: "MONTHLY", label: "Gói tháng cá nhân hóa" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => {
          const isMonthly = pkg.type === "MONTHLY";
          const dailyAvg = Math.round(pkg.priceVnd / pkg.daysCount);

          return (
            <div
              key={pkg.id}
              id={pkg.slug}
              className={`bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between ${
                isMonthly
                  ? "border-brand-500 shadow-xl relative overflow-hidden"
                  : "border-gray-100 hover:border-brand-200 shadow-sm"
              }`}
            >
              {isMonthly && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-extrabold px-6 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm">
                  Tư vấn cá nhân hóa
                </div>
              )}

              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-6">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase">
                      {pkg.type === "FULL_SET"
                        ? "Set 1 ngày hoàn chỉnh"
                        : pkg.type === "THREE_DAYS"
                        ? "Liệu trình 3 ngày"
                        : pkg.type === "WEEKLY"
                        ? "6 ngày (T2 - T7)"
                        : "24 ngày / tháng"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 leading-snug">{pkg.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Specs Pill List */}
                <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-gray-50 rounded-2xl text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Thời gian phục vụ</span>
                    <span className="font-bold text-gray-900">{pkg.daysCount} ngày liên tục</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Tổng số hộp / bữa</span>
                    <span className="font-bold text-gray-900">{pkg.totalBoxes} bữa giao tận nơi</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Calo trung bình / ngày</span>
                    <span className="font-bold text-amber-700">
                      {pkg.avgKcalPerDay ? `~${pkg.avgKcalPerDay} kcal/ngày` : "Tùy biến"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Chi phí trung bình / ngày</span>
                    <span className="font-bold text-brand-700">{formatVnd(dailyAvg)}/ngày</span>
                  </div>
                </div>

                {/* Package Features List */}
                <div className="mt-5 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Luân phiên thực đơn không gây ngán</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Hộp giữ nhiệt thân thiện môi trường</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Đổi món linh hoạt khi báo trước 12 tiếng</span>
                  </div>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Giá trọn gói</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-brand-700">
                      {formatVnd(pkg.priceVnd)}
                    </span>
                    {pkg.originalPriceVnd && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatVnd(pkg.originalPriceVnd)}
                      </span>
                    )}
                  </div>
                </div>

                {isMonthly ? (
                  <button
                    onClick={() => handleOpenConsultation(pkg.name)}
                    className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-95 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Đăng ký tư vấn gói tháng</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddSetToCart(pkg)}
                    className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-95 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Đặt gói ngay</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        defaultPackageName={consultPackageName}
      />
    </div>
  );
}

