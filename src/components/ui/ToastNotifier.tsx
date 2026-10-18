"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function ToastNotifier() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-2.5 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

