import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import MenuClientPage from "@/components/menu/MenuClientPage";

export const revalidate = 60;

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string; sort?: string };
}) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const products = await prisma.product.findMany({
    where: { isAvailable: true },
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
          initialCategories={categories}
          initialProducts={products as any}
          initialQuery={searchParams.q || ""}
          initialCategory={searchParams.cat || "all"}
        />
      </Suspense>
    </div>
  );
}

