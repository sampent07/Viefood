"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatVnd } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    totalBoxes,
    totalWeightG,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-brand-50/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-gray-900 text-lg">Giỏ hàng ({totalBoxes})</h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Giỏ hàng của bạn đang trống</p>
                  <p className="text-xs text-gray-400 mt-1">Hãy khám phá thực đơn healthy của VieFood nhé!</p>
                </div>
                <Link
                  href="/menu"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition"
                >
                  Xem thực đơn ngay
                </Link>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex space-x-3.5 p-3.5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-100 transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.productId, item.itemNote)}
                          className="text-gray-400 hover:text-red-500 p-1 -mr-1"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                        <span className="font-semibold text-brand-600">{formatVnd(item.priceVnd)}</span>
                        {item.caloriesKcal ? <span>• {item.caloriesKcal} kcal</span> : null}
                      </div>
                      {item.itemNote && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                          Ghi chú: {item.itemNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.itemNote)}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 px-2 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.itemNote)}
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatVnd(item.priceVnd * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer totals */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Tổng số hộp / khẩu phần:</span>
                  <span className="font-semibold text-gray-900">{totalBoxes} hộp</span>
                </div>
                {totalWeightG > 0 && (
                  <div className="flex justify-between">
                    <span>Tổng khối lượng dự kiến:</span>
                    <span className="font-semibold text-gray-900">~{totalWeightG} g/ml</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Tạm tính:</span>
                  <span className="text-brand-700 text-base">{formatVnd(subtotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-4 bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-xl text-center hover:bg-gray-50 transition"
                >
                  Xem chi tiết giỏ
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-4 bg-brand-600 text-white text-xs font-bold rounded-xl text-center hover:bg-brand-700 flex items-center justify-center space-x-1 shadow-md shadow-brand-500/20 transition"
                >
                  <span>Thanh toán</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

