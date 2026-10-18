import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    // Allow demo/local access or check admin role
    if (session && session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.json({ success: false, message: "Không có quyền truy cập" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        branch: true,
      },
    });

    const statusCounts: Record<string, number> = {
      NEW: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      DELIVERING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    let totalRevenue = 0;
    let completedOrdersCount = 0;

    orders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      // Count revenue only for non-cancelled orders
      if (o.status !== "CANCELLED") {
        totalRevenue += o.totalAmount;
      }
      if (o.status === "COMPLETED") {
        completedOrdersCount += 1;
      }
    });

    const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / Math.max(1, orders.length - statusCounts.CANCELLED)) : 0;

    const consultationCount = await prisma.consultationRequest.count();
    const productCount = await prisma.product.count();
    const activeVouchersCount = await prisma.voucher.count({ where: { isActive: true } });

    // Recent orders
    const recentOrders = orders.slice(0, 8);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: orders.length,
        statusCounts,
        totalRevenue,
        averageOrderValue,
        consultationCount,
        productCount,
        activeVouchersCount,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải thống kê" }, { status: 500 });
  }
}

