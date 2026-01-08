import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://huyboon.tech";
    const locales = ["vi", "en"];
    const pages = ["", "/projects", "/services", "/contact", "/portfolio"];

    const entries = locales.flatMap((locale) =>
        pages.map((page) => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: page === "" ? 1 : 0.8,
        }))
    );

    return entries;
}
