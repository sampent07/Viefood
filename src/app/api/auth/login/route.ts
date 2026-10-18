import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encodeSession, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập email/số điện thoại và mật khẩu" },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();

    // Find by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { phone: identifier.trim() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Tài khoản hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Tài khoản hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = encodeSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      message: "Đăng nhập thành công!",
    });

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi đăng nhập" },
      { status: 500 }
    );
  }
}

