import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Awas Imsak! - Jadwal Sholat & Imsak",
  icons: {
    icon: '/brand.ico'
  },
  description: "Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses",
  applicationName: 'Awas Imsak!',
  referrer: 'origin-when-cross-origin',
  keywords: ['puasa', 'imsak', 'sholat', 'ramadhan', 'jadwal imsak', 'jadwal sholat', 'quran', 'baca quran', 'puasa ramadhan', 'bulan ramadhan'],
  authors: [{ name: 'Klaw' }, { name: 'Muhammad Dimas', url: 'https://klaw.my.id' }],
  creator: 'Klaw',
  publisher: 'RIOT REVENGER',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Awas Imsak! - Jadwal Sholat & Imsak',
    description: 'Awas Imsak! adalah portal yang menghadirkan jadwal sholat dan imsak dengan akurat dan mudah diakses',
    url: 'https://imsak.my.id',
    siteName: 'Awas Imsak!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/brand.ico" sizes="any" />
      </head>
      <body className="bodi">{children}</body>
    </html>
  );
}
