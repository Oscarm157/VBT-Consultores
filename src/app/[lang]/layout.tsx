import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { LangSetter } from "@/components/site/LangSetter";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { getDictionary, isLocale, locales } from "@/content/dictionaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    description: d.footer.tagline,
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_MX" : "en_US",
      siteName: "VBT Consultores",
      description: d.footer.tagline,
    },
    alternates: {
      languages: { es: "/es", en: "/en" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <LangSetter lang={lang} />
      <div className="grain" aria-hidden />
      <Nav
        lang={lang}
        dict={dict.nav}
        langSwitch={dict.langSwitch}
        services={dict.services.items}
        servicesCta={dict.services.cta}
      />
      <main>{children}</main>
      <Footer lang={lang} dict={dict} />
      <FloatingCTA href={dict.contact.whatsappHref} label={dict.floatingCta.whatsapp} />
    </>
  );
}
