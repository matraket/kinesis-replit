# PRD T11 – Homepage (MVP) basada en Stack-UI

## 0. Metadatos

* **ID:** T11
* **Fase:** 4 – Frontend (Web) — Web corporativa
* **Módulo principal:** `web/` (Home `/`)
* **Módulos secundarios:** `shared/components/sections/`, `shared/ui`
* **Dependencias de tareas:**

  * T0–T1: entorno base + dominio/BD.
  * T2: API pública de lectura (`/api/public/**`) para `business_models` y `page_content`.
  * T3–T5: CRUD admin y leads (para entender CTAs)
  * T6–T8: CMS, `shared/ui`, vistas de contenido (para coherencia visual y datos).
  * T10: Configuración Web, Stack-UI y Layout base (`LayoutPublic`, rutas públicas, secciones base Hero/Features/Pricing/FAQ/Footer).

---

## 1. Objetivo

Construir la **Homepage real (MVP)** de Kinesis en `/`, basada en el **Stack-UI Kinesis**:

* **Librería de UI base:** `shadcn/ui` (Button, Card, Badge, Accordion, Sheet, NavigationMenu, etc.).
* **Bloques de sección:** patrones de **Launch UI Components** (Hero, Features grid, CTAs, etc.).
* **Estética y composición:** inspiradas en plantilla **Serene Yoga** (layout calmado, mucho aire, tipografía clara).
* **Responsive:** patrones de `KB-patrones-responsive-kinesis-web.md` (mobile-first, grid, container, behavior del header).

La Home debe:

* Explicar la **propuesta de valor global** de Kinesis.
* Presentar los **4 modelos de negocio** como piezas clave de la oferta (Élite On Demand, Ritmo Constante, Generación Dance, Sí, Quiero Bailar).
* Ofrecer CTAs claras hacia los futuros flujos de leads (Reserva Élite, Preinscripción), sin implementar aún formularios (T14).

---

## 2. Alcance

### 2.1 In Scope (T11)

1. **Página Home `/` real (no placeholder)**

   * Implementar `HomeRoute` (o `HomePage`) dentro de `web/`:

     * Usa `LayoutPublic` definido en T10.
     * Composición vertical de secciones:

       1. `<HeroPrimary>` (Stack-UI hero principal).
       2. `<BusinessModelsSection>` (los 4 modelos de negocio).
       3. (Opcional MVP avanzado) 1–2 secciones adicionales reutilizando bloques de T10 (`FeatureGridSection`, `FaqSection`, `PricingSection`) como **teaser** de contenido, pero con datos estáticos simples.
   * La Home debe estar **completa visualmente** aunque algunas secciones usen texto estático.

2. **Sección `<HeroPrimary>` refinada (Stack-UI)**

   * Evolucionar el `HeroPrimary` creado en T10  para que deje de ser placeholder:

     * Props mínimas:

       * `eyebrow?: string` (pequeño texto encima, opcional).
       * `title: string` (H1).
       * `subtitle?: string`.
       * `primaryCta?: { label: string; href: string; variant?: "default" | "outline"; }`.
       * `secondaryCta?: { label: string; href: string; variant?: "ghost" | "outline"; }`.
       * `image?: { src: string; alt: string }` (foto o ilustración en estilo Serene Yoga).
     * Layout:

       * **Mobile (<md):** 1 columna, texto + CTAs arriba, imagen debajo.
       * **Desktop (≥md):** 2 columnas (texto izquierda, imagen derecha) con diseño inspirado en Launch UI/Serene Yoga (mucha separación, background sutil).
     * Implementar CTAs:

       * `primaryCta` → “Reserva Élite”.
       * `secondaryCta` → “Preinscríbete”.
       * Por ahora **solo navegan** a rutas o anchors (`/horarios-tarifas#elite`, `/programas#preinscripcion`) sin formularios (T14).

