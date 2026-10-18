"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Truck, Store, AlertCircle, RefreshCw } from "lucide-react";
import { Branch } from "@/lib/types";
import { formatVnd } from "@/lib/utils";

interface HomeBranchesSectionProps {
  initialBranches?: Branch[];
}

export default function HomeBranchesSection({ initialBranches = [] }: HomeBranchesSectionProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [loading, setLoading] = useState(initialBranches.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBranches = async () => {
    try {
      const res = await fetch("/api/branches", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.branches)) {
        setBranches(data.branches);
        setError(null);
      } else {
        setError("Không thể tải danh sách chi nhánh");
      }
    } catch (e) {
      console.error("Error loading branches on homepage:", e);
      setError("Lỗi kết nối khi tải chi nhánh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBranches();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Hệ thống cửa hàng
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Chi Nhánh VieFood Đang Phục Vụ ({branches.length} Chi nhánh)
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
          Danh sách chi nhánh đang hoạt động, cập nhật tự động theo thời gian thực.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-xs text-gray-400 space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
          <span>Đang đồng bộ danh sách chi nhánh từ máy chủ...</span>
        </div>
      ) : error && branches.length === 0 ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6 space-y-2">
          <Store className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500 font-medium">
            Hiện tại chưa có chi nhánh nào đang mở cửa phục vụ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 text-brand-600">
                  <div className="w-9 h-9 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full uppercase">
                      {b.code}
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base mt-0.5">
                      {b.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{b.address}</p>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-50 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>
                      Giờ hoạt động: <strong className="text-gray-800">{b.openHours}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>
                      Hotline: <strong className="text-gray-800">{b.phone}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-brand-700">
                    <Truck className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>
                      Phí giao chuẩn: <strong>{formatVnd(b.baseShippingFee)}</strong> (Tối đa {b.deliveryRadiusKm}km)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50">
                <a
                  href={`tel:${b.phone}`}
                  className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl text-center block transition"
                >
                  Liên hệ chi nhánh này
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

