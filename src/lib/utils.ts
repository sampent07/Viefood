import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVnd(amount?: number | null): string {
  if (amount === undefined || amount === null) {
    return "Đang cập nhật";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s/g, "");
}

export function formatNumber(num?: number | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export const CATEGORY_MAP: Record<string, string> = {
  "com-gao-lut": "Cơm gạo lứt",
  "bun-healthy": "Bún healthy",
  "meal-prep": "Meal Prep",
  "nuoc-detox": "Nước Detox",
  "sua-chua-hy-lap": "Sữa chua Hy Lạp",
};

export const BADGE_MAP: Record<string, { label: string; color: string }> = {
  BEST_SELLER: { label: "Bán chạy", color: "bg-amber-100 text-amber-800 border-amber-200" },
  NEW: { label: "Món mới", color: "bg-blue-100 text-blue-800 border-blue-200" },
  HEALTHY: { label: "Healthy", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