3. **Nueva sección `<BusinessModelsSection>`**

   * Crear `shared/components/sections/BusinessModelsSection.tsx`:

     * Presenta los 4 modelos de negocio como **cards/features**:

       * Icono (simple, placeholder o `lucide-react` *solo si ya existe en el proyecto*).
       * Título (name).
       * Subtítulo (subtitle).
       * Resumen corto (short description / tagline).
       * CTA “Ver más” o “Explorar programas”.
     * Diseño:

       * Encabezado de sección (H2) + breve intro.
       * **Mobile:** lista vertical de cards.
       * **Desktop:** grid responsivo (2 x 2) o variante tabs:

         * Opción A (obligatoria para T11): **grid de cards** usando `Card` de shadcn/ui.
         * Opción B (opcional nice-to-have): modo “tabs” (`Tabs` de shadcn/ui) donde cada modelo es una pestaña con contenido detallado a la derecha.
     * Semántica alineada con `business_models` de T2 y el doc `kinesis-modelos-negocio` (cuando exista): uso de `name`, `subtitle`, `description`, etc.
     * Ancla `id="modelos-de-negocio"` para scroll desde el menú y CTAs.

4. **CTAs principales coherentes con la estrategia de leads (T5/T14)**

   * CTAs configuradas en Hero y BusinessModelsSection:

     * “Reserva Élite”:

       * En T11 → navegar a `/horarios-tarifas#elite` o `/programas?businessModelSlug=elite-on-demand`.
       * No mostrar aún formulario/modal funcional.
     * “Preinscríbete”:

       * En T11 → navegar a `/programas#preinscripcion` o `/programas?businessModelSlug=generacion-dance`.
   * Criterio:

     * CTAs ya usan textos finales (no “Lorem Ipsum”), pero su **comportamiento funcional completo** (formularios + POST `/api/public/leads/**`) queda para T14.

5. **Mobile-first y responsive (aplicado de verdad)**

   * Implementar Home cumpliendo explícitamente patrones de `KB-patrones-responsive-kinesis-web.md`:

     * `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` en secciones.
     * Espaciado vertical consistente (`py-12 sm:py-16 lg:py-20`).
     * Tipografía jerárquica (`text-4xl sm:text-5xl` para H1, etc.).
     * Botones CTA:

       * Mobile: apilados (`flex-col gap-3`).
       * Desktop: en línea (`flex-row gap-4`).
   * No debe haber **scroll horizontal** en mobile.

6. **Preparación para contenido dinámico (API T2)**

   * Para `<BusinessModelsSection>`:

     * Definir tipo `BusinessModelSummary` alineado con T2 (`slug`, `name`, `subtitle`, `description`, `metaTitle`, etc.).
     * La sección debe soportar:

       * **Modo estático** (props con array de objetos in-memory).
       * **Modo dinámico** (props `models` provenientes de un hook/cliente HTTP).
   * T11 **no está obligado** a implementar React Query + cliente HTTP, pero:

     * Si ya existe un cliente público (`usePublicBusinessModels` o similar), puede usarse para alimentar la sección.
     * Si no existe, usar datos estáticos tipados, dejando comentarios claros para conectar T12–T13.

7. (Opcional) Secciones teaser reutilizando Stack-UI

   * Sin ampliar demasiado scope, se permite añadir 1–2 secciones extra, **si y solo si** se reutilizan bloques ya existentes de T10:

     * Ejemplo: `<FeatureGridSection>` como “Por qué Kinesis”.
     * Ejemplo: `<FaqSection>` con 3 preguntas estáticas clave.
   * Estas secciones **no deben** traer lógica nueva (ni API, ni formularios, ni slider complejo).

---

### 2.2 Out of Scope (T11)

Para evitar repetir errores de T7 (scope creep e improvisación):

* ❌ Cualquier **formulario funcional**:

  * Nada de React Hook Form, Zod ni POST a `/api/public/leads/**` en T11 (eso es T14).
* ❌ Creación de nuevas páginas (Quiénes somos, Modelos de negocio, Programas, etc.) → T12–T13.
* ❌ Cambios en `LayoutPublic`, header o footer base definidos en T10 (solo se pueden tocar estilos menores si es estrictamente necesario).
* ❌ Cambios en la API (`api/**`) o modelo de datos / migraciones SQL.
* ❌ Nuevos WYSIWYG, Media Library, uploads, sliders personalizados, carousels complejos.
* ❌ Instalación de librerías nuevas de UI o animación (MUI, Chakra, framer-motion, Swiper, etc.).
* ❌ Modificar:

  * `.replit`
  * `replit.nix`
  * `replit.md`
  * `context/**`
* ❌ Eliminar `React.StrictMode` de `web/src/main.tsx` o de cualquier otro entrypoint.

---

## 3. Suposiciones y dependencias

