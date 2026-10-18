import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      branches,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải danh sách chi nhánh" },
      { status: 500 }
    );
  }
}

