"use client";

import React, { useState, useEffect } from "react";
import { Tag, Copy, Check, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Voucher } from "@/lib/types";
import { formatVnd } from "@/lib/utils";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/vouchers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVouchers(data.vouchers);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Ưu đãi dành cho bạn
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Kho Mã Giảm Giá VieFood
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Sao chép mã ưu đãi và dán vào ô voucher tại bước thanh toán để nhận ngay chiết khấu trực tiếp cho bữa ăn healthy của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-3xl p-6 border-2 border-dashed border-brand-200 hover:border-brand-400 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center space-x-1 bg-brand-50 text-brand-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  <Tag className="w-3 h-3" />
                  <span>
                    {v.discountType === "PERCENT"
                      ? `Giảm ${v.discountValue}%`
                      : v.discountType === "FREE_SHIP"
                      ? "Miễn phí ship"
                      : `Giảm ${formatVnd(v.discountValue)}`}
                  </span>
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">Có hạn</span>
              </div>

              <h3 className="font-extrabold text-gray-900 text-base mt-3 leading-snug">
                {v.title}
              </h3>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                <div>
                  Đơn hàng tối thiểu:{" "}
                  <strong className="text-gray-800">{formatVnd(v.minOrderValue)}</strong>
                </div>
                {v.maxDiscountValue && (
                  <div>
                    Giảm tối đa:{" "}
                    <strong className="text-gray-800">{formatVnd(v.maxDiscountValue)}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono font-bold text-sm text-gray-900 text-center tracking-wider">
                {v.code}
              </div>
              <button
                onClick={() => handleCopy(v.code)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 transition shadow-sm"
              >
                {copiedCode === v.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Lấy mã</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/menu"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white text-xs font-bold rounded-2xl hover:bg-brand-700 shadow-md shadow-brand-500/20 transition"
        >
          <span>Áp dụng vào thực đơn ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