1. **Stack y arquitectura ya fijados en replit.md**

   * Monolito modular con `/api`, `/web`, `/cms`, `/shared`, etc.
   * Frontends en React + Vite + Tailwind + shadcn/ui.

2. **T10 completado**

   * `web/` existe con:

     * `LayoutPublic` funcional (Header + Nav + Footer).
     * Router público con `/` apuntando a `HomeRoute` placeholder.
     * Secciones base en `shared/components/sections` (`HeroPrimary`, `FeatureGridSection`, `PricingSection`, `FaqSection`, `FooterSection`).

3. **T2 completado**

   * Endpoints GET `business_models`, `page_content` disponibles en `/api/public/**` (aunque la Home aún no esté consumiéndolos directamente).

4. **CMS y contenido**

   * El equipo podrá rellenar los 4 modelos de negocio vía T4 y T8; la Home debe asumir que estos datos existen o existirán.

---

## 4. Reglas y restricciones

### 4.1 Restricciones globales (Replit / arquitectura)

* NO tocar:

  * `.replit`, `replit.nix`, `replit.md`.
  * `context/**` (solo lectura).
  * Estructura de carpetas de primer nivel.
* NO romper endpoints existentes:

  * `GET /`
  * `GET /health`
  * `/api/public/**`
  * `/api/admin/**` ya creados.
* NO crear nuevas migraciones ni cambiar esquema SQL.

### 4.2 UI/UX – Stack-UI Kinesis

* **shadcn/ui como base**:

  * Todo botón en Home → `Button` de `shared/ui`.
  * Cards → `Card` de `shared/ui`.
  * Acordeones/FAQ (si se usan) → `Accordion` (Radix vía shadcn).
* **Launch UI / Serene Yoga**:

  * Hero con imagen lateral o background controlado, sin sobrecargar de efectos.
  * Secciones con mucho espacio blanco, tipografía legible, contraste suficiente.
  * Mantener sensación premium y calmada.
* **Responsive**:

  * Mobile first, uso de breakpoints `sm`, `md`, `lg`.
  * Layout vertical en mobile, composiciones 2 columnas solo a partir de `md`.
* **Accesibilidad**:

  * Jerarquía de headings correcta: un solo H1 en Hero, H2 para secciones.
  * `aria-label` en CTAs donde el texto no sea totalmente autoexplicativo.
  * `alt` significativo en la imagen del Hero.

### 4.3 Técnicas

* Reutilizar versiones de dependencias ya presentes (React, react-router-dom, tailwindcss, shadcn/ui, etc.).
* No instalar nuevas dependencias salvo que sean parte del stack ya aprobado.
* Mantener `pnpm install` y `pnpm dev` funcionando sin errores.

---

## 5. Detalle funcional

### 5.1 HomeRoute / HomePage

**Archivo sugerido:**
`web/src/app/routes/HomeRoute.tsx` (si ya existe; en caso contrario, crearlo y referenciarlo desde el router).

**Responsabilidades:**

* Componer la Home en este orden:

  1. `<HeroPrimary {...heroProps} />`
  2. `<BusinessModelsSection {...businessModelsProps} />`
  3. (Opcional) `<FeatureGridSection />` con 3–4 “ventajas de Kinesis”.
  4. (Opcional) `<FaqSection />` con 3 FAQs clave.

* Proveer las props en T11 de forma **estática** (hardcoded pero tipadas) dejando preparado un futuro `useHomePageContent` que pueda inyectar esos datos desde `page_content` o `business_models` vía API.

**Pseudoestructura:**

```tsx
export function HomeRoute() {
  const heroProps = { /* texto estático por ahora */ };
  const businessModels = STATIC_MODELS; // o datos reales si existe hook

  return (
    <>
      <HeroPrimary {...heroProps} />
      <BusinessModelsSection models={businessModels} />
      {/* Opcionales */}
      {/* <FeatureGridSection ... /> */}
      {/* <FaqSection ... /> */}
    </>
  );
}
```

---

### 5.2 Sección `<HeroPrimary>`

**Archivo:** `shared/components/sections/HeroPrimary.tsx` (ya creado en T10, ahora se refina).

**Requisitos UI:**

