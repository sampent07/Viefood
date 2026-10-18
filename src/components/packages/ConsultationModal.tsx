"use client";

import React, { useState } from "react";
import { X, CheckCircle, Send, Sparkles, Phone, ShieldCheck, AlertCircle } from "lucide-react";
import { useBranch } from "@/lib/branch-context";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackageName?: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  defaultPackageName = "Gói ăn chuyên sâu 1 Tháng",
}: ConsultationModalProps) {
  const { branches, currentBranch } = useBranch();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [zalo, setZalo] = useState("");
  const [packageInterest, setPackageInterest] = useState(defaultPackageName);
  const [branchId, setBranchId] = useState(currentBranch?.id || "");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [budget, setBudget] = useState("");
  const [dietaryGoals, setDietaryGoals] = useState("");
  const [preferredContactTime, setPreferredContactTime] = useState("");
  const [notes, setNotes] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền họ tên và số điện thoại.");
      return;
    }

    if (!consentAgreed) {
      setErrorMsg("Vui lòng đồng ý cho VieFood liên hệ tư vấn.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          zalo: zalo || phone,
          packageInterest,
          branchId: branchId || currentBranch?.id,
          deliveryArea,
          budget,
          dietaryGoals,
          preferredContactTime,
          notes,
          consentAgreed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Đã xảy ra lỗi, vui lòng thử lại");
        return;
      }

      setSuccessCode(data.requestCode);
    } catch (e) {
      setErrorMsg("Không thể kết nối máy chủ, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessCode(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successCode ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Gửi yêu cầu tư vấn thành công!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
              Cảm ơn bạn <span className="font-bold text-gray-800">{fullName}</span> đã quan tâm đến giải pháp dinh dưỡng của VieFood.
            </p>
            <div className="bg-brand-50 border border-brand-200/80 rounded-2xl p-4 max-w-sm mx-auto">
              <span className="text-xs text-brand-800 font-semibold block">Mã yêu cầu tư vấn của bạn</span>
              <span className="text-xl font-extrabold text-brand-700 tracking-wider block mt-0.5">
                {successCode}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Chuyên viên dinh dưỡng của VieFood sẽ liên hệ lại qua điện thoại / Zalo trong vòng 30 phút (trong giờ hành chính).
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition"
            >
              Hoàn tất
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-600">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Tư vấn dinh dưỡng 1-1</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Đăng Ký Tư Vấn Gói Tháng Cá Nhân Hóa
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Để lại thông tin để chuyên viên tính toán macro, calo và lên thực đơn phù hợp nhất với thể trạng của bạn.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  placeholder="Ví dụ: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Số Zalo (nếu khác SĐT)
                </label>
                <input
                  type="tel"
                  placeholder="Để nhận bảng thực đơn mẫu"
                  value={zalo}
                  onChange={(e) => setZalo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chi nhánh phục vụ</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Khu vực / Địa chỉ giao hàng dự kiến
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 1, TP.HCM hoặc cơ quan làm việc"
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mục tiêu dinh dưỡng
                </label>
                <select
                  value={dietaryGoals}
                  onChange={(e) => setDietaryGoals(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Chọn mục tiêu --</option>
                  <option value="Giảm mỡ, siết cân">Giảm mỡ, siết cân</option>
                  <option value="Tăng cơ, bổ sung đạm nạc">Tăng cơ, bổ sung đạm nạc</option>
                  <option value="Duy trì vóc dáng, ăn sạch">Duy trì vóc dáng, ăn sạch (Eat clean)</option>
                  <option value="Ăn chay thanh đạm">Ăn chay thanh đạm, thuần thực vật</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Thời gian phù hợp để liên hệ
                </label>
                <select
                  value={preferredContactTime}
                  onChange={(e) => setPreferredContactTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Bất kỳ lúc nào">Bất kỳ lúc nào trong giờ làm việc</option>
                  <option value="Sáng (08:30 - 11:30)">Buổi sáng (08:30 - 11:30)</option>
                  <option value="Chiều (13:30 - 17:30)">Buổi chiều (13:30 - 17:30)</option>
                  <option value="Tối (18:00 - 20:00)">Buổi tối (18:00 - 20:00)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Ghi chú dị ứng hoặc yêu cầu món đặc biệt
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Không ăn được cay, dị ứng hải sản, muốn đổi nước detox..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start space-x-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 mt-0.5"
                />
                <span className="leading-tight">
                  Tôi đồng ý để VieFood liên hệ qua SĐT/Zalo nhằm tư vấn gói ăn theo chính sách bảo mật thông tin.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-95 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu tư vấn ngay"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

