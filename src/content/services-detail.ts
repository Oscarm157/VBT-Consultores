import type { Locale } from "./dictionaries";

export type SubService = { name: string; description: string };
export type ServiceDetail = {
  slug: string;
  name: string;
  summary: string;
  intro: string;
  items: SubService[];
};

const es: ServiceDetail[] = [
  {
    slug: "fiscal",
    name: "Consultoría fiscal",
    summary:
      "Reducimos el riesgo fiscal de la empresa y ordenamos su relación con la autoridad.",
    intro:
      "Revisamos cómo está la empresa hoy, corregimos lo que la expone y dejamos una estructura que soporta una revisión. El objetivo es pagar lo justo conforme a la ley, con respaldo para sostenerlo.",
    items: [
      {
        name: "Diagnóstico fiscal empresarial",
        description:
          "Revisión del estado fiscal actual de la empresa: obligaciones, riesgos y oportunidades. Es el punto de partida para cualquier decisión.",
      },
      {
        name: "Planeación fiscal",
        description:
          "Estructura de la operación para pagar lo justo conforme a la ley, sin exponer a la empresa. Se define antes de ejecutar, no después.",
      },
      {
        name: "Atención SAT",
        description:
          "Acompañamiento en requerimientos, revisiones y aclaraciones ante el SAT, con sustento técnico y dentro de los plazos que marca la autoridad.",
      },
      {
        name: "Auditoría preventiva",
        description:
          "Revisión interna antes de que llegue la autoridad. Detecta y corrige inconsistencias mientras todavía hay margen para hacerlo.",
      },
    ],
  },
  {
    slug: "financiera",
    name: "Consultoría financiera",
    summary:
      "Damos visibilidad sobre los números de la empresa para decidir con datos.",
    intro:
      "Desde el modelo que proyecta el negocio hasta el control que sostiene la operación mes a mes. La idea es que cada decisión de inversión, financiamiento o crecimiento se tome sobre cifras, no por intuición.",
    items: [
      {
        name: "Modelos financieros",
        description:
          "Proyecciones de la empresa bajo distintos escenarios, para evaluar inversiones, financiamiento o crecimiento antes de comprometer recursos.",
      },
      {
        name: "Valuación de empresas",
        description:
          "Estimación del valor de la empresa con metodología reconocida. Útil para venta, entrada de socios, sucesión o financiamiento.",
      },
      {
        name: "Presupuestos y control financiero",
        description:
          "Presupuesto anual y seguimiento mensual contra lo real, para que las desviaciones se vean a tiempo y no hasta el cierre del año.",
      },
    ],
  },
  {
    slug: "empresarial",
    name: "Consultoría empresarial",
    summary:
      "Ordenamos la estructura de la empresa para que crezca sin perder control.",
    intro:
      "Reglas claras de decisión, información confiable para terceros y procesos que no dependen de una sola persona. Trabajo especialmente útil cuando la empresa creció más rápido que su organización.",
    items: [
      {
        name: "Gobierno corporativo",
        description:
          "Reglas de decisión, roles y órganos de gobierno. Especialmente útil en empresas familiares, donde se mezclan la operación y la propiedad.",
      },
      {
        name: "Due diligence",
        description:
          "Revisión a fondo de una empresa antes de comprar, invertir o asociarse. Pone sobre la mesa los riesgos fiscales, financieros y legales.",
      },
      {
        name: "Reestructuración administrativa",
        description:
          "Rediseño de la estructura y los procesos internos cuando la organización dejó de corresponder al tamaño de la empresa.",
      },
    ],
  },
];

const en: ServiceDetail[] = [
  {
    slug: "fiscal",
    name: "Tax advisory",
    summary:
      "We reduce the company's tax risk and put its relationship with the authority in order.",
    intro:
      "We review where the company stands today, fix what exposes it and leave a structure that can withstand an audit. The goal is to pay what is fair under the law, with backing to sustain it.",
    items: [
      {
        name: "Corporate tax diagnosis",
        description:
          "A review of the company's current tax position: obligations, risks and opportunities. The starting point for any decision.",
      },
      {
        name: "Tax planning",
        description:
          "Structuring the operation to pay what is fair under the law, without exposing the company. Defined before execution, not after.",
      },
      {
        name: "SAT representation",
        description:
          "Support through requirements, reviews and clarifications before the SAT, with technical backing and within the authority's deadlines.",
      },
      {
        name: "Preventive audit",
        description:
          "An internal review before the authority arrives. It detects and corrects inconsistencies while there is still room to act.",
      },
    ],
  },
  {
    slug: "financiera",
    name: "Financial advisory",
    summary:
      "We give visibility over the company's numbers so decisions rest on data.",
    intro:
      "From the model that projects the business to the control that sustains the operation month to month. Every investment, financing or growth decision rests on figures, not intuition.",
    items: [
      {
        name: "Financial modeling",
        description:
          "Projections of the company under different scenarios, to assess investment, financing or growth before committing resources.",
      },
      {
        name: "Business valuation",
        description:
          "An estimate of the company's value with recognized methodology. Useful for a sale, new partners, succession or financing.",
      },
      {
        name: "Budgeting and financial control",
        description:
          "An annual budget and monthly tracking against actuals, so deviations show up in time and not at year-end.",
      },
    ],
  },
  {
    slug: "empresarial",
    name: "Business advisory",
    summary:
      "We structure the company so it can grow without losing control.",
    intro:
      "Clear decision rules, reliable information for third parties and processes that do not depend on a single person. Especially useful when the company has grown faster than its organization.",
    items: [
      {
        name: "Corporate governance",
        description:
          "Decision rules, roles and governing bodies. Especially useful in family businesses, where operation and ownership mix.",
      },
      {
        name: "Due diligence",
        description:
          "A thorough review of a company before buying, investing or partnering. It surfaces tax, financial and legal risks.",
      },
      {
        name: "Administrative restructuring",
        description:
          "A redesign of internal structure and processes when the organization no longer matches the size of the company.",
      },
    ],
  },
];

const byLocale: Record<Locale, ServiceDetail[]> = { es, en };

export function getServices(lang: Locale): ServiceDetail[] {
  return byLocale[lang];
}

export function getService(lang: Locale, slug: string): ServiceDetail | undefined {
  return byLocale[lang].find((s) => s.slug === slug);
}
