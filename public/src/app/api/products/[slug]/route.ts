import { NextResponse } from "next/server";
import { getProductBySlug, getReviewsForProduct, getAllProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const reviews = await getReviewsForProduct(slug);
  const all = await getAllProducts();
  const related = all.filter((p) => p.slug !== slug && (p.collection === product.collection || p.category === product.category)).slice(0, 4);
  return NextResponse.json({ product, reviews, related });
}
