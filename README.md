# VBT Consultores

Sitio web bilingüe (ES/EN) de VBT Consultores, firma de consultoría fiscal, financiera y
empresarial en Tijuana. Estética editorial oscura, enfocado en generar leads.

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (tokens en `src/app/globals.css`, sin archivo de config)
- Motion 12 para animaciones
- i18n route-based `/[lang]` (`/es` default, `/en`)

## Desarrollo
```bash
npm install
npm run dev      # http://localhost:3000  → redirige a /es
npm run build    # build de producción
npm run lint
```

## Estructura
```
src/
  app/
    layout.tsx              raíz (fonts, metadata base)
    page.tsx                redirige a /es
    not-found.tsx           404 de marca
    sitemap.ts · robots.ts · icon.svg
    [lang]/
      layout.tsx            Nav + Footer + FloatingCTA + skip-link
      page.tsx              Home
      servicios/            índice + [slug] (fiscal · financiera · empresarial)
      nosotros · faq · contacto · blog · recursos
    api/leads/route.ts      captura de leads → Neon (Drizzle); email opcional vía Resend
  components/site/          Nav, Footer, Wordmark, Reveal, SectionHeading, SignalLine,
                           PillButton, Accordion, ContactForm, FloatingCTA, LangSetter
  content/
    dictionaries.ts         todo el copy ES/EN (única fuente)
    services-detail.ts      contenido por pilar de servicio
  lib/motion.ts             editorialEase
```

## Contenido
Todo el copy vive en `src/content/dictionaries.ts` y `src/content/services-detail.ts`.
Los datos de contacto (tel, WhatsApp, email, dirección, horario) están en el bloque
`contact` del diccionario. Blog y Recursos son placeholders marcados como ejemplo.

## Base de datos
Leads en Neon (Postgres) vía Drizzle. Schema en `src/lib/schema.ts`, cliente en
`src/lib/db.ts`, migraciones en `drizzle/`. Para regenerar/aplicar:
```bash
npx drizzle-kit generate   # genera SQL desde el schema
npx drizzle-kit migrate    # aplica a la DB de DATABASE_URL (.env.local)
```

## Pendiente / no incluido aún
Ver `docs/ESTADO.md`. En resumen: el email de notificación de leads se activa al poner
`RESEND_API_KEY`; no hay chatbot ni CRM todavía; falta el logo final y la cuenta de
Vercel para desplegar.

## Variables de entorno
Copiar `.env.example` a `.env.local` y completar cuando se provisione la infraestructura.
