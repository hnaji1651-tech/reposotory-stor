"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowLeft, Truck, Banknote, PhoneCall } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { WhatsAppIcon, WHATSAPP_CATALOG_URL } from "@/lib/whatsapp";

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const [order, setOrder] = useState<{
    totalCents: number;
    email: string;
    count: number;
    name?: string;
    city?: string;
    waUrl?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("atlas-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-14 sm:py-20 text-center">
      <div className="mx-auto grid place-items-center size-20 rounded-full bg-[#15803d] text-white animate-[fadeUp_0.5s_ease]">
        <Check size={36} strokeWidth={3} />
      </div>
      <p className="mt-6 text-xs font-black text-[#15803d]">توصّلنا بالطلب ديالك ✓</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black">
        شكراً {order?.name ? order.name.split(" ")[0] : ""}! طلبك تسجّل بنجاح
      </h1>
      <p className="mt-3 text-[15px] text-black/60 max-w-md mx-auto leading-relaxed">
        {order ? (
          <>
            غادي نتصلو بيك قريباً على <strong dir="ltr">{order.email}</strong> للتأكيد،
            ومن بعد نصيفطو لك {order.count === 1 ? "النظارة" : `${order.count} نظارات`} إلى{" "}
            <strong>{order.city}</strong> — المجموع{" "}
            <strong className="text-[#f97316]">{formatPrice(order.totalCents)}</strong> تخلصو ملي
            توصلك السلعة.
          </>
        ) : (
          "غادي نتصلو بيك للتأكيد ومن بعد نصيفطو الطلب ديالك. الخلاص ملي توصلك السلعة."
        )}
      </p>
      {orderId && (
        <p className="mt-4 inline-block rounded-full bg-black/[0.05] border border-black/10 px-4 py-1.5 text-[13px] font-mono" dir="ltr">
          N° {orderId.slice(0, 8).toUpperCase()}
        </p>
      )}
      <div className="mt-8 grid sm:grid-cols-3 gap-3 text-right">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <PhoneCall size={20} className="text-[#f97316]" />
          <p className="mt-2 text-sm font-black">مكالمة التأكيد</p>
          <p className="text-[13px] text-black/60">غادي نعيطو لك قبل الشحن للتأكيد.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <Truck size={20} className="text-[#f97316]" />
          <p className="mt-2 text-sm font-black">التوصيل 24-72 ساعة</p>
          <p className="text-[13px] text-black/60">لجميع المدن المغربية، مجاني.</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <Banknote size={20} className="text-[#f97316]" />
          <p className="mt-2 text-sm font-black">الخلاص عند الاستلام</p>
          <p className="text-[13px] text-black/60">قلّب السلعة عاد خلّص بلا خوف.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <a
          href={order?.waUrl ?? WHATSAPP_CATALOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-7 py-3 text-sm font-black hover:bg-[#1eb856] transition-colors shadow-[0_8px_25px_rgba(37,211,102,0.4)]"
        >
          <WhatsAppIcon size={17} /> تابع طلبك على واتساب
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#1a2b23] text-white px-7 py-3 text-sm font-black hover:bg-[#2a4436] transition-colors"
        >
          رجوع للصفحة الرئيسية <ArrowLeft size={16} />
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">كايتم التأكيد...</div>}>
      <SuccessInner />
    </Suspense>
  );
}
