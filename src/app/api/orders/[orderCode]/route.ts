import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;
    const body = await request.json();
    const { action } = body;

    const order = await prisma.order.findUnique({
      where: { orderCode },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Customer clicks "Tôi đã chuyển khoản"
    if (action === "NOTIFY_TRANSFER") {
      // NOTE: Strictly do NOT mark as PAID here. Must stay PENDING awaiting admin verification or bank webhook.
      const updated = await prisma.order.update({
        where: { orderCode },
        data: {
          customerTransferred: true,
          transferredAt: new Date(),
          paymentStatus: "PENDING", // Strictly remain PENDING
        },
        include: {
          items: true,
          branch: true,
        },
      });

      return NextResponse.json({
        success: true,
        order: updated,
        message:
          "Đã ghi nhận thông báo chuyển khoản của bạn. Hệ thống đang tiến hành đối soát giao dịch với ngân hàng. Đơn hàng sẽ được chuyển sang 'Đã thanh toán' ngay khi có xác nhận giao dịch hợp lệ.",
      });
    }

    // Admin verifies payment
    if (action === "ADMIN_CONFIRM_PAYMENT") {
      const session = await getServerSession();
      if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
        return NextResponse.json(
          { success: false, message: "Bạn không có quyền xác thực thanh toán." },
          { status: 403 }
        );
      }

      const updated = await prisma.order.update({
        where: { orderCode },
        data: {
          paymentStatus: "PAID",
          status: order.status === "NEW" ? "CONFIRMED" : order.status,
        },
        include: {
          items: true,
          branch: true,
        },
      });

      return NextResponse.json({
        success: true,
        order: updated,
        message: `Đã xác nhận đơn hàng ${orderCode} đã thanh toán thành công (PAID).`,
      });
    }

    return NextResponse.json({ success: false, message: "Hành động không hợp lệ" }, { status: 400 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi cập nhật trạng thái đơn hàng" },
      { status: 500 }
    );
  }
}
