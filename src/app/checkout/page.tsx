"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  User,
  CreditCard,
  QrCode,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useBranch } from "@/lib/branch-context";
import { formatVnd } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    totalBoxes,
    appliedVoucher,
    orderNote,
    setOrderNote,
  } = useCart();

  const { branches, currentBranch, setCurrentBranch } = useBranch();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("Hôm nay");
  const [deliverySlot, setDeliverySlot] = useState("Càng sớm càng tốt (30-45 phút)");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("BANK_TRANSFER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill if logged in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setReceiverName(data.user.name || "");
          setReceiverPhone(data.user.phone || "");
          if (data.user.addresses && data.user.addresses.length > 0) {
            const def = data.user.addresses.find((a: any) => a.isDefault) || data.user.addresses[0];
            setDeliveryAddress(`${def.street}, ${def.ward}, ${def.district}, ${def.province}`);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!receiverName.trim() || !receiverPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ tên người nhận, số điện thoại và địa chỉ giao hàng.");
      return;
    }

    if (!currentBranch) {
      setErrorMessage("Vui lòng chọn chi nhánh phục vụ.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Giỏ hàng đang trống.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverName,
          receiverPhone,
          branchId: currentBranch.id,
          deliveryAddress,
          deliveryDate,
          deliverySlot,
          orderNote,
          paymentMethod,
          voucherCode: appliedVoucher ? appliedVoucher.code : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            itemNote: i.itemNote,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Đặt hàng không thành công, vui lòng thử lại.");
        setIsSubmitting(false);
        return;
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success/${data.orderCode}`);
    } catch (e) {
      setErrorMessage("Lỗi kết nối máy chủ khi tạo đơn hàng.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Giỏ hàng đang trống, không thể thanh toán.</p>
        <Link href="/menu" className="mt-4 inline-block text-brand-600 font-bold text-sm">
          Quay lại thực đơn →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
          Bước cuối cùng
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Xác Nhận & Thanh Toán Đơn Hàng
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details and Payment method */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Recipient info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>1. Thông tin người nhận</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Nhựt Huy"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988777666"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Địa chỉ nhận hàng (Số nhà, đường, phường/xã, quận/huyện){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Branch & Delivery Time Slot */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>2. Chi nhánh & Khung giờ giao hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Chi nhánh chuẩn bị món ăn
                </label>
                <select
                  value={currentBranch?.id}
                  onChange={(e) => {
                    const found = branches.find((b) => b.id === e.target.value);
                    if (found) setCurrentBranch(found);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Ngày giao</label>
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Hôm nay">Hôm nay</option>
                  <option value="Ngày mai">Ngày mai</option>
                  <option value="Hẹn ngày khác">Hẹn ngày khác theo ghi chú</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Khung giờ giao</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Càng sớm càng tốt (30-45 phút)">Càng sớm càng tốt (30 - 45 phút)</option>
                  <option value="Bữa trưa (11:30 - 12:30)">Bữa trưa (11:30 - 12:30)</option>
                  <option value="Bữa chiều/tối (17:30 - 18:30)">Bữa chiều/tối (17:30 - 18:30)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Ghi chú đơn hàng (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ghi chú thêm về giờ giao, địa chỉ chi tiết..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>3. Phương thức thanh toán</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* VietQR Bank Transfer */}
              <div
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-brand-500 bg-brand-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Chuyển khoản QR (VietQR)</span>
                    {paymentMethod === "BANK_TRANSFER" && <Check className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Tạo mã VietQR tự động kèm số tiền và mã đơn để quét bằng mọi app ngân hàng.
                  </p>
                </div>
              </div>

              {/* COD */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === "COD"
                    ? "border-brand-500 bg-brand-50/50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    {paymentMethod === "COD" && <Check className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Thanh toán tiền mặt cho tài xế sau khi kiểm tra đúng hộp món ăn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider pb-3 border-b border-gray-100">
              Tóm tắt đơn hàng ({totalBoxes} hộp)
            </h3>

            {/* List preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 pr-1 text-xs">
              {items.map((i, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div className="pr-2">
                    <span className="font-bold text-gray-800 line-clamp-1">{i.name}</span>
                    <span className="text-[11px] text-gray-400">
                      {formatVnd(i.priceVnd)} x {i.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    {formatVnd(i.priceVnd * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính tiền món:</span>
                <span className="font-bold text-gray-900">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng ({currentBranch?.code}):</span>
                <span className="font-bold text-gray-900">{formatVnd(shippingFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá ({appliedVoucher?.code}):</span>
                  <span>- {formatVnd(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-sm font-bold text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-2xl font-black text-brand-700">{formatVnd(totalAmount)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-98 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? "Đang xử lý đơn..." : "Xác nhận đặt hàng ngay"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Bằng việc bấm đặt hàng, bạn đồng ý với các điều khoản mua sắm và chính sách giao nhận của VieFood.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

