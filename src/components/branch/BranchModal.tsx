"use client";

import React from "react";
import { X, MapPin, Phone, Clock, Check, Truck } from "lucide-react";
import { useBranch } from "@/lib/branch-context";
import { formatVnd } from "@/lib/utils";

export default function BranchModal() {
  const { branches, currentBranch, setCurrentBranch, isBranchModalOpen, setIsBranchModalOpen } = useBranch();

  if (!isBranchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsBranchModalOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Chọn Chi Nhánh Phục Vụ</h3>
              <p className="text-xs text-gray-500">Xem đúng thực đơn, phí giao và ưu đãi theo khu vực của bạn</p>
            </div>
          </div>
          <button
            onClick={() => setIsBranchModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {branches.map((branch) => {
            const isSelected = currentBranch?.id === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => {
                  setCurrentBranch(branch);
                  setIsBranchModalOpen(false);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/50 shadow-sm"
                    : "border-gray-100 hover:border-brand-200 hover:bg-gray-50/60"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 text-sm">{branch.name}</span>
                      {isSelected && (
                        <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                          <Check className="w-3 h-3" />
                          <span>Đang chọn</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{branch.openHours}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-2 text-brand-700 font-medium">
                    <Truck className="w-3.5 h-3.5 text-brand-600" />
                    <span>
                      Phí giao chuẩn: {formatVnd(branch.baseShippingFee)} (Bán kính {branch.deliveryRadiusKm}km)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400">
            * Mọi đơn hàng được chế biến và giao trực tiếp từ chi nhánh gần nhất để đảm bảo độ nóng sốt và tươi ngon.
          </p>
        </div>
      </div>
    </div>
  );
}

