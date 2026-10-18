import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderCode: { contains: search } },
        { receiverName: { contains: search } },
        { receiverPhone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        branch: true,
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải danh sách đơn hàng" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus, cancelReason } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID đơn hàng" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (cancelReason !== undefined) updateData.cancelReason = cancelReason;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, branch: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật đơn hàng" }, { status: 500 });
  }
}

