// Configuración específica del sitio. Al clonar la plantilla a otro cliente,
// este archivo (más los tokens de marca) es lo único que cambia. Datos reales.

export const siteConfig = {
  name: "VBT Consultores",
  shortName: "VBT",
  legalName: "VBT Consultores",
  domain: "vbtconsultores.com",
  tagline: {
    es: "Consultoría fiscal, financiera y empresarial en Tijuana.",
    en: "Tax, financial and business advisory in Tijuana.",
  },
  email: "Rvila@vbtconsultores.com",
  timezone: "America/Tijuana",
  offices: [
    {
      city: "Tijuana",
      address: "Torela Corporativo, Blvd. Agua Caliente 9955, Piso 5, Tijuana, B.C.",
      phone: "664 889 5835",
    },
  ],
  hours: {
    es: "Lunes a viernes, 9:00 a 18:00",
    en: "Monday to Friday, 9:00 to 18:00",
  },
} as const;

// Destinatario de las notificaciones de leads (form y chatbot).
// Override con LEAD_RECIPIENT en env si se quiere enrutar a otra bandeja.
export const leadRecipient = process.env.LEAD_RECIPIENT || siteConfig.email;

// Remitente verificado en Resend. Mientras no se verifique el dominio,
// usar el sandbox onboarding@resend.dev (solo entrega al dueño de la cuenta).
export const mailFrom = process.env.MAIL_FROM || "onboarding@resend.dev";
