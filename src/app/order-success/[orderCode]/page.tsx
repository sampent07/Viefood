import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderSuccessClient from "@/components/order/OrderSuccessClient";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderCode: string };
}) {
  const { orderCode } = params;

  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: {
      items: true,
      branch: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <OrderSuccessClient order={order as any} />
    </div>
  );
}

