import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        ingredients: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Admin products error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải sản phẩm" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sku,
      slug,
      name,
      categorySlug,
      description,
      priceVnd,
      estimatedWeightG,
      servingVolumeMl,
      caloriesKcal,
      nutritionVerified,
      imageUrl,
      badges,
      isAvailable,
      ingredients,
    } = body;

    if (!sku || !slug || !name || !categorySlug) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập đầy đủ SKU, Slug, Tên và Danh mục" }, { status: 400 });
    }

    const created = await prisma.product.create({
      data: {
        sku: sku.trim().toUpperCase(),
        slug: slug.trim().toLowerCase(),
        name: name.trim(),
        categorySlug,
        description: description || "",
        priceVnd: priceVnd !== undefined && priceVnd !== null && priceVnd !== "" ? Number(priceVnd) : null,
        estimatedWeightG: estimatedWeightG ? Number(estimatedWeightG) : null,
        servingVolumeMl: servingVolumeMl ? Number(servingVolumeMl) : null,
        caloriesKcal: caloriesKcal ? Number(caloriesKcal) : null,
        nutritionVerified: Boolean(nutritionVerified),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        badges: badges || null,
        isAvailable: isAvailable !== false,
      },
    });

    if (ingredients && Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        if (ing.name && ing.amount) {
          await prisma.productIngredient.create({
            data: {
              productId: created.id,
              name: ing.name,
              amount: Number(ing.amount),
              unit: ing.unit || "g",
              caloriesKcal: ing.caloriesKcal ? Number(ing.caloriesKcal) : null,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    console.error("Admin product create error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo sản phẩm mới" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ingredients, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID sản phẩm" }, { status: 400 });
    }

    const cleanData: any = { ...updateFields };
    if (cleanData.priceVnd !== undefined) {
      cleanData.priceVnd = cleanData.priceVnd === null || cleanData.priceVnd === "" ? null : Number(cleanData.priceVnd);
    }
    if (cleanData.caloriesKcal !== undefined) {
      cleanData.caloriesKcal = cleanData.caloriesKcal === null || cleanData.caloriesKcal === "" ? null : Number(cleanData.caloriesKcal);
    }
    if (cleanData.estimatedWeightG !== undefined) {
      cleanData.estimatedWeightG = cleanData.estimatedWeightG === null || cleanData.estimatedWeightG === "" ? null : Number(cleanData.estimatedWeightG);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: cleanData,
    });

    if (ingredients && Array.isArray(ingredients)) {
      await prisma.productIngredient.deleteMany({ where: { productId: id } });
      for (const ing of ingredients) {
        if (ing.name && ing.amount) {
          await prisma.productIngredient.create({
            data: {
              productId: id,
              name: ing.name,
              amount: Number(ing.amount),
              unit: ing.unit || "g",
              caloriesKcal: ing.caloriesKcal ? Number(ing.caloriesKcal) : null,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Admin product update error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật sản phẩm" }, { status: 500 });
  }
}

