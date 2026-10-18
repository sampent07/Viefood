import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const requests = await prisma.consultationRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { branch: true },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Admin consultations error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải danh sách yêu cầu tư vấn" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, staffNote } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID yêu cầu" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (staffNote !== undefined) updateData.staffNote = staffNote;

    const updated = await prisma.consultationRequest.update({
      where: { id },
      data: updateData,
      include: { branch: true },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Admin consultation update error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật yêu cầu tư vấn" }, { status: 500 });
  }
}

