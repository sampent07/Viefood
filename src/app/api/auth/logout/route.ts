import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Đăng xuất thành công" });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

