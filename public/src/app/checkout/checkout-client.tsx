"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  ChevronLeft,
  Check,
  CreditCard,
  Truck,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/catalog";

type Step = 1 | 2 | 3;

export function CheckoutClient() {
  const { items, subtotalCents, clear, updateQty, removeItem } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
  });
  const [payment, setPayment] = useState({
    card: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const shippingCents = useMemo(() => {
    if (items.length === 0) return 0;
    if (shippingMethod === "express") return 1800;
    return subtotalCents >= 9900 ? 0 : 800;
  }, [shippingMethod, subtotalCents, items.length]);

  const taxCents = Math.round(subtotalCents * 0.08);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const set = (k: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  const canContinue1 =
    customer.email.includes("@") &&
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    customer.address.trim() &&
    customer.city.trim() &&
    customer.zip.trim();

  const canPay =
    payment.card.replace(/\s/g, "").length >= 12 &&
    payment.expiry.length >= 4 &&
    payment.cvc.length >= 3 &&
    payment.name.trim();

  const placeOrder = async () => {
    if (!canPay || placing) return;
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          shippingMethod,
          items: items.map((i) => ({
            productSlug: i.slug,
            name: i.name,
            priceCents: i.priceCents,
            qty: i.qty,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      try {
        sessionStorage.setItem(
          "atlas-last-order",
          JSON.stringify({
            id: data.orderId,
            totalCents: data.totalCents,
            email: customer.email,
            count: items.reduce((s, i) => s + i.qty, 0),
          })
        );
      } catch {
        // ignore
      }
      clear();
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placing) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto grid place-items-center size-16 rounded-full bg-black/5 text-2xl">🛒</div>
        <h1 className="mt-5 font-display text-4xl">Your cart is empty</h1>
        <p className="mt-2 text-black/60">Add a few essentials before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-[#1a2b23] text-white px-7 py-3 text-sm font-semibold"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black">
        <ChevronLeft size={16} /> Continue shopping
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Checkout</h1>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-black/60">
          <Lock size={14} /> 256-bit encrypted · Demo checkout, no charge
        </span>
      </div>

      {/* stepper */}
      <div className="mt-6 flex items-center gap-2">
        {(
          [
            [1, "Shipping"],
            [2, "Delivery"],
            [3, "Payment"],
          ] as [Step, string][]
        ).map(([n, label], i) => (
          <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
            <button
              onClick={() => n < step && setStep(n)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                step === n
                  ? "bg-[#1a2b23] text-white"
                  : step > n
                    ? "bg-[#2d6a4f]/15 text-[#2d6a4f]"
                    : "bg-black/[0.06] text-black/50"
              }`}
            >
              {step > n ? <Check size={14} /> : <span>{n}</span>}
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < 2 && <span className="h-px flex-1 bg-black/10" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div className="rounded-[24px] border border-black/[0.08] bg-white p-5 sm:p-8">
          {step === 1 && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <h2 className="font-display text-2xl">Where&apos;s it going?</h2>
              <div className="mt-5 grid gap-3">
                <label className="block">
                  <span className="text-[13px] font-semibold">Email</span>
                  <input
                    value={customer.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    type="email"
                    className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e] focus:ring-2 focus:ring-[#c96f2e]/20"
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="First name" value={customer.firstName} onChange={set("firstName")} placeholder="Jordan" />
                  <Field label="Last name" value={customer.lastName} onChange={set("lastName")} placeholder="Lee" />
                </div>
                <Field label="Street address" value={customer.address} onChange={set("address")} placeholder="1200 NW Flanders St, Apt 4" />
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="City" value={customer.city} onChange={set("city")} placeholder="Portland" />
                  <Field label="ZIP" value={customer.zip} onChange={set("zip")} placeholder="97209" />
                  <label className="block">
                    <span className="text-[13px] font-semibold">Country</span>
                    <select
                      value={customer.country}
                      onChange={set("country")}
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#c96f2e]"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                    </select>
                  </label>
                </div>
              </div>
              <button
                disabled={!canContinue1}
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-full bg-[#1a2b23] text-white py-3.5 text-sm font-bold hover:bg-[#2a4436] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continue to delivery →
              </button>
              {!canContinue1 && (
                <p className="mt-2 text-center text-xs text-black/50">Fill in every field to continue.</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <h2 className="font-display text-2xl">Delivery speed</h2>
              <div className="mt-5 space-y-3">
                <button
                  onClick={() => setShippingMethod("standard")}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    shippingMethod === "standard" ? "border-[#1a2b23] bg-[#faf8f2]" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <span className="grid place-items-center size-11 rounded-full bg-[#1a2b23]/10">
                    <Truck size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">Standard · 2–4 days</span>
                    <span className="block text-[13px] text-black/55">Tracked & insured from Portland, OR</span>
                  </span>
                  <span className="text-sm font-bold">{subtotalCents >= 15000 ? "Free" : formatPrice(800)}</span>
                </button>
                <button
                  onClick={() => setShippingMethod("express")}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    shippingMethod === "express" ? "border-[#c96f2e] bg-[#fff7ed]" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <span className="grid place-items-center size-11 rounded-full bg-[#c96f2e]/15">
                    <Zap size={20} className="text-[#c96f2e]" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">Express · 1–2 days</span>
                    <span className="block text-[13px] text-black/55">Priority handling, arrives faster</span>
                  </span>
                  <span className="text-sm font-bold">{formatPrice(1800)}</span>
                </button>
              </div>
              <div className="mt-6 flex gap-2.5">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-black/20 px-6 py-3.5 text-sm font-bold hover:bg-black/5 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-full bg-[#1a2b23] text-white py-3.5 text-sm font-bold hover:bg-[#2a4436] transition-colors"
                >
                  Continue to payment →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <h2 className="flex items-center gap-2 font-display text-2xl">
                <CreditCard size={22} /> Payment
              </h2>
              <p className="mt-1 text-[13px] text-black/55">Demo checkout — use any details, you won&apos;t be charged.</p>
              <div className="mt-5 grid gap-3">
                <label className="block">
                  <span className="text-[13px] font-semibold">Name on card</span>
                  <input
                    value={payment.name}
                    onChange={(e) => setPayment((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Jordan Lee"
                    className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e] focus:ring-2 focus:ring-[#c96f2e]/20"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold">Card number</span>
                  <input
                    value={payment.card}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setPayment((p) => ({ ...p, card: digits.replace(/(\d{4})(?=\d)/g, "$1 ") }));
                    }}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm tracking-widest focus:outline-none focus:border-[#c96f2e] focus:ring-2 focus:ring-[#c96f2e]/20"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[13px] font-semibold">Expiry</span>
                    <input
                      value={payment.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
                        setPayment((p) => ({ ...p, expiry: v }));
                      }}
                      placeholder="08 / 28"
                      inputMode="numeric"
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold">CVC</span>
                    <input
                      value={payment.cvc}
                      onChange={(e) => setPayment((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="314"
                      inputMode="numeric"
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e]"
                    />
                  </label>
                </div>
              </div>
              {error && (
                <p className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-[13px] text-red-700">{error}</p>
              )}
              <div className="mt-6 flex gap-2.5">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-full border border-black/20 px-6 py-3.5 text-sm font-bold hover:bg-black/5 transition-colors"
                >
                  ← Back
                </button>
                <button
                  disabled={!canPay || placing}
                  onClick={placeOrder}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#c96f2e] text-white py-3.5 text-sm font-bold hover:bg-[#a95822] disabled:opacity-50 transition-all"
                >
                  <Lock size={15} /> {placing ? "Placing order…" : `Pay ${formatPrice(totalCents)}`}
                </button>
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-black/50">
                <ShieldCheck size={13} /> Protected by Atlas Buyer Guarantee · 60-day returns
              </p>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <aside className="h-fit rounded-[24px] bg-[#1a2b23] text-[#faf8f2] p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Order summary</h2>
          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={`${i.slug}-${i.color}-${i.size}`} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  <span className="absolute -top-0 -right-0 bg-[#c96f2e] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                    ×{i.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{i.name}</p>
                  <p className="text-xs text-white/55">{[i.color, i.size].filter(Boolean).join(" · ")}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <button onClick={() => updateQty(i.slug, i.color, i.size, i.qty - 1)} className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20">−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => updateQty(i.slug, i.color, i.size, i.qty + 1)} className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20">+</button>
                      <button onClick={() => removeItem(i.slug, i.color, i.size)} className="ml-1 text-white/50 hover:text-red-300 underline">remove</button>
                    </div>
                    <span className="text-[13px] font-bold">{formatPrice(i.priceCents * i.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-1.5 border-t border-white/15 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotalCents)} />
            <Row
              label={`Shipping (${shippingMethod})`}
              value={shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
            />
            <Row label="Est. tax (8%)" value={formatPrice(taxCents)} />
            <div className="flex justify-between pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/55">
            {shippingCents === 0 ? "✓ Free standard shipping unlocked" : `Add ${formatPrice(9900 - subtotalCents)} more for free standard shipping`}
          </p>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#c96f2e] focus:ring-2 focus:ring-[#c96f2e]/20"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-white/75">
      <span>{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
