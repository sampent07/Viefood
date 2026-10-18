import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encodeSession, AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !password || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập họ tên, mật khẩu và email hoặc số điện thoại" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: "Email này đã được sử dụng" },
          { status: 400 }
        );
      }
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: phone.trim() },
      });
      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: "Số điện thoại này đã được sử dụng" },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email ? email.trim().toLowerCase() : null,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "CUSTOMER",
      },
    });

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
      message: "Đăng ký tài khoản thành công!",
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
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi đăng ký tài khoản" },
      { status: 500 }
    );
  }
}

