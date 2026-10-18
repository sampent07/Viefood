"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, Voucher } from "./types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, itemNote?: string) => void;
  updateQuantity: (productId: string, quantity: number, itemNote?: string) => void;
  removeItem: (productId: string, itemNote?: string) => void;
  clearCart: () => void;
  itemCount: number;
  totalBoxes: number;
  totalWeightG: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  setShippingFee: (fee: number) => void;
  totalAmount: number;
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => Promise<{ success: boolean; message: string }>;
  removeVoucher: () => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "viefood_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(20000); // Default standard fee
  const [orderNote, setOrderNote] = useState<string>("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    }
  }, [items, isInitialized]);

  // Recalculate voucher discount when subtotal changes
  const subtotal = items.reduce((sum, item) => sum + item.priceVnd * item.quantity, 0);

  useEffect(() => {
    if (!appliedVoucher) {
      setDiscountAmount(0);
      return;
    }

    if (subtotal < appliedVoucher.minOrderValue) {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      showToast(`Voucher ${appliedVoucher.code} đã bị gỡ vì đơn chưa đủ ${new Intl.NumberFormat('vi-VN').format(appliedVoucher.minOrderValue)}đ`);
      return;
    }

    let discount = 0;
    if (appliedVoucher.discountType === "PERCENT") {
      discount = Math.round((subtotal * appliedVoucher.discountValue) / 100);
      if (appliedVoucher.maxDiscountValue && discount > appliedVoucher.maxDiscountValue) {
        discount = appliedVoucher.maxDiscountValue;
      }
    } else if (appliedVoucher.discountType === "FIXED") {
      discount = appliedVoucher.discountValue;
    } else if (appliedVoucher.discountType === "FREE_SHIP") {
      discount = Math.min(shippingFee, appliedVoucher.discountValue);
    }

    setDiscountAmount(Math.min(discount, subtotal));
  }, [subtotal, appliedVoucher, shippingFee]);

  const addItem = (product: Product, quantity = 1, itemNote = "") => {
    if (!product.priceVnd) {
      showToast("Món ăn đang cập nhật giá, tạm thời chưa thể đặt.");
      return;
    }

    setItems((prev) => {
      const cleanNote = (itemNote || "").trim();
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && (i.itemNote || "").trim() === cleanNote
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          priceVnd: product.priceVnd,
          quantity,
          imageUrl: product.imageUrl,
          categorySlug: product.categorySlug,
          estimatedWeightG: product.estimatedWeightG || product.servingVolumeMl || 0,
          caloriesKcal: product.caloriesKcal || 0,
          itemNote: cleanNote || undefined,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const updateQuantity = (productId: string, quantity: number, itemNote = "") => {
    const cleanNote = (itemNote || "").trim();
    if (quantity <= 0) {
      removeItem(productId, itemNote);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && (item.itemNote || "").trim() === cleanNote) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string, itemNote = "") => {
    const cleanNote = (itemNote || "").trim();
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (item.itemNote || "").trim() === cleanNote)
      )
    );
    showToast("Đã xóa món khỏi giỏ hàng");
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setOrderNote("");
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const applyVoucher = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Vui lòng nhập mã ưu đãi" };
    }

    try {
      const res = await fetch(`/api/vouchers/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, subtotal }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Mã ưu đãi không hợp lệ" };
      }

      setAppliedVoucher(data.voucher);
      showToast(`Áp dụng thành công: ${data.voucher.title}`);
      return { success: true, message: `Áp dụng thành công voucher ${data.voucher.code}` };
    } catch (e) {
      return { success: false, message: "Lỗi kiểm tra voucher, vui lòng thử lại" };
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    showToast("Đã gỡ voucher");
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalBoxes = itemCount;
  const totalWeightG = items.reduce((sum, i) => sum + (i.estimatedWeightG || 0) * i.quantity, 0);
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        totalBoxes,
        totalWeightG,
        subtotal,
        discountAmount,
        shippingFee,
        setShippingFee,
        totalAmount,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        orderNote,
        setOrderNote,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

