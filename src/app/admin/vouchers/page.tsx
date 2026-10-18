"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Check, X } from "lucide-react";
import { formatVnd } from "@/lib/utils";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    title: "",
    discountType: "FIXED",
    discountValue: 20000,
    minOrderValue: 150000,
    maxDiscountValue: 20000,
    usageLimit: 1000,
  });

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vouchers");
      const data = await res.json();
      if (data.success) {
        setVouchers(data.vouchers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVoucher),
      });
      const data = await res.json();
      if (data.success) {
        setVouchers([data.voucher, ...vouchers]);
        setIsCreating(false);
        setNewVoucher({
          code: "",
          title: "",
          discountType: "FIXED",
          discountValue: 20000,
          minOrderValue: 150000,
          maxDiscountValue: 20000,
          usageLimit: 1000,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Khuyến mãi & Marketing
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">Quản Lý Mã Giảm Giá</h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo voucher mới</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-3xl p-6 border border-brand-200 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Thiết Lập Voucher Mới</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mã Voucher (Code)</label>
              <input
                type="text"
                required
                placeholder="VD: VIEFOOD10"
                value={newVoucher.code}
                onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tiêu đề chương trình</label>
              <input
                type="text"
                required
                placeholder="VD: Giảm 10% mừng năm mới"
                value={newVoucher.title}
                onChange={(e) => setNewVoucher({ ...newVoucher, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Loại giảm giá</label>
              <select
                value={newVoucher.discountType}
                onChange={(e) => setNewVoucher({ ...newVoucher, discountType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
              >
                <option value="FIXED">Giảm tiền cố định (VNĐ)</option>
                <option value="PERCENT">Giảm theo % giá trị đơn</option>
                <option value="FREE_SHIP">Miễn/giảm phí ship</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Giá trị giảm (VNĐ hoặc %)
              </label>
              <input
                type="number"
                required
                value={newVoucher.discountValue}
                onChange={(e) => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Giá trị đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                value={newVoucher.minOrderValue}
                onChange={(e) => setNewVoucher({ ...newVoucher, minOrderValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Giảm tối đa (VNĐ)</label>
              <input
                type="number"
                value={newVoucher.maxDiscountValue}
                onChange={(e) => setNewVoucher({ ...newVoucher, maxDiscountValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Hủy
              </button>
              <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl">
                Tạo voucher
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vouchers list */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Đang tải voucher...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Tiêu đề chương trình</th>
                  <th className="py-3 px-4">Loại & Mức giảm</th>
                  <th className="py-3 px-4">Đơn tối thiểu</th>
                  <th className="py-3 px-4">Đã dùng / Giới hạn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{v.code}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{v.title}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {v.discountType === "PERCENT"
                        ? `Giảm ${v.discountValue}%`
                        : v.discountType === "FREE_SHIP"
                        ? "Freeship"
                        : formatVnd(v.discountValue)}
                    </td>
                    <td className="py-3.5 px-4">{formatVnd(v.minOrderValue)}</td>
                    <td className="py-3.5 px-4 font-medium">
                      {v.usedCount} / {v.usageLimit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Đang hoạt động
                      </span>
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

