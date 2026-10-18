"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Phone, Clock, Truck, X } from "lucide-react";
import { formatVnd } from "@/lib/utils";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBranch, setNewBranch] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
    openHours: "07:00 - 21:00",
    deliveryRadiusKm: 15,
    baseShippingFee: 20000,
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
      });
      const data = await res.json();
      if (data.success) {
        setBranches([...branches, data.branch]);
        setIsCreating(false);
        setNewBranch({
          code: "",
          name: "",
          address: "",
          phone: "",
          openHours: "07:00 - 21:00",
          deliveryRadiusKm: 15,
          baseShippingFee: 20000,
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
            Mạng lưới phục vụ
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-0.5">Quản Lý Chi Nhánh</h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chi nhánh</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-3xl p-6 border border-brand-200 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Thêm Chi Nhánh Mới</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mã Chi Nhánh (Code)</label>
              <input
                type="text"
                required
                placeholder="VD: CN-CG"
                value={newBranch.code}
                onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tên Chi Nhánh</label>
              <input
                type="text"
                required
                placeholder="VD: VieFood Cầu Giấy - Hà Nội"
                value={newBranch.name}
                onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Địa chỉ chi tiết</label>
              <input
                type="text"
                required
                placeholder="Số nhà, đường, phường, quận..."
                value={newBranch.address}
                onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                required
                placeholder="0901 xxx xxx"
                value={newBranch.phone}
                onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Giờ mở cửa</label>
              <input
                type="text"
                value={newBranch.openHours}
                onChange={(e) => setNewBranch({ ...newBranch, openHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bán kính giao (km)</label>
              <input
                type="number"
                value={newBranch.deliveryRadiusKm}
                onChange={(e) => setNewBranch({ ...newBranch, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phí giao cơ bản (VNĐ)</label>
              <input
                type="number"
                value={newBranch.baseShippingFee}
                onChange={(e) => setNewBranch({ ...newBranch, baseShippingFee: Number(e.target.value) })}
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
                Lưu chi nhánh
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-2 text-brand-600">
              <MapPin className="w-5 h-5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 block">{b.code}</span>
                <h3 className="font-bold text-gray-900 text-sm">{b.name}</h3>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{b.address}</p>

            <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-50">
              <div>Giờ hoạt động: <strong className="text-gray-800">{b.openHours}</strong></div>
              <div>Hotline: <strong className="text-gray-800">{b.phone}</strong></div>
              <div>Bán kính: <strong className="text-gray-800">{b.deliveryRadiusKm} km</strong></div>
              <div>Phí giao: <strong className="text-brand-700">{formatVnd(b.baseShippingFee)}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

