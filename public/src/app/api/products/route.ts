import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const category = searchParams.get("category") ?? "";
  const collection = searchParams.get("collection") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const maxPrice = Number(searchParams.get("maxPrice") ?? "0");

  let items = await getAllProducts();

  if (q) {
    items = items.filter((p) =>
      `${p.name} ${p.tagline} ${p.category} ${p.description}`.toLowerCase().includes(q)
    );
  }
  if (category) items = items.filter((p) => p.category === category);
  if (collection) items = items.filter((p) => p.collection === collection);
  if (maxPrice > 0) items = items.filter((p) => p.priceCents <= maxPrice * 100);

  switch (sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "rating":
      items = [...items].sort((a, b) => b.ratingAvg - a.ratingAvg);
      break;
    case "newest":
      items = [...items].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      items = [...items].sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.reviewCount - a.reviewCount
      );
  }

  return NextResponse.json({ products: items, total: items.length });
}
