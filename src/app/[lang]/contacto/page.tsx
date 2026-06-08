import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content/dictionaries";
import { Reveal } from "@/components/site/Reveal";
import { SignalLine } from "@/components/site/SignalLine";
import { ContactForm } from "@/components/site/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const cp = getDictionary(lang).contactPage;
  return { title: cp.eyebrow, description: cp.lead };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const cp = d.contactPage;
  const c = d.contact;

  const info = [
    { label: cp.emailLabel, value: c.email, href: `mailto:${c.email}` },
    { label: cp.phoneLabel, value: c.phone, href: c.phoneHref },
    {
      label: cp.whatsappLabel,
      value: c.whatsapp,
      href: c.whatsappHref,
      external: true,
    },
    { label: cp.addressLabel, value: `${c.address}, ${c.city}` },
    { label: cp.hoursLabel, value: c.hours },
  ];

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-40 pb-28 sm:px-8 sm:pt-48 lg:pb-36">
      <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* Info */}
        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
              {cp.eyebrow}
            </span>
            <h1 className="mt-7 font-serif text-[clamp(2.3rem,5.5vw,4rem)] font-normal leading-[1.0] tracking-[-0.03em] text-chalk">
              {cp.title}
            </h1>
            <SignalLine className="mt-7 w-20" />
            <p className="mt-7 max-w-sm text-[17px] leading-relaxed text-bone/90">
              {cp.lead}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 space-y-6 border-t border-line pt-8">
              {info.map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 text-[16px] text-chalk">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noopener noreferrer" : undefined}
                        className="transition-colors hover:text-bone"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <div className="console-panel rounded-2xl p-7 sm:p-10">
            <ContactForm
              dict={cp.form}
              services={d.services.items}
              locale={lang}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
