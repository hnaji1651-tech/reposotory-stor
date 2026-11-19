import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { Header, Footer } from "@/components/site";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingWhatsApp } from "@/components/lenstrail";

export const metadata: Metadata = {
  title: "نظارات Lenstrail POV — صوّر مغامراتك بدون يدين | الدفع عند الاستلام",
  description:
    "نظارات Lenstrail POV بالكاميرا المدمجة HD: تصوير بدون يدين، خفيفة ومقاومة للماء، بطارية تدوم طويلاً. التوصيل لجميع المدن المغربية والدفع عند الاستلام.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf8f2] text-[#1a2b23] antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