* Layout:

  * Wrapper: `section` con `id="home-hero"` y clases tipo `py-16 sm:py-20 lg:py-24`.
  * Contenedor: `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
  * Grid:

    * Mobile: `flex flex-col gap-10`.
    * Desktop: `grid md:grid-cols-2 gap-12 items-center`.
* Columna texto:

  * Eyebrow opcional (`text-sm font-medium text-brand`).
  * H1 (`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight`).
  * Subtítulo (`mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl`).
  * CTAs:

    * Wrapper `div` con `mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4`.
    * Botón primario → clase `Button` variante `default`.
    * Botón secundario → `variant="outline"` o `ghost`.
* Columna imagen:

  * `div` con `relative aspect-[4/3] md:aspect-[4/3] w-full`.
  * Imagen con `rounded-3xl`, `object-cover`, `shadow-xl`, border sutil.
  * Puede usarse `<img>` simple o un componente utilitario de imagen (no hace falta next/image).

**Comportamiento:**

* El `href` de CTAs debe ser un `Link` de `react-router-dom` (`<Link to={...}>`) envuelto en `Button` para mantener SPA.
* No abrir modales aún.

---

### 5.3 Sección `<BusinessModelsSection>`

**Archivo:** `shared/components/sections/BusinessModelsSection.tsx` (nuevo).

**Props sugeridas:**

```ts
type BusinessModelSummary = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  targetAudience?: string;
  format?: string;
};

interface BusinessModelsSectionProps {
  models: BusinessModelSummary[];
  layoutVariant?: "grid" | "tabs"; // "grid" por defecto
}
```

**Layout base (grid, obligatorio):**

* Wrapper:

  * `section` con `id="modelos-de-negocio"` y `py-16 sm:py-20 lg:py-24`.
* Contenido:

  * Título H2 (`text-3xl sm:text-4xl font-bold`) tipo “4 formas de vivir Kinesis”.
  * Breve párrafo introductorio.
* Grid:

  * `div` con `mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4`.
  * Cada modelo:

    * `Card` (`shared/ui/card`) con:

      * Icono (opcional) en círculo sutil (`rounded-full border p-2`).
      * Título (`name`) como `h3`.
      * Subtítulo/targetAudience en texto menor.
      * `shortDescription` en 2–3 líneas.
      * CTA “Descubrir más” como `Button` `variant="ghost" size="sm"` con flecha (puede ser `→` si no hay iconos).
    * CTA `to`:

      * `/modelos-de-negocio#${slug}` o
      * `/programas?businessModelSlug=${slug}`.

**Variante tabs (opcional):**

* Si `layoutVariant === "tabs"`:

  * Usar `Tabs` de shadcn/ui:

    * Lista de tabs con el `name` de cada modelo.
    * Panel derecho con título, subtítulo, párrafo más largo y CTA.
* Esta variante es nice-to-have, no obligatoria para completar T11.

---

### 5.4 CTAs y navegación

* CTAs definidas en Hero y BusinessModelsSection deben:

  * Navegar dentro de la SPA, sin recargar página.
  * Ser configurables vía props (no hardcodear rutas en varios sitios).
* Rutas objetivo (sujetas a revisión cuando se implementen T13 y T14, pero **no cambiar en T11**):

  * “Reserva Élite” → `/horarios-tarifas#elite`.
  * “Preinscríbete” → `/programas#preinscripcion`.

---

### 5.5 Preparación para contenido dinámico

* `<BusinessModelsSection>` no debe conocer los detalles de la API; solo recibe `models`.
* Para consumo futuro de T2:

  * Se deja preparado un hook o función a implementar después, por ejemplo:

```ts
// T11: solo definir tipo y stub, no implementarlo entero
export async function fetchPublicBusinessModels(): Promise<BusinessModelSummary[]> {
  // TODO T12/T13: fetch real de /api/public/business-models
  return STATIC_MODELS;
}
```

* HomeRoute en T11 usa datos estáticos, pero la firma ya será compatible con un futuro `React Query` + `useQuery`.

---

## 6. Criterios de aceptación

### 6.1 Obligatorios

1. `pnpm install` en la raíz termina **sin errores**.
2. `pnpm dev` levanta API + CMS + Web sin romper endpoints existentes.
3. Navegar a `/`:

   * Renderiza `LayoutPublic` con header y footer intactos (tal como quedaron en T10).
   * Muestra Hero con H1, subtítulo, CTAs visibles y accesibles.
   * Muestra sección de Modelos de negocio (4 items o tantos como `models` proporcione la prop).
