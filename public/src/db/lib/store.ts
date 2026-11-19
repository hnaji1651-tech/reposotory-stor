import { db } from "@/db";
import { products, reviews, orders, orderItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PRODUCTS, SEED_REVIEWS, type CatalogProduct } from "./catalog";

export type ProductDTO = CatalogProduct & { id?: string };

function rowToDTO(r: typeof products.$inferSelect): ProductDTO {
  return {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    details: (r.details as string[]) ?? [],
    priceCents: r.priceCents,
    compareAtCents: r.compareAtCents ?? undefined,
    category: r.category,
    collection: r.collection,
    colors: (r.colors as string[]) ?? [],
    sizes: (r.sizes as string[]) ?? [],
    images: (r.images as string[]) ?? [],
    ratingAvg: Number(r.ratingAvg ?? 0),
    reviewCount: r.reviewCount ?? 0,
    stock: r.stock ?? 50,
    featured: r.featured ?? false,
    badge: r.badge ?? undefined,
    id: r.id,
  };
}

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    try {
      const existing = await db.select({ slug: products.slug }).from(products);
      const have = new Set(existing.map((r) => r.slug));
      const missing = PRODUCTS.filter((p) => !have.has(p.slug));
      if (missing.length === 0) return;
      for (const p of missing) {
        try {
          const inserted = await db
            .insert(products)
            .values({
              slug: p.slug,
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              details: p.details,
              priceCents: p.priceCents,
              compareAtCents: p.compareAtCents ?? null,
              category: p.category,
              collection: p.collection,
              colors: p.colors,
              sizes: p.sizes,
              images: p.images,
              ratingAvg: String(p.ratingAvg),
              reviewCount: p.reviewCount,
              stock: p.stock,
              featured: p.featured ?? false,
              badge: p.badge ?? null,
            })
            .onConflictDoNothing()
            .returning({ id: products.id, slug: products.slug });
          const row = inserted[0];
          if (row) {
            const rel = SEED_REVIEWS.filter((r) => r.productSlug === p.slug);
            for (const rv of rel) {
              await db.insert(reviews).values({
                productId: row.id,
                productSlug: rv.productSlug,
                author: rv.author,
                rating: rv.rating,
                title: rv.title,
                body: rv.body,
                verified: rv.verified,
              });
            }
          }
        } catch {
          // ignore per-product errors
        }
      }
    } catch {
      // DB unavailable — fallback to static catalog
    }
  })();
  return seedPromise;
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(products);
    if (rows.length === 0) return PRODUCTS;
    return rows.map(rowToDTO);
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (rows.length > 0) return rowToDTO(rows[0]);
  } catch {
    // fall through
  }
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getReviewsForProduct(slug: string) {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productSlug, slug));
    if (rows.length > 0) {
      return rows
        .map((r) => ({
          id: r.id,
          author: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          verified: r.verified ?? true,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
        }))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
  } catch {
    // fallback
  }
  return SEED_REVIEWS.filter((r) => r.productSlug === slug).map((r, i) => ({
    id: `seed-${slug}-${i}`,
    author: r.author,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt,
  }));
}

export async function createOrder(input: {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  shippingMethod: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: { productSlug: string; name: string; priceCents: number; qty: number; image?: string }[];
}) {
  try {
    await ensureSeeded();
    const inserted = await db
      .insert(orders)
      .values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        address: input.address,
        city: input.city,
        zip: input.zip,
        country: input.country,
        shippingMethod: input.shippingMethod,
        subtotalCents: input.subtotalCents,
        shippingCents: input.shippingCents,
        taxCents: input.taxCents,
        totalCents: input.totalCents,
        status: "confirmed",
      })
      .returning({ id: orders.id });
    const orderId = inserted[0]?.id ?? `demo-${Date.now()}`;
    for (const it of input.items) {
      try {
        await db.insert(orderItems).values({
          orderId: orderId as string,
          productSlug: it.productSlug,
          name: it.name,
          priceCents: it.priceCents,
          qty: it.qty,
          image: it.image ?? null,
        });
      } catch {
        // ignore
      }
    }
    return { id: orderId };
  } catch {
    return { id: `demo-${Date.now().toString(36)}` };
  }
}
