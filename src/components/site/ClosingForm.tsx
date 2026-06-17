import { Reveal } from "./Reveal";
import { SignalLine } from "./SignalLine";
import { ContactForm } from "./ContactForm";

type FormDict = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  servicePlaceholder: string;
  serviceOther: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

/** Cierre de página con form corto inline (reusa ContactForm → /api/leads). */
export function ClosingForm({
  closing,
  labels,
  contact,
  form,
  services,
  locale,
}: {
  closing: { eyebrow: string; title: string; lead: string };
  labels: { emailLabel: string; phoneLabel: string; whatsappLabel: string };
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    whatsapp: string;
    whatsappHref: string;
  };
  form: FormDict;
  services: readonly { slug: string; name: string }[];
  locale: string;
}) {
  const channels = [
    { label: labels.phoneLabel, value: contact.phone, href: contact.phoneHref },
    {
      label: labels.whatsappLabel,
      value: contact.whatsapp,
      href: contact.whatsappHref,
      external: true,
    },
    { label: labels.emailLabel, value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section>
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">
                {closing.eyebrow}
              </span>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-chalk">
                {closing.title}
              </h2>
              <SignalLine className="mt-7 w-20" />
              <p className="mt-7 max-w-sm text-[16px] leading-relaxed text-bone/90">
                {closing.lead}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 space-y-5 border-t border-line pt-8">
                {channels.map((row) => (
                  <div key={row.label}>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">
                      {row.label}
                    </dt>
                    <dd className="mt-1.5 text-[16px] text-chalk">
                      <a
                        href={row.href}
                        target={row.external ? "_blank" : undefined}
                        rel={row.external ? "noopener noreferrer" : undefined}
                        className="transition-colors hover:text-bone"
                      >
                        {row.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="console-panel rounded-2xl p-7 sm:p-10">
              <ContactForm dict={form} services={services} locale={locale} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
