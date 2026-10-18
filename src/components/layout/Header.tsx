"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  MapPin,
  User as UserIcon,
  Menu as MenuIcon,
  X,
  Sparkles,
  ChevronDown,
  Phone,
  Clock,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useBranch } from "@/lib/branch-context";
import { formatVnd } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { currentBranch, setIsBranchModalOpen } = useBranch();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Check login session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Handle Search Input Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.products.slice(0, 5));
          setShowSearchDropdown(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowUserDropdown(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Thực đơn", href: "/menu" },
    { label: "Các gói ăn", href: "/packages" },
    { label: "Ưu đãi", href: "/vouchers" },
    { label: "Chi nhánh", href: "/branches" },
    { label: "Liên hệ", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Top micro bar: Branch & Hotline */}
      <div className="bg-brand-50 border-b border-brand-100/60 text-xs text-brand-900 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center space-x-1.5 hover:text-brand-700 font-medium transition"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Đang phục vụ từ:</span>
              <span className="font-semibold underline decoration-brand-400 underline-offset-2">
                {currentBranch ? currentBranch.name : "Đang tải chi nhánh..."}
              </span>
              <ChevronDown className="w-3 h-3 text-brand-600" />
            </button>
            <div className="flex items-center space-x-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{currentBranch ? currentBranch.openHours : "07:00 - 21:00"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Giao hàng nhanh 30 phút • Giữ ấm & giữ trọn dinh dưỡng</span>
            <a
              href={`tel:${currentBranch?.phone || "0901888123"}`}
              className="flex items-center space-x-1 font-semibold text-brand-700 hover:text-brand-800"
            >
              <Phone className="w-3 h-3" />
              <span>Hotline: {currentBranch?.phone || "0901 888 123"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand-600 transition">
                Vie<span className="text-brand-600">Food</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Healthy Living</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "text-brand-700 bg-brand-50"
                      : "text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-xs sm:max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm món, nguyên liệu, calo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    setShowSearchDropdown(false);
                    router.push(`/menu?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Gợi ý món phù hợp
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center space-x-3 p-3 hover:bg-brand-50/50 transition group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-brand-600">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                          <span className="text-brand-600 font-medium">
                            {formatVnd(item.priceVnd)}
                          </span>
                          <span>•</span>
                          <span>{item.caloriesKcal ? `${item.caloriesKcal} kcal` : "Calo tham khảo"}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/menu?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setShowSearchDropdown(false)}
                  className="block text-center text-xs font-semibold text-brand-600 hover:bg-brand-50 p-2.5 transition border-t border-gray-50"
                >
                  Xem tất cả kết quả cho &quot;{searchQuery}&quot; →
                </Link>
              </div>
            )}
          </div>

          {/* Right Action Icons: Branch, User, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Branch Button */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-100 rounded-full md:hidden"
              title="Chọn chi nhánh"
            >
              <MapPin className="w-5 h-5" />
            </button>

            {/* User Account Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 hidden xl:inline">
                      {user.name?.split(" ").pop()}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden xl:inline" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in duration-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Đã đăng nhập</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || user.phone}</p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Tài khoản của tôi</span>
                      </Link>

                      {(user.role === "ADMIN" || user.role === "STAFF") && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Trang Quản trị (Admin)</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-lg transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Cart Icon with Item Badge */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-full transition-transform active:scale-95"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brand-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm món ăn, kcal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  setIsMobileMenuOpen(false);
                  router.push(`/menu?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-50 font-medium text-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-1 hover:text-brand-600 flex justify-between items-center"
              >
                <span>{link.label}</span>
                <span className="text-gray-300">›</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBranchModalOpen(true);
              }}
              className="w-full py-2 px-3 bg-brand-50 text-brand-800 text-xs font-semibold rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Chi nhánh: {currentBranch?.name || "Chọn chi nhánh"}</span>
              </span>
              <span className="text-brand-600 font-bold">Đổi</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

