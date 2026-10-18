import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, branchId } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập mã voucher" },
        { status: 400 }
      );
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!voucher || !voucher.isActive) {
      return NextResponse.json(
        { success: false, message: "Mã ưu đãi không tồn tại hoặc đã hết hạn" },
        { status: 404 }
      );
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Mã ưu đãi đã hết lượt sử dụng" },
        { status: 400 }
      );
    }

    if (voucher.branchId && branchId && voucher.branchId !== branchId) {
      return NextResponse.json(
        { success: false, message: "Mã ưu đãi này chỉ áp dụng cho chi nhánh được chỉ định" },
        { status: 400 }
      );
    }

    const currentSubtotal = Number(subtotal) || 0;
    if (currentSubtotal < voucher.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN").format(
            voucher.minOrderValue
          )}đ để áp dụng voucher này`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (voucher.discountType === "PERCENT") {
      discount = Math.round((currentSubtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscountValue && discount > voucher.maxDiscountValue) {
        discount = voucher.maxDiscountValue;
      }
    } else if (voucher.discountType === "FIXED" || voucher.discountType === "FREE_SHIP") {
      discount = voucher.discountValue;
    }

    discount = Math.min(discount, currentSubtotal);

    return NextResponse.json({
      success: true,
      voucher,
      discountAmount: discount,
      message: `Áp dụng thành công: Giảm ${new Intl.NumberFormat("vi-VN").format(discount)}đ`,
    });
  } catch (error) {
    console.error("Error validating voucher:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi kiểm tra voucher" },
      { status: 500 }
    );
  }
}

