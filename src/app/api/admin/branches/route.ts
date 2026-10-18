import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    return NextResponse.json(
      { success: true, count: branches.length, branches },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin branches error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải chi nhánh" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (session && session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.json({ success: false, message: "Không có quyền thực hiện" }, { status: 403 });
    }

    const body = await request.json();
    const { code, name, address, phone, openHours, deliveryRadiusKm, baseShippingFee, isActive } = body;

    if (!code || !name || !address || !phone) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ mã, tên, địa chỉ và số điện thoại" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate code
    const existing = await prisma.branch.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Mã chi nhánh "${cleanCode}" đã tồn tại. Vui lòng chọn mã khác.` },
        { status: 400 }
      );
    }

    const created = await prisma.branch.create({
      data: {
        code: cleanCode,
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        openHours: openHours || "07:00 - 21:00",
        deliveryRadiusKm: Number(deliveryRadiusKm) || 15.0,
        baseShippingFee: Number(baseShippingFee) || 20000,
        isActive: isActive !== false,
      },
    });

    // Auto-link with all available products in branch_products
    const allProducts = await prisma.product.findMany({ select: { id: true } });
    if (allProducts.length > 0) {
      for (const p of allProducts) {
        await prisma.branchProduct.upsert({
          where: {
            branchId_productId: {
              branchId: created.id,
              productId: p.id,
            },
          },
          update: { isAvailable: true, stockQuantity: 99 },
          create: {
            branchId: created.id,
            productId: p.id,
            isAvailable: true,
            stockQuantity: 99,
          },
        });
      }
    }

    return NextResponse.json({ success: true, branch: created });
  } catch (error) {
    console.error("Admin branch create error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo chi nhánh" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (session && session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.json({ success: false, message: "Không có quyền thực hiện" }, { status: 403 });
    }

    const body = await request.json();
    const { id, code, name, address, phone, openHours, deliveryRadiusKm, baseShippingFee, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID chi nhánh" }, { status: 400 });
    }

    const updateData: any = {};
    if (code) updateData.code = code.trim().toUpperCase();
    if (name) updateData.name = name.trim();
    if (address) updateData.address = address.trim();
    if (phone) updateData.phone = phone.trim();
    if (openHours) updateData.openHours = openHours.trim();
    if (deliveryRadiusKm !== undefined) updateData.deliveryRadiusKm = Number(deliveryRadiusKm);
    if (baseShippingFee !== undefined) updateData.baseShippingFee = Number(baseShippingFee);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.branch.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, branch: updated });
  } catch (error) {
    console.error("Admin branch update error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật chi nhánh" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (session && session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.json({ success: false, message: "Không có quyền thực hiện" }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive } = body;

    if (!id || isActive === undefined) {
      return NextResponse.json({ success: false, message: "Thiếu thông tin cập nhật trạng thái chi nhánh" }, { status: 400 });
    }

    const updated = await prisma.branch.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    return NextResponse.json({
      success: true,
      branch: updated,
      message: updated.isActive ? "Đã kích hoạt lại chi nhánh" : "Đã ngừng hoạt động chi nhánh",
    });
  } catch (error) {
    console.error("Admin branch toggle status error:", error);
    return NextResponse.json({ success: false, message: "Lỗi thay đổi trạng thái chi nhánh" }, { status: 500 });
  }
}
