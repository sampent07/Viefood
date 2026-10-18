"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { formatVnd, formatDate } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-gray-500">
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  if (!user) return null;

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "Mới tạo", color: "text-amber-700 bg-amber-50" },
    CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700 bg-blue-50" },
    PREPARING: { label: "Đang nấu", color: "text-indigo-700 bg-indigo-50" },
    DELIVERING: { label: "Đang giao", color: "text-purple-700 bg-purple-50" },
    COMPLETED: { label: "Hoàn tất", color: "text-emerald-700 bg-emerald-50" },
    CANCELLED: { label: "Đã hủy", color: "text-red-700 bg-red-50" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* User Header Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-2xl uppercase shadow-inner">
            {user.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
              {user.role === "ADMIN" && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Quản trị viên
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.email || "Chưa có email"} • {user.phone || "Chưa có số điện thoại"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition"
            >
              Vào Trang Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <span>Lịch Sử Đơn Hàng Của Bạn</span>
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                {user.orders?.length || 0} đơn đã tạo
              </span>
            </div>

            {user.orders?.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-gray-500">Bạn chưa có đơn hàng nào tại VieFood.</p>
                <Link
                  href="/menu"
                  className="inline-block px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition"
                >
                  Đặt món ngay
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 space-y-4">
                {user.orders?.map((order: any) => {
                  const status = statusMap[order.status] || {
                    label: order.status,
                    color: "text-gray-700 bg-gray-50",
                  };
                  return (
                    <div key={order.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <span className="font-extrabold text-gray-900 text-sm">
                            #{order.orderCode}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-sm font-black text-brand-700">
                            {formatVnd(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p>
                          Chi nhánh: <strong>{order.branch?.name}</strong> • Giao đến:{" "}
                          <strong>{order.deliveryAddress}</strong>
                        </p>
                        <p className="text-gray-500">
                          {order.items?.map((i: any) => `${i.productName} (x${i.quantity})`).join(", ")}
                        </p>
                      </div>

                      <div className="pt-1 flex justify-end">
                        <Link
                          href={`/order-success/${order.orderCode}`}
                          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                        >
                          <span>Xem hóa đơn & mã VietQR</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Address Book & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2 pb-3 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Sổ địa chỉ đã lưu</span>
            </h3>

            {user.addresses?.length === 0 ? (
              <p className="text-xs text-gray-400">Chưa có địa chỉ nào được lưu.</p>
            ) : (
              <div className="space-y-3">
                {user.addresses?.map((addr: any) => (
                  <div
                    key={addr.id}
                    className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1 border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">{addr.receiverName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">SĐT: {addr.phone}</p>
                    <p className="text-gray-500 leading-relaxed">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

