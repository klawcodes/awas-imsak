import React from "react";
import type { Metadata } from "next";
import Masjid from "./Masjid";

const title = "Tampilan TV Jadwal Sholat untuk Masjid & Mushola";
const description =
  "Tampilkan jadwal sholat, jam analog, dan hitung mundur adzan di layar TV masjid atau mushola Anda. Gratis, cukup buka di browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/masjid" },
  openGraph: {
    title,
    description,
    url: "/masjid",
    type: "website",
    locale: "id_ID",
    siteName: "Awas Imsak!",
    images: ["/img/twt-link.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/twt-link.png"],
  },
};

const MasjidPage = () => {
  return (
    <div>
      <Masjid />
    </div>
  );
};

export default MasjidPage;
