"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "vi" | "en";

const translations: Record<string, string> = {
  "Trang chủ": "Home", "Thực đơn": "Menu", "Các gói ăn": "Meal Plans", "Ưu đãi": "Offers",
  "Chi nhánh": "Branches", "Liên hệ": "Contact", "Đang phục vụ từ:": "Now serving from:",
  "Đang tải chi nhánh...": "Loading branches...", "Giao hàng nhanh 30 phút • Giữ ấm & giữ trọn dinh dưỡng": "Fast 30-minute delivery • Warm and nutritious",
  "Tìm món, nguyên liệu, calo...": "Search dishes, ingredients, calories...", "Tìm món ăn, kcal...": "Search dishes, kcal...",
  "Gợi ý món phù hợp": "Suggested dishes", "Calo tham khảo": "Estimated calories", "Xem tất cả": "View all",
  "Chọn chi nhánh": "Choose a branch", "Đã đăng nhập": "Signed in", "Tài khoản của tôi": "My account",
  "Trang Quản trị (Admin)": "Admin dashboard", "Đăng xuất": "Sign out", "Đăng nhập": "Sign in", "Giỏ hàng": "Shopping cart",
  "Chi nhánh:": "Branch:", "Đổi": "Change", "Ăn Sạch Chuẩn Vị • Tính Sẵn Calo & Macro": "Clean, flavorful food • Calories and macros included",
  "Dinh Dưỡng Lành Mạnh,": "Healthy nutrition,", "Trọn Vẹn Sức Sống": "A fuller, healthier life", "Mỗi Ngày": "Every day",
  "Khám phá thực đơn": "Explore the menu", "Xem các gói ăn": "View meal plans", "Món ăn healthy": "Healthy dishes",
  "Báo rõ calo & gam": "Calories and portions shown", "Giao nhanh 30 phút": "Fast 30-minute delivery", "Giàu đạm nạc": "Rich in lean protein",
  "Bán chạy nhất": "Best sellers", "Kiểm soát khẩu phần": "Portion control", "Giảm mỡ • Tăng cơ hiệu quả": "Lose fat • Build muscle effectively",
  "Danh mục thực đơn": "Menu categories", "Khám Phá 5 Nhóm Món Ăn Chính": "Explore 5 Main Food Categories", "Xem toàn bộ 50 món": "View all 50 dishes",
  "món ăn": "dishes", "Tiện lợi & Tiết kiệm": "Convenient & affordable", "Các Gói Ăn Định Kỳ VieFood": "VieFood Meal Plans",
  "Không còn lo lắng hôm nay ăn gì, VieFood chuẩn bị và giao tận nơi đúng giờ hẹn mỗi ngày.": "No more wondering what to eat. VieFood prepares and delivers your meals on time, every day.",
  "Thực đơn Healthy": "Healthy menu", "Cơm gạo lứt": "Brown rice bowls", "Bún healthy": "Healthy noodles", "Meal Prep chuẩn gym": "Fitness meal prep",
  "Nước Detox trái cây": "Fruit detox drinks", "Nước Detox": "Detox drinks", "Sữa chua Hy Lạp": "Greek yogurt", "Meal Prep": "Meal Prep", "Gói ăn & Dịch vụ": "Meal plans & services",
  "Thực đơn dinh dưỡng VieFood": "VieFood Nutrition Menu", "Toàn Bộ Thực Đơn Healthy": "Full Healthy Menu",
  "Tất cả món ăn đều chế biến từ nguyên liệu tươi mới mỗi ngày, tính toán calo và định lượng chi tiết cho từng khẩu phần.": "Every dish is made with fresh ingredients, with calories and serving sizes carefully calculated.",
  "Tất cả thực đơn": "All dishes", "Tìm theo tên món, nguyên liệu (ức gà, cá hồi, tôm...)...": "Search by dish or ingredient (chicken, salmon, shrimp)...",
  "Mức năng lượng: Tất cả": "Calories: All", "Dưới 350 kcal (Thanh nhẹ)": "Under 350 kcal (Light)", "Từ 350 – 450 kcal (Cân bằng)": "350–450 kcal (Balanced)", "Trên 450 kcal (Tăng cơ)": "Over 450 kcal (Muscle gain)",
  "Sắp xếp: Mặc định": "Sort: Default", "Giá tăng dần": "Price: low to high", "Giá giảm dần": "Price: high to low", "Calo tăng dần": "Calories: low to high", "Calo giảm dần": "Calories: high to low",
  "Giỏ hàng của bạn đang trống": "Your cart is empty", "Hãy khám phá thực đơn healthy của VieFood nhé!": "Explore VieFood's healthy menu!",
  "Tổng số hộp / khẩu phần:": "Total meals / servings:", "Tổng khối lượng dự kiến:": "Estimated total weight:", "Xem tất cả thực đơn": "View the full menu",
  "Giờ mở cửa:": "Opening hours:", "Có hạn": "Limited time", "Đã chép": "Copied", "Lấy mã": "Get code", "Áp dụng vào thực đơn ngay": "Browse the menu",
  "Giỏ hàng đang trống, không thể thanh toán.": "Your cart is empty. Add items before checkout.", "1. Thông tin người nhận": "1. Recipient information",
  "2. Chi nhánh & Khung giờ giao hàng": "2. Branch & delivery time", "Ngày giao": "Delivery date", "Hôm nay": "Today", "Ngày mai": "Tomorrow",
  "Hẹn ngày khác": "Choose another day", "Khung giờ giao": "Delivery time", "Càng sớm càng tốt (30 - 45 phút)": "As soon as possible (30–45 minutes)",
  "Bữa trưa (11:30 - 12:30)": "Lunch (11:30 AM–12:30 PM)", "Bữa chiều/tối (17:30 - 18:30)": "Dinner (5:30–6:30 PM)", "3. Phương thức thanh toán": "3. Payment method",
  "Số ngày phục vụ:": "Days of service:", "Tổng số hộp / bữa:": "Total meals / servings:", "Calo trung bình / ngày:": "Average calories / day:", "Trọn gói:": "Package price:",
  "Chương trình ưu đãi hiện hành": "Current promotions", "Mã ưu đãi": "Promo code", "Xem tất cả voucher": "View all vouchers", "Khách hàng đã xác thực mua món": "Verified customer",
  "Set ăn dinh dưỡng đầy đủ": "Complete nutrition set", "Gói ăn 3 ngày khởi động": "3-day starter plan", "Gói ăn chuẩn Macro 1 tuần": "1-week macro plan",
  "Tư vấn gói tháng cá nhân hóa": "Personalized monthly plan", "Kho mã giảm giá & ưu đãi": "Coupons & offers", "Chính sách & Hỗ trợ": "Policies & support",
  "Chính sách giao hàng & phí ship": "Delivery and shipping policy", "Chính sách đổi trả & hủy đơn": "Returns and cancellations", "Chính sách bảo mật thông tin": "Privacy policy",
  "Điều khoản sử dụng dịch vụ": "Terms of service", "Cổng quản trị nội bộ": "Admin portal", "100% Nguyên liệu tươi sạch": "100% fresh ingredients",
  "Rau củ hữu cơ chuẩn VietGAP, ức gà và phi lê cá tươi mỗi ngày.": "VietGAP-standard organic vegetables, fresh chicken breast and fish fillets every day.",
  "Giao hàng giữ nhiệt nhanh": "Fast, temperature-controlled delivery", "Giao đúng giờ hẹn từ chi nhánh gần nhất, hộp giữ ấm kín đáo thân thiện môi trường.": "On-time delivery from the nearest branch in insulated, eco-friendly packaging.",
  "Đổi trả minh bạch": "Clear returns policy", "Hỗ trợ đổi món mới hoặc hoàn tiền ngay nếu món ăn không đúng chất lượng cam kết.": "We replace or refund meals that do not meet our quality standards.",
  "Dinh dưỡng chuẩn macro": "Macro-conscious nutrition", "Công bố minh bạch thành phần, định lượng gam và năng lượng calo tham khảo.": "Ingredients, portion weights, and estimated calories are clearly listed.",
  "VieFood là nền tảng ẩm thực healthy hàng đầu tại Việt Nam, mang đến giải pháp ăn uống tiện lợi, sạch sẽ, cân bằng calo và dinh dưỡng cho người hiện đại và người tập luyện.": "VieFood is a healthy food platform in Vietnam, offering convenient, clean meals with balanced calories and nutrition for active, modern lifestyles.",
  "Trụ sở: 72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh": "Head office: 72 Le Thanh Ton, Ben Nghe, District 1, Ho Chi Minh City",
  "Tìm kiếm món ăn": "Search dishes", "Danh mục": "Category", "Khoảng calo": "Calorie range", "Mức giá": "Price", "Mặc định": "Default",
  "Giá thấp đến cao": "Price: low to high", "Giá cao đến thấp": "Price: high to low", "Calo thấp đến cao": "Calories: low to high", "Calo cao đến thấp": "Calories: high to low",
  "Xóa bộ lọc": "Clear filters", "Không tìm thấy món ăn phù hợp": "No matching dishes found", "Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc calo và danh mục.": "Try another search term or adjust the calorie and category filters.",
  "Xóa toàn bộ giỏ": "Clear cart", "Xóa món": "Remove item", "Ghi chú": "Note", "Ghi chú cho toàn đơn hàng": "Order notes",
  "Ví dụ: Giao giờ trưa khoảng 11h45, để trước cửa phòng 402, xin thêm khăn giấy...": "Example: Deliver around 11:45 AM, leave outside room 402, include extra napkins...",
  "Tiếp tục chọn thêm món khác": "Continue adding dishes", "Chi nhánh phục vụ": "Serving branch", "Mã Giảm Giá / Voucher": "Discount code / Voucher",
  "Nhập mã: VIEFOODNEW, FREESHIP...": "Enter code: VIEFOODNEW, FREESHIP...", "Kiểm tra...": "Checking...", "Gỡ": "Remove", "Chi tiết thanh toán": "Payment summary",
  "Thêm vào giỏ": "Add to cart", "Đặt hàng ngay": "Order now", "Số lượng": "Quantity", "Tiếp tục mua sắm": "Continue shopping", "Thanh toán": "Checkout",
  "Áp dụng": "Apply", "Hủy": "Cancel", "Xác nhận": "Confirm", "Lưu": "Save", "Đóng": "Close", "Quay lại": "Go back", "Đơn hàng": "Orders",
  "Thông tin giao hàng": "Delivery information", "Phương thức thanh toán": "Payment method", "Tạm tính": "Subtotal", "Phí giao hàng": "Delivery fee", "Giảm giá": "Discount", "Tổng cộng": "Total",
  "Họ và tên": "Full name", "Số điện thoại": "Phone number", "Địa chỉ giao hàng": "Delivery address", "Mã giảm giá": "Promo code", "Đăng ký": "Create account", "Mật khẩu": "Password",
  "Email": "Email", "Quên mật khẩu?": "Forgot password?", "Chưa có tài khoản?": "Don't have an account?", "Đã có tài khoản?": "Already have an account?",
  "© 2026 VieFood. Toàn bộ bản quyền thuộc về Hệ thống Thực phẩm Lành mạnh VieFood Việt Nam.": "© 2026 VieFood. All rights reserved by VieFood Healthy Food Vietnam.",
  "Số liệu dinh dưỡng và calo hiển thị trên website là số liệu ước tính ban đầu phục vụ tham khảo khẩu phần.": "Nutrition and calorie values are estimates for reference and portion planning.",
};

