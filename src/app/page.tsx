import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  CheckCircle,
  Clock,
  Heart,
  ChevronRight,
  Tag,
  MapPin,
  Calendar,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import HomeClientSection from "@/components/home/HomeClientSection";
import { formatVnd } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  const bestSellers = await prisma.product.findMany({
    where: {
      isAvailable: true,
      badges: { contains: "BEST_SELLER" },
    },
    take: 8,
    include: {
      category: true,
      ingredients: true,
    },
  });

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    take: 4,
  });

  const vouchers = await prisma.voucher.findMany({
    where: { isActive: true },
    take: 3,
  });

  const branches = await prisma.branch.findMany({
    where: { isActive: true },
  });

  const reviews = await prisma.review.findMany({
    where: { isVerified: true },
    take: 3,
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-transparent pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ăn Sạch Chuẩn Vị • Tính Sẵn Calo & Macro</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Dinh Dưỡng Lành Mạnh, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
                  Trọn Vẹn Sức Sống
                </span>{" "}
                Mỗi Ngày
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                VieFood mang đến thực đơn 50 món ăn chuẩn sạch: Cơm gạo lứt dẻo mềm, bún thanh đạm, meal prep chuyên sâu cho người tập luyện, nước detox thanh lọc và sữa chua Hy Lạp sánh mịn.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Khám phá thực đơn</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/packages"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center space-x-2 transition"
                >
                  <span>Xem các gói ăn</span>
                  <Calendar className="w-4 h-4 text-brand-600" />
                </Link>
              </div>

              {/* Micro stats banner */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-gray-900 block">50+</span>
                  <span className="text-xs text-gray-500 font-medium">Món ăn healthy</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-gray-900 block">100%</span>
                  <span className="text-xs text-gray-500 font-medium">Báo rõ calo & gam</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-gray-900 block">3 Chi nhánh</span>
                  <span className="text-xs text-gray-500 font-medium">Giao nhanh 30 phút</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="VieFood Healthy Meal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Bán chạy nhất
                    </span>
                    <h3 className="text-base font-bold mt-1">Cơm gạo lứt ức gà áp chảo</h3>
                    <p className="text-xs text-white/90">430 kcal • 400g • Giàu đạm nạc</p>
                  </div>
                </div>

                {/* Floating pill: Macro guarantee */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Kiểm soát khẩu phần</span>
                    <span className="text-[11px] text-gray-500">Giảm mỡ • Tăng cơ hiệu quả</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5 Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase block">
              Danh mục thực đơn
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Khám Phá 5 Nhóm Món Ăn Chính
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>Xem toàn bộ 50 món</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const catImages: Record<string, string> = {
              "com-gao-lut": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
              "bun-healthy": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80",
              "meal-prep": "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=500&q=80",
              "nuoc-detox": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
              "sua-chua-hy-lap": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
            };

            return (
              <Link
                key={cat.id}
                href={`/menu/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 flex flex-col justify-end p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={catImages[cat.slug] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-semibold text-brand-300 block uppercase">
                    {cat._count.products} món ăn
                  </span>
                  <h3 className="font-bold text-sm sm:text-base mt-0.5 group-hover:text-brand-300 transition">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Best Sellers Section (with interactive Client Modal handler) */}
      <HomeClientSection bestSellers={bestSellers as any} />

      {/* 4. Meal Packages Section (4 packages: Full set, 3 days, weekly, monthly) */}
      <section className="bg-gradient-to-b from-brand-50/50 via-white to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
              Tiện lợi & Tiết kiệm
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-1">
              Các Gói Ăn Định Kỳ VieFood
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Không còn lo lắng hôm nay ăn gì, VieFood chuẩn bị và giao tận nơi đúng giờ hẹn mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pkg.type === "FULL_SET"
                        ? "Set ngày"
                        : pkg.type === "THREE_DAYS"
                        ? "3 Ngày"
                        : pkg.type === "WEEKLY"
                        ? "Gói Tuần"
                        : "Gói Tháng"}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Số ngày phục vụ:</span>
                      <span className="font-bold text-gray-800">{pkg.daysCount} ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng số hộp / bữa:</span>
                      <span className="font-bold text-gray-800">{pkg.totalBoxes} bữa</span>
                    </div>
                    {pkg.avgKcalPerDay && (
                      <div className="flex justify-between text-amber-700">
                        <span>Calo trung bình / ngày:</span>
                        <span className="font-bold">~{pkg.avgKcalPerDay} kcal</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-gray-400">Trọn gói:</span>
                    <div className="text-right">
                      {pkg.originalPriceVnd && (
                        <span className="text-xs text-gray-400 line-through mr-1.5">
                          {formatVnd(pkg.originalPriceVnd)}
                        </span>
                      )}
                      <span className="text-lg font-black text-brand-700">
                        {formatVnd(pkg.priceVnd)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/packages#${pkg.slug}`}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl text-center block transition shadow-md shadow-brand-500/20"
                  >
                    Xem thực đơn & Đăng ký
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Vouchers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-brand-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <Tag className="w-3.5 h-3.5" />
              <span>Chương trình ưu đãi hiện hành</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Săn Mã Giảm Giá Hôm Nay
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Nhập mã ngay tại bước thanh toán để nhận giảm giá trực tiếp lên đến 15% hoặc miễn phí vận chuyển.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-left"
                >
                  <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Mã ưu đãi</span>
                  <span className="text-base font-extrabold text-white tracking-wider block mt-0.5">
                    {v.code}
                  </span>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-1">{v.title}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/vouchers"
                className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl transition"
              >
                <span>Xem tất cả voucher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Branches Locator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Hệ thống cửa hàng
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Chi Nhánh VieFood Đang Phục Vụ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition space-y-4"
            >
              <div className="flex items-center space-x-2 text-brand-600">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{b.address}</p>
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-1">
                <div>Giờ hoạt động: <span className="font-semibold text-gray-800">{b.openHours}</span></div>
                <div>Hotline: <span className="font-semibold text-gray-800">{b.phone}</span></div>
                <div>Phí giao chuẩn: <span className="font-semibold text-brand-700">{formatVnd(b.baseShippingFee)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Real Customer Reviews Section */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
              Trải nghiệm thực tế
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Khách Hàng Nói Gì Về VieFood?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-brand-50/40 rounded-3xl p-6 border border-brand-100 space-y-3"
              >
                <div className="flex items-center space-x-1 text-amber-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <div className="pt-2 text-xs">
                  <span className="font-bold text-gray-900 block">{r.customerName}</span>
                  <span className="text-emerald-700 font-medium text-[11px] flex items-center space-x-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                    <span>Khách hàng đã xác thực mua món</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

