## PRD T11.2 – Wow Pass Home Kinesis

### 1. Metadatos

* **ID:** T11.2
* **Fase:** 4 – Web corporativa
* **Depende de:** T10, T11, T11.1 (ya implementados)
* **Módulos afectados (únicos):**

  * `web/src/index.css`
  * `web/tailwind.config.js` (TOQUE LIGERO si hace falta)
  * `web/src/app/layout/Header.tsx`
  * `web/src/app/routes/HomeRoute.tsx`
  * `shared/components/sections/HeroPrimary.tsx`
  * `shared/components/sections/BusinessModelsSection.tsx`
  * `shared/components/sections/FeatureGridSection.tsx`
  * `shared/components/sections/FaqSection.tsx`
  * `shared/components/sections/FooterSection.tsx`

**Fuera de alcance:** `api/**`, `cms/**`, `.replit`, `replit.nix`, `replit.md`, `context/**`, rutas nuevas, forms, lógica de datos.

---

### 2. Objetivo

Partiendo de la Home actual (wireframe + textos + fotos):

> Convertirla en una landing visualmente **premium y alineada con Stack-UI** (shadcn/ui + Launch UI + Serene Yoga), sin tocar flujos ni lógica de negocio.

Palancas concretas:

* Mejorar **tipografía, jerarquía y espaciados**.
* Convertir secciones en **bloques de landing** (cards, grids, hover, sombras suaves).
* Usar **componentes de Stack-UI**: `Button`, `Card`, `Accordion` (`shared/ui`), lucide icons, `container` + `grid` mobile-first.

---

### 3. Alcance por sección

#### 3.1 Hero (`HeroPrimary.tsx` + datos en `HomeRoute.tsx`)

**Problema actual:** Correcto pero “plano”: demasiado blanco, imagen gigante sin integración, CTAs sin peso visual.

**Objetivo:** Hero de entrada tipo Launch UI / Serene Yoga, con sensación de landing premium.

**Cambios en `HeroPrimary.tsx`:**

* Contenedor raíz:

  ```tsx
  <section
    id="home-hero"
    className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white"
  >
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* columna texto + columna imagen */}
      </div>
    </div>
  </section>
  ```
* Columna de texto:

  * Limitar ancho: `className="max-w-xl"`.
  * Título con fuente display:

    ```tsx
    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
    ```
  * Subtítulo con más aire:

    ```tsx
    <p className="mt-4 text-base sm:text-lg text-white/80">
    ```
* CTAs:

  * Usar `Button` de `shared/ui` con variantes:

    ```tsx
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Link to={primaryCta.href}>
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto shadow-lg shadow-brand-primary/40"
        >
          {primaryCta.label}
        </Button>
      </Link>
      <Link to={secondaryCta.href}>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
        >
          {secondaryCta.label}
        </Button>
      </Link>
    </div>
    ```
* Columna imagen:

  * Mantener `hero-home` pero integrarlo mejor:

    ```tsx
    <div className="relative w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-brand-primary/30">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-brand-primary/30" />
      </div>
    </div>
    ```

**Cambios en `HomeRoute.tsx`:**

* Asegurar que el hero se monta con copy + CTAs:

  * `eyebrow`: “Bienvenido a Kinesis”.
  * `title`: “Transforma tu vida a través del movimiento consciente”.
  * `subtitle`: copy actual de bienestar.
  * `primaryCta`: `Reserva Élite` → `/modelos-de-negocio#elite-on-demand` (por ahora link interno).
  * `secondaryCta`: `Preinscríbete` → `/programas#preinscripcion`.

---

#### 3.2 Modelos de negocio (`BusinessModelsSection.tsx`)

**Problema actual (según capturas):** Parece una sucesión de bloques texto + imagen a pantalla completa. Falta una **grid de cards** limpia tipo landing.

**Objetivo:** Sección “4 formas de vivir Kinesis” con cards homogéneas, hover suave y jerarquía clara.

