import type { MetadataRoute } from "next";
import { locales } from "@/content/dictionaries";

const BASE = "https://vbtconsultores.com";

const paths = [
  "",
  "/servicios",
  "/servicios/fiscal",
  "/servicios/financiera",
  "/servicios/empresarial",
  "/nosotros",
  "/blog",
  "/faq",
  "/contacto",
  "/recursos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) =>
    paths.map((p) => ({
      url: `${BASE}/${lang}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
  );
}
