"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Copy,
  Check,
  QrCode,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ArrowRight,
  Info,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Order } from "@/lib/types";
import { formatVnd, formatDate } from "@/lib/utils";

interface OrderSuccessClientProps {
  order: Order;
}

export default function OrderSuccessClient({ order: initialOrder }: OrderSuccessClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notifying, setNotifying] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(
    (initialOrder as any).customerTransferred
      ? "Đã ghi nhận thông báo chuyển khoản của bạn. Đơn hàng đang được tiến hành đối soát giao dịch."
      : null
  );

  // Exact verified bank information from the user's uploaded QR
  const bankName = "BIDV - PGD Lê Văn Sỹ";
  const bankAccount = "8823016648";
  const accountHolder = "NGUYEN THI TUONG VY";
  const transferContent = `${order.orderCode} TT DON HANG`;

  // Direct path to original unedited QR image added by user
  const originalQrPath = "/1792348842013_2275018627102805874_2275018627102805874_69ee40cd9c7d88cf25ee9af13ec870a5.jpg";

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleNotifyTransfer = async () => {
    setNotifying(true);
    try {
      const res = await fetch(`/api/orders/${order.orderCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "NOTIFY_TRANSFER" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setNotificationMsg(
          "Đã ghi nhận thông báo chuyển khoản của bạn! Hệ thống đang tiến hành đối soát với ngân hàng BIDV. Đơn hàng sẽ được chuyển sang 'Đã thanh toán' ngay khi có xác nhận giao dịch hợp lệ từ quản trị viên hoặc ngân hàng."
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNotifying(false);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "Mới tạo (Chờ xử lý)", color: "text-amber-700 bg-amber-50 border-amber-200" },
    CONFIRMED: { label: "Đã xác nhận đơn", color: "text-blue-700 bg-blue-50 border-blue-200" },
    PREPARING: { label: "Bếp đang chế biến", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
    DELIVERING: { label: "Đang giao hàng", color: "text-purple-700 bg-purple-50 border-purple-200" },
    COMPLETED: { label: "Hoàn tất thành công", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    CANCELLED: { label: "Đã hủy đơn", color: "text-red-700 bg-red-50 border-red-200" },
  };

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    color: "text-gray-700 bg-gray-50 border-gray-200",
  };

  const isPaid = order.paymentStatus === "PAID";
  const hasNotified = (order as any).customerTransferred;

  return (
    <div className="space-y-8">
      {/* Top Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Mã đơn hàng của bạn là:{" "}
          <span className="font-extrabold text-brand-700 tracking-wider text-base">
            {order.orderCode}
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
            Đơn hàng: {statusInfo.label}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isPaid
                ? "text-emerald-700 bg-emerald-50 border-emerald-300"
                : "text-amber-700 bg-amber-50 border-amber-300"
            }`}
          >
            Thanh toán: {isPaid ? "✓ Đã thanh toán (PAID)" : "Chờ thanh toán (PENDING)"}
          </span>
        </div>
      </div>

      {/* Bank Transfer QR section if paymentMethod is BANK_TRANSFER */}
      {order.paymentMethod === "BANK_TRANSFER" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
          <div className="flex items-center space-x-2 text-brand-700 pb-3 border-b border-gray-100">
            <QrCode className="w-5 h-5 text-brand-600" />
            <h2 className="font-extrabold text-base">
              {isPaid ? "Thông Tin Chuyển Khoản Đã Xác Nhận" : "Quét Mã VietQR Chuyển Khoản"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Direct Original QR Box */}
            <div className="md:col-span-5 text-center flex flex-col items-center">
              <div className="p-3 bg-white border-2 border-brand-200 rounded-3xl shadow-sm inline-block max-w-[280px] w-full">
                {/* Image rendered with pure object-contain, no distortion, no cropping, 100% original content */}
                <img
                  src={originalQrPath}
                  alt="Mã QR thanh toán VietQR chính thức của VieFood"
                  className="w-full h-auto rounded-2xl mx-auto object-contain shadow-sm"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-2 block font-medium">
                Mã VietQR chính thức — Quét bằng ứng dụng ngân hàng bất kỳ
              </span>
            </div>

            {/* Verified Bank details & Copy buttons */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-gray-400 block text-[10px]">Ngân hàng thụ hưởng</span>
                  <span className="font-bold text-gray-900">{bankName}</span>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-gray-400 block text-[10px]">Số tài khoản chính thức</span>
                  <span className="font-mono text-sm font-black text-gray-900">{bankAccount}</span>
                </div>
                <button
                  onClick={() => handleCopy(bankAccount, "account")}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 flex items-center space-x-1"
                >
                  {copiedField === "account" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-gray-400 block text-[10px]">Tên chủ tài khoản</span>
                  <span className="font-bold text-gray-900">{accountHolder}</span>
                </div>
              </div>

              <div className="p-3.5 bg-brand-50 border border-brand-100 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-brand-800 block text-[10px] font-semibold">
                    Số tiền cần thanh toán
                  </span>
                  <span className="text-base font-black text-brand-700">
                    {formatVnd(order.totalAmount)}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(String(order.totalAmount), "amount")}
                  className="px-3 py-1.5 bg-white border border-brand-200 rounded-xl text-brand-700 font-semibold hover:bg-brand-100 flex items-center space-x-1"
                >
                  {copiedField === "amount" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-amber-800 block text-[10px] font-semibold">
                    Nội dung chuyển khoản (bắt buộc)
                  </span>
                  <span className="font-mono text-xs font-black text-amber-900">
                    {transferContent}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(transferContent, "memo")}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-amber-800 font-semibold hover:bg-amber-100 flex items-center space-x-1"
                >
                  {copiedField === "memo" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Customer confirmation button */}
          {!isPaid && (
            <div className="pt-2 border-t border-gray-100 space-y-3">
              {notificationMsg && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{notificationMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl">
                <div>
                  <span className="font-bold text-gray-900 text-xs block">
                    Bạn đã hoàn tất chuyển khoản trên ứng dụng ngân hàng?
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Bấm nút bên cạnh để thông báo cho nhân viên kế toán tiến hành đối soát giao dịch.
                  </p>
                </div>

                <button
                  onClick={handleNotifyTransfer}
                  disabled={notifying || hasNotified}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition flex-shrink-0 ${
                    hasNotified
                      ? "bg-gray-200 text-gray-600 cursor-default"
                      : "bg-brand-600 hover:bg-brand-700 text-white shadow-md active:scale-95"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {hasNotified
                      ? "Đã gửi thông báo chuyển khoản"
                      : notifying
                      ? "Đang gửi..."
                      : "Tôi đã chuyển khoản"}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 italic">
                * Lưu ý: Thao tác thông báo không tự động xác nhận đơn đã thanh toán. Trạng thái &quot;Đã thanh toán&quot; chỉ được kích hoạt sau khi đối soát thành công từ sao kê ngân hàng BIDV hoặc xác nhận của Quản trị viên.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Itemized Receipt */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
          Chi Tiết Đơn Hàng & Người Nhận
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="text-gray-400 block">Người nhận hàng:</span>
            <span className="font-bold text-gray-800 text-sm">{order.receiverName}</span>
            <p className="mt-0.5">SĐT: {order.receiverPhone}</p>
          </div>

          <div>
            <span className="text-gray-400 block">Địa chỉ nhận hàng:</span>
            <span className="font-bold text-gray-800">{order.deliveryAddress}</span>
            <p className="mt-0.5 text-gray-500">
              Khung giờ: {order.deliverySlot || "Càng sớm càng tốt"}
            </p>
          </div>

          <div>
            <span className="text-gray-400 block">Chi nhánh phục vụ:</span>
            <span className="font-bold text-gray-800">{order.branch?.name}</span>
            <p className="mt-0.5 text-gray-500">{order.branch?.address}</p>
          </div>

          <div>
            <span className="text-gray-400 block">Phương thức thanh toán:</span>
            <span className="font-bold text-gray-800">
              {order.paymentMethod === "BANK_TRANSFER"
                ? "Chuyển khoản QR (VietQR)"
                : "Tiền mặt khi nhận hàng (COD)"}
            </span>
            <p className="mt-0.5 text-gray-500">Thời gian tạo: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Món ăn</th>
                <th className="py-2.5 px-3 text-center">Số lượng</th>
                <th className="py-2.5 px-3 text-right">Đơn giá</th>
                <th className="py-2.5 px-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-3">
                    <span className="font-bold text-gray-900 block">{item.productName}</span>
                    {item.itemNote && (
                      <span className="text-[11px] text-amber-700 italic">
                        Ghi chú: {item.itemNote}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-2 px-3 text-right">{formatVnd(item.priceAtPurchase)}</td>
                  <td className="py-2 px-3 text-right font-bold text-gray-900">
                    {formatVnd(item.priceAtPurchase * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-1.5 text-xs text-gray-600 pt-2 text-right">
          <div>
            Tạm tính tiền món: <strong className="text-gray-900">{formatVnd(order.subtotal)}</strong>
          </div>
          <div>
            Phí giao hàng: <strong className="text-gray-900">{formatVnd(order.shippingFee)}</strong>
          </div>
          {order.discountAmount > 0 && (
            <div className="text-emerald-600 font-bold">
              Giảm giá voucher: - {formatVnd(order.discountAmount)}
            </div>
          )}
          <div className="text-base font-black text-brand-700 pt-2 border-t border-gray-100">
            Tổng thanh toán: {formatVnd(order.totalAmount)}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Link
          href="/"
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl shadow-md transition"
        >
          Quay lại trang chủ
        </Link>
        <Link
          href="/menu"
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-2xl hover:bg-gray-50 transition"
        >
          Đặt thêm món khác
        </Link>
      </div>
    </div>
  );
}
