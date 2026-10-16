import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarryBackground from "@/components/star/page";

const siteUrl = "https://awasimsak.vercel.app";
const siteTitle = "Awas Imsak! - Jadwal Sholat & Imsak";
const siteDescription =
  "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: "/" },
  verification: {
    // Isi lewat env var GOOGLE_SITE_VERIFICATION (kode dari Search Console)
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  applicationName: "Awas Imsak!",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Awas Imsak!",
    statusBarStyle: "black-translucent",
  },
  referrer: "origin-when-cross-origin",
  keywords: [
    "puasa",
    "imsak",
    "sholat",
    "ramadhan",
    "jadwal imsak",
    "jadwal sholat",
    "quran",
    "baca quran",
    "puasa ramadhan",
    "bulan ramadhan",
  ],
  authors: [
    { name: "RIOT REVENGER" },
    { name: "Muhammad Dimas", url: "https://riotrevenger.xyz" },
  ],
  creator: "Commonly Works",
  publisher: "RIOT REVENGER",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Awas Imsak!",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/img/twt-link.png",
        alt: "Awas Imsak! - Jadwal Sholat & Imsak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/img/twt-link.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <StarryBackground numberOfStars={50}>{children}</StarryBackground>
      </body>
    </html>
  );
}
