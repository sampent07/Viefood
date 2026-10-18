import React from "react";
import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* 4 Feature Commitments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">100% Nguyên liệu tươi sạch</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rau củ hữu cơ chuẩn VietGAP, ức gà và phi lê cá tươi mỗi ngày.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Giao hàng giữ nhiệt nhanh</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Giao đúng giờ hẹn từ chi nhánh gần nhất, hộp giữ ấm kín đáo thân thiện môi trường.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Đổi trả minh bạch</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hỗ trợ đổi món mới hoặc hoàn tiền ngay nếu món ăn không đúng chất lượng cam kết.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Dinh dưỡng chuẩn macro</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Công bố minh bạch thành phần, định lượng gam và năng lượng calo tham khảo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Vie<span className="text-brand-400">Food</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              VieFood là nền tảng ẩm thực healthy hàng đầu tại Việt Nam, mang đến giải pháp ăn uống tiện lợi, sạch sẽ, cân bằng calo và dinh dưỡng cho người hiện đại và người tập luyện.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Trụ sở: 72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Tổng đài CSKH: 0901 888 123 (07:00 - 21:00)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Email hỗ trợ: cskh@viefood.vn</span>
              </div>
            </div>
          </div>

          {/* Menu Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Thực đơn Healthy</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/menu/com-gao-lut" className="hover:text-brand-400 transition">
                  Cơm gạo lứt (10 món)
                </Link>
              </li>
              <li>
                <Link href="/menu/bun-healthy" className="hover:text-brand-400 transition">
                  Bún healthy (10 món)
                </Link>
              </li>
              <li>
                <Link href="/menu/meal-prep" className="hover:text-brand-400 transition">
                  Meal Prep chuẩn gym (10 món)
                </Link>
              </li>
              <li>
                <Link href="/menu/nuoc-detox" className="hover:text-brand-400 transition">
                  Nước Detox trái cây (10 món)
                </Link>
              </li>
              <li>
                <Link href="/menu/sua-chua-hy-lap" className="hover:text-brand-400 transition">
                  Sữa chua Hy Lạp (10 món)
                </Link>
              </li>
            </ul>
          </div>

          {/* Packages & Service */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Gói ăn & Dịch vụ</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/packages#fullset" className="hover:text-brand-400 transition">
                  Set ăn dinh dưỡng đầy đủ
                </Link>
              </li>
              <li>
                <Link href="/packages#3days" className="hover:text-brand-400 transition">
                  Gói ăn 3 ngày khởi động
                </Link>
              </li>
              <li>
                <Link href="/packages#weekly" className="hover:text-brand-400 transition">
                  Gói ăn chuẩn Macro 1 tuần
                </Link>
              </li>
              <li>
                <Link href="/packages#monthly" className="hover:text-brand-400 transition">
                  Tư vấn gói tháng cá nhân hóa
                </Link>
              </li>
              <li>
                <Link href="/vouchers" className="hover:text-brand-400 transition">
                  Kho mã giảm giá & ưu đãi
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="cursor-pointer hover:text-brand-400 transition">Chính sách giao hàng & phí ship</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-400 transition">Chính sách đổi trả & hủy đơn</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-400 transition">Chính sách bảo mật thông tin</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-400 transition">Điều khoản sử dụng dịch vụ</span>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-400 transition text-slate-500">
                  Cổng quản trị nội bộ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 VieFood. Toàn bộ bản quyền thuộc về Hệ thống Thực phẩm Lành mạnh VieFood Việt Nam.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Số liệu dinh dưỡng và calo hiển thị trên website là số liệu ước tính ban đầu phục vụ tham khảo khẩu phần.
        </p>
      </div>
    </footer>
  );
}

