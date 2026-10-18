"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ArrowLeft,
  Scale,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useBranch } from "@/lib/branch-context";
import { formatVnd, CATEGORY_MAP } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    totalBoxes,
    totalWeightG,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    orderNote,
    setOrderNote,
  } = useCart();

  const { currentBranch, setIsBranchModalOpen } = useBranch();

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setVoucherLoading(true);
    setVoucherError(null);

    const res = await applyVoucher(voucherInput.trim());
    setVoucherLoading(false);
    if (!res.success) {
      setVoucherError(res.message);
    } else {
      setVoucherInput("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Giỏ Hàng Của Bạn Đang Trống</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Hãy khám phá hơn 50 món ăn healthy tính toán calo chi tiết để bổ sung vào thực đơn của bạn ngay hôm nay!
        </p>
        <div className="pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white text-xs font-bold rounded-2xl hover:bg-brand-700 shadow-md shadow-brand-500/20 transition"
          >
            <span>Khám phá thực đơn</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
            Xem lại đơn hàng
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Giỏ Hàng Của Bạn ({totalBoxes} món)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa toàn bộ giỏ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List and General Notes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-brand-600 uppercase">
                      {CATEGORY_MAP[item.categorySlug] || item.categorySlug}
                    </span>
                    <Link
                      href={`/product/${item.slug}`}
                      className="block font-bold text-gray-900 text-sm sm:text-base truncate hover:text-brand-600 transition"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                      <span className="font-semibold text-brand-700">{formatVnd(item.priceVnd)}</span>
                      {item.caloriesKcal ? <span>• {item.caloriesKcal} kcal</span> : null}
                      {item.estimatedWeightG ? <span>• ~{item.estimatedWeightG}g</span> : null}
                    </div>

                    {item.itemNote && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 rounded-lg px-2 py-0.5 mt-1.5 inline-block">
                        Ghi chú: {item.itemNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.itemNote)}
                      className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 px-2 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.itemNote)}
                      className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm sm:text-base font-extrabold text-gray-900 min-w-[90px] text-right">
                    {formatVnd(item.priceVnd * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId, item.itemNote)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"
                    title="Xóa món"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* General Order Notes */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Ghi chú cho toàn đơn hàng
            </label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Giao giờ trưa khoảng 11h45, để trước cửa phòng 402, xin thêm khăn giấy..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Back link */}
          <div>
            <Link
              href="/menu"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-brand-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tiếp tục chọn thêm món khác</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Voucher */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Branch Display */}
          <div className="bg-brand-50/60 rounded-3xl p-5 border border-brand-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-800 font-bold flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Chi nhánh phục vụ</span>
              </span>
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="text-brand-700 font-bold hover:underline"
              >
                Đổi
              </button>
            </div>
            <p className="text-xs font-semibold text-gray-900">{currentBranch?.name}</p>
            <p className="text-[11px] text-gray-500">{currentBranch?.address}</p>
          </div>

          {/* Voucher input block */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Mã Giảm Giá / Voucher</span>
            </label>

            {appliedVoucher ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800">
                <div>
                  <span className="font-extrabold block">{appliedVoucher.code}</span>
                  <span className="text-[11px] text-emerald-700">{appliedVoucher.title}</span>
                </div>
                <button
                  onClick={removeVoucher}
                  className="text-red-500 hover:text-red-700 font-bold text-xs"
                >
                  Gỡ
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Nhập mã: VIEFOODNEW, FREESHIP..."
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    disabled={voucherLoading || !voucherInput.trim()}
                    className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition disabled:opacity-40"
                  >
                    {voucherLoading ? "Kiểm tra..." : "Áp dụng"}
                  </button>
                </div>

                {voucherError && (
                  <p className="text-xs text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{voucherError}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Totals Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100">
              Chi tiết thanh toán
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tổng số hộp / khẩu phần:</span>
                <span className="font-bold text-gray-800">{totalBoxes} hộp</span>
              </div>

              {totalWeightG > 0 && (
                <div className="flex justify-between">
                  <span>Tổng khối lượng dự kiến:</span>
                  <span className="font-bold text-gray-800">~{totalWeightG} g/ml</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tạm tính tiền món:</span>
                <span className="font-bold text-gray-800">{formatVnd(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Phí giao hàng dự kiến:</span>
                <span className="font-bold text-gray-800">{formatVnd(shippingFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá khuyến mãi:</span>
                  <span>- {formatVnd(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
                <span className="text-xl font-black text-brand-700">{formatVnd(totalAmount)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-98 transition block text-center"
            >
              <span>Tiến hành thanh toán</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

