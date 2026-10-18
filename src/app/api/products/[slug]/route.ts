import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        ingredients: true,
        branchProducts: {
          include: { branch: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy món ăn" },
        { status: 404 }
      );
    }

    // Get related products in same category
    const related = await prisma.product.findMany({
      where: {
        categorySlug: product.categorySlug,
        id: { not: product.id },
        isAvailable: true,
      },
      take: 4,
      include: {
        category: true,
      },
    });

    // Get verified reviews
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      product,
      related,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải thông tin món ăn" },
      { status: 500 }
    );
  }
}

