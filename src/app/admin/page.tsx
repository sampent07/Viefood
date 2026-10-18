"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  PhoneCall,
  UtensilsCrossed,
  Tag,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { formatVnd, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-xs text-gray-500 py-12">Đang tải số liệu thống kê...</div>;
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "Mới tạo", color: "text-amber-700 bg-amber-50" },
    CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700 bg-blue-50" },
    PREPARING: { label: "Đang chuẩn bị", color: "text-indigo-700 bg-indigo-50" },
    DELIVERING: { label: "Đang giao", color: "text-purple-700 bg-purple-50" },
    COMPLETED: { label: "Hoàn tất", color: "text-emerald-700 bg-emerald-50" },
    CANCELLED: { label: "Đã hủy", color: "text-red-700 bg-red-50" },
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Tổng quan vận hành
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Bảng Điều Khiển Hệ Thống VieFood
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi doanh thu, trạng thái đơn hàng và các yêu cầu tư vấn dinh dưỡng thời gian thực.
        </p>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Tổng Doanh Thu Hợp Lệ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatVnd(stats?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-gray-400">
            Chỉ tính các đơn hợp lệ (loại trừ đơn hủy)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Tổng Số Đơn Hàng</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats?.totalOrders || 0}</div>
          <p className="text-[11px] text-gray-400">
            {stats?.statusCounts?.COMPLETED || 0} đơn đã hoàn tất thành công
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Giá Trị Đơn Trung Bình</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatVnd(stats?.averageOrderValue || 0)}
          </div>
          <p className="text-[11px] text-gray-400">Trung bình mỗi đơn đặt hàng</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Yêu Cầu Tư Vấn Gói Tháng</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats?.consultationCount || 0}</div>
          <Link
            href="/admin/consultations"
            className="text-[11px] text-brand-600 font-bold hover:underline block"
          >
            Xem danh sách khách hàng →
          </Link>
        </div>
      </div>

      {/* Orders by Status Pills */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Trạng thái xử lý đơn hàng
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: "NEW", label: "Mới tạo", count: stats?.statusCounts?.NEW || 0, color: "border-amber-200 bg-amber-50 text-amber-800" },
            { key: "CONFIRMED", label: "Đã xác nhận", count: stats?.statusCounts?.CONFIRMED || 0, color: "border-blue-200 bg-blue-50 text-blue-800" },
            { key: "PREPARING", label: "Đang nấu", count: stats?.statusCounts?.PREPARING || 0, color: "border-indigo-200 bg-indigo-50 text-indigo-800" },
            { key: "DELIVERING", label: "Đang giao", count: stats?.statusCounts?.DELIVERING || 0, color: "border-purple-200 bg-purple-50 text-purple-800" },
            { key: "COMPLETED", label: "Hoàn tất", count: stats?.statusCounts?.COMPLETED || 0, color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
            { key: "CANCELLED", label: "Đã hủy", count: stats?.statusCounts?.CANCELLED || 0, color: "border-red-200 bg-red-50 text-red-800" },
          ].map((s) => (
            <Link
              key={s.key}
              href={`/admin/orders?status=${s.key}`}
              className={`p-3.5 rounded-2xl border text-center transition hover:scale-105 ${s.color}`}
            >
              <span className="text-xl font-black block">{s.count}</span>
              <span className="text-xs font-bold mt-0.5 block">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
            Đơn hàng mới nhận gần đây
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>Xem toàn bộ đơn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Mã đơn</th>
                  <th className="py-2.5 px-3">Khách hàng</th>
                  <th className="py-2.5 px-3">Chi nhánh</th>
                  <th className="py-2.5 px-3">Tổng tiền</th>
                  <th className="py-2.5 px-3">Thanh toán</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {stats?.recentOrders?.map((order: any) => {
                  const s = statusMap[order.status] || { label: order.status, color: "bg-gray-100" };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        <Link href={`/order-success/${order.orderCode}`} className="hover:text-brand-600">
                          {order.orderCode}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">{order.receiverName}</span>
                        <span className="text-[11px] text-gray-400">{order.receiverPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{order.branch?.name}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        {formatVnd(order.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-semibold">
                          {order.paymentMethod === "BANK_TRANSFER" ? "VietQR" : "COD"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

