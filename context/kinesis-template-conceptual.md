# Kinesis Conceptual Template
Guía conceptual de layouts, arquetipos de página y uso del Stack-UI Kinesis

> Objetivo: que cualquier desarrollador o Agent pueda construir **nuevas pantallas Web/CMS** coherentes con Kinesis sin inventarse el diseño desde cero, reutilizando los mismos patrones de UI.

---

## 1. Principios del Template Kinesis

### 1.1 Identidad visual

- **Tono**: premium, calmado, estructurado, nada estridente.
- **Colores base**:
  - Fondo claro: `bg-white` / `bg-slate-50`.
  - Modo secciones oscuras: `bg-slate-950` / `bg-slate-900` con texto claro.
  - Marca: `brand.primary`, `brand.secondary`, `brand.accent` (via CSS vars).
- **Tipografía**:
  - `font-display`: Montserrat (titulares).
  - `font-body`: Inter (texto).
- **Sensación**:
  - Mucho **aire** (padding generoso).
  - Jerarquía clara de títulos.
  - Sombras suaves y radios grandes (`rounded-2xl`, `rounded-3xl`).

### 1.2 Layout base

Regla general de secciones de página:

```tsx
<section className="py-16 sm:py-20 lg:py-24 bg-white">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    {/* contenido */}
  </div>
</section>
````

* Siempre **mobile-first**:

  * 1 columna en `<md`.
  * A partir de `md`, grid/flex.
* Ejes típicos:

  * `grid md:grid-cols-2` para “texto + imagen”.
  * `grid md:grid-cols-3` o `xl:grid-cols-4` para cards.

### 1.3 Primitivas de Stack-UI Kinesis

#### 1.3.1 Componentes base (`shared/ui`)

Usar SIEMPRE que existan:

* `Button`: variantes `primary | secondary | ghost | outline`, tamaños `sm | md | lg`.
* `Card`: contenedor visual básico para cajas de contenido.
* `Accordion`: para FAQs y secciones de contenido colapsable.
* `Sheet` / `Dialog`: menús móviles, overlays.
* `Input`, `Form`, `data-table`, `filter-sidebar`: para CMS y formularios/listados.

**Do:**

* Importar desde `shared/ui` o vía alias centralizado.
* Ajustar estilos con `className`, no reimplementar botones.

**Don’t:**

* No crear botones `<button className="...">` a pelo si `Button` existe.
* No duplicar componentes de `shared/ui` en `web/src/components/ui`.

#### 1.3.2 Secciones (`shared/components/sections`)

Bloques reutilizables:

* `HeroPrimary`
* `BusinessModelsSection`
* `FeatureGridSection`
* `FaqSection`
* `FooterSection`
* (Futuras secciones se añadirán aquí: `TestimonialsSection`, `PricingSection`, etc.)

Cada sección:

* Recibe props tipadas.
* Se centra en **layout + estilo**, no en lógica de datos.
* Se instancia desde rutas/pages.

---

## 2. Guía de estilos – Web Kinesis

### 2.1. Tokens de color (CSS + Tailwind)

Colores globales definidos en `web/src/index.css`:

- `--background`: `#FFFFFF` (fondo principal claro)
- `--foreground`: `#111827` (texto principal)
- `--brand-primary`: `#FB2F72` (rosa Kinesis – CTAs, acentos clave)
- `--brand-secondary`: `#6366F1` (lila/indigo – acentos secundarios)
- `--brand-accent`: `#F59E0B` (accent cálido – badges, highlights)
- `--border`: `#E5E7EB` (bordes suaves)
- `--text-muted`: `#64748B` (texto secundario)
- `--radius`: `0.5rem` (radio base)

En `web/tailwind.config.js` estos tokens se exponen como:

