import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productSlug, author, rating, title, body: text } = body;
    if (!productSlug || !author || !rating || !title || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    try {
      const rows = await db.select().from(products).where(eq(products.slug, productSlug)).limit(1);
      const prod = rows[0];
      await db.insert(reviews).values({
        productId: prod?.id,
        productSlug,
        author: String(author).slice(0, 60),
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: String(title).slice(0, 120),
        body: String(text).slice(0, 2000),
        verified: false,
      });
    } catch {
      // DB unavailable — still succeed for demo
    }
    return NextResponse.json({
      review: {
        id: `local-${Date.now()}`,
        author,
        rating: Number(rating),
        title,
        body: text,
        verified: false,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
