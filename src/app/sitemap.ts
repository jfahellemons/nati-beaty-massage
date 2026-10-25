import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/over-mij`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/algemene-voorwaarden`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
