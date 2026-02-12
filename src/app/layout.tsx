import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fleur Finds - Luxury Flower Bouquets & Curated Floral Arrangements",
  description: "Fleur Finds offers exquisitely curated luxury flower bouquets and bespoke floral arrangements. Each piece is a masterwork of botanical artistry, crafted with the finest blooms for discerning clientele.",
  keywords: ["luxury flowers", "premium bouquet", "bespoke floral arrangements", "luxury flower delivery", "designer bouquets", "curated flowers", "elegant arrangements", "luxury gifts"],
  authors: [{ name: "Fleur Finds" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [
      { url: '/favicon.svg' },
    ],
  },
  openGraph: {
    title: "Fleur Finds - Luxury Floral Artistry",
    description: "Exquisitely curated luxury flower bouquets and bespoke arrangements for discerning clientele.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fleur Finds - Luxury Flower Bouquets",
    description: "Exquisitely curated floral masterpieces",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
