# Spec · VBT Consultores

## Objetivo
Sitio web bilingüe (ES default, EN scaffold) para VBT Consultores, firma de consultoría
fiscal, financiera y empresarial en Tijuana. Genera leads y transmite confianza
institucional con una estética editorial oscura de alta calidad. Incluye un CRM (fase
final) para gestionar los leads capturados por el sitio y un chatbot concierge.

## Alcance
- 7 páginas marketing: Home, Servicios (index + 3 pilares), Nosotros, Blog/Noticias
  (placeholder), FAQ, Contacto, Descargas/Recursos (placeholder).
- i18n ES/EN route-based, copy ES completo, EN como esqueleto.
- Captura de leads: formulario de contacto + chatbot concierge → API → DB → email.
- CRM en /crm (fase final): roles, lista/kanban/dashboard, campos adaptados al negocio.
- Fuera de alcance inicial: contenido real de Blog/Recursos, logo limpio, provisión de
  infraestructura (las da Oscar).

## Dirección visual
Editorial oscuro dominante, achromático B&N, serif display sobredimensionado, motion
sobrio (editorialEase). Reference lock: Sequel (primaria), Liron Moran + Metalab/Adcker
(detalles). Vara de calidad: BG Consulting.

## Datos reales (única fuente)
- Tel: 664 488 9835 · WhatsApp: 664 409 8464 · Email: Rvila@vbtconsultores.com
- Dirección: Torela Corporativo, Blvd. Agua Caliente 9955, Piso 5, Tijuana
- Horario: Lunes a viernes, 9:00 a 18:00
- Tagline: "Estrategia, cumplimiento y crecimiento."
- Diferenciador: no es despacho contable; firma de consultoría para empresarios que
  buscan crecer con control financiero, seguridad fiscal y visión estratégica.
- Cliente ideal: desarrollos inmobiliarios, empresas familiares, inversionistas y
  emprendedores (35+).
- Servicios:
  - Fiscal: diagnóstico fiscal empresarial, planeación fiscal, atención SAT, auditoría
    preventiva.
  - Financiera: modelos financieros, valuación de empresas, presupuestos y control
    financiero.
  - Empresarial: gobierno corporativo, due diligence, reestructuración administrativa.
- Valores: integridad, confidencialidad, profesionalismo, innovación, responsabilidad,
  compromiso con resultados.
- Tono: semi-formal, corporativo, institucional.

## Criterios de aceptación
1. `npm run build` limpio; las 7 rutas resuelven en `/es` y `/en`.
2. Estética editorial oscura coherente en todas las páginas; motion desde v1; responsive.
3. Copy ES sin AI slop: cero frases huecas, cero em-dashes, solo datos reales del brief.
4. Sin testimonios, clientes, cifras ni premios inventados.
5. Formulario de contacto y chatbot capturan leads de punta a punta (probado local en M7/M8).
6. CRM (final) con campos adaptados al negocio de consultoría, no a factoring.

## Riesgos
- Next.js 16 tiene cambios respecto al conocimiento base: replicar patrones de BG, leer
  docs en node_modules cuando haga falta.
- Infra (Neon/Resend/Anthropic/Vercel) pendiente de Oscar: el build corre con placeholders.
- Campos del CRM requieren mini-spec con Oscar antes de codear M9.
