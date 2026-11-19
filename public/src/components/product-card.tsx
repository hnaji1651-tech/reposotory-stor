"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { type ProductDTO } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";
import { Stars } from "./site";
import { useCart } from "./cart";

export function ProductCard({ product, index = 0 }: { product: ProductDTO; index?: number }) {
  const { addItem } = useCart();
  const discount = product.compareAtCents
    ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
    : 0;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white border border-black/[0.06] shadow-[0_2px_16px_rgba(26,43,35,0.06)] hover:shadow-[0_20px_50px_rgba(26,43,35,0.14)] hover:-translate-y-1 transition-all duration-400 animate-[fadeUp_0.5s_ease_both]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[#ece5d3]">
        <div className="aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-[#1a2b23] text-[#faf8f2] px-3 py-1 text-[11px] font-bold tracking-[0.08em] uppercase">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-[#c96f2e] text-white px-3 py-1 text-[11px] font-bold tracking-wide">
              −{discount}%
            </span>
          )}
        </div>
        {product.stock <= 25 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-[#9a3412]">
            Only {product.stock} left
          </span>
        )}
        <span className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <span className="block rounded-full bg-[#1a2b23]/90 backdrop-blur text-white text-center text-[13px] font-semibold py-2.5">
            Quick view →
          </span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-[#c96f2e]">
            {product.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-black/55">
            <Stars value={product.ratingAvg} size={12} />
            <span className="font-medium">({product.reviewCount})</span>
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 font-display text-[17px] leading-snug font-medium text-[#1a2b23] group-hover:text-[#c96f2e] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-[13px] text-black/55 line-clamp-1">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-baseline gap-2">
            <span className="text-[16px] font-bold text-[#1a2b23]">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-[13px] line-through text-black/40">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </span>
          <button
            onClick={() =>
              addItem(
                {
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  image: product.images[0],
                  color: product.colors[0],
                  size: product.sizes[0],
                },
                1
              )
            }
            className="grid place-items-center size-9 rounded-full bg-[#1a2b23] text-white hover:bg-[#c96f2e] active:scale-90 transition-all"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