const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([vi, en]) => [en, vi]));

function translate(value: string, language: Language) {
  const trimmed = value.trim();
  const original = reverseTranslations[trimmed] || trimmed;
  const translated = language === "en" ? translations[original] || original : original;
  const start = value.indexOf(trimmed);
  return start < 0 ? value : `${value.slice(0, start)}${translated}${value.slice(start + trimmed.length)}`;
}

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function localize(node: Node, language: Language) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return;
    const value = node.textContent || "";
    const next = translate(value, language);
    if (next !== value) node.textContent = next;
    return;
  }
  if (node instanceof Element) {
    for (const attribute of ["placeholder", "title", "aria-label", "alt"]) {
      const value = node.getAttribute(attribute);
      if (value) {
        const next = translate(value, language);
        if (next !== value) node.setAttribute(attribute, next);
      }
    }
    node.childNodes.forEach((child) => localize(child, language));
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const saved = window.localStorage.getItem("viefood-language");
    if (saved === "en" || saved === "vi") setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localize(document.body, language);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "characterData") localize(record.target, language);
        else if (record.type === "attributes") localize(record.target, language);
        else record.addedNodes.forEach((node) => localize(node, language));
      });
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
    });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (next: Language) => {
      window.localStorage.setItem("viefood-language", next);
      setLanguageState(next);
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
