"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { type ProductDTO } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";
import { Stars, Price } from "@/components/site";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart";

type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export function ProductDetailClient({
  product,
  initialReviews,
  related,
}: {
  product: ProductDTO;
  initialReviews: Review[];
  related: ProductDTO[];
}) {
  const { addItem } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(product.colors[0] ?? "Standard");
  const [size, setSize] = useState(product.sizes[0] ?? "One Size");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "shipping" | "reviews">("details");

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [form, setForm] = useState({ author: "", rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const avg = useMemo(() => {
    if (reviews.length === 0) return product.ratingAvg;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews, product.ratingAvg]);

  const dist = useMemo(() => {
    const d = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      d[5 - r.rating] += 1;
    });
    // d index 0 = 5 stars
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
  }, [reviews]);

  const handleAdd = () => {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.images[0],
        color,
        size,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.title.trim() || !form.body.trim()) {
      setFormMsg("Please fill in every field.");
      return;
    }
    setSubmitting(true);
    setFormMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: product.slug, ...form }),
      });
      const data = await res.json();
      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setForm({ author: "", rating: 5, title: "", body: "" });
        setFormMsg("Thanks! Your review is live below.");
      } else {
        setFormMsg("Something went wrong — please try again.");
      }
    } catch {
      setFormMsg("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* GALLERY */}
        <div>
          <div className="relative overflow-hidden rounded-[26px] bg-[#ece5d3] aspect-[4/5] sm:aspect-square group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imgIdx}
              src={product.images[imgIdx]}
              alt={product.name}
              className="h-full w-full object-cover animate-[fadeUp_0.4s_ease]"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-[#1a2b23] text-white px-4 py-1.5 text-xs font-bold tracking-[0.1em] uppercase">
                {product.badge}
              </span>
            )}
            {product.compareAtCents && (
              <span className="absolute left-4 top-12 rounded-full bg-[#c96f2e] text-white px-3.5 py-1 text-xs font-bold">
                Save {formatPrice(product.compareAtCents - product.priceCents)}
              </span>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center size-10 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center size-10 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setImgIdx(i)}
                className={`overflow-hidden rounded-2xl aspect-square bg-[#ece5d3] border-2 transition-all ${
                  i === imgIdx ? "border-[#c96f2e]" : "border-transparent hover:border-black/20"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-xs tracking-[0.22em] uppercase font-bold text-[#c96f2e]">
            {product.category} · {product.collection.replace(/-/g, " ")}
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-[2.9rem] leading-[1.02] tracking-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-[15px] text-black/60">{product.tagline}</p>
          <div className="mt-3 flex items-center gap-2.5">
            <Stars value={avg} size={17} />
            <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
            <button onClick={() => setTab("reviews")} className="text-sm text-black/55 underline underline-offset-2 hover:text-black">
              {reviews.length} reviews
            </button>
          </div>
          <div className="mt-4">
            <Price cents={product.priceCents} compareCents={product.compareAtCents} large />
          </div>
          <p className="mt-1 text-[13px] text-black/55">
            or 4 interest-free payments of {formatPrice(Math.round(product.priceCents / 4))}
          </p>

          <p className="mt-5 text-[15px] leading-relaxed text-black/75">{product.description}</p>

          {/* color */}
          <div className="mt-6">
            <p className="text-[13px] font-bold tracking-wide">
              Color — <span className="font-medium text-black/60">{color}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium border transition-all ${
                    color === c
                      ? "bg-[#1a2b23] text-white border-[#1a2b23]"
                      : "border-black/20 hover:border-black/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* size */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold tracking-wide">
                Size — <span className="font-medium text-black/60">{size}</span>
              </p>
              <span className="text-xs text-black/50 underline underline-offset-2 cursor-pointer">
                Size guide
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 rounded-xl px-3.5 py-2.5 text-sm font-semibold border transition-all ${
                    size === s
                      ? "bg-[#1a2b23] text-white border-[#1a2b23]"
                      : "border-black/20 hover:border-black/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + add */}
          <div className="mt-6 flex gap-2.5">
            <div className="flex items-center rounded-full border border-black/20 px-1">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="grid place-items-center size-10 hover:bg-black/5 rounded-full"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty((v) => Math.min(99, v + 1))}
                className="grid place-items-center size-10 hover:bg-black/5 rounded-full"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold transition-all active:scale-[0.99] ${
                added ? "bg-[#2d6a4f] text-white" : "bg-[#1a2b23] text-white hover:bg-[#c96f2e]"
              }`}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to cart · {formatPrice(product.priceCents * qty)}
                </>
              )}
            </button>
          </div>

          <p className={`mt-3 text-[13px] font-medium ${product.stock <= 25 ? "text-[#9a3412]" : "text-[#2d6a4f]"}`}>
            {product.stock <= 25 ? (
              <>● Only {product.stock} left in stock — ships in 24h</>
            ) : (
              <>● In stock — ships within 24 hours from Portland, OR</>
            )}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              [Truck, "Free ship $99+"],
              [RotateCcw, "45-day returns"],
              [ShieldCheck, "1-yr warranty"],
            ].map(([Icon, label]: any) => (
              <div
                key={label}
                className="rounded-2xl border border-black/10 bg-white px-2 py-3 text-center"
              >
                <Icon size={17} className="mx-auto text-[#c96f2e]" />
                <p className="mt-1.5 text-[12px] font-semibold leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="mt-7 rounded-[22px] border border-black/10 bg-white overflow-hidden">
            <div className="flex border-b border-black/10">
              {(
                [
                  ["details", "Details"],
                  ["shipping", "Shipping"],
                  ["reviews", `Reviews (${reviews.length})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 px-2 py-3.5 text-[13px] font-bold tracking-wide transition-colors ${
                    tab === key
                      ? "bg-[#1a2b23] text-white"
                      : "text-black/60 hover:text-black hover:bg-black/[0.03]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-5 sm:p-6">
              {tab === "details" && (
                <ul className="space-y-2.5">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm text-black/75">
                      <Check size={16} className="mt-0.5 shrink-0 text-[#2d6a4f]" /> {d}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "shipping" && (
                <div className="text-sm text-black/75 space-y-2.5 leading-relaxed">
                  <p>
                    <strong>Standard (2–4 days):</strong> $8, free over $99.{" "}
                    <strong>Express (1–2 days):</strong> $18.
                  </p>
                  <p>Orders placed before 2pm PT ship same day from Portland, OR. Tracked & insured.</p>
                  <p>45-day ride-tested returns — ride, run and sweat in them. If you don&apos;t love it, send it back free.</p>
                </div>
              )}
              {tab === "reviews" && (
                <div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="text-center sm:w-36 shrink-0 rounded-2xl bg-[#faf8f2] p-4">
                      <p className="font-display text-4xl">{avg.toFixed(1)}</p>
                      <Stars value={avg} />
                      <p className="mt-1 text-xs text-black/55">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {dist.map((row) => (
                        <div key={row.star} className="flex items-center gap-2 text-xs">
                          <span className="w-7 font-semibold">{row.star}★</span>
                          <div className="flex-1 h-2 rounded-full bg-black/10 overflow-hidden">
                            <div
                              className="h-full bg-[#c96f2e] rounded-full transition-all"
                              style={{
                                width: `${reviews.length ? (row.count / reviews.length) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="w-6 text-black/50">{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {reviews.map((r) => (
                      <article key={r.id} className="rounded-2xl border border-black/[0.08] bg-[#faf8f2] p-4">
                        <div className="flex items-center justify-between gap-2">
                          <Stars value={r.rating} size={13} />
                          <span className="text-xs text-black/45">{r.createdAt}</span>
                        </div>
                        <h4 className="mt-1.5 text-sm font-bold">{r.title}</h4>
                        <p className="mt-1 text-sm text-black/70 leading-relaxed">{r.body}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-black/55">
                          — {r.author}
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] px-2 py-0.5 font-bold">
                              <BadgeCheck size={12} /> Verified
                            </span>
                          )}
                        </p>
                      </article>
                    ))}
                  </div>

                  <form onSubmit={submitReview} className="mt-5 rounded-2xl bg-[#1a2b23] text-white p-5">
                    <h4 className="font-display text-xl">Write a review</h4>
                    <div className="mt-3 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, rating: s }))}
                          aria-label={`${s} stars`}
                        >
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 20 20"
                            fill={s <= form.rating ? "#e8a04c" : "none"}
                            stroke={s <= form.rating ? "#e8a04c" : "rgba(255,255,255,0.4)"}
                            strokeWidth={1.5}
                          >
                            <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                      <input
                        value={form.author}
                        onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                        placeholder="Your name"
                        className="rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#e8a04c]"
                      />
                      <input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Headline"
                        className="rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#e8a04c]"
                      />
                    </div>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                      placeholder="How did it hold up on trail, in the city, in the wash…?"
                      rows={3}
                      className="mt-2.5 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#e8a04c] resize-none"
                    />
                    {formMsg && <p className="mt-2 text-[13px] text-[#e8c99a]">{formMsg}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-3 rounded-full bg-[#c96f2e] px-6 py-2.5 text-sm font-bold hover:bg-[#b25f25] disabled:opacity-60 transition-colors"
                    >
                      {submitting ? "Posting…" : "Post review"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl sm:text-4xl tracking-tight">Pairs well with</h2>
          <Link href="/shop" className="text-sm font-semibold hover:text-[#c96f2e] transition-colors">
            Shop all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