**Cambios en `BusinessModelsSection.tsx`:**

* Contenedor de sección:

  ```tsx
  <section id="business-models" className="py-16 sm:py-20 bg-white">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
          4 formas de vivir Kinesis
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Elige el modelo que encaja contigo
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
          Desde sesiones personalizadas hasta experiencias grupales, cada modelo está pensado para un tipo de vida y objetivos diferentes.
        </p>
      </div>
  ```
* Grid:

  ```tsx
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {models.map(...)}
      </div>
    </div>
  </section>
  ```
* Card (usa `Card` de `shared/ui` si lo tienes, o wrapper `<div>`):

  ```tsx
  <Card className="h-full flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <img ... className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white uppercase tracking-wide">
        {model.tagline}
      </div>
    </div>
    <div className="flex-1 p-5 flex flex-col">
      <h3 className="font-display text-lg font-semibold text-slate-900">
        {model.name}
      </h3>
      <p className="mt-2 text-sm text-slate-600 flex-1">
        {model.shortDescription}
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-primary">
        Para: {model.audience}
      </p>
      <div className="mt-4">
        <Button variant="ghost" size="sm" className="px-0 text-brand-primary" asChild>
          <Link to={`/modelos-de-negocio/${model.slug}`}>
            Descubrir más →
          </Link>
        </Button>
      </div>
    </div>
  </Card>
  ```

**HomeRoute.tsx:**

* Mantener el `businessModels` con `imageSrc`, `imageAlt`, `tagline`, `audience` como ya definiste en T11.1 (solo ajustar textos si hace falta).

---

#### 3.3 “Por qué Kinesis” / FeatureGrid (`FeatureGridSection.tsx`)

**Problema actual:** Bloques con borde cuadrado y mucho aire blanco; aspecto de tabla simple.

**Objetivo:** Sección tipo “beneficios clave” inspirada en Launch UI: cards suaves con icono en círculo, título y texto.

**Cambios:**

* Importar iconos de `lucide-react` (ya tienes la dependencia):
  `CheckCircle2`, `Clock3`, `Users`, por ejemplo.
* Layout:

  ```tsx
  <section className="py-16 sm:py-20 bg-slate-50">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
          Por qué Kinesis
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
          Tu centro de bienestar integral
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
          Combinamos técnica, arte y comunidad para que disfrutes del movimiento en todas sus formas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* cards */}
      </div>
    </div>
  </section>
  ```
* Card:

  ```tsx
  <div className="rounded-2xl bg-white shadow-sm hover:shadow-md border border-slate-100 p-6 flex flex-col gap-3">
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
      <CheckCircle2 className="h-5 w-5" />
    </div>
    <h3 className="font-medium text-slate-900">
      Instructores certificados
    </h3>
    <p className="text-sm text-slate-600">
      Profesionales con años de experiencia en danza y bienestar integral.
    </p>
  </div>
  ```
* 3–4 cards máximo, todas con estructura homogénea.

---

#### 3.4 FAQs (`FaqSection.tsx`)

**Problema actual:** Flechas gigantes y contenidos separados; sensación de wireframe.

**Objetivo:** Acordeón accesible usando `Accordion` de `shared/ui`, estilo shadcn.

**Cambios en `FaqSection.tsx`:**

* Importar `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` desde `shared/ui/accordion` (según tengas exportado).
* Layout:

  ```tsx
  <section className="py-16 sm:py-20 bg-white">
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
          Resuelve tus dudas
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
          Preguntas frecuentes
        </h2>
        <p className="mt-4 text-base text-slate-600">
          Todo lo que necesitas saber antes de comenzar a bailar con nosotros.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="mt-8 space-y-3"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border border-slate-200 rounded-2xl px-4"
          >
            <AccordionTrigger className="text-left py-4 font-medium text-slate-900">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm text-slate-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
  ```
