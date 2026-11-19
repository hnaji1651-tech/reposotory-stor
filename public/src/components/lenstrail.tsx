"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Check, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { orderMessageUrl, WHATSAPP_CATALOG_URL, WhatsAppIcon } from "@/lib/whatsapp";
import { Stars } from "./site";

const CITIES = [
  "الدار البيضاء",
  "الرباط",
  "مراكش",
  "فاس",
  "مكناس",
  "أكادير",
  "طنجة",
  "تطوان",
  "وجدة",
  "القنيطرة",
  "الجديدة",
  "الناظور",
  "بني ملال",
  "آسفي",
  "المحمدية",
  "خريبكة",
  "برشيد",
  "الصويرة",
  "الداخلة",
  "العيون",
  "مدينة أخرى",
];

export function Countdown() {
  const [left, setLeft] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span dir="ltr" className="font-mono font-black tabular-nums">
      {left}
    </span>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-2.5">
      {items.map(([q, a], i) => (
        <div
          key={q}
          className={`rounded-2xl border transition-colors overflow-hidden ${
            open === i ? "border-[#f97316] bg-white" : "border-black/10 bg-white/70"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-right font-bold text-[15px]"
          >
            {q}
            <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${open === i ? "rotate-180 text-[#f97316]" : "text-black/40"}`}
            />
          </button>
          {open === i && (
            <p className="px-5 pb-5 text-sm leading-relaxed text-black/65 animate-[fadeUp_0.25s_ease]">
              {a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

type Offer = { qty: number; priceCents: number; label: string; tag?: string };

export function OrderForm({
  slug,
  name,
  image,
  unitPrice,
  compareAt,
}: {
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  compareAt: number;
}) {
  const router = useRouter();
  const offers: Offer[] = useMemo(
    () => [
      { qty: 1, priceCents: unitPrice, label: "عرض التجربة — نظارة وحدة" },
      { qty: 2, priceCents: unitPrice * 2 - 9900, label: "عرض الثنائي — الأكثر طلباً", tag: "وفّر 99 د.م." },
    ],
    [unitPrice]
  );
  const [offerIdx, setOfferIdx] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", city: CITIES[0], address: "", note: "" });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const offer = offers[offerIdx];
  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const phoneOk = /^0[67]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("المرجو كتابة الاسم الكامل.");
    if (!phoneOk) return setError("المرجو كتابة رقم هاتف مغربي صحيح (مثال: 0612345678).");
    if (form.address.trim().length < 5) return setError("المرجو كتابة العنوان الكامل باش يوصلك الطلب.");
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: `cod-${form.phone.replace(/\D/g, "")}@lenstrail.ma`,
            firstName: form.name.trim(),
            lastName: "—",
            address: `${form.address.trim()}${form.note.trim() ? ` — ملاحظة: ${form.note.trim()}` : ""}`,
            city: form.city,
            zip: "00000",
            country: "المغرب",
            phone: form.phone.trim(),
          },
          shippingMethod: "cod",
          items: [
            {
              productSlug: slug,
              name: `${name} × ${offer.qty}`,
              priceCents: offer.priceCents,
              qty: 1,
              image,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "تعذّر إرسال الطلب");
      const waUrl = orderMessageUrl({
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city,
        address: form.address.trim(),
        qty: offer.qty,
        offerLabel: offer.qty === 1 ? "عرض التجربة" : "عرض الثنائي",
        totalLabel: formatPrice(offer.priceCents),
      });
      try {
        sessionStorage.setItem(
          "atlas-last-order",
          JSON.stringify({
            id: data.orderId,
            totalCents: data.totalCents,
            email: form.phone.trim(),
            count: offer.qty,
            cod: true,
            name: form.name.trim(),
            city: form.city,
            waUrl,
          })
        );
      } catch {
        // ignore
      }
      // Open WhatsApp with the prefilled order message, then show confirmation
      window.open(waUrl, "_blank", "noopener,noreferrer");
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch (err: any) {
      setError(err.message ?? "وقع مشكل، عاود المحاولة من فضلك.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[26px] border-2 border-[#1a2b23]/10 bg-white p-5 sm:p-8 shadow-[0_20px_60px_rgba(26,43,35,0.12)]">
      <h3 className="font-display text-2xl font-black">عمّر الاستمارة وطلب دابا</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#15803d]">
        <Banknote size={16} /> الدفع نقداً ملي توصلك السلعة — بلا كارت بنكية
      </p>

      <div className="mt-5 space-y-2.5">
        {offers.map((o, i) => (
          <button
            key={o.qty}
            type="button"
            onClick={() => setOfferIdx(i)}
            className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
              offerIdx === i ? "border-[#f97316] bg-[#fff7ed]" : "border-black/10 hover:border-black/30"
            }`}
          >
            <span
              className={`grid place-items-center size-6 rounded-full border-2 shrink-0 ${
                offerIdx === i ? "border-[#f97316] bg-[#f97316] text-white" : "border-black/25 text-transparent"
              }`}
            >
              <Check size={14} strokeWidth={3.5} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-black">
                {o.qty === 1 ? "نظارة وحدة" : "جوج نظارات"} — {o.label.split("—")[1]?.trim() ?? o.label}
              </span>
              {o.tag && (
                <span className="mt-0.5 inline-block rounded-full bg-[#15803d]/10 text-[#15803d] px-2.5 py-0.5 text-xs font-black">
                  {o.tag} + توصيل مجاني
                </span>
              )}
            </span>
            <span className="text-left">
              <span className="block text-lg font-black text-[#f97316]">{formatPrice(o.priceCents)}</span>
              <span className="block text-xs line-through text-black/40">{formatPrice(compareAt * o.qty)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <label className="block">
          <span className="text-[13px] font-black">الاسم الكامل *</span>
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="مثال: محمد العلوي"
            className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block" dir="ltr">
            <span className="text-[13px] font-black text-right block" dir="rtl">رقم الهاتف *</span>
            <input
              value={form.phone}
              onChange={set("phone")}
              placeholder="0612345678"
              inputMode="tel"
              dir="ltr"
              className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm tracking-widest text-left focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
            />
          </label>
          <label className="block">
            <span className="text-[13px] font-black">المدينة *</span>
            <select
              value={form.city}
              onChange={set("city")}
              className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#f97316]"
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-[13px] font-black">العنوان الكامل *</span>
          <input
            value={form.address}
            onChange={set("address")}
            placeholder="الحي، الزنقة، رقم الدار..."
            className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl bg-[#faf8f2] border border-black/10 p-4 text-sm space-y-1.5">
        <div className="flex justify-between"><span className="text-black/60">الثمن</span><strong>{formatPrice(offer.priceCents)}</strong></div>
        <div className="flex justify-between"><span className="text-black/60">التوصيل</span><strong className="text-[#15803d]">مجاني</strong></div>
        <div className="flex justify-between border-t border-black/10 pt-2 text-base"><span className="font-black">المجموع عند الاستلام</span><span className="font-black text-[#f97316] text-xl">{formatPrice(offer.priceCents)}</span></div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-[13px] font-bold text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={placing}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-4 text-base font-black hover:bg-[#1eb856] disabled:opacity-60 transition-all shadow-[0_12px_35px_rgba(37,211,102,0.45)] active:scale-[0.99]"
      >
        <WhatsAppIcon size={20} /> {placing ? "كايتصيفط الطلب..." : `تأكيد الطلب عبر واتساب — ${formatPrice(offer.priceCents)}`}
      </button>
      <p className="mt-2.5 text-center text-xs text-black/55">
        غادي نتصلو بيك للتأكيد قبل الشحن · التوصيل 24-72 ساعة لجميع المدن
      </p>
    </form>
  );
}

export function ReviewStars({ value }: { value: number }) {
  return <Stars value={value} size={15} />;
}

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_CATALOG_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معانا على واتساب وشوف الكتالوج"
      title="تواصل معانا واتساب"
      className="fixed z-50 bottom-24 right-4 lg:bottom-6 lg:right-6 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="relative grid place-items-center size-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] transition-transform group-hover:scale-110 group-active:scale-95">
        <WhatsAppIcon size={30} />
      </span>
      <span className="absolute top-0 right-0 grid place-items-center size-4 rounded-full bg-[#dc2626] text-white text-[10px] font-black">
        1
      </span>
    </a>
  );
}
