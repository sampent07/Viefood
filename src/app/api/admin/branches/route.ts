import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
    return NextResponse.json({ success: true, branches });
  } catch (error) {
    console.error("Admin branches error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải chi nhánh" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, address, phone, openHours, deliveryRadiusKm, baseShippingFee, isActive } = body;

    if (!code || !name || !address || !phone) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ mã, tên, địa chỉ và số điện thoại" }, { status: 400 });
    }

    const created = await prisma.branch.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        openHours: openHours || "07:00 - 21:00",
        deliveryRadiusKm: Number(deliveryRadiusKm) || 15.0,
        baseShippingFee: Number(baseShippingFee) || 20000,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, branch: created });
  } catch (error) {
    console.error("Admin branch create error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo chi nhánh" }, { status: 500 });
  }
}

