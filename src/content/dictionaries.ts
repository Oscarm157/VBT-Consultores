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
    skipToContent: "Saltar al contenido",
    home: {
      hero: {
        eyebrow: "Consultoría · Tijuana, B.C.",
        title: "Estrategia, cumplimiento y crecimiento.",
        titleAccent: "y crecimiento.",
        lead: "Firma de consultoría fiscal, financiera y empresarial para empresarios que buscan crecer con control financiero, seguridad fiscal y visión estratégica.",
        ctaPrimary: "Agendar consulta",
        ctaSecondary: "Ver servicios",
        channels: [
          { label: "Fiscal", state: "Riesgo en control", tone: "signal" },
          { label: "Financiera", state: "Con visibilidad", tone: "up" },
          { label: "Empresarial", state: "Estructura clara", tone: "signal" },
        ],
      },
      differentiator: {
        eyebrow: "El enfoque",
        title: "Consultoría empresarial, más allá de la contabilidad.",
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
          { name: "Innovación", note: "Seguimos los cambios normativos y de herramientas para que el trabajo sea vigente, no rutinario." },
          { name: "Responsabilidad", note: "Respondemos por el trabajo y por sus tiempos." },
          { name: "Compromiso con resultados", note: "Definimos un alcance, entregamos en los plazos acordados y revisamos que el resultado sea accionable." },
        ],
      },
      cta: {
        title: "Hablemos de tu empresa.",
        lead: "Agenda una consulta. Respondemos en un día hábil.",
        button: "Agendar consulta",
      },
    },
    services: { items: servicesEs, cta: "Ver todos los servicios" },
    servicesPage: {
      eyebrow: "Servicios",
      title: "Tres frentes, un mismo criterio.",
      lead: "Fiscal, financiero y empresarial bajo una sola firma. Cada frente resuelve un problema distinto y responde al mismo estándar de trabajo.",
      detailEyebrow: "Servicio",
      includes: "Lo que incluye",
      others: "Otros servicios",
      backToAll: "Todos los servicios",
      cta: "Agendar consulta",
      ctaLead: "Cuéntanos en qué está tu empresa y vemos por dónde empezar.",
    },
    about: {
      hero: {
        eyebrow: "Nosotros",
        title: "Consultoría empresarial, más allá de la contabilidad.",
        lead: "VBT Consultores es una firma de consultoría fiscal, financiera y empresarial en Tijuana. Trabajamos con empresarios que ya están operando y quieren crecer con control.",
      },
      approach: {
        eyebrow: "Cómo trabajamos",
        title: "Tres frentes, un solo criterio.",
        paragraphs: [
          "La mayoría de las empresas tratan lo fiscal, lo financiero y lo administrativo por separado, con un proveedor distinto para cada cosa. En la práctica son el mismo problema visto desde tres ángulos.",
          "Primero entendemos cómo está la empresa hoy. Luego corregimos lo que la expone y dejamos una estructura que sostiene una revisión y soporta el crecimiento.",
          "No prometemos atajos. Lo que ofrecemos es criterio técnico, trato formal y respuestas con respaldo.",
        ],
      },
      valuesEyebrow: "Principios",
      audienceEyebrow: "Para quién",
    },
    faqPage: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que suelen preguntar.",
      lead: "Si tu duda no está aquí, escríbenos y la resolvemos.",
      items: [
        {
          q: "¿En qué se diferencian de un despacho contable?",
          a: "Un despacho lleva la contabilidad y cumple obligaciones. Nosotros trabajamos sobre la estrategia: cómo reducir el riesgo fiscal, ordenar las finanzas y estructurar la empresa para que crezca con control.",
        },
        {
          q: "¿Cómo empieza el trabajo con ustedes?",
          a: "Con una consulta inicial. Revisamos en qué está tu empresa y proponemos por dónde empezar, con un alcance claro antes de comprometer nada.",
        },
        {
          q: "¿Trabajan con empresas familiares?",
          a: "Sí. Es uno de los casos donde más aportamos, sobre todo en gobierno corporativo, donde se mezclan la operación y la propiedad.",
        },
        {
          q: "¿Atienden requerimientos del SAT que ya están en curso?",
          a: "Sí. Acompañamos en requerimientos, revisiones y aclaraciones, con sustento técnico y dentro de los plazos que marca la autoridad.",
        },
        {
          q: "¿Cómo manejan la información de la empresa?",
          a: "Con reserva absoluta. La confidencialidad es una condición del trabajo, no un agregado.",
        },
        {
          q: "¿Cuánto cuesta una consultoría?",
          a: "Depende del alcance. Después de una primera conversación enviamos una propuesta con el detalle de lo que incluye.",
        },
      ],
    },
    contactPage: {
      eyebrow: "Contacto",
      title: "Hablemos de tu empresa.",
      lead: "Agenda una consulta. Respondemos en un día hábil.",
      infoTitle: "Datos de contacto",
      emailLabel: "Correo",
      phoneLabel: "Teléfono",
      whatsappLabel: "WhatsApp",
      addressLabel: "Oficina",
      hoursLabel: "Horario",
      form: {
        name: "Nombre",
        email: "Correo",
        phone: "Teléfono",
        company: "Empresa",
        service: "Servicio de interés",
        servicePlaceholder: "Selecciona un servicio",
        serviceOther: "No estoy seguro",
        message: "¿En qué podemos ayudarte?",
        submit: "Enviar",
        sending: "Enviando…",
        success: "Gracias. Te contactamos en un día hábil.",
        error: "No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.",
      },
    },
    blogPage: {
      eyebrow: "Blog y noticias",
      title: "Criterio fiscal y financiero, en claro.",
      lead: "Notas breves sobre cambios fiscales, finanzas y gestión para empresarios. En preparación.",
      sampleBadge: "Ejemplo",
      comingSoon: "Próximamente",
      items: [
        {
          category: "Fiscal",
          title: "Qué revisar antes del cierre del ejercicio",
          excerpt: "Una lista corta de puntos que conviene tener en orden antes de cerrar el año fiscal.",
          date: "Ejemplo",
        },
        {
          category: "Financiera",
          title: "Presupuesto anual: por dónde empezar",
          excerpt: "Cómo armar un presupuesto que sí se use durante el año y no se quede en el archivo.",
          date: "Ejemplo",
        },
        {
          category: "Empresarial",
          title: "Gobierno corporativo en la empresa familiar",
          excerpt: "Reglas mínimas para separar la operación de la propiedad sin frenar el negocio.",
          date: "Ejemplo",
        },
      ],
    },
    resourcesPage: {
      eyebrow: "Descargas y recursos",
      title: "Material de apoyo para tu operación.",
      lead: "Guías y formatos para ordenar lo fiscal y financiero de tu empresa. En preparación.",
      sampleBadge: "Ejemplo",
      comingSoon: "Próximamente",
      items: [
        {
          type: "Guía PDF",
          title: "Checklist de cierre fiscal",
          description: "Los puntos a revisar antes de cerrar el ejercicio.",
        },
        {
          type: "Formato",
          title: "Plantilla de presupuesto anual",
          description: "Base para armar tu presupuesto y darle seguimiento mensual.",
        },
        {
          type: "Guía PDF",
          title: "Primeros pasos en gobierno corporativo",
          description: "Estructura mínima para una empresa familiar.",
        },
      ],
    },
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
    skipToContent: "Skip to content",
    home: {
      hero: {
        eyebrow: "Advisory · Tijuana, B.C.",
        title: "Strategy, compliance and growth.",
        titleAccent: "and growth.",
        lead: "A tax, financial and business advisory firm for owners who want to grow with financial control, tax certainty and strategic vision.",
        ctaPrimary: "Book a consultation",
        ctaSecondary: "View services",
        channels: [
          { label: "Tax", state: "Risk in control", tone: "signal" },
          { label: "Financial", state: "With visibility", tone: "up" },
          { label: "Business", state: "Clear structure", tone: "signal" },
        ],
      },
      differentiator: {
        eyebrow: "The approach",
        title: "Business consulting, beyond accounting.",
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
          { name: "Innovation", note: "We track regulatory and methodological changes so the work stays current, not routine." },
          { name: "Responsibility", note: "We answer for the work and for its deadlines." },
          { name: "Commitment to results", note: "We define a scope, deliver on the agreed timeline and confirm the output is actionable." },
        ],
      },
      cta: {
        title: "Let's talk about your company.",
        lead: "Book a consultation. We reply within one business day.",
        button: "Book a consultation",
      },
    },
    services: { items: servicesEn, cta: "View all services" },
    servicesPage: {
      eyebrow: "Services",
      title: "Three fronts, one standard.",
      lead: "Tax, finance and business under a single firm. Each front solves a different problem and answers to the same standard of work.",
      detailEyebrow: "Service",
      includes: "What it includes",
      others: "Other services",
      backToAll: "All services",
      cta: "Book a consultation",
      ctaLead: "Tell us where your company stands and we'll see where to start.",
    },
    about: {
      hero: {
        eyebrow: "About",
        title: "Business consulting, beyond accounting.",
        lead: "VBT Consultores is a tax, financial and business advisory firm in Tijuana. We work with owners who are already operating and want to grow with control.",
      },
      approach: {
        eyebrow: "How we work",
        title: "Three fronts, one standard.",
        paragraphs: [
          "Most companies handle tax, finance and administration separately, with a different provider for each. In practice they are the same problem seen from three angles.",
          "We start by understanding where the company stands today. Then we fix what exposes it and leave a structure that withstands an audit and supports growth.",
          "We do not promise shortcuts. What we offer is technical judgment, a formal manner and answers with backing.",
        ],
      },
      valuesEyebrow: "Principles",
      audienceEyebrow: "Who we work with",
    },
    faqPage: {
      eyebrow: "FAQ",
      title: "What clients usually ask.",
      lead: "If your question isn't here, write to us and we'll answer it.",
      items: [
        {
          q: "How are you different from an accounting practice?",
          a: "A practice keeps the books and meets obligations. We work on strategy: how to reduce tax risk, put finances in order and structure the company so it grows with control.",
        },
        {
          q: "How does working with you start?",
          a: "With an initial consultation. We review where your company stands and propose where to start, with a clear scope before committing to anything.",
        },
        {
          q: "Do you work with family businesses?",
          a: "Yes. It is one of the cases where we add the most, especially in corporate governance, where operation and ownership mix.",
        },
        {
          q: "Do you handle SAT requirements already in progress?",
          a: "Yes. We support requirements, reviews and clarifications, with technical backing and within the authority's deadlines.",
        },
        {
          q: "How do you handle company information?",
          a: "With full discretion. Confidentiality is a condition of the work, not an add-on.",
        },
        {
          q: "How much does an engagement cost?",
          a: "It depends on the scope. After a first conversation we send a proposal detailing what it includes.",
        },
      ],
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Let's talk about your company.",
      lead: "Book a consultation. We reply within one business day.",
      infoTitle: "Contact details",
      emailLabel: "Email",
      phoneLabel: "Phone",
      whatsappLabel: "WhatsApp",
      addressLabel: "Office",
      hoursLabel: "Hours",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        service: "Service of interest",
        servicePlaceholder: "Select a service",
        serviceOther: "Not sure yet",
        message: "How can we help?",
        submit: "Send",
        sending: "Sending…",
        success: "Thank you. We'll be in touch within one business day.",
        error: "Couldn't send. Try again or reach us on WhatsApp.",
      },
    },
    blogPage: {
      eyebrow: "Blog and news",
      title: "Tax and financial perspective, in plain terms.",
      lead: "Short notes on tax changes, finance and management for business owners. In preparation.",
      sampleBadge: "Sample",
      comingSoon: "Coming soon",
      items: [
        {
          category: "Tax",
          title: "What to review before year-end close",
          excerpt: "A short list of points worth having in order before closing the fiscal year.",
          date: "Sample",
        },
        {
          category: "Finance",
          title: "Annual budget: where to start",
          excerpt: "How to build a budget that gets used through the year and not filed away.",
          date: "Sample",
        },
        {
          category: "Business",
          title: "Corporate governance in the family business",
          excerpt: "Minimum rules to separate operation from ownership without slowing the business.",
          date: "Sample",
        },
      ],
    },
    resourcesPage: {
      eyebrow: "Downloads and resources",
      title: "Support material for your operation.",
      lead: "Guides and templates to put your company's tax and finances in order. In preparation.",
      sampleBadge: "Sample",
      comingSoon: "Coming soon",
      items: [
        {
          type: "PDF guide",
          title: "Tax close checklist",
          description: "The points to review before closing the fiscal year.",
        },
        {
          type: "Template",
          title: "Annual budget template",
          description: "A base to build your budget and track it monthly.",
        },
        {
          type: "PDF guide",
          title: "First steps in corporate governance",
          description: "Minimum structure for a family business.",
        },
      ],
    },
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
