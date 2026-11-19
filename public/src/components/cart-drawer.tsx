"use client";

import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "./cart";
import { formatPrice } from "@/lib/catalog";
import { inquiryUrl, WhatsAppIcon } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotalCents } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-[#1a2b23]/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-full max-w-md bg-[#faf8f2] shadow-2xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="سلة التسوق"
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/10">
          <h2 className="font-display text-xl font-black">
            السلة{" "}
            <span className="text-sm text-black/50">
              ({items.reduce((s, i) => s + i.qty, 0)})
            </span>
          </h2>
          <button
            onClick={closeCart}
            className="grid place-items-center size-9 rounded-full hover:bg-black/5 transition-colors"
            aria-label="سد السلة"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 border-b border-black/10 bg-[#fff3e6]">
          <p className="flex items-center gap-2 text-[13px] font-black text-[#15803d]">
            <WhatsAppIcon size={16} />
            التوصيل مجاني · الدفع نقداً عند الاستلام
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-center py-16">
              <div>
                <div className="mx-auto grid place-items-center size-16 rounded-full bg-black/5 text-2xl">
                  🕶️
                </div>
                <p className="mt-4 font-display text-2xl font-black">السلة خاوية</p>
                <p className="mt-2 text-sm text-black/60 max-w-[26ch] mx-auto">
                  زيد نظارات Lenstrail POV وطلب بضغطة وحدة.
                </p>
                <a
                  href={inquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-black hover:bg-[#1eb856] transition-colors"
                >
                  اطلب دابا واتساب <ArrowLeft size={16} />
                </a>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.slug}-${item.color}-${item.size}`}
                className="flex gap-3 rounded-2xl bg-white border border-black/[0.07] p-3 shadow-[0_2px_12px_rgba(26,43,35,0.06)] animate-[fadeUp_0.3s_ease]"
              >
                <div className="size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl bg-[#ece5d3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#1a2b23]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-black/55">
                        {[item.color, item.size].filter(Boolean).join(" · ") || "ستاندار"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug, item.color, item.size)}
                      className="p-1.5 rounded-full text-black/40 hover:text-red-700 hover:bg-red-50 transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-black/15 overflow-hidden">
                      <button
                        onClick={() => updateQty(item.slug, item.color, item.size, item.qty - 1)}
                        className="grid place-items-center size-7 hover:bg-black/5"
                        aria-label="نقص"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-[13px] font-black">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.slug, item.color, item.size, item.qty + 1)}
                        className="grid place-items-center size-7 hover:bg-black/5"
                        aria-label="زيد"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="text-sm font-black text-[#1a2b23]">
                      {formatPrice(item.priceCents * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 px-5 sm:px-6 py-4 bg-white/60 backdrop-blur">
            <div className="flex justify-between text-sm">
              <span className="text-black/60">المجموع</span>
              <span className="font-black text-[#1a2b23]">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-black/50">
              التوصيل مجاني · الخلاص نقداً عند الاستلام.
            </p>
            <a
              href={inquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeCart}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3.5 text-sm font-black hover:bg-[#1eb856] active:scale-[0.99] transition-all"
            >
              <WhatsAppIcon size={16} /> كمّل الطلب واتساب · {formatPrice(subtotalCents)}
            </a>
            <button
              onClick={closeCart}
              className="mt-2 w-full text-center text-[13px] font-bold text-black/60 hover:text-black py-1"
            >
              مواصلة التصفح
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
