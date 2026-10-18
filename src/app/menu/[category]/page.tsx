import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuClientPage from "@/components/menu/MenuClientPage";

export const revalidate = 60;

export async function generateStaticParams() {
  return [
    { category: "com-gao-lut" },
    { category: "bun-healthy" },
    { category: "meal-prep" },
    { category: "nuoc-detox" },
    { category: "sua-chua-hy-lap" },
  ];
}

export default async function CategoryMenuPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { q?: string; sort?: string };
}) {
  const { category: categorySlug } = params;

  const currentCategory = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!currentCategory) {
    notFound();
  }

  const allCategories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Fetch ONLY items belonging to this category!
  const products = await prisma.product.findMany({
    where: {
      categorySlug,
      isAvailable: true,
    },
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      ingredients: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Đang tải thực đơn...</div>}>
        <MenuClientPage
          initialCategories={allCategories}
          initialProducts={products as any}
          initialQuery={searchParams.q || ""}
          initialCategory={categorySlug}
          lockedCategory={currentCategory}
        />
      </Suspense>
    </div>
  );
}

