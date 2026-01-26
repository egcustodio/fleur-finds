import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: "Flowertown PH - Premium Flower Bouquets & Arrangements | Naga City",
  description: "Flowertown is a sanctuary of floral artistry in Naga City, crafting stunning bouquets and exquisite floral arrangements. Fresh flowers, dried bouquets, customized arrangements, and more. Established since 2022.",
  keywords: ["flower shop", "bouquet", "Naga City", "fresh flowers", "dried flowers", "customized bouquets", "sympathy flowers", "money bouquets", "vases", "floral arrangements"],
  authors: [{ name: "Flowertown PH" }],
  openGraph: {
    title: "Flowertown PH - Premium Flower Bouquets & Arrangements",
    description: "A sanctuary of floral artistry in Naga City. Order online and receive 10% off your first purchase!",
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowertown PH - Premium Flower Bouquets",
    description: "Stunning bouquets and exquisite floral arrangements in Naga City",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${cormorant.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
