# Estado del proyecto · VBT Consultores

Actualizado: 2026-06-08

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

## En hold (no tocar desde aquí)
- **M8** chatbot concierge (falta `ANTHROPIC_API_KEY`), **M9** CRM: el CRM, el blog real
  y la unificación de datos se están trabajando en la terminal de BG. No duplicar aquí.
- **M7** capa de datos: HECHO. Leads del formulario persisten en Neon (tabla `leads`).

## Conocido / menor
- `src/app/layout.tsx` usa `<html lang="es">` fijo; `LangSetter` corrige el idioma en
  cliente. El fix real (reestructurar el layout raíz) queda en hold por ser de bajo
  impacto y riesgo de regresión.

Plan completo y bitácora de hitos: ver el plan de la sesión (M0–M10).
