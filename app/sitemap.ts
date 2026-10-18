import type { MetadataRoute } from "next";
import { siteConfig } from "@/components/seo/siteConfig";

// Tambahkan halaman baru ke daftar ini (mis. "/qadha", "/doa").
const routes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/niat", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tadarus", changeFrequency: "monthly", priority: 0.8 },
  { path: "/masjid", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
