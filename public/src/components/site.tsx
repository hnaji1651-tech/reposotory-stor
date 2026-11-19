"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Camera,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import { useCart } from "./cart";
import { formatPrice } from "@/lib/catalog";
import { inquiryUrl, WhatsAppIcon } from "@/lib/whatsapp";

const NAV = [
  { href: "#features", label: "المميزات" },
  { href: "#gallery", label: "الصور" },
  { href: "#reviews", label: "آراء الزبناء" },
  { href: "#faq", label: "أسئلة شائعة" },
];

export function Header() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <div className="bg-[#1a2b23] text-[#f3ede1] text-center text-[11px] sm:text-xs font-bold py-2.5 px-4">
        التوصيل لجميع المدن المغربية &nbsp;·&nbsp; الدفع عند الاستلام &nbsp;·&nbsp; تخفيض 38% اليوم فقط
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#faf8f2]/90 backdrop-blur-xl border-[#1a2b23]/10 shadow-[0_8px_30px_rgba(26,43,35,0.08)]"
            : "bg-[#faf8f2] border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
            <button
              className="lg:hidden p-2 -mr-2 rounded-full hover:bg-black/5"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="القائمة"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="grid place-items-center size-9 sm:size-10 rounded-full bg-[#f97316] text-white group-hover:rotate-[-8deg] transition-transform">
                <Camera size={20} strokeWidth={2.2} />
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl sm:text-2xl font-black text-[#1a2b23]">
                  LENSTRAIL
                </span>
                <span className="block text-[10px] font-bold text-[#1a2b23]/60">
                  نظارات POV بالكاميرا
                </span>
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={`/${n.href}`}
                  className="text-sm font-bold transition-colors text-[#1a2b23]/65 hover:text-[#1a2b23]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={openCart}
                className="relative grid place-items-center size-10 rounded-full border border-black/15 hover:bg-black/5 transition-colors"
                aria-label="السلة"
              >
                <ShoppingBag size={19} />
                {count > 0 && (
                  <span
                    className={`absolute -top-1 -left-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-[#f97316] text-white text-[11px] font-bold transition-transform ${
                      bump ? "scale-125" : "scale-100"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
              <a
                href={inquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 sm:px-7 py-2.5 text-sm font-black hover:bg-[#1eb856] active:scale-[0.97] transition-all shadow-[0_8px_25px_rgba(37,211,102,0.45)]"
              >
                <WhatsAppIcon size={17} />
                اطلب الآن
              </a>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <nav className="lg:hidden border-t border-black/10 bg-[#faf8f2] px-4 py-3 animate-[slideDown_0.25s_ease]">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={`/${n.href}`}
                className="block py-3 text-sm font-bold text-[#1a2b23]/80 border-b border-black/5 last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={inquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3 text-sm font-black"
            >
              اطلب الآن واتساب — الدفع عند الاستلام <ArrowLeft size={16} />
            </a>
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1a2b23] text-[#f3ede1] mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center size-10 rounded-full bg-[#f97316] text-white">
                <Camera size={20} />
              </span>
              <span className="font-display text-2xl font-black">LENSTRAIL</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#f3ede1]/70 max-w-xs">
              نظارات POV بالكاميرا المدمجة — صوّر مغامراتك بدون يدين. التوصيل لجميع المدن
              المغربية والدفع عند الاستلام.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#f3ede1]/70">
              <span className="flex items-center gap-2">
                <Truck size={16} /> توصيل لجميع المدن
              </span>
              <span className="flex items-center gap-2">
                <Banknote size={16} /> الدفع عند الاستلام
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} /> ضمان سنة
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black text-[#f3ede1]/50">روابط سريعة</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/#features">المميزات</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#gallery">صور المنتج</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#reviews">آراء الزبناء</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#faq">أسئلة شائعة</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-[#f3ede1]/50">اطلب مباشرة</h4>
            <p className="mt-4 text-sm text-[#f3ede1]/70">
              عمّر الاستمارة وخلّص ملي توصلك السلعة. بلا كارت بنكية، بلا تعقيدات.
            </p>
            <a
              href={inquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-black hover:bg-[#1eb856] transition-colors"
            >
              <WhatsAppIcon size={17} /> اطلب عبر واتساب <ArrowLeft size={16} />
            </a>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-[#f3ede1]/60">
              <RotateCcw size={15} /> إمكانية الإرجاع خلال 7 أيام
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#f3ede1]/50">
          <span>© 2026 Lenstrail المغرب — جميع الحقوق محفوظة.</span>
          <span>الدفع نقداً عند الاستلام · التوصيل 24-72 ساعة</span>
        </div>
      </div>
    </footer>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${value} من 5 نجوم`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i <= Math.round(value) ? "#f97316" : "none"}
          stroke={i <= Math.round(value) ? "#f97316" : "#c9c2b2"}
          strokeWidth={1.5}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function Price({ cents, compareCents, large }: { cents: number; compareCents?: number; large?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-black text-[#1a2b23] ${large ? "text-3xl" : "text-[15px]"}`}>
        {formatPrice(cents)}
      </span>
      {compareCents && compareCents > cents && (
        <span className={`line-through text-[#1a2b23]/45 ${large ? "text-xl" : "text-[13px]"}`}>
          {formatPrice(compareCents)}
        </span>
      )}
    </span>
  );
}
