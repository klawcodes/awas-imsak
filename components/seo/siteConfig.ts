/**
 * Satu sumber kebenaran untuk SEO: dipakai oleh layout, sitemap, robots,
 * dan JSON-LD. Kalau domain berganti lagi, cukup ubah di sini.
 */
export const siteConfig = {
  url: "https://imsak.my.id",
  name: "Awas Imsak!",
  title: "Awas Imsak! - Jadwal Sholat, Imsak & Buka Puasa",
  description:
    "Jadwal imsak hari ini, jadwal sholat, dan waktu buka puasa untuk seluruh kota di Indonesia. Dilengkapi niat puasa Ramadhan, pengingat tadarus, dan tampilan TV masjid.",
  locale: "id_ID",
  language: "id-ID",
  themeColor: "#0d1811",
  ogImage: {
    url: "/img/twt-link.png",
    width: 1200,
    height: 630,
    alt: "Awas Imsak! - Jadwal Sholat, Imsak & Buka Puasa",
  },
  author: {
    name: "Muhammad Dimas",
    alias: "RIOT REVENGER",
    url: "https://riotrevenger.xyz",
  },
  publisher: "Commonly Works",
  publisherUrl: "https://commonly.riotrevenger.xyz",
} as const;
