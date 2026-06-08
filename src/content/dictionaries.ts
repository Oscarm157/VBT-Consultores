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
    home: {
      hero: {
        eyebrow: "Consultoría · Tijuana, B.C.",
        title: "Estrategia, cumplimiento",
        titleAccent: "y crecimiento.",
        lead: "Firma de consultoría fiscal, financiera y empresarial para empresarios que buscan crecer con control financiero, seguridad fiscal y visión estratégica.",
        ctaPrimary: "Agendar consulta",
        ctaSecondary: "Ver servicios",
      },
      differentiator: {
        eyebrow: "El enfoque",
        title: "No somos un despacho contable.",
        body: "Somos una firma de consultoría para empresarios. Trabajamos sobre tres frentes que en la práctica no se separan: la carga fiscal, la salud financiera y la estructura de la empresa. El objetivo no es cumplir por cumplir, sino que cada decisión tenga control y respaldo.",
      },
      pillars: {
        eyebrow: "Servicios",
        title: "Tres frentes, un mismo criterio.",
        lead: "Cada frente resuelve un problema distinto, pero responde al mismo estándar de trabajo.",
        cta: "Ver el servicio",
      },
      audience: {
        eyebrow: "Para quién",
        title: "Empresarios que ya están operando.",
        lead: "Trabajamos con quienes buscan ordenar su operación y crecer con respaldo.",
        items: [
          "Desarrollos inmobiliarios",
          "Empresas familiares",
          "Inversionistas",
          "Emprendedores",
        ],
      },
      values: {
        eyebrow: "Cómo trabajamos",
        title: "Seis principios que no se negocian.",
        items: [
          { name: "Integridad", note: "Recomendamos lo que haríamos con nuestra propia empresa." },
          { name: "Confidencialidad", note: "La información de cada cliente se trata con reserva absoluta." },
          { name: "Profesionalismo", note: "Criterio técnico y trato formal en cada entrega." },
          { name: "Innovación", note: "Métodos y herramientas actuales aplicados a tu operación." },
          { name: "Responsabilidad", note: "Respondemos por el trabajo y por sus tiempos." },
          { name: "Compromiso con resultados", note: "Medimos el avance por lo que cambia en tu negocio." },
        ],
      },
      cta: {
        title: "Hablemos de tu empresa.",
        lead: "Agenda una consulta. Respondemos en un día hábil.",
        button: "Agendar consulta",
      },
    },
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
    home: {
      hero: {
        eyebrow: "Advisory · Tijuana, B.C.",
        title: "Strategy, compliance",
        titleAccent: "and growth.",
        lead: "A tax, financial and business advisory firm for owners who want to grow with financial control, tax certainty and strategic vision.",
        ctaPrimary: "Book a consultation",
        ctaSecondary: "View services",
      },
      differentiator: {
        eyebrow: "The approach",
        title: "We are not an accounting practice.",
        body: "We are an advisory firm for business owners. We work across three fronts that in practice never split apart: the tax burden, financial health and the structure of the company. The goal is not to comply for the sake of it, but to give every decision control and backing.",
      },
      pillars: {
        eyebrow: "Services",
        title: "Three fronts, one standard.",
        lead: "Each front solves a different problem, under the same standard of work.",
        cta: "View the service",
      },
      audience: {
        eyebrow: "Who we work with",
        title: "Owners who are already operating.",
        lead: "We work with those looking to put their operation in order and grow with backing.",
        items: [
          "Real estate developments",
          "Family businesses",
          "Investors",
          "Entrepreneurs",
        ],
      },
      values: {
        eyebrow: "How we work",
        title: "Six principles we do not negotiate.",
        items: [
          { name: "Integrity", note: "We recommend what we would do with our own company." },
          { name: "Confidentiality", note: "Every client's information is handled with full discretion." },
          { name: "Professionalism", note: "Technical judgment and a formal manner in every deliverable." },
          { name: "Innovation", note: "Current methods and tools applied to your operation." },
          { name: "Responsibility", note: "We answer for the work and for its deadlines." },
          { name: "Commitment to results", note: "We measure progress by what changes in your business." },
        ],
      },
      cta: {
        title: "Let's talk about your company.",
        lead: "Book a consultation. We reply within one business day.",
        button: "Book a consultation",
      },
    },
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
