"use client";

import { useEffect } from "react";
import type { Locale } from "@/content/dictionaries";

export function LangSetter({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
