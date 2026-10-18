import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailView from "@/components/product/ProductDetailView";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
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
    notFound();
  }

  // Related products
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

  // Reviews
  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ProductDetailView
        product={product as any}
        relatedProducts={related as any}
        reviews={reviews}
      />
    </div>
  );
}

