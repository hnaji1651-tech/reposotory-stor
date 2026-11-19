import Link from "next/link";
import {
  Camera,
  Droplets,
  BatteryCharging,
  Feather,
  Truck,
  Banknote,
  ShieldCheck,
  RotateCcw,
  Check,
  Play,
  Package,
  PhoneCall,
  Zap,
} from "lucide-react";
import { getProductBySlug, getReviewsForProduct } from "@/lib/store";
import { PRODUCT_SLUG, formatPrice } from "@/lib/catalog";
import { Stars, Price } from "@/components/site";
import { Reveal } from "@/components/reveal";
import { Countdown, Faq, OrderForm } from "@/components/lenstrail";
import { inquiryUrl, WhatsAppIcon } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const product = await getProductBySlug(PRODUCT_SLUG);
  const reviews = await getReviewsForProduct(PRODUCT_SLUG);
  if (!product) return <main className="p-20 text-center">المنتج غير متوفر حالياً.</main>;

  const discount = product.compareAtCents
    ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
    : 0;

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#101d17] text-white">
        <div className="absolute inset-0 opacity-25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/lenstrail-ride.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101d17] via-[#101d17]/60 to-[#101d17]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-4 py-1.5 text-xs font-black animate-[fadeUp_0.5s_ease_both]">
              <Zap size={13} /> تخفيض {discount}% — العرض كيسالي اليوم
              <Countdown />
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2rem,6vw,3.8rem)] leading-[1.25] font-black animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: "80ms" }}
            >
              صوّر مغامراتك بدون يدين مع نظارات{" "}
              <span className="text-[#fb923c]">Lenstrail POV</span>
            </h1>
            <p
              className="mt-4 text-white/80 text-[15px] sm:text-lg leading-relaxed max-w-xl animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: "160ms" }}
            >
              كاميرا HD مدمجة كتصوّر من منظور عينيك — للموتور، الدراجة، السفر والبحر.
              خفيفة، ضد الماء، وبطارية صبّارة. خلّص غير ملي توصلك السلعة.
            </p>
            <div
              className="mt-5 flex items-center gap-3 animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: "220ms" }}
            >
              <Stars value={5} size={18} />
              <span className="text-sm font-bold">4.8/5 · +{reviews.length * 30} زبون راضي</span>
            </div>
            <div
              className="mt-6 flex flex-wrap items-center gap-4 animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: "280ms" }}
            >
              <div>
                <Price cents={product.priceCents} compareCents={product.compareAtCents} large />
                <p className="text-xs text-white/60 mt-1">التوصيل مجاني · الدفع عند الاستلام</p>
              </div>
            </div>
            <div
              className="mt-6 flex flex-wrap gap-3 animate-[fadeUp_0.6s_ease_both]"
              style={{ animationDelay: "340ms" }}
            >
              <a
                href={inquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-black hover:bg-[#1eb856] transition-all shadow-[0_12px_40px_rgba(37,211,102,0.5)]"
              >
                <WhatsAppIcon size={20} /> اطلب الآن واتساب — خلّص ملي توصلك
              </a>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-8 py-4 text-base font-bold hover:bg-white/20 transition-colors"
              >
                <Play size={17} /> شوف كيفاش خدامة
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2 max-w-md text-center">
              {[
                [Banknote, "الدفع عند الاستلام"],
                [Truck, "توصيل لجميع المدن"],
                [ShieldCheck, "ضمان سنة كاملة"],
              ].map(([Icon, label]: any) => (
                <div key={label} className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur px-2 py-3">
                  <Icon size={19} className="mx-auto text-[#fdba74]" />
                  <p className="mt-1.5 text-[12px] font-black leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* hero product visual */}
          <div className="relative animate-[fadeUp_0.7s_ease_both]" style={{ animationDelay: "200ms" }}>
            <div className="relative overflow-hidden rounded-[28px] bg-white shadow-2xl rotate-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/alicdn-hero.jpg"
                alt="نظارات Lenstrail POV بالكاميرا المدمجة"
                className="w-full aspect-square object-cover"
              />
              <span className="absolute top-4 right-4 rounded-full bg-[#dc2626] text-white px-4 py-1.5 text-sm font-black shadow-lg">
                -{discount}%
              </span>
              <span className="absolute top-4 left-4 rounded-full bg-[#1a2b23] text-white px-4 py-1.5 text-xs font-black">
                الأكثر مبيعاً
              </span>
            </div>
            <div className="absolute -bottom-4 right-6 left-6 sm:right-10 sm:left-10">
              <div className="rounded-2xl bg-[#1a2b23]/95 backdrop-blur px-5 py-3.5 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-sm font-black">Lenstrail POV — برتقالي ناري</p>
                  <p className="text-xs text-white/60">كاميرا HD · ضد الماء · بطارية 6 ساعات</p>
                </div>
                <Link href="#order" className="rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-black hover:bg-[#ea580c] transition-colors whitespace-nowrap">
                  {formatPrice(product.priceCents)}
                </Link>
              </div>
            </div>
            <div className="absolute -top-3 left-6 rounded-2xl bg-white text-[#1a2b23] px-4 py-2 text-xs font-black shadow-xl animate-[floaty_5s_ease-in-out_infinite]">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-500 animate-pulse" /> كاميرا HD مدمجة</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST MARQUEE ===== */}
      <div className="overflow-hidden border-b border-[#1a2b23]/10 bg-[#fff3e6] py-3">
        <div className="flex w-max animate-marquee gap-10 text-[12px] font-black text-[#7c2d12]/80">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10 pl-10" aria-hidden={k === 1}>
              {[
                "الدفع عند الاستلام",
                "توصيل 24-72 ساعة لجميع المدن",
                "كاميرا HD من منظور عينيك",
                "ضد الماء والعرق IPX5",
                "بطارية حتى 6 ساعات",
                "إرجاع خلال 7 أيام",
              ].map((t) => (
                <span key={t} className="whitespace-nowrap">✦ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 scroll-mt-24">
        <Reveal>
          <p className="text-center text-xs font-black text-[#ea580c]">علاش Lenstrail POV؟</p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-5xl font-black tracking-tight">
            3 أسباب كيخليوها الأفضل
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              img: "/products/lenstrail-macro.jpg",
              icon: Camera,
              title: "كاميرا HD مدمجة",
              body: "عدسة مخفية في الوسط كتصوّر فيديو وصور من نفس منظور عينيك. ضغطة وحدة على الزر وكتولي مخرج — بلا هاتف فيدك، بلا كاميرا فوق الراس.",
              points: ["تصوير POV بزاوية واسعة", "فيديو + صور بزر واحد", "مثالية للموتور والدراجة والسفر"],
            },
            {
              img: "/products/lenstrail-ride.jpg",
              icon: Droplets,
              title: "خفيفة ومقاومة للماء",
              body: "غير 32 غرام — غادي تنسى بلي لابسها. مقاومة للماء والعرق والغبار، ثابتة فوق الموتور وفي الجري، وعدسات مستقطبة كتحمي عينيك من الشمس.",
              points: ["وزن خفيف 32غ فقط", "مقاومة للماء IPX5", "عدسات UV400 مستقطبة"],
            },
            {
              img: "/products/alicdn-hero.jpg",
              icon: BatteryCharging,
              title: "بطارية تدوم طويلاً",
              body: "حتى 6 ساعات تصوير متواصل في الشحنة الوحدة — كافية لنهار كامل ديال المغامرات. شحن سريع USB-C وكارت ميموري 32GB هدية في العلبة.",
              points: ["حتى 6 ساعات تصوير", "شحن سريع USB-C", "كارت 32GB هدية + دعم حتى 128GB"],
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="h-full overflow-hidden rounded-[24px] bg-white border border-black/[0.07] shadow-[0_4px_25px_rgba(26,43,35,0.08)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ece5d3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.title} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  <span className="absolute bottom-3 right-3 grid place-items-center size-11 rounded-full bg-[#f97316] text-white shadow-lg">
                    <f.icon size={21} />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-black">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/65">{f.body}</p>
                  <ul className="mt-4 space-y-2">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm font-bold">
                        <Check size={16} className="text-[#15803d] shrink-0" strokeWidth={3} /> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 scroll-mt-24">
        <Reveal>
          <p className="text-center text-xs font-black text-[#ea580c]">شوفها من قريب</p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl font-black">صور المنتج الحقيقية</h2>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/products/alicdn-hero.jpg", "الواجهة — الكاميرا في الوسط"],
            ["/products/lenstrail-macro.jpg", "عدسة الكاميرا HD عن قرب"],
            ["/products/lenstrail-ride.jpg", "ثابتة فوق الموتور والدراجة"],
            ["/products/lenstrail-hero.jpg", "الأبعاد ومحتوى العلبة"],
          ].map(([src, label], i) => (
            <Reveal key={src} delay={i * 70}>
              <figure className="overflow-hidden rounded-[20px] bg-white border border-black/[0.07]">
                <div className="aspect-square overflow-hidden bg-[#ece5d3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={label} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <figcaption className="px-4 py-3 text-[13px] font-bold text-center">{label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS + SPECS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[26px] bg-[#1a2b23] text-white p-7 sm:p-10">
              <p className="text-xs font-black text-[#fdba74]">ساهلة بزاف</p>
              <h2 className="mt-2 font-display text-3xl font-black">كيفاش كتخدم؟ 3 خطوات</h2>
              <div className="mt-6 space-y-4">
                {[
                  ["1", "لبس النظارات", "إطار رياضي مريح وثابت — كتلبسها بحال أي نظارات شمسية عادية."],
                  ["2", "ضغط على الزر", "ضغطة وحدة للتصويرة، وضغطة مطوّلة للفيديو. ضوء صغير كيأكد بلي كتصوّر."],
                  ["3", "تفرّج وبارطاجي", "نقل الملفات للهاتف بالكابل، ومونتاج سريع وبارطاجي مغامراتك."],
                ].map(([n, t, d]) => (
                  <div key={n} className="flex gap-4 rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                    <span className="grid place-items-center size-10 shrink-0 rounded-full bg-[#f97316] font-black text-lg">{n}</span>
                    <div>
                      <p className="font-black">{t}</p>
                      <p className="mt-0.5 text-sm text-white/65">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[26px] bg-white border border-black/[0.08] p-7 sm:p-10">
              <p className="text-xs font-black text-[#ea580c]">المواصفات التقنية</p>
              <h2 className="mt-2 font-display text-3xl font-black">شنو فيها بالضبط؟</h2>
              <dl className="mt-6 divide-y divide-black/[0.07] text-sm">
                {[
                  ["الكاميرا", "HD مدمجة، تصوير POV بزاوية واسعة"],
                  ["العدسات", "مستقطبة UV400 ضد الشمس والانعكاس"],
                  ["الوزن", "32 غرام فقط — خفيفة بزاف"],
                  ["المقاومة", "ضد الماء والعرق والغبار IPX5"],
                  ["البطارية", "حتى 6 ساعات تصوير + شحن USB-C سريع"],
                  ["التخزين", "كارت 32GB هدية، دعم حتى 128GB"],
                  ["الألوان", "برتقالي ناري / أسود"],
                  ["محتوى العلبة", "النظارات + علبة صلبة + كابل + منديل"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3">
                    <dt className="font-black shrink-0">{k}</dt>
                    <dd className="text-black/60 text-left">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="#order" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#1a2b23] text-white py-3.5 text-sm font-black hover:bg-[#f97316] transition-colors">
                بغيتها — {formatPrice(product.priceCents)} فقط
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 scroll-mt-24">
        <Reveal>
          <div className="rounded-[28px] border border-[#1a2b23]/10 bg-white p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-[#ea580c]">آراء حقيقية</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black">شنو قالو الزبناء؟</h2>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#faf8f2] border border-black/[0.07] px-5 py-3">
                <span className="font-display text-4xl font-black">{product.ratingAvg.toFixed(1)}</span>
                <div>
                  <Stars value={product.ratingAvg} size={16} />
                  <p className="text-xs text-black/55 mt-0.5">+{product.reviewCount} تقييم من جميع المدن</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((r, i) => (
                <Reveal key={r.id} delay={Math.min(i, 5) * 60}>
                  <figure className="h-full rounded-2xl bg-[#faf8f2] border border-black/[0.06] p-5">
                    <Stars value={r.rating} />
                    <blockquote className="mt-2 text-[14px] leading-relaxed">{r.body}</blockquote>
                    <figcaption className="mt-3 text-[13px] font-black text-black/60">
                      — {r.author} {r.verified && <span className="text-[#15803d]">✓ مشتري مؤكد</span>}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 scroll-mt-24">
        <Reveal>
          <p className="text-center text-xs font-black text-[#ea580c]">عندك سؤال؟</p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl font-black">أسئلة كتوصلنا بزاف</h2>
          <div className="mt-6">
            <Faq
              items={[
                ["كيفاش كنخلص؟", "ساهلة: كتعمّر الاستمارة وكنتصلو بيك للتأكيد، وكتخلص نقداً ملي توصلك السلعة بين يديك. بلا كارت بنكية وبلا تسبيق."],
                ["شحال كيدير التوصيل؟", "التوصيل مجاني لجميع المدن المغربية، وكيوصل في 24-72 ساعة حسب المدينة. الدار البيضاء والرباط غالباً في 24-48 ساعة."],
                ["كيفاش كتخدم الكاميرا؟", "ضغطة وحدة على زر الذراع للتصويرة، وضغطة مطوّلة للفيديو. الملفات كيتسجلو على كارت الميموري ومن بعد كتنقلهم للهاتف بالكابل."],
                ["واش البطارية كافية؟", "البطارية كتدوم حتى 6 ساعات تصوير متواصل، والشحن سريع عبر USB-C. كافية لنهار كامل ديال الخرجات."],
                ["واش ضد الماء بصح؟", "إيه، مقاومة للماء والعرق والغبار (IPX5): الشتا، العرق، والرشاش عادي. غير ما تغطسهاش كاملة في الماء."],
                ["واش كاين ضمان؟", "إيه، ضمان سنة كاملة ضد عيوب الصنع + إمكانية الإرجاع خلال 7 أيام إلا ما عجباتكش (بحالتها الأصلية)."],
              ]}
            />
          </div>
        </Reveal>
      </section>

      {/* ===== ORDER ===== */}
      <section id="order" className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 scroll-mt-24">
        <Reveal>
          <p className="text-center text-xs font-black text-[#ea580c]">العرض كيسالي اليوم — المخزون محدود</p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-5xl font-black">
            طلب Lenstrail POV دابا
          </h2>
          <p className="mt-2 text-center text-black/60 font-bold">
            بقات غير <span className="text-[#dc2626] font-black">{product.stock} قطعة</span> بهاد الثمن — <Countdown />
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] bg-white border border-black/[0.07]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/alicdn-hero.jpg" alt="نظارات Lenstrail POV" className="w-full aspect-square object-cover" />
            </div>
            <div className="rounded-[24px] bg-[#1a2b23] text-white p-6">
              <p className="flex items-center gap-2 font-black"><Package size={18} className="text-[#fdba74]" /> شنو غادي يوصلك؟</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {["نظارات Lenstrail POV بالكاميرا", "كارت ميموري 32GB هدية", "علبة صلبة للحماية", "كابل شحن USB-C سريع", "منديل تنظيف + دليل سريع بالعربية"].map((t) => (
                  <li key={t} className="flex gap-2"><Check size={16} className="text-[#4ade80] shrink-0 mt-0.5" strokeWidth={3} /> {t}</li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] font-black">
                <span className="rounded-xl bg-white/10 px-2 py-2.5">توصيل مجاني</span>
                <span className="rounded-xl bg-white/10 px-2 py-2.5">الدفع عند الاستلام</span>
                <span className="rounded-xl bg-white/10 px-2 py-2.5">ضمان سنة</span>
              </div>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-5 flex items-start gap-3">
              <PhoneCall size={22} className="text-[#f97316] shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-black/70">
                <strong>ما بغيتيش تعمّر الاستمارة؟</strong> من بعد الطلب غادي نتصلو بيك للتأكيد —
                إلا كان عندك أي سؤال، فريقنا كيجاوب كل نهار من 9ص حتى 9م.
              </p>
            </div>
          </div>
          <OrderForm
            slug={product.slug}
            name={product.name}
            image={product.images[0]}
            unitPrice={product.priceCents}
            compareAt={product.compareAtCents ?? product.priceCents}
          />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 text-center">
          {[
            [Feather, "خفيفة ومريحة", "32غ فقط — للبس اليومي الطويل"],
            [Droplets, "ضد الماء والعرق", "الموتور، البحر، الشتا — بلا خوف"],
            [RotateCcw, "إرجاع 7 أيام", "إلا ما عجباتكش، رجّعها"],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-2xl bg-white border border-black/[0.07] p-5">
              <Icon size={22} className="mx-auto text-[#f97316]" />
              <p className="mt-2 font-black">{t}</p>
              <p className="text-[13px] text-black/55">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-black/10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[11px] line-through text-black/40">{formatPrice(product.compareAtCents ?? product.priceCents)}</p>
          <p className="text-lg font-black text-[#f97316] leading-none">{formatPrice(product.priceCents)}</p>
        </div>
        <a href={inquiryUrl()} target="_blank" rel="noopener noreferrer" className="flex-[1.4] text-center rounded-full bg-[#25D366] text-white py-3.5 text-[15px] font-black shadow-[0_8px_25px_rgba(37,211,102,0.45)]">
          اطلب الآن واتساب
        </a>
      </div>
      <div className="h-20 lg:hidden" />
    </main>
  );
}
