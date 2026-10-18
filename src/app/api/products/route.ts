import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const query = searchParams.get("q") || searchParams.get("search");
    const sort = searchParams.get("sort") || "default";
    const badge = searchParams.get("badge");
    const minCal = searchParams.get("minCal") ? parseInt(searchParams.get("minCal")!) : undefined;
    const maxCal = searchParams.get("maxCal") ? parseInt(searchParams.get("maxCal")!) : undefined;
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined;

    const where: any = {
      isAvailable: true,
    };

    if (categorySlug && categorySlug !== "all") {
      where.categorySlug = categorySlug;
    }

    if (badge) {
      where.badges = { contains: badge };
    }

    if (minCal !== undefined || maxCal !== undefined) {
      where.caloriesKcal = {};
      if (minCal !== undefined) where.caloriesKcal.gte = minCal;
      if (maxCal !== undefined) where.caloriesKcal.lte = maxCal;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceVnd = {};
      if (minPrice !== undefined) where.priceVnd.gte = minPrice;
      if (maxPrice !== undefined) where.priceVnd.lte = maxPrice;
    }

    if (query) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
        {
          ingredients: {
            some: {
              name: { contains: q },
            },
          },
        },
      ];
    }

    let orderBy: any = { sortOrder: "asc" };
    if (sort === "price-asc") {
      orderBy = { priceVnd: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { priceVnd: "desc" };
    } else if (sort === "cal-asc") {
      orderBy = { caloriesKcal: "asc" };
    } else if (sort === "cal-desc") {
      orderBy = { caloriesKcal: "desc" };
    } else if (sort === "name-asc") {
      orderBy = { name: "asc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        ingredients: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

