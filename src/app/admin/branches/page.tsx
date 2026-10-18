"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Phone,
  Clock,
  Truck,
  X,
  Edit2,
  Power,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { formatVnd } from "@/lib/utils";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formBranch, setFormBranch] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
    openHours: "07:00 - 21:00",
    deliveryRadiusKm: 15,
    baseShippingFee: 20000,
    isActive: true,
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/branches");
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formBranch),
      });
      const data = await res.json();
      if (data.success) {
        setBranches([...branches, data.branch]);
        setIsCreating(false);
        setFormBranch({
          code: "",
          name: "",
          address: "",
          phone: "",
          openHours: "07:00 - 21:00",
          deliveryRadiusKm: 15,
          baseShippingFee: 20000,
          isActive: true,
        });
        showStatus(`Đã thêm chi nhánh mới: ${data.branch.name}`);
      } else {
        alert(data.message || "Lỗi tạo chi nhánh");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/branches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBranch),
      });
      const data = await res.json();
      if (data.success) {
        setBranches((prev) =>
          prev.map((b) => (b.id === editingBranch.id ? { ...b, ...data.branch } : b))
        );
        setEditingBranch(null);
        showStatus(`Đã cập nhật thông tin: ${data.branch.name}`);
      } else {
        alert(data.message || "Lỗi cập nhật chi nhánh");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (branch: any) => {
    const nextState = !branch.isActive;
    const confirmMsg = nextState
      ? `Kích hoạt lại chi nhánh "${branch.name}"? Chi nhánh sẽ hiển thị trở lại trên trang chủ và danh sách đặt hàng.`
      : `Ngừng hoạt động chi nhánh "${branch.name}"? Chi nhánh sẽ bị ẩn khỏi trang chủ và giỏ hàng của khách hàng, nhưng lịch sử đơn hàng cũ vẫn được bảo toàn nguyên vẹn.`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/branches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: branch.id, isActive: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        setBranches((prev) =>
          prev.map((b) => (b.id === branch.id ? { ...b, isActive: nextState } : b))
        );
        showStatus(data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Mạng lưới phục vụ
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">
            Quản Lý Chi Nhánh ({branches.length} Chi nhánh trong CSDL)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Thêm chi nhánh thứ 4, thứ 5, sửa thông tin hoặc tạm ngừng hoạt động. Khách hàng chỉ nhìn thấy chi nhánh đang hoạt động.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingBranch(null);
          }}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chi nhánh mới</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="bg-white rounded-3xl p-6 border-2 border-brand-300 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Thêm Chi Nhánh Mới</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mã Chi Nhánh (Code duy nhất) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: CN-CG (Cầu Giấy) hoặc CN-TB (Tân Bình)"
                value={formBranch.code}
                onChange={(e) =>
                  setFormBranch({ ...formBranch, code: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tên Chi Nhánh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: VieFood Cầu Giấy - Hà Nội"
                value={formBranch.name}
                onChange={(e) => setFormBranch({ ...formBranch, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={formBranch.address}
                onChange={(e) => setFormBranch({ ...formBranch, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Số điện thoại hotline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: 0904 888 999"
                value={formBranch.phone}
                onChange={(e) => setFormBranch({ ...formBranch, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Khung giờ mở cửa</label>
              <input
                type="text"
                value={formBranch.openHours}
                onChange={(e) => setFormBranch({ ...formBranch, openHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bán kính giao hàng (km)</label>
              <input
                type="number"
                value={formBranch.deliveryRadiusKm}
                onChange={(e) =>
                  setFormBranch({ ...formBranch, deliveryRadiusKm: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phí giao cơ bản (VNĐ)</label>
              <input
                type="number"
                value={formBranch.baseShippingFee}
                onChange={(e) =>
                  setFormBranch({ ...formBranch, baseShippingFee: Number(e.target.value) })
                }
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
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-md"
              >
                {isSaving ? "Đang lưu..." : "Tạo & Kích hoạt chi nhánh"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingBranch && (
        <div className="bg-white rounded-3xl p-6 border-2 border-blue-300 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">
              Chỉnh Sửa Chi Nhánh: {editingBranch.name}
            </h3>
            <button
              onClick={() => setEditingBranch(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mã Chi Nhánh</label>
              <input
                type="text"
                required
                value={editingBranch.code}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, code: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tên Chi Nhánh</label>
              <input
                type="text"
                required
                value={editingBranch.name}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Địa chỉ chi tiết</label>
              <input
                type="text"
                required
                value={editingBranch.address}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, address: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                required
                value={editingBranch.phone}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Giờ mở cửa</label>
              <input
                type="text"
                value={editingBranch.openHours}
                onChange={(e) =>
                  setEditingBranch({ ...editingBranch, openHours: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bán kính giao hàng (km)</label>
              <input
                type="number"
                value={editingBranch.deliveryRadiusKm}
                onChange={(e) =>
                  setEditingBranch({
                    ...editingBranch,
                    deliveryRadiusKm: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phí giao cơ bản (VNĐ)</label>
              <input
                type="number"
                value={editingBranch.baseShippingFee}
                onChange={(e) =>
                  setEditingBranch({
                    ...editingBranch,
                    baseShippingFee: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
              >
                {isSaving ? "Đang lưu..." : "Cập nhật thay đổi"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className={`bg-white rounded-3xl p-6 border-2 shadow-sm transition space-y-4 flex flex-col justify-between ${
              b.isActive
                ? "border-gray-100 hover:border-brand-200"
                : "border-red-100 bg-gray-50/70 opacity-80"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 text-brand-600">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">{b.code}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{b.name}</h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    b.isActive
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-red-700 bg-red-50 border-red-200"
                  }`}
                >
                  {b.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{b.address}</p>

              <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div>Giờ hoạt động: <strong className="text-gray-800">{b.openHours}</strong></div>
                <div>Hotline: <strong className="text-gray-800">{b.phone}</strong></div>
                <div>Bán kính: <strong className="text-gray-800">{b.deliveryRadiusKm} km</strong></div>
                <div>Phí giao: <strong className="text-brand-700">{formatVnd(b.baseShippingFee)}</strong></div>
                <div className="flex items-center space-x-1 pt-1 text-gray-400 text-[11px]">
                  <ShoppingBag className="w-3 h-3" />
                  <span>Đơn hàng đã gắn với chi nhánh này: <strong>{b._count?.orders || 0} đơn</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setEditingBranch({ ...b });
                  setIsCreating(false);
                }}
                className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>

              <button
                onClick={() => handleToggleActive(b)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                  b.isActive
                    ? "bg-red-50 hover:bg-red-100 text-red-700"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                }`}
                title={b.isActive ? "Ngừng hoạt động chi nhánh này" : "Kích hoạt lại chi nhánh này"}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{b.isActive ? "Ngừng HĐ" : "Bật lại"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
