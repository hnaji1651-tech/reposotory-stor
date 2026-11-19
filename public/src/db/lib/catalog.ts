export type CatalogProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  priceCents: number;
  compareAtCents?: number;
  category: string;
  collection: string;
  colors: string[];
  sizes: string[];
  images: string[];
  ratingAvg: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  badge?: string;
};

export type CatalogReview = {
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export const COLLECTIONS = [
  {
    slug: "lenstrail-pov",
    name: "Lenstrail POV",
    tagline: "نظارات الكاميرا المدمجة — صوّر بدون يدين",
    image: "/products/alicdn-hero.jpg",
    description: "كاميرا HD مدمجة + عدسات مستقطبة.",
  },
];

export const CATEGORIES = ["نظارات ذكية"];

export const PRODUCT_SLUG = "lenstrail-pov-camera";

export const PRODUCTS: CatalogProduct[] = [
  {
    slug: PRODUCT_SLUG,
    name: "نظارات Lenstrail POV بالكاميرا",
    tagline: "كاميرا HD مدمجة · تصوير بدون يدين · ضد الماء",
    description:
      "نظارات Lenstrail POV هي الطريقة الأسهل باش توثّق مغامراتك: كاميرا HD مدمجة في الوسط كتصوّر من نفس منظور عينيك، بضغطة وحدة على الزر. عدسات مستقطبة ملوّنة كتحمي من الشمس، إطار رياضي خفيف ومريح، ومقاومة للماء والعرق — مثالية للموتور، الدراجة، السفر، البحر والصيد. البطارية كتدوم حتى 6 ساعات تصوير، والتخزين على كارت ميموري.",
    details: [
      "كاميرا HD مدمجة في الجسر — تصوير POV من منظور عينيك",
      "تسجيل فيديو + صور بضغطة زر وحدة على الذراع",
      "عدسات مستقطبة UV400 ضد الشمس والانعكاس",
      "خفيفة بزاف (32غ) ومريحة لساعات طويلة",
      "مقاومة للماء والعرق IPX5 — الموتور والبحر والشتا",
      "بطارية تدوم حتى 6 ساعات + شحن سريع USB-C",
      "دعم كارت ميموري حتى 128GB (كاينة فالعلبة 32GB هدية)",
      "في العلبة: النظارات + علبة صلبة + كابل شحن + منديل تنظيف",
    ],
    priceCents: 49900,
    compareAtCents: 79900,
    category: "نظارات ذكية",
    collection: "lenstrail-pov",
    colors: ["برتقالي ناري", "أسود"],
    sizes: ["مقاس واحد"],
    images: [
      "/products/alicdn-hero.jpg",
      "/products/lenstrail-macro.jpg",
      "/products/lenstrail-ride.jpg",
    ],
    ratingAvg: 4.8,
    reviewCount: 327,
    stock: 58,
    featured: true,
    badge: "الأكثر مبيعاً",
  },
];

export const SEED_REVIEWS: CatalogReview[] = [
  {
    productSlug: PRODUCT_SLUG,
    author: "ياسين من الدار البيضاء",
    rating: 5,
    title: "خدماتني فالموتور بزاف",
    body: "كنسوق موتور كل نهار وكنت باغي نوثّق الطريق. الكاميرا واضحة والتصوير ثابت، والصوت مسموع. وصلاتني ف 48 ساعة وخلصت ملي وصلاتني. شكراً!",
    verified: true,
    createdAt: "2026-10-12",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "سلمى من الرباط",
    rating: 5,
    title: "خفيفة وزوينة",
    body: "كنت خايفة تكون ثقيلة على الوجه ولكن خفيفة بزاف، لبستها نهار كامل فالسفر وما حسيتش بيها. التصاور ديال البحر خرجو واعرين.",
    verified: true,
    createdAt: "2026-10-05",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "Mehdi de Casablanca",
    rating: 5,
    title: "Qualité surprenante",
    body: "Je ne m'attendais pas à cette qualité pour le prix. Vidéo fluide, lunettes confortables, livraison rapide à Casa en 2 jours. Paiement à la livraison, zéro stress.",
    verified: true,
    createdAt: "2026-09-28",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "عمر من مراكش",
    rating: 5,
    title: "البطارية صبارة",
    body: "صورت بيها خرجة كاملة ديال الدراجة تقريباً 5 ساعات وما طفاتش. الشحن سريع. العدسات كيحميو من الشمس مزيان.",
    verified: true,
    createdAt: "2026-09-20",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "خديجة من أكادير",
    rating: 4,
    title: "زوينة، خاص غير تعلم الزر",
    body: "أول نهار تلفت شوية مع الزر ديال التصوير ولكن من بعد ساهلة: ضغطة للتصويرة وجوج للفيديو. الجودة ممتازة بالنسبة للثمن.",
    verified: true,
    createdAt: "2026-09-11",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "Anas de Tanger",
    rating: 5,
    title: "Parfait pour la moto",
    body: "Je filme tous mes trajets maintenant. L'angle POV est exactement ce que je vois. Étanche testée sous la pluie — aucun problème. Je recommande.",
    verified: true,
    createdAt: "2026-08-30",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "بلال من فاس",
    rating: 5,
    title: "الدفع عند الاستلام ريحني",
    body: "أول مرة نشري من الإنترنت وكنت خايف، ولكن الدفع عند الاستلام ريحني. السلعة هي اللي فالتصاور بالضبط والعلبة عامرة.",
    verified: true,
    createdAt: "2026-08-22",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "Sara de Marrakech",
    rating: 5,
    title: "Idéal voyage",
    body: "Je l'ai emmenée à Essaouira : photos, vidéos, plage, tout y est. Légères, jolies, et la carte mémoire offerte fait plaisir. Livraison soignée.",
    verified: false,
    createdAt: "2026-08-14",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "حمزة من مكناس",
    rating: 4,
    title: "ممتازة للصيد والخرجات",
    body: "كنستعملها فالصيد والخرجات للجبل. ضد الماء بصح، طاحت ليا فالواد مرة وخدامة عادي. كنصح بيها.",
    verified: true,
    createdAt: "2026-07-29",
  },
  {
    productSlug: PRODUCT_SLUG,
    author: "Rachid de Rabat",
    rating: 5,
    title: "Rapport qualité-prix imbattable",
    body: "Caméra discrète, verres polarisés de bonne qualité, batterie sérieuse. Pour 499 DH franchement il n'y a pas mieux. Service client réactif sur WhatsApp.",
    verified: true,
    createdAt: "2026-07-17",
  },
];

export function formatPrice(cents: number): string {
  const mad = cents / 100;
  return `${new Intl.NumberFormat("ar-MA").format(mad)} د.م.`;
}
