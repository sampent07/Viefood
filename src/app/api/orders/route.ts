import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      receiverName,
      receiverPhone,
      branchId,
      deliveryAddress,
      deliveryDate,
      deliverySlot,
      orderNote,
      paymentMethod,
      voucherCode,
      items,
    } = body;

    // Validate required fields
    if (!receiverName || !receiverPhone || !branchId || !deliveryAddress) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ thông tin nhận hàng và chọn chi nhánh" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Giỏ hàng đang trống" },
        { status: 400 }
      );
    }

    // Verify branch
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!branch || !branch.isActive) {
      return NextResponse.json(
        { success: false, message: "Chi nhánh đã chọn không khả dụng" },
        { status: 400 }
      );
    }

    // Fetch live product details from DB to guarantee backend calculation (NEVER trust frontend prices)
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          {
            success: false,
            message: `Món ăn "${item.name || item.productId}" hiện không còn kinh doanh hoặc đã hết`,
          },
          { status: 400 }
        );
      }

      if (dbProduct.priceVnd === null) {
        return NextResponse.json(
          {
            success: false,
            message: `Món "${dbProduct.name}" đang cập nhật giá, vui lòng chọn món khác`,
          },
          { status: 400 }
        );
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const lineTotal = dbProduct.priceVnd * qty;
      calculatedSubtotal += lineTotal;

      orderItemsData.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productSku: dbProduct.sku,
        priceAtPurchase: dbProduct.priceVnd, // Snapshot
        quantity: qty,
        itemNote: item.itemNote ? String(item.itemNote).slice(0, 200) : null,
        weightSnapshot: dbProduct.estimatedWeightG || dbProduct.servingVolumeMl || null,
        caloriesSnapshot: dbProduct.caloriesKcal || null,
        imageUrl: dbProduct.imageUrl,
      });
    }

    // Shipping fee from branch
    const shippingFee = branch.baseShippingFee;

    // Recalculate voucher at backend
    let calculatedDiscount = 0;
    let validVoucher: any = null;

    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode.trim().toUpperCase() },
      });

      if (
        voucher &&
        voucher.isActive &&
        voucher.usedCount < voucher.usageLimit &&
        (!voucher.branchId || voucher.branchId === branchId) &&
        calculatedSubtotal >= voucher.minOrderValue
      ) {
        if (voucher.discountType === "PERCENT") {
          calculatedDiscount = Math.round((calculatedSubtotal * voucher.discountValue) / 100);
          if (voucher.maxDiscountValue && calculatedDiscount > voucher.maxDiscountValue) {
            calculatedDiscount = voucher.maxDiscountValue;
          }
        } else if (voucher.discountType === "FIXED") {
          calculatedDiscount = voucher.discountValue;
        } else if (voucher.discountType === "FREE_SHIP") {
          calculatedDiscount = Math.min(shippingFee, voucher.discountValue);
        }
        calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
        validVoucher = voucher;
      }
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal + shippingFee - calculatedDiscount);

    // Generate readable order code: VF-YYMM-XXXX
    const now = new Date();
    const datePrefix = `VF${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `${datePrefix}-${randomSuffix}`;

    // Check optional authenticated user session
    const session = await getServerSession();

    // Create order transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          userId: session?.id || null,
          receiverName: receiverName.trim(),
          receiverPhone: receiverPhone.trim(),
          branchId,
          deliveryAddress: deliveryAddress.trim(),
          deliveryDate: deliveryDate || null,
          deliverySlot: deliverySlot || null,
          orderNote: orderNote ? orderNote.trim() : null,
          subtotal: calculatedSubtotal,
          shippingFee,
          discountAmount: calculatedDiscount,
          totalAmount: calculatedTotal,
          status: "NEW",
          paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "COD",
          paymentStatus: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
          branch: true,
        },
      });

      if (validVoucher) {
        await tx.voucher.update({
          where: { id: validVoucher.id },
          data: { usedCount: { increment: 1 } },
        });

        await tx.voucherRedemption.create({
          data: {
            voucherId: validVoucher.id,
            orderId: newOrder.id,
            userId: session?.id || null,
            discountApplied: calculatedDiscount,
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tạo đơn hàng, vui lòng thử lại" },
      { status: 500 }
    );
  }
}

