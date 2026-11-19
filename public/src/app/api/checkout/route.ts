import { NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, shippingMethod } = body;
    if (!customer?.email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing customer or items" }, { status: 400 });
    }
    const subtotalCents = items.reduce(
      (s: number, i: { priceCents: number; qty: number }) => s + i.priceCents * i.qty,
      0
    );
    const shippingCents = shippingMethod === "express" ? 1800 : 0;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;

    const order = await createOrder({
      email: customer.email,
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      address: customer.address ?? "",
      city: customer.city ?? "",
      zip: customer.zip ?? "",
      country: customer.country ?? "US",
      shippingMethod: shippingMethod ?? "standard",
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      items,
    });

    return NextResponse.json({
      orderId: order.id,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
    });
  } catch (e) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
