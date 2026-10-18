import React from "react";
import { MapPin, Phone, Clock, Truck, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/utils";

export const revalidate = 60;

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Hệ thống cửa hàng
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Danh Sách Chi Nhánh VieFood
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Mỗi chi nhánh được trang bị bếp tiêu chuẩn vệ sinh an toàn thực phẩm, chuẩn bị món ăn tươi nóng và giao nhanh trong bán kính 15km.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5"
          >
            <div className="flex items-center space-x-3 text-brand-600">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full uppercase">
                  Mã: {b.code}
                </span>
                <h3 className="font-extrabold text-gray-900 text-base mt-1">{b.name}</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-50">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{b.address}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Giờ mở cửa: <strong className="text-gray-900">{b.openHours}</strong></span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Hotline: <strong className="text-gray-900">{b.phone}</strong></span>
              </div>

              <div className="flex items-center space-x-2.5 text-brand-700">
                <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  Phí giao tiêu chuẩn: <strong>{formatVnd(b.baseShippingFee)}</strong> (Tối đa {b.deliveryRadiusKm}km)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <a
                href={`tel:${b.phone}`}
                className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl text-center block transition"
              >
                Gọi chi nhánh này
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

