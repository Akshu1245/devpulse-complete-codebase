import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://devpulse.in";

const routes = [
  "",
  "/pricing",
  "/privacy",
  "/terms",
  "/demo",
  "/compare",
  "/research",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.7,
  }));
}
