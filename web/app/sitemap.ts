import type { MetadataRoute } from "next";
import { RATINGS } from "@/lib/ratings";

const BASE_URL = "https://stave.cc";

const STATIC_ROUTES: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFreq: "weekly" },
  { path: "/marketplace", priority: 0.9, changeFreq: "weekly" },
  { path: "/indices", priority: 0.8, changeFreq: "weekly" },
  { path: "/how-it-works", priority: 0.7, changeFreq: "monthly" },
  { path: "/partners", priority: 0.6, changeFreq: "monthly" },
  { path: "/for-artists", priority: 0.6, changeFreq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFreq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));

  const catalogEntries = Object.keys(RATINGS).map((id) => ({
    url: `${BASE_URL}/issuances/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...catalogEntries];
}
