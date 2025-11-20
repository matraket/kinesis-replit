Perfecto, aquí tienes el bloque listo para pegar en Replit (modo **Build**):

---

### PRD-Agent T11.2 – Wow Pass Home Kinesis

#### 1. Objetivo

Mejorar visualmente la **Home (`/`)** de Kinesis.
Partiendo de la versión actual (wireframes + fotos), debes convertirla en una **landing premium** usando el Stack-UI existente:

* Hero oscuro tipo landing (texto + CTAs + imagen lateral).
* Sección “4 formas de vivir Kinesis” en **grid de cards**.
* Bloque de beneficios “Por qué Kinesis”.
* FAQs en acordeón.
* Footer limpio alineado con el header.

Sin crear formularios ni lógica nueva de datos.

---

#### 2. Dónde SÍ puedes trabajar

Solo toca estos archivos:

* `web/src/index.css`
* `web/tailwind.config.js` (ajustes ligeros de theme/shadows/radius)
* `web/src/app/layout/Header.tsx`
* `web/src/app/routes/HomeRoute.tsx`
* `shared/components/sections/HeroPrimary.tsx`
* `shared/components/sections/BusinessModelsSection.tsx`
* `shared/components/sections/FeatureGridSection.tsx`
* `shared/components/sections/FaqSection.tsx`
* `shared/components/sections/FooterSection.tsx`

No crees archivos nuevos salvo constantes internas en estas secciones.

---

#### 3. RESTRICCIONES DURAS (NO HACER)

* No tocar: `api/**`, `cms/**`, `.replit`, `replit.nix`, `replit.md`, `context/**`.
* No cambiar rutas ni añadir páginas nuevas.
* No eliminar `React.StrictMode`.
* No añadir nuevas dependencias (nada de MUI, Chakra, framer-motion, sliders, etc.).
* No modificar forms ni lógica de leads / API.
* No mover ni renombrar carpetas.

Usa siempre los componentes de `shared/ui` (Button, Card, Accordion, etc.) y Tailwind.

---

#### 4. Qué debe quedar en la Home

**Hero (`HeroPrimary` + `HomeRoute`):**

* Fondo degradado oscuro (`bg-gradient-to-b`), texto blanco.
* Layout:

  * Mobile: 1 columna (texto + CTAs arriba, imagen debajo).
  * Desktop: 2 columnas (`grid md:grid-cols-2`).
* Texto:

  * Eyebrow: “Bienvenido a Kinesis”.
  * H1: “Transforma tu vida a través del movimiento consciente”.
  * Subtítulo: copy actual de bienestar (mejor legible).
* CTAs usando `Button` de `shared/ui`:

  * Primary: “Reserva Élite” → navega a `/modelos-de-negocio#elite-on-demand`.
  * Secondary: “Preinscríbete” → navega a `/programas#preinscripcion`.
  * En móvil apilados, en desktop en línea.
* Imagen hero: `hero-home.jpg` dentro de un contenedor con `rounded-3xl`, `border`, `shadow-2xl` y overlay suave.

**BusinessModelsSection:**

* Título: “4 formas de vivir Kinesis” + subtítulo corto.
* Grid: `grid gap-8 sm:grid-cols-2 xl:grid-cols-4`.
* Cada card (usa `Card` de `shared/ui` o wrapper similar):

  * Imagen arriba (`aspect-[4/3]`, `rounded-3xl`, `object-cover`, pequeño zoom en hover).
  * Nombre del modelo, tagline, “Para: …”.
  * CTA `Button variant="ghost" size="sm"` con texto “Descubrir más →” que navega a `/modelos-de-negocio/{slug}` o similar.
* Imágenes:

  * Élite On Demand → `modelo-elite-on-demand.jpg`
  * Ritmo Constante → `modelo-ritmo-constante.jpg`
  * Generación Dance → `modelo-generacion-dance.jpg`
  * Sí Quiero Bailar → `modelo-si-quiero-bailar.jpg`

**FeatureGridSection (“Por qué Kinesis”):**

* Fondo claro (`bg-slate-50`), título + subtítulo centrados.
* 3–4 cards en `grid md:grid-cols-3`:

  * Icono de `lucide-react` en círculo (`bg-brand-primary/10`).
  * Título corto + texto explicativo (instructores, horarios, comunidad, etc.).

**FaqSection:**

* Título “Preguntas frecuentes” con subtítulo.
* Usar `Accordion` de `shared/ui`:

  * `Accordion` `type="single"` `collapsible`.
  * Cada pregunta/respuesta en `AccordionItem` con borde y esquinas redondeadas.
  * Solo se ve una respuesta abierta a la vez.

**FooterSection:**

* Fondo `bg-slate-50`, borde superior suave.
* Contiene:

  * Columna con logo + tagline.
  * Columna(s) de enlaces (Inicio, Programas, Modelos de negocio, Equipo…).
  * Fila inferior con © año + enlaces a `/legal/aviso` y `/legal/privacidad`.

---

#### 5. Checklist para terminar

Marca como cumplido solo si es verdadero:

* [ ] `pnpm dev` funciona sin errores; no se han añadido dependencias nuevas.
* [ ] En la Home, el hero tiene fondo oscuro, imagen lateral, CTAs con botones y layout 1 col mobile / 2 cols desktop.
* [ ] La sección “4 formas de vivir Kinesis” muestra 4 **cards** con imagen, textos y CTA, no bloques a ancho completo.
* [ ] Existe una sección de beneficios “Por qué Kinesis” con cards e iconos.
* [ ] Las FAQs se muestran como acordeón (abrir/cerrar) usando `Accordion` de `shared/ui`.
* [ ] No hay scroll horizontal en móvil.
* [ ] No se ha tocado ningún archivo fuera de la lista de “Dónde SÍ puedes trabajar”.
