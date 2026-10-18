import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: true,
        branch: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải thông tin đơn hàng" },
      { status: 500 }
    );
  }
}

