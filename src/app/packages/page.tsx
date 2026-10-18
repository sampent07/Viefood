import React from "react";
import { prisma } from "@/lib/prisma";
import PackagesClientPage from "@/components/packages/PackagesClientPage";

export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <PackagesClientPage packages={packages as any} />
    </div>
  );
}

