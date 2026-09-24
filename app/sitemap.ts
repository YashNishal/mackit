import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", SITE_URL).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/how-it-works", SITE_URL).toString(), changeFrequency: "monthly", priority: 0.6 },
    { url: new URL("/safety", SITE_URL).toString(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
