"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import { formatVnd, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "NEW", label: "Mới tạo (NEW)" },
    { value: "CONFIRMED", label: "Đã xác nhận (CONFIRMED)" },
    { value: "PREPARING", label: "Bếp đang nấu (PREPARING)" },
    { value: "DELIVERING", label: "Đang giao hàng (DELIVERING)" },
    { value: "COMPLETED", label: "Hoàn tất (COMPLETED)" },
    { value: "CANCELLED", label: "Đã hủy (CANCELLED)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Vận hành đơn
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">Quản Lý Đơn Hàng</h1>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm mã đơn, tên, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchOrders();
              }}
              className="text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-52"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchOrders}
            className="px-3 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition"
          >
            Lọc
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">Không tìm thấy đơn hàng nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Khách nhận & Địa chỉ</th>
                  <th className="py-3 px-4">Chi nhánh</th>
                  <th className="py-3 px-4">Món ăn đặt</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4">Thanh toán</th>
                  <th className="py-3 px-4">Cập nhật trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900 align-top">
                      {order.orderCode}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-bold text-gray-900 block">{order.receiverName}</span>
                      <span className="text-gray-500 block">{order.receiverPhone}</span>
                      <span className="text-[11px] text-gray-400 block max-w-xs truncate">
                        {order.deliveryAddress}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top text-gray-600 font-medium">
                      {order.branch?.name}
                    </td>
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="space-y-1">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="text-[11px]">
                            • <strong className="text-gray-800">{item.productName}</strong> x
                            {item.quantity}
                            {item.itemNote && (
                              <span className="text-amber-700 italic block pl-2 text-[10px]">
                                ({item.itemNote})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top font-bold text-brand-700">
                      {formatVnd(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-semibold block">
                        {order.paymentMethod === "BANK_TRANSFER" ? "VietQR" : "COD"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="text-xs font-semibold py-1.5 px-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="NEW">Mới tạo (NEW)</option>
                        <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                        <option value="PREPARING">Đang nấu (PREPARING)</option>
                        <option value="DELIVERING">Đang giao (DELIVERING)</option>
                        <option value="COMPLETED">Hoàn tất (COMPLETED)</option>
                        <option value="CANCELLED">Hủy đơn (CANCELLED)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

