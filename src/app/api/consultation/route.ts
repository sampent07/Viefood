import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      zalo,
      packageInterest,
      branchId,
      deliveryArea,
      budget,
      dietaryGoals,
      preferredContactTime,
      notes,
      consentAgreed,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập họ tên và số điện thoại liên hệ" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Số điện thoại không hợp lệ, vui lòng kiểm tra lại" },
        { status: 400 }
      );
    }

    const now = new Date();
    const datePrefix = `TV${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestCode = `${datePrefix}-${randomSuffix}`;

    const lead = await prisma.consultationRequest.create({
      data: {
        requestCode,
        fullName: fullName.trim(),
        phone: cleanPhone,
        zalo: zalo ? zalo.trim() : null,
        packageInterest: packageInterest || "Gói ăn chuyên sâu 1 Tháng",
        branchId: branchId || null,
        deliveryArea: deliveryArea ? deliveryArea.trim() : null,
        budget: budget ? budget.trim() : null,
        dietaryGoals: dietaryGoals ? dietaryGoals.trim() : null,
        preferredContactTime: preferredContactTime ? preferredContactTime.trim() : null,
        notes: notes ? notes.trim() : null,
        consentAgreed: consentAgreed !== false,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      requestCode: lead.requestCode,
      message: "Gửi yêu cầu tư vấn thành công! Chuyên viên VieFood sẽ liên hệ lại trong thời gian sớm nhất.",
    });
  } catch (error) {
    console.error("Error creating consultation request:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi gửi yêu cầu tư vấn, vui lòng thử lại" },
      { status: 500 }
    );
  }
}