```ts
colors: {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  brand: {
    primary: 'var(--brand-primary)',
    secondary: 'var(--brand-secondary)',
    accent: 'var(--brand-accent)',
  },
  border: 'var(--border)',
  muted: 'var(--text-muted)',
}
````

**Reglas de uso:**

* CTA principal → `bg-brand-primary text-white hover:opacity-90`.
* CTA secundaria → borde `border-brand-primary text-brand-primary` o `text-brand-secondary`.
* Enlaces activos/hover nav → `text-brand-primary`.
* Badges / micro-acentos → `bg-brand-accent` o `text-brand-accent`.
* Bordes de cards/inputs → `border-border`.
* Texto secundario, labels → `text-muted`.

### 2.2. Tipografía

Fuentes mapeadas en Tailwind:

```ts
fontFamily: {
  display: ['Montserrat', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

* **Display / Titles**: `font-display` (Montserrat).

  * H1: `text-4xl lg:text-6xl font-bold tracking-tight`
  * H2: `text-3xl lg:text-4xl font-semibold`
  * H3: `text-2xl lg:text-[32px] font-semibold`
* **Body**: `font-body` (Inter).

  * Texto normal: `text-base text-foreground`
  * Texto secundario: `text-sm text-muted`

Regla conceptual:

* Hero y títulos de sección → Montserrat.
* Párrafos, descripciones y labels → Inter.

### 2.3. Espaciado y radii

Tokens de spacing en Tailwind:

```ts
spacing: {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  '2xl': '64px',
  '3xl': '96px',
},
borderRadius: {
  lg: '8px',
  xl: '12px',
},
```

* Secciones verticales:

  * Mobile: `py-xl` (`py-12` aprox.)
  * Desktop: `py-2xl` (`py-16`–`py-24`) según importancia.
* Cards:

  * `rounded-xl` + `shadow-md` ligero.
* Imágenes de hero / modelos:

  * `rounded-3xl` cuando queramos look más “premium”.

### 2.4. Layout base Web

* Contenedor estándar:

  ```tsx
  <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  ```

* Página Web:

  ```tsx
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1">
      {/* secciones */}
    </main>
    <FooterSection />
  </div>
  ```

* Mobile-first:

  * Secciones 1 columna (`flex flex-col gap-md`).
  * A partir de `md:` usar `grid md:grid-cols-2` o `lg:grid-cols-3/4` según patrón.

### 2.5. Patrones de secciones clave (Web)

**Hero landing (tipo Serene Yoga):**

* `section` con:

  * `py-16 sm:py-20 lg:py-24`
  * `bg-gradient-to-b from-purple-50/50 to-white` (o variante con `brand.secondary` muy aclarado).
* Layout:

  * Mobile: 1 columna texto → imagen.
  * Desktop: `md:grid md:grid-cols-2 gap-10 md:gap-12 items-center`.
* Contenido:

  * Eyebrow (opcional): `text-brand-primary text-sm uppercase tracking-wide`.
  * H1 display.
  * Párrafo `text-muted`.
  * CTAs: `<Button variant="primary" />` + `<Button variant="outline" />` apilados en mobile, en fila en desktop.

**Grid de modelos / productos:**

* `grid gap-lg sm:grid-cols-2 xl:grid-cols-4`.
* Cada card:

  * Imagen `aspect-[4/3] rounded-2xl object-cover`.
  * Título (H3).
  * Texto breve.
  * CTA `Button variant="ghost" size="sm"`.

### 2.6 Patrones de secciones adicionales (Web)

Además de Hero y grids de contenido, el template Kinesis incorpora una serie de secciones “tipo marketing” recurrentes. Todas deben seguir el layout base (`section` + `container`) y apoyarse en `shared/ui` (Button, Card, Badge, Accordion…).

---

#### 2.6.1 Sección de trust / logos

**Cuándo usarla**

- Justo debajo del hero o tras la primera sección de valor.
- Para mostrar: marcas colaboradoras, medios, partners, premios, etc.

**Objetivo**

- Generar confianza rápida con muy poco texto.
- Visualmente ligera, sin robar protagonismo al hero.

**Layout recomendado**

```tsx
<section className="py-10 sm:py-12 bg-white">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <p className="text-center text-xs font-semibold tracking-[0.16em] uppercase text-muted">
      Con la confianza de
    </p>
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
      {/* logos */}
    </div>
  </div>
</section>
```

**Reglas visuales**

* Logos en escala de grises (`opacity-70 hover:opacity-100`).
* No más de 5–8 logos en desktop.
* En móvil, 2 columnas; en desktop, 4–5.

---

#### 2.6.2 Sección de “cómo funciona”

**Cuándo usarla**

* En landings de programa, pricing o servicios.
* Para explicar un flujo simple en 3–4 pasos.

**Objetivo**

* Reducir fricción: mostrar que el proceso es claro y guiado.

**Layout recomendado**

```tsx
<section className="py-16 sm:py-20 bg-slate-50">
  <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
        Cómo funciona
      </p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
        Empieza a moverte en 3 pasos
      </h2>
      <p className="mt-4 text-sm sm:text-base text-muted">
        Desde el primer contacto hasta tu primera clase, te acompañamos en todo el proceso.
      </p>
    </div>

    <div className="mt-10 grid gap-8 md:grid-cols-3">
      {/* StepCard[3] */}
    </div>
  </div>
</section>
```

**StepCard conceptual**

* Número dentro de un círculo (`1`, `2`, `3`).
* Título breve.
* Descripción 2–3 líneas.

```tsx
<div className="flex flex-col gap-3">
  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand.primary/10 text-brand.primary font-semibold">
    1
  </div>
  <h3 className="font-medium text-slate-900">
    Reserva tu plaza
  </h3>
  <p className="text-sm text-muted">
    Completa un breve formulario para conocer tu nivel, objetivos y disponibilidad.
  </p>
</div>
```

---

#### 2.6.3 Testimonios

**Cuándo usarla**

* En la Home y en landings de programas.
* Cerca de secciones de pricing o CTAs fuertes.

**Objetivo**

* Probar que Kinesis funciona para personas reales (social proof).

**Layout recomendado**

```tsx
<section className="py-16 sm:py-20 bg-white">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
          Testimonios
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
          Lo que dicen nuestros alumnos
        </h2>
      </div>
      <p className="text-sm text-muted max-w-md">
        Historias reales de personas que han recuperado el movimiento, la confianza y la alegría a través de Kinesis.
      </p>
    </div>

    <div className="mt-10 grid gap-8 md:grid-cols-3">
      {/* TestimonialCard[] */}
    </div>
  </div>
</section>
```

**TestimonialCard conceptual**

* Usa `Card` de `shared/ui`.
* Estructura:

  * Comillas o icono.
  * Texto de la opinión (4–6 líneas).
  * Línea inferior con avatar iniciales / foto + nombre + tipo de alumno.

```tsx
<Card className="h-full flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
  <p className="text-sm text-slate-700 leading-relaxed">
    “Volver a bailar ha sido volver a sentirme yo. Las clases son el momento de la semana que más espero.”
  </p>
  <div className="mt-6 flex items-center gap-3">
    <div className="h-9 w-9 rounded-full bg-brand.primary/10 flex items-center justify-center text-xs font-semibold text-brand.primary">
      MC
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-900">María Casado</span>
      <span className="text-xs text-muted">Programa Ritmo Constante</span>
    </div>
  </div>
</Card>
```

Slider/carrusel **no obligatorio**: se puede empezar con grid estático.

---

#### 2.6.4 FAQ (accordion)

> Ya se usa en `FaqSection`, pero se define aquí como patrón conceptual.

**Cuándo usarla**

* Al final de landings.
* Tras pricing o secciones con fricción.

**Objetivo**

* Anticipar dudas frecuentes y reducir bloqueos de decisión.

**Layout recomendado**

```tsx
<section className="py-16 sm:py-20 bg-white">
  <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
        Preguntas frecuentes
      </p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
        Resuelve tus dudas
      </h2>
      <p className="mt-4 text-sm sm:text-base text-muted">
        Todo lo que necesitas saber antes de empezar a bailar con nosotros.
      </p>
    </div>

    <Accordion
      type="single"
      collapsible
      className="mt-8 space-y-3"
    >
      {/* AccordionItem[] */}
    </Accordion>
  </div>
</section>
```

**Reglas**

* 5–7 preguntas máximo por landing.
* Pregunta = frase directa; respuesta = 3–6 líneas.
* Usar `Accordion` de `shared/ui`, nunca inventar acordeones manuales.

---

#### 2.6.5 Pricing (3–4 planes, uno destacado)

**Cuándo usarla**

* En páginas de tarifas (`/horarios-tarifas`) o landings de suscripción.

**Objetivo**

* Hacer comparables los planes y resaltar el recomendado.

**Layout recomendado**

```tsx
<section className="py-16 sm:py-20 bg-slate-50">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
        Tarifas
      </p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-slate-900">
        Elige cómo quieres moverte
      </h2>
      <p className="mt-4 text-sm sm:text-base text-muted">
        Planes flexibles según tu ritmo de vida y tu nivel de compromiso.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {/* PricingCard[3] */}
    </div>
  </div>
</section>
```

**PricingCard conceptual**

* Usa `Card` de `shared/ui`.
* Uno de los planes marcado como recomendado (badge).

```tsx
<Card className="relative flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
  {plan.recommended && (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand.primary px-3 py-1 text-xs font-semibold text-white shadow-md">
      Más elegido
    </div>
  )}
  <div className="p-6 flex flex-col gap-3">
    <h3 className="font-display text-xl font-semibold text-slate-900">
      {plan.name}
    </h3>
    <p className="text-sm text-muted">{plan.description}</p>
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
      <span className="text-xs text-muted">/mes</span>
    </div>
    <ul className="mt-4 space-y-2 text-sm text-slate-700">
      {plan.features.map((feature) => (
        <li key={feature} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand.primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      variant={plan.recommended ? 'primary' : 'outline'}
      size="md"
      className="mt-6 w-full"
    >
      Elegir plan
    </Button>
  </div>
</Card>
```

**Reglas**

* 3 planes es el estándar; 4 como máximo.
* Un solo plan destacado visualmente.
* CTA clara y homogénea (“Elegir plan”, “Reserva tu plaza”).

---

## 3. Arquetipos de páginas “Marketing” (Web Pública)

### 3.1 Landing principal (Homepage)

**Cuándo usar**
Página raíz (`/`), o landings principales de campañas. Debe combinar:

* Hero fuerte.
* Bloque de “modelos de negocio/productos”.
* Razones/beneficios.
* Prueba social (testimonios) y FAQs.
* CTA clara.

**Patrón recomendado**

Secciones en este orden:

1. `HeroPrimary`
2. `BusinessModelsSection` ó `FeatureGridSection` adaptada
3. Sección de beneficios (`FeatureGridSection`)
4. Sección de prueba social (futura `TestimonialsSection`)
5. `FaqSection`
6. `FooterSection`

**Ejemplo conceptual**

```tsx
export function HomeRoute() {
  return (
    <>
      <HeroPrimary
        eyebrow="Bienvenido a Kinesis"
        title="Transforma tu vida a través del movimiento consciente"
        subtitle="Programas de danza y bienestar para todas las etapas."
        primaryCta={{ label: "Reserva Élite", href: "/modelos-de-negocio#elite-on-demand" }}
        secondaryCta={{ label: "Preinscríbete", href: "/programas#preinscripcion" }}
        image={{ src: "/assets/kinesis/hero-home.jpg", alt: "Grupo de bailarines en escena" }}
      />
      <BusinessModelsSection models={businessModels} />
      <FeatureGridSection features={benefits} />
      {/* TestimonialsSection (futura) */}
      <FaqSection faqs={homeFaqs} />
    </>
  );
}
```

---

### 3.2 Landing de programa/servicio

**Cuándo usar**
Para una URL tipo `/programas/elite-on-demand` o similar.

**Patrón**

1. Hero “light” centrado en el nombre del programa.
2. Bloque de características principales (FeatureGrid).
3. Bloque “Qué incluye / Qué obtendrás”.
4. Testimonios específicos.
5. FAQs específicas.
6. CTA final (preinscripción, contacto).

**Layout resumido**

* Hero: texto centrado y botón.
* Secciones interiores: `grid md:grid-cols-2` y `grid md:grid-cols-3`.

**Mini-ejemplo**

```tsx
export function ProgramDetailRoute() {
  return (
    <>
      <HeroPrimary
        eyebrow="Programa"
        title="Élite On Demand"
        subtitle="Entrenamiento individualizado para bailarines que buscan máximo rendimiento."
        primaryCta={{ label: "Solicitar plaza", href: "#preinscripcion" }}
      />
      <FeatureGridSection features={eliteFeatures} />
      {/* sección “Qué incluye” como cards verticales */}
      {/* sección testimonios */}
      <FaqSection faqs={eliteFaqs} />
    </>
  );
}
```

---

### 3.3 Páginas de Pricing

**Cuándo usar**
Para páginas centradas en tarifas (`/horarios-tarifas`) o planes de suscripción.

**Patrón**

* Introducción corta + tabla de precios o cards con planes.
* Comparativa de beneficios por plan.
* CTA final clara.

**Layout**

* Encabezado centrado (`text-center`).
* `grid sm:grid-cols-2 lg:grid-cols-3` de cards con precio.

**Mini-ejemplo**

```tsx
<PricingSection
  plans={[
    {
      name: "Ritmo Constante",
      price: "59 €/mes",
      description: "Clases semanales para mantener el hábito.",
      features: ["1 clase semanal", "Acceso a eventos trimestrales"],
      ctaLabel: "Empezar ahora",
      ctaHref: "/programas?plan=ritmo-constante",
    },
    // ...
  ]}
/>
```

*(`PricingSection` se puede definir en `shared/components/sections` siguiendo el mismo patrón que `FeatureGridSection`.)*

---

### 3.4 Páginas de contenido editorial (Blog / Noticias)

#### 3.4.1 Listado de noticias

**Cuándo**
Para /blog o /noticias.

**Patrón**

* Título + subtítulo.
* Listado de cards de artículo:

  * Imagen, título, fecha, extracto, CTA “Leer más”.

**Layout**

```tsx
<section className="py-16 bg-white">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    {/* header */}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {/* ArticleCard[] */}
    </div>
  </div>
</section>
```

#### 3.4.2 Detalle de noticia

**Cuándo**
`/noticias/:slug`.

**Patrón**

* Hero simple con título + breadcrumb.
* Cuerpo del artículo en columna central.
* Lateral (en desktop) con noticias relacionadas.

---

## 4. Arquetipos “App / CMS / Backoffice”

### 4.1 Listado tipo tabla (CMS)

**Cuándo**
Listados de entidades: programas, leads, usuarios, etc.

**Patrón**

* Barra superior: título + acciones + búsqueda.
* Cuerpo: tabla (`data-table` de `shared/ui`) con:

  * Checkbox de selección.
  * Columnas principales.
  * Acciones por fila (editar, ver).

**Layout**

```tsx
export function ProgramsListPage() {
  return (
    <PageLayout
      title="Programas"
      actions={<Button variant="primary">Nuevo programa</Button>}
    >
      <DataTable
        columns={programColumns}
        data={programs}
        filterSidebar={<ProgramsFilterSidebar />}
      />
    </PageLayout>
  );
}
```

Donde:

* `PageLayout` es un patrón interno (puede vivir en `cms/src/layout`).
* `DataTable` viene del `shared/ui/data-table`.
* `ProgramsFilterSidebar` del `shared/ui/filter-sidebar` adaptado.

---

### 4.2 Listado tipo cards (grid)

**Cuándo**
Cuando el contenido es mejor visual (profes, cursos, tarjetas con imágenes).

**Patrón**

* Filtro arriba (búsqueda / tags).
* Grid de `Card` con imagen + título + badge.

**Layout**

```tsx
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {items.map(item => (
    <Card key={item.id} className="flex flex-col overflow-hidden">
      <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-medium">{item.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{item.subtitle}</p>
      </div>
    </Card>
  ))}
</div>
```

---

### 4.3 Página de detalle + formulario

**Cuándo**
Edición de entidad (programa, tarifa, usuario).

**Patrón**

* Layout 2 columnas en desktop:

  * Columna principal: formulario.
  * Columna lateral: info resumen / estados / acciones.

**Layout**

```tsx
<div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
  <Card className="p-6">
    <ProgramForm />
  </Card>
  <div className="space-y-4">
    <Card className="p-4"> {/* Resumen */}</Card>
    <Card className="p-4"> {/* Estado / notas */}</Card>
  </div>
</div>
```

---

### 4.4 Auth (Login / Registro / Reset)

**Cuándo**
Pantallas de autenticación, áreas privadas futuras.

**Patrón**

* Página centrada, card con formulario y logo arriba.
* Fondo neutro (`bg-slate-950` con gradiente suave o `bg-slate-100` según decisión).

**Layout**

```tsx
<div className="min-h-screen flex items-center justify-center bg-slate-950">
  <div className="w-full max-w-md px-4">
    <Card className="p-6 bg-slate-900 border-slate-800 text-white">
      <LogoKinesis />
      <h1 className="mt-4 text-2xl font-display font-semibold">Inicia sesión</h1>
      <LoginForm />
    </Card>
  </div>
</div>
```

---

### 4.5 Vista tipo chat / actividad

**Cuándo**
Si en el futuro hay mensajería, soporte, o timeline de actividad.

**Patrón**

* Layout 2 columnas:

  * Lista de conversaciones/elementos (izquierda).
  * Panel de detalle/chat (derecha).

**Layout**

```tsx
<div className="grid h-[calc(100vh-80px)] grid-cols-[280px_minmax(0,1fr)] rounded-2xl border bg-background">
  <aside className="border-r p-4 overflow-y-auto">{/* lista */}</aside>
  <main className="flex flex-col">{/* mensajes */}</main>
</div>
```

---

## 5. Páginas utilitarias

### 5.1 404 / No encontrado

**Patrón**

* Ilustración simple, mensaje, botón “Volver al inicio”.

```tsx
<section className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
  <div className="text-center px-4">
    <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">Error 404</p>
    <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold">Página no encontrada</h1>
    <p className="mt-4 text-sm text-white/70">
      Puede que el enlace haya cambiado o ya no exista.
    </p>
    <div className="mt-6 flex justify-center">
      <Button variant="primary" size="md" asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  </div>
</section>
```

### 5.2 Estados vacíos

**Cuándo**
Listados sin datos, filtros sin resultados.

**Patrón**

* Icono/emoji, mensaje y CTA.

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="mb-4 text-4xl">🕊️</div>
  <h3 className="text-lg font-medium">Todavía no hay programas</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Crea tu primer programa para comenzar a organizar la oferta de Kinesis.
  </p>
  <div className="mt-4">
    <Button variant="primary" size="sm">Nuevo programa</Button>
  </div>
</div>
```

---

## 6. Reglas para el Agent (resumen operativo)

1. **Antes de crear/modificar una pantalla**:

   * Identifica el **arquetipo** que mejor encaja (Landing, Listing tabla, Ficha detalle, Auth, etc.).
   * Reutiliza el patrón de layout descrito aquí.

2. **Siempre**:

   * Usa `Button`, `Card`, `Accordion`, etc. de `shared/ui`.
   * Usa `container max-w-6xl px-4 sm:px-6 lg:px-8` y `py-16 sm:py-20` para secciones.
   * Diseña mobile-first: 1 columna en mobile, grid/flex en desktop.

3. **Nunca**:

   * Inventes patrones de UI completamente nuevos si uno de estos arquetipos encaja.
   * Maquetes páginas de negocio con `div` planos y texto sin cards/estructura.
   * Añadas dependencias de UI nuevas sin que el PRD lo pida.

4. **Para nuevas páginas**:

   * Elige el arquetipo (o combinación de ellos).
   * Documenta en el PRD: “esta página usa Arquetipo X + sección Y”, en vez de describir todo desde cero.

---