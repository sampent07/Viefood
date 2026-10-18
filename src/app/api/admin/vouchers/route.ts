import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
      include: { branch: true },
    });
    return NextResponse.json({ success: true, vouchers });
  } catch (error) {
    console.error("Admin vouchers error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải voucher" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, title, discountType, discountValue, minOrderValue, maxDiscountValue, usageLimit, branchId, isActive } = body;

    if (!code || !title || !discountType || discountValue === undefined) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ mã, tiêu đề, loại và giá trị giảm" }, { status: 400 });
    }

    const created = await prisma.voucher.create({
      data: {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscountValue: maxDiscountValue ? Number(maxDiscountValue) : null,
        usageLimit: Number(usageLimit) || 1000,
        branchId: branchId || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, voucher: created });
  } catch (error) {
    console.error("Admin voucher create error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo voucher" }, { status: 500 });
  }
}

