# Estado del proyecto · VBT Consultores

Actualizado: 2026-06-09

## EN PRODUCCIÓN
- Sitio: **https://vbt-consultores.vercel.app**
- CRM: **https://vbt-consultores.vercel.app/admin/login**
  - Admin inicial: `admin@vbtconsultores.com` (contraseña temporal en `.env.local`
    como `CRM_ADMIN_PASSWORD`; cambiarla en Perfil al entrar).
- Vercel: proyecto `vbt-consultores` en scope `oscars-projects157` (token
  `/root/.vercel-new-token`). Env vars en producción: DATABASE_URL, CRM_SECRET,
  CRM_ADMIN_EMAIL, CRM_ADMIN_PASSWORD. Deploy: `vercel --prod --token <token>`.
- DB: Neon (DATABASE_URL en `.env.local`). Tablas CRM creadas vía `npm run db:push`.

## Hecho (sitio marketing completo + hardening)
Sitio editorial oscuro bilingüe (ES default, EN), Next.js 16 + Tailwind v4 + Motion.
- **7 páginas** en `/es` y `/en`: Home, Servicios (índice + 3 detalles: fiscal,
  financiera, empresarial), Nosotros, FAQ (acordeón), Contacto (formulario funcional),
  Blog y Recursos (placeholders marcados como ejemplo).
- **Navbar pro** con mega-menú de servicios (3 columnas con sub-servicios), toggle ES/EN,
  WhatsApp flotante, footer con datos reales.
- **Formulario de contacto** → `POST /api/leads` → **persiste en Neon** (tabla `leads`,
  Drizzle). Probado de punta a punta. El email de notificación a Rvila@vbtconsultores.com
  se activa automáticamente al configurar `RESEND_API_KEY` (hoy dormido, no rompe nada).
- **Hardening**: metadata SEO por página, `sitemap.xml`, `robots.txt`, favicon
  (`src/app/icon.svg`, placeholder serif), un `h1` por página, foco visible, skip-link,
  `aria-live` en el form, página **404** de marca. Lint y `npm run build` limpios.
- Copy real del brief, sin slop ni em-dashes, sin datos inventados.

## Cómo correrlo
```
cd /root/VBT-Consultores
npm install      # si hace falta
npm run dev      # http://localhost:3000  (redirige a /es)
```

## Pendiente de Oscar (desbloquea lo demás)
- **Logo limpio** (hoy se usa wordmark serif "VBT Consultores" como placeholder).
- **Llaves de infra**: `DATABASE_URL` (Neon) ya configurada en `.env.local`. Faltan
  `RESEND_API_KEY` (para notificar leads por email) y `ANTHROPIC_API_KEY` (chatbot).
- **Cuenta Vercel + dominio** vbtconsultores.com para deploy.
- **Definición de campos del CRM** (negocio distinto a Prime Advisor).
- **Contenido real** de Blog y Recursos.

## Estado de milestones
- **M7** datos: HECHO. Leads del formulario persisten en Neon.
- **M8** chatbot concierge: HECHO y en producción. Claude (sonnet-4-6), persona VBT,
  califica por frente/sector/urgencia, guarda el lead en el CRM con transcript
  (`source: bot`). `ANTHROPIC_API_KEY` configurada en Vercel.
- **M9** CRM: HECHO y en producción. Base estandarizada portada de BG (← Prime Advisor),
  genérica y rebrandeada a VBT, en `/admin`. SIN blog admin (esa unificación va en la
  terminal de BG). Si esa unificación será la fuente única del CRM, alinear para no
  mantener dos versiones.

## Opcionales pendientes (no del brief)
- Email de leads: `RESEND_API_KEY` (+ verificar dominio para el remitente).
- Archivos en leads (Vercel Blob): código presente, dormido hasta `BLOB_READ_WRITE_TOKEN`.
- Logo limpio (hoy wordmark serif de placeholder).
- Dominio `vbtconsultores.com` (hoy en `vbt-consultores.vercel.app`).

## Conocido / menor
- `src/app/layout.tsx` usa `<html lang="es">` fijo; `LangSetter` corrige el idioma en
  cliente. El fix real (reestructurar el layout raíz) queda en hold por ser de bajo
  impacto y riesgo de regresión.

Plan completo y bitácora de hitos: ver el plan de la sesión (M0–M10).