* Preguntas/Respuestas pueden seguir estáticas por ahora; simplemente pásalas a un array `faqs` local.

---

#### 3.5 Footer (`FooterSection.tsx`)

**Objetivo:** Rematar con un footer compacto, alineado con el header, no “texto tirado”.

**Cambios:**

* Contenedor:

  ```tsx
  <footer className="border-t border-slate-200 bg-slate-50">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* columna marca + columnas nav */}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Kinesis. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link to="/legal/aviso" className="hover:text-slate-700">Aviso legal</Link>
          <Link to="/legal/privacidad" className="hover:text-slate-700">Política de privacidad</Link>
        </div>
      </div>
    </div>
  </footer>
  ```
* Columna de marca: logo + tagline corto; columnas de navegación (Inicio, Programas, Modelos de negocio, etc.).

---

### 4. Ajustes globales (ligeros)

#### 4.1 `web/src/index.css`

* Asegurar uso de las fuentes definidas en Tailwind (`font-display`, `font-body`):

  ```css
  body {
    @apply font-body bg-background text-foreground antialiased;
  }

  h1, h2, h3, h4 {
    @apply font-display;
  }
  ```

#### 4.2 `web/tailwind.config.js`

* No añadir nada nuevo salvo que necesites:

  * Alguna `boxShadow` moderada (`shadow-elevated`), o
  * `borderRadius['3xl'] = '1.5rem'` si no lo tienes.

---

### 5. Criterios de aceptación (Home “WoW”)

1. **Hero**

   * Layout 1 col mobile, 2 cols desktop.
   * Fondo degradado oscuro; texto blanco; CTAs claramente diferenciados.
   * Imagen `hero-home` encuadrada en card con borde + shadow + overlay.

2. **Modelos de negocio**

   * Título “4 formas de vivir Kinesis” + subtítulo.
   * 4 cards en grid: 1 col mobile, 2 col tablet, 4 col desktop.
   * Cada card: imagen proporcional (no a pantalla completa), título, tagline, audiencia y CTA “Descubrir más”.
   * Hover con ligera elevación y zoom de imagen.

3. **Por qué Kinesis / Features**

   * 3–4 cards con icono circular + título + texto.
   * Aspecto de “bloques de beneficios”, no cajas con borde plano.

4. **FAQs**

   * Accordion de shadcn con animación suave.
   * Solo se ve la respuesta de 0 o 1 pregunta a la vez.

5. **Footer**

   * Alineado con header en estilo.
   * Enlaces legales visibles y clicables.

6. **Responsive**

   * No hay scroll horizontal en móvil.
   * CTAs y elementos interactivos ≥ 44px de alto.
   * Las imágenes de modelos nunca ocupan más del ancho del `container`.

7. **Stack / Técnica**

   * No se añaden dependencias nuevas.
   * `pnpm install` y `pnpm dev` siguen funcionando.
   * No se modifican archivos prohibidos.

---

### 6. Bloque PRD-Agent (resumen ultra-concreto)

* **SOLO puedes tocar/crear:**

  * `web/src/index.css`
  * `web/tailwind.config.js` (ajustes mínimos de theme/spacing/shadows)
  * `web/src/app/layout/Header.tsx`
  * `web/src/app/routes/HomeRoute.tsx`
  * `shared/components/sections/HeroPrimary.tsx`
  * `shared/components/sections/BusinessModelsSection.tsx`
  * `shared/components/sections/FeatureGridSection.tsx`
  * `shared/components/sections/FaqSection.tsx`
  * `shared/components/sections/FooterSection.tsx`
* **NO puedes tocar:** `api/**`, `cms/**`, `.replit`, `replit.nix`, `replit.md`, `context/**`, rutas o endpoints.
* **Objetivo:** Transformar la Home actual (wireframes + fotos) en una **landing con hero potente + grid de modelos + features + FAQs + footer**, usando `shared/ui` (Button, Card, Accordion) y Tailwind, siguiendo el layout descrito.