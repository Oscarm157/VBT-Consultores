export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Datos de contacto reales (única fuente). No inventar otros canales. */
const contactEs = {
  email: "Rvila@vbtconsultores.com",
  phone: "664 889 5835",
  phoneHref: "tel:+526648895835",
  whatsapp: "664 409 8464",
  whatsappHref: "https://wa.me/526644098464",
  address: "Torela Corporativo, Blvd. Agua Caliente 9955, Piso 5",
  city: "Tijuana, B.C., México",
  hours: "Lunes a viernes, 9:00 a 18:00",
} as const;

const contactEn = {
  ...contactEs,
  city: "Tijuana, B.C., Mexico",
  hours: "Monday to Friday, 9:00 to 18:00",
} as const;

/** Tres pilares de servicio (slugs estables). */
const servicesEs = [
  {
    slug: "fiscal",
    name: "Consultoría fiscal",
    summary: "Diagnóstico, planeación, atención SAT y auditoría preventiva.",
    items: [
      "Diagnóstico fiscal empresarial",
      "Planeación fiscal",
      "Atención SAT",
      "Auditoría preventiva",
    ],
  },
  {
    slug: "financiera",
    name: "Consultoría financiera",
    summary: "Modelos financieros, valuación y control presupuestal.",
    items: [
      "Modelos financieros",
      "Valuación de empresas",
      "Presupuestos y control financiero",
    ],
  },
  {
    slug: "empresarial",
    name: "Consultoría empresarial",
    summary: "Gobierno corporativo, due diligence y reestructuración.",
    items: [
      "Gobierno corporativo",
      "Due diligence",
      "Reestructuración administrativa",
    ],
  },
] as const;

const servicesEn = [
  {
    slug: "fiscal",
    name: "Tax advisory",
    summary: "Diagnosis, planning, SAT representation and preventive audit.",
    items: [
      "Corporate tax diagnosis",
      "Tax planning",
      "SAT representation",
      "Preventive audit",
    ],
  },
  {
    slug: "financiera",
    name: "Financial advisory",
    summary: "Financial modeling, business valuation and budget control.",
    items: [
      "Financial modeling",
      "Business valuation",
      "Budgeting and financial control",
    ],
  },
  {
    slug: "empresarial",
    name: "Business advisory",
    summary: "Corporate governance, due diligence and restructuring.",
    items: [
      "Corporate governance",
      "Due diligence",
      "Administrative restructuring",
    ],
  },
] as const;

export const dictionaries = {
  es: {
    nav: {
      services: "Servicios",
      about: "Nosotros",
      blog: "Blog",
      faq: "Preguntas",
      contact: "Contacto",
      resources: "Recursos",
      cta: "Agendar consulta",
      megaTitle: "Tres frentes, un mismo criterio.",
      megaLead:
        "Fiscal, financiero y empresarial bajo una sola firma de consultoría.",
    },
    langSwitch: { to: "EN", aria: "Switch to English" },
    services: { items: servicesEs, cta: "Ver todos los servicios" },
    contact: contactEs,
    floatingCta: { whatsapp: "WhatsApp" },
    footer: {
      tagline: "Consultoría fiscal, financiera y empresarial en Tijuana.",
      rights: "Todos los derechos reservados.",
      navLabel: "Navegación",
      contactLabel: "Contacto",
      hoursLabel: "Horario",
    },
  },
  en: {
    nav: {
      services: "Services",
      about: "About",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      resources: "Resources",
      cta: "Book a consultation",
      megaTitle: "Three fronts, one standard.",
      megaLead: "Tax, finance and business under a single advisory firm.",
    },
    langSwitch: { to: "ES", aria: "Cambiar a español" },
    services: { items: servicesEn, cta: "View all services" },
    contact: contactEn,
    floatingCta: { whatsapp: "WhatsApp" },
    footer: {
      tagline: "Tax, financial and business advisory in Tijuana.",
      rights: "All rights reserved.",
      navLabel: "Navigation",
      contactLabel: "Contact",
      hoursLabel: "Hours",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)["es"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as unknown as Dictionary;
}
