import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  PhoneCall,
  Tag,
  MapPin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminNav = [
    { label: "Dashboard Thống Kê", href: "/admin", icon: LayoutDashboard },
    { label: "Quản Lý Đơn Hàng", href: "/admin/orders", icon: ShoppingBag },
    { label: "Sản Phẩm & Công Thức", href: "/admin/products", icon: UtensilsCrossed },
    { label: "Yêu Cầu Tư Vấn Gói", href: "/admin/consultations", icon: PhoneCall },
    { label: "Mã Giảm Giá / Voucher", href: "/admin/vouchers", icon: Tag },
    { label: "Quản Lý Chi Nhánh", href: "/admin/branches", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2.5 text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">
                Vie<span className="text-brand-400">Food</span> Admin
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Cổng quản trị 2026
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang bán lẻ</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

