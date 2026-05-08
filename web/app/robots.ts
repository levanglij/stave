import type { MetadataRoute } from "next";

// Crawler instructions. Permissive on purpose — we want judges and
// search engines to find every page. The API route is excluded
// because it accepts POST applications, not browseable content.
// Served at /robots.txt automatically.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://stave.cc/sitemap.xml",
    host: "https://stave.cc",
  };
}