4. Vista Mobile:

   * Hero en 1 columna (texto + CTAs, imagen debajo).
   * CTAs apiladas verticalmente con espacio suficiente.
   * Modelos de negocio en listado vertical o grid de 1–2 columnas sin scroll horizontal.
5. Vista Desktop:

   * Hero en 2 columnas (texto – imagen).
   * Modelos de negocio en grid de 2x2 o más, centrado y con buena legibilidad.
6. CTAs:

   * Hacen `Link` a rutas internas (`/horarios-tarifas#elite`, `/programas#preinscripcion`), sin errores de navegación.
7. Código:

   * `BusinessModelsSection` vive en `shared/components/sections/BusinessModelsSection.tsx`.
   * Usa componentes `shared/ui` (Button, Card, etc.) y Tailwind, sin HTML duplicado innecesario.
8. No se han instalado nuevas deps fuera del stack permitido.
9. No se han tocado `.replit`, `replit.nix`, `replit.md`, `context/**`.

### 6.2 Opcionales (nice-to-have)

1. Variante `layoutVariant="tabs"` funcionando para `<BusinessModelsSection>`.
2. Hero con pequeño efecto visual moderno (por ejemplo, fondo `bg-gradient-to-b` y sombra leve en la imagen) sin añadir nuevas librerías.
3. Inclusión de una sección extra `<FeatureGridSection>` o `<FaqSection>` con contenido estático pero alineado con Kinesis.

---

## 7. Bloque PRD-Agent (versión sintetizada para el Agent)

> Este bloque es lo que se le pasa al Agent de Replit en modo **Build** para T11.

### 7.1 NO HACER (restricciones duras)

* NO tocar:

  * `.replit`, `replit.nix`, `replit.md`.
  * `context/**`.
  * Carpetas de primer nivel (`api/`, `web/`, `cms/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`).
* NO modificar endpoints ni código de `api/**`.
* NO crear ni modificar migraciones SQL.
* NO instalar nuevas librerías (WYSIWYG, Media Library, MUI, framer-motion, etc.).
* NO eliminar `React.StrictMode` de ningún `main.tsx`.
* NO cambiar `LayoutPublic`, header o footer más allá de ajustes menores de clases si fuesen absolutamente necesarios.

### 7.2 DÓNDE PUEDES TRABAJAR

**Crear / modificar SOLO archivos bajo:**

* `web/`:

  * `src/app/routes/HomeRoute.tsx` (o archivo de ruta Home equivalente).
* `shared/components/sections/`:

  * `HeroPrimary.tsx` (refinar, no romper API básica).
  * `BusinessModelsSection.tsx` (nuevo).
  * (Opcional) usar `FeatureGridSection.tsx`, `FaqSection.tsx` ya existentes, sin alterar su API pública de T10.
* NO crees nuevos directorios fuera de estos sin una razón muy clara.

### 7.3 Objetivo concreto para el Agent

* Implementar la Home (`/`) como composición de secciones:

  * `<HeroPrimary>` con texto real, CTAs “Reserva Élite” y “Preinscríbete”.
  * `<BusinessModelsSection>` con al menos 4 modelos de negocio en formato card.
* Garantizar mobile-first:

  * Hero 1 columna en mobile y 2 en desktop.
  * CTAs apiladas en mobile, en línea en desktop.
* Usar `shared/ui` (Button, Card, etc.) + Tailwind para el layout.
* Usar datos estáticos para los modelos de negocio en T11, definiendo tipos para que sea fácil conectar `GET /api/public/business-models` más adelante.

### 7.4 Checklist rápido para dar por completada T11

* [ ] `pnpm install` OK; `pnpm dev` OK.
* [ ] Navegar a `/` muestra Hero + BusinessModelsSection sin errores JS.
* [ ] Hero:

  * [ ] H1, subtítulo, CTAs visibles.
  * [ ] Mobile 1 columna, desktop 2 columnas.
* [ ] BusinessModelsSection:

  * [ ] Muestra 4 cards (o todas las entradas del array) con título, subtítulo/descripcion y CTA.
  * [ ] Tiene `id="modelos-de-negocio"`.
* [ ] CTAs enlazan correctamente a `/horarios-tarifas#elite` y `/programas#preinscripcion`.
* [ ] No se ha tocado `.replit`, `replit.nix`, `replit.md`, `context/**`, ni `api/**`.
* [ ] No se han añadido dependencias nuevas fuera del stack ya aprobado.

