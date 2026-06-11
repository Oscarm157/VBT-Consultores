import { notFound } from "next/navigation";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { ChatWidget } from "@/components/site/ChatWidget";
import { getDictionary, isLocale } from "@/content/dictionaries";

export default async function SiteLayout({
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
      <a href="#main" className="skip-link">
        {dict.skipToContent}
      </a>
      <div className="grain" aria-hidden />
      <Nav
        lang={lang}
        dict={dict.nav}
        langSwitch={dict.langSwitch}
        services={dict.services.items}
        servicesCta={dict.services.cta}
      />
      <main id="main">{children}</main>
      <Footer lang={lang} dict={dict} />
      <FloatingCTA href={dict.contact.whatsappHref} label={dict.floatingCta.whatsapp} />
      <ChatWidget />
    </>
  );
}
