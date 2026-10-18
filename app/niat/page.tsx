import React from "react";
import type { Metadata } from "next";
import Niat from "./Niat";

const title = "Niat Puasa Ramadhan: Bacaan Arab, Latin & Artinya";
const description =
  "Bacaan niat puasa Ramadhan untuk sehari dan sebulan penuh lengkap dengan tulisan Arab, Latin, dan artinya.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/niat" },
  openGraph: {
    title,
    description,
    url: "/niat",
    type: "article",
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

const NiatPage = () => {
  return (
    <div>
      <Niat />
    </div>
  );
};

export default NiatPage;
