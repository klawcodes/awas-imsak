import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StarryBackground from "@/components/star/page";

export const metadata: Metadata = {
  title: "Awas Imsak! - Jadwal Sholat & Imsak",
  description:
    "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses",
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
    { name: "Klaw" },
    { name: "Muhammad Dimas", url: "https://klaw.my.id" },
  ],
  creator: "Commonly Works",
  publisher: "RIOT REVENGER",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Awas Imsak! - Jadwal Sholat & Imsak",
    description:
      "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses",
    url: "https://imsak.my.id",
    siteName: "Awas Imsak!",
    type: "website",
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
