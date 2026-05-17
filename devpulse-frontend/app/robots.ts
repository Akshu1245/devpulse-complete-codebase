import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/", "/settings/", "/billing/"],
    },
    sitemap: "https://devpulse.in/sitemap.xml",
    host: "https://devpulse.in",
  };
}
