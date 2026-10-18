import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            items: true,
            branch: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

