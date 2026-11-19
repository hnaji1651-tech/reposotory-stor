"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { type ProductDTO } from "@/lib/store";
import { CATEGORIES, COLLECTIONS } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Most reviewed" },
];

export function ShopClient({ initial, collectionPreset }: { initial: ProductDTO[]; collectionPreset?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [collection, setCollection] = useState(
    collectionPreset ?? searchParams.get("collection") ?? ""
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "featured");
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice") ?? "200"));
  const [onSale, setOnSale] = useState(searchParams.get("sale") === "1");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [items, setItems] = useState<ProductDTO[]>(initial);
  const [loading, setLoading] = useState(false);

  // debounce search
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQ) params.set("q", debouncedQ);
        if (category) params.set("category", category);
        if (collection) params.set("collection", collection);
        if (sort) params.set("sort", sort);
        const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
        const data = await res.json();
        let list: ProductDTO[] = data.products ?? [];
        if (maxPrice < 200) list = list.filter((p) => p.priceCents <= maxPrice * 100);
        if (onSale) list = list.filter((p) => p.compareAtCents && p.compareAtCents > p.priceCents);
        if (!cancelled) setItems(list);
      } catch {
        // fallback client-side filter on initial
        let list = [...initial];
        if (debouncedQ)
          list = list.filter((p) =>
            `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(debouncedQ.toLowerCase())
          );
        if (category) list = list.filter((p) => p.category === category);
        if (collection) list = list.filter((p) => p.collection === collection);
        if (!cancelled) setItems(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, category, collection, sort, maxPrice, onSale]);

  const activeFilterCount =
    (category ? 1 : 0) + (collection && !collectionPreset ? 1 : 0) + (onSale ? 1 : 0) + (maxPrice < 200 ? 1 : 0);

  const clearAll = () => {
    setQ("");
    setCategory("");
    if (!collectionPreset) setCollection("");
    setMaxPrice(200);
    setOnSale(false);
    setSort("featured");
  };

  const collectionName = useMemo(
    () => COLLECTIONS.find((c) => c.slug === collection)?.name,
    [collection]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.24em] uppercase font-semibold text-[#c96f2e]">
            {collectionName ?? "The full catalogue"}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl tracking-tight">
            {collectionPreset
              ? COLLECTIONS.find((c) => c.slug === collectionPreset)?.name ?? "Shop"
              : "Shop all goods"}
          </h1>
          <p className="mt-2 text-sm text-black/60">
            <span className="font-semibold text-[#1a2b23]">{items.length}</span>{" "}
            {items.length === 1 ? "product" : "products"}
            {loading && <span className="ml-2 animate-pulse">· updating…</span>}
          </p>
        </div>
        {/* search + sort */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
          <label className="relative flex-1 sm:w-72">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sport, urban, chargers…"
              className="w-full rounded-full border border-black/15 bg-white pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e] focus:ring-2 focus:ring-[#c96f2e]/20 transition-all"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>
          <label className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full sm:w-52 rounded-full border border-black/15 bg-white pl-5 pr-10 py-3 text-sm font-medium focus:outline-none focus:border-[#c96f2e] cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/50" />
          </label>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border transition-colors lg:hidden ${
              filtersOpen ? "bg-[#1a2b23] text-white border-[#1a2b23]" : "bg-white border-black/15"
            }`}
          >
            <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* SIDEBAR */}
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-28 space-y-6 rounded-[22px] border border-black/[0.07] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[13px] font-bold tracking-[0.14em] uppercase">
                <SlidersHorizontal size={15} /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-xs font-semibold text-[#c96f2e] hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {!collectionPreset && (
              <div>
                <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-black/50">Collection</h3>
                <div className="mt-2.5 space-y-1">
                  <FilterRow active={!collection} label="All collections" onClick={() => setCollection("")} />
                  {COLLECTIONS.map((c) => (
                    <FilterRow
                      key={c.slug}
                      active={collection === c.slug}
                      label={c.name}
                      onClick={() => setCollection(collection === c.slug ? "" : c.slug)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-black/50">Category</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategory("")}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium border transition-colors ${
                    !category ? "bg-[#1a2b23] text-white border-[#1a2b23]" : "border-black/15 hover:border-black/40"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(category === c ? "" : c)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium border transition-colors ${
                      category === c
                        ? "bg-[#1a2b23] text-white border-[#1a2b23]"
                        : "border-black/15 hover:border-black/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-black/50">
                Max price · <span className="text-[#1a2b23]">${maxPrice}</span>
              </h3>
              <input
                type="range"
                min={15}
                max={200}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-[#c96f2e]"
              />
              <div className="flex justify-between text-xs text-black/50">
                <span>$15</span>
                <span>$200</span>
              </div>
            </div>

            <label className="flex items-center justify-between rounded-2xl bg-[#faf8f2] border border-black/[0.07] px-4 py-3 cursor-pointer">
              <span className="text-sm font-semibold">On sale only</span>
              <button
                role="switch"
                aria-checked={onSale}
                onClick={(e) => {
                  e.preventDefault();
                  setOnSale((v) => !v);
                }}
                className={`relative h-6 w-11 rounded-full transition-colors ${onSale ? "bg-[#c96f2e]" : "bg-black/20"}`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${onSale ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            </label>
          </div>
        </aside>

        {/* GRID */}
        <div>
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-[22px] border border-dashed border-black/20 bg-white/60 py-24 text-center">
              <div>
                <p className="font-display text-3xl">Nothing found</p>
                <p className="mt-2 text-sm text-black/60">Try a different search or clear your filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-5 rounded-full bg-[#1a2b23] text-white px-6 py-2.5 text-sm font-semibold"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
              {items.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function FilterRow({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
        active ? "bg-[#1a2b23] text-white font-semibold" : "hover:bg-black/5 text-black/75"
      }`}
    >
      {label}
      {active && <span aria-hidden>✓</span>}
    </button>
  );
}
