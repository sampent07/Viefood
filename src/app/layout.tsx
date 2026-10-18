import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { BranchProvider } from "@/lib/branch-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import BranchModal from "@/components/branch/BranchModal";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import ToastNotifier from "@/components/ui/ToastNotifier";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "VieFood — Ẩm Thực Healthy, Gọn Lành & Chuẩn Dinh Dưỡng",
  description:
    "Đặt món ăn healthy, cơm gạo lứt, bún thanh đạm, meal prep chuẩn macro, nước detox và sữa chua Hy Lạp giao tận nơi tại Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <BranchProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <BranchModal />
            <ChatbotWidget />
            <ToastNotifier />
          </CartProvider>
        </BranchProvider>
      </body>
    </html>
  );
}

