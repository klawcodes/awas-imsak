import type { Metadata, Viewport } from "next";
import "./globals.css";
import StarryBackground from "@/components/star/page";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/components/seo/siteConfig";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // Halaman lain cukup mengisi `title`, hasilnya "Judul | Awas Imsak!"
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Isi lewat env var GOOGLE_SITE_VERIFICATION (kode dari Search Console).
    // Tidak perlu kalau Anda verifikasi lewat DNS.
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  applicationName: siteConfig.name,
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
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  referrer: "origin-when-cross-origin",
  keywords: [
    "jadwal imsak",
    "jadwal sholat",
    "jadwal buka puasa",
    "jadwal imsakiyah",
    "niat puasa ramadhan",
    "tadarus",
    "tv masjid",
    "puasa ramadhan",
  ],
  authors: [
    { name: siteConfig.author.alias },
    { name: siteConfig.author.name, url: siteConfig.author.url },
  ],
  creator: siteConfig.publisher,
  publisher: siteConfig.author.alias,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage.url],
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
        <JsonLd />
        <StarryBackground numberOfStars={50}>{children}</StarryBackground>
      </body>
    </html>
  );
}
