"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, AlertCircle, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Đăng nhập thất bại");
        setIsLoading(false);
        return;
      }

      if (data.user?.role === "ADMIN" || data.user?.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (e) {
      setErrorMsg("Lỗi kết nối máy chủ");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Đăng Nhập VieFood</h1>
          <p className="text-xs text-gray-500">Quản lý đơn hàng, địa chỉ và lịch gói ăn của bạn</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email hoặc Số điện thoại
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="admin@viefood.vn hoặc số điện thoại"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 active:scale-95 transition disabled:opacity-50"
          >
            <span>{isLoading ? "Đang xác thực..." : "Đăng nhập ngay"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-gray-50 rounded-2xl text-[11px] text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">Tài khoản demo thử nghiệm:</p>
          <p>• Admin: <code>admin@viefood.vn</code> / <code>admin123456</code></p>
          <p>• Khách hàng: <code>khachhang@viefood.vn</code> / <code>customer123456</code></p>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-brand-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

