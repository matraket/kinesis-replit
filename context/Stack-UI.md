---
id: "kb-Stack-UI-implementation"
file_type: "kb-single-file"
title: "Stack UI Kinesis – Guía técnica de implementación"
description: "Descripción técnica del Stack-UI de Kinesis: estructura de shared/ui, secciones compartidas y patrones de uso en Web y CMS."
repo_path: "/context/Stack-UI.md"
tags:
  - "kinesis"
  - "stack-ui"
  - "shared-ui"
  - "web-cms"
---

# Stack-UI Kinesis – Guía técnica de implementación

> Objetivo: definir **cómo debe usarse el stack de UI de Kinesis** (React + Vite + Tailwind + `shared/ui` + `shared/components/sections`) al implementar cualquier pantalla en `/web` o `/cms`, evitando maquetar desde cero y asegurando coherencia visual.

---

## 1. Stack de UI: visión general

### 1.1 Tecnologías base

- **Librería:** React (TypeScript).
- **Bundler / dev server:** Vite.
- **Estilos:** Tailwind CSS 4.
- **Componentes de UI base:** `shared/ui` (inspirados en shadcn/ui, adaptados a Kinesis).
- **Bloques de sección:** `shared/components/sections` (hero, grids, FAQs, etc.).
- **Iconos:** `lucide-react`.

### 1.2 Principios de diseño

- **Mobile-first:** diseñar primero para `<640px` y luego escalar con `sm:`, `md:`, `lg:`.
- **Layout base de sección:**

```tsx
<section className="py-16 sm:py-20 lg:py-24 bg-white">
<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    {/* contenido */}
</div>
</section>
```

* **Tipografía:**

  * `font-display` para encabezados.
  * `font-body` para texto.
* **Look & feel:**

  * Mucho aire, jerarquía clara, sombras suaves, bordes redondeados (`rounded-2xl`, `rounded-3xl`).
  * Uso consistente de colores de marca (`brand.primary`, `brand.secondary`, `brand.accent`).

---

## 2. Estructura de carpetas y alias

### 2.1 Carpetas relevantes

* `shared/ui/`
  Componentes base reutilizables:

  * `button.tsx`
  * `card.tsx`
  * `input.tsx`
  * `badge.tsx`
  * `accordion.tsx`
  * `sheet.tsx`
  * `form/` (Form, FormField, etc.)
  * `data-table/`
  * `filter-sidebar/`
  * `index.ts` (barrel de exports)

* `shared/components/sections/`
  Secciones de alto nivel, p. ej.:

  * `HeroPrimary.tsx`
  * `BusinessModelsSection.tsx`
  * `FeatureGridSection.tsx`
  * `FaqSection.tsx`
  * `FooterSection.tsx`
  * (otras futuras: `PricingSection.tsx`, `TestimonialsSection.tsx`, etc.)

* `web/src/app/...` y `cms/src/app/...`
  Páginas y layouts que **consumen** `shared/ui` y `shared/components/sections`.

### 2.2 Importación recomendada

Idealmente se centralizarán alias en tsconfig, pero a día de hoy pueden coexistir dos estilos:

* Imports relativos (ya en uso):

  ```tsx
  import { Button } from '../../ui';
  import { HeroPrimary } from '../../../../shared/components/sections/HeroPrimary';
  ```

* Imports con alias (recomendados a futuro):

  ```tsx
  import { Button } from '@/shared/ui';
  import { HeroPrimary } from '@/shared/components/sections/HeroPrimary';
  ```

**Regla:**

> Siempre que exista un componente equivalente en `shared/ui` o sección en `shared/components/sections`, se debe **reutilizar**, no reimplementar.

---

## 3. Componentes base de `shared/ui`

> Esta sección describe **qué hay disponible** y cómo se espera que se use. Para la API exacta, revisar cada archivo en `shared/ui`.

### 3.1 Button

**Archivo:** `shared/ui/button.tsx`
**Uso:** acciones principales, CTAs, botones en formularios.

**Características:**

* Basado en `<button>` HTML.
* Props típicas:

  * `variant?: 'primary' | 'secondary' | 'ghost' | 'outline'`
  * `size?: 'sm' | 'md' | 'lg'`
  * `className?: string`
* Se apoya en utilidades como `clsx` para combinar clases.

**Ejemplo:**

```tsx
import { Button } from '../../ui';
// o desde alias: import { Button } from '@/shared/ui';

<Button variant="primary" size="lg">
  Guardar cambios
</Button>;

<Button variant="outline" size="sm" className="ml-2">
  Cancelar
</Button>;
```

**Do:**

* Usar `Button` en CTAs de hero, formularios, listas, etc.
* Extender estilos con `className`.

**Don’t:**

* No usar `<button className="...">` si existe `Button`.

---

### 3.2 Card

**Archivo:** `shared/ui/card.tsx`
**Uso:** contenedores visuales para agrupar contenido (cards de programa, secciones de info, paneles de CMS).

**Patrón típico:**

```tsx
import { Card } from '../../ui';

<Card className="p-4">
  {/* contenido */}
</Card>;
```

En algunos casos se pueden añadir subcomponentes (`CardHeader`, `CardContent`) si se definen; si no, usar un único `Card` y manejar el layout interno con `div`s y Tailwind.

**Do:**

* Usar `Card` para:

  * Tarjetas de modelos de negocio.
  * Paneles de CMS (filtros, detalle de entidad).
  * Bloques de contenido en landings.

---

### 3.3 Input

**Archivo:** `shared/ui/input.tsx`
**Uso:** inputs estándar en formularios.

**Patrón típico:**

```tsx
import { Input } from '../../ui';

<Input
  type="text"
  placeholder="Tu nombre"
  className="w-full"
/>;
```

Se integra con los componentes de `form/` (Form, FormField) para validación y errores.

---

### 3.4 Badge

**Archivo:** `shared/ui/badge.tsx`
**Uso:** etiquetas pequeñas (estado, tipo, plan, etc.).

**Ejemplo conceptual:**

```tsx
import { Badge } from '../../ui';

<Badge variant="outline">
  Nuevo
</Badge>;
```

Puede representar:

* Estado: “Activo / Inactivo”.
* Tipo de programa: “Intensivo”, “Regular”.
* Nivel: “Iniciación”, “Avanzado”.

---

### 3.5 Accordion

**Archivo:** `shared/ui/accordion.tsx`
**Uso:** secciones colapsables, FAQs, bloques de contenido opcional.

**Patrón de uso:**

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../ui';

<Accordion type="single" collapsible className="space-y-3">
  <AccordionItem value="faq-1">
    <AccordionTrigger>¿Pregunta frecuente?</AccordionTrigger>
    <AccordionContent>Respuesta a la pregunta.</AccordionContent>
  </AccordionItem>
</Accordion>;
```

---

### 3.6 Sheet / Dialog

**Archivo:** `shared/ui/sheet.tsx`
**Uso:**

* `Sheet`: panel lateral (ej. menú mobile, filtros).
* `Dialog`: modal centrado (si se define en otra unidad).

**Patrón de uso (Sheet):**

```tsx
import { Sheet, SheetTrigger, SheetContent } from '../../ui';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost">Abrir menú</Button>
  </SheetTrigger>
  <SheetContent side="left">
    {/* contenido del panel */}
  </SheetContent>
</Sheet>;
```

En el header de `PublicLayout` se usa para el menú hamburguesa en móvil.

---

### 3.7 Form (carpeta `form/`)

**Ruta:** `shared/ui/form/`
Contiene wrappers para formularios con React Hook Form + Zod (cuando se usen):

* `Form`
* `FormField`
* `FormLabel`
* `FormControl`
* `FormMessage`

**Patrón conceptual:**

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Enviar</Button>
  </form>
</Form>;
```

---

### 3.8 DataTable

**Ruta:** `shared/ui/data-table/`
**Uso:** listados en CMS con:

* Ordenación.
* Paginación.
* Filtros.

Se suele montar así:

```tsx
import { DataTable } from '../../ui/data-table';

<DataTable columns={columns} data={rows} />;
```

Las columnas se definen con un modelo de tipo `ColumnDef<T>`.
Es el patrón recomendado para:

* Listado de programas.
* Listado de leads.
* Listado de usuarios, etc.

---

### 3.9 FilterSidebar

**Ruta:** `shared/ui/filter-sidebar/`
**Uso:** barra lateral de filtros combinada con tablas o grids.

Patrón genérico:

```tsx
import { FilterSidebar } from '../../ui/filter-sidebar';

<div className="flex gap-6">
  <FilterSidebar>
    {/* campos de filtro */}
  </FilterSidebar>
  <DataTable ... />
</div>;
```

---

## 4. Secciones en `shared/components/sections`

> Bloques de UI de alto nivel que combinan varios componentes de `shared/ui`. Se instancian desde las rutas/páginas.

### 4.1 HeroPrimary

**Uso:** hero de landings (Home, páginas de programa).

Props típicas:

* `eyebrow?: string`
* `title: string`
* `subtitle?: string`
* `primaryCta?: { label: string; href: string; variant?: 'primary' | 'outline' }`
* `secondaryCta?: { label: string; href: string; variant?: 'ghost' | 'outline' }`
* `image?: { src: string; alt: string }`

Layout:

* Mobile: 1 columna (texto + CTAs arriba, imagen debajo).
* Desktop: `grid md:grid-cols-2` texto + imagen.

Se apoya en:

* `Button` de `shared/ui`.
* `Link` de React Router.

### 4.2 BusinessModelsSection

**Uso:** sección tipo “catálogo de modelos de negocio / productos”.

Estructura conceptual:

* Título + subtítulo centrado.
* Grid de cards (`Card`):

  * Imagen.
  * Nombre, tagline, descripción breve.
  * Target (“Para: …”).
  * CTA “Descubrir más”.

Layout:

```tsx
<section>
  <div className="container ...">
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
      {/* cards */}
    </div>
  </div>
</section>
```

### 4.3 FeatureGridSection

**Uso:** bloques de beneficios (“Por qué Kinesis”, “Qué te llevas”).

* `features: Array<{ icon: ReactNode; title: string; description: string }>`
* Mapea a cards con icono, título y texto.

### 4.4 FaqSection

**Uso:** FAQs en landings o páginas de programa.

Se apoya en:

* `Accordion` de `shared/ui` para preguntas/respuestas colapsables.

### 4.5 FooterSection

**Uso:** pie de página de la web pública.

* Columna de marca (logo + tagline).
* Columnas de enlaces.
* Enlaces legales (aviso, privacidad, cookies futuras).

---

## 5. Patrones de uso entre Web y CMS

### 5.1 Web (`/web`)

* Debe usar principalmente:

  * `HeroPrimary`
  * `BusinessModelsSection`
  * `FeatureGridSection`
  * `FaqSection`
  * `FooterSection`

* Para CTAs y acciones: siempre `Button`.

* Para contenido estructurado: `Card`.

### 5.2 CMS (`/cms`)

* Debe usar:

  * `Card` para paneles y formularios.
  * `DataTable` + `FilterSidebar` en listados.
  * `Form` + `Input` en formularios.
  * `Accordion` en secciones colapsables de configuración.

---

## 6. Reglas para el Agent (uso obligatorio)

1. Antes de crear o modificar UI en `/web` o `/cms`:

   * Identificar si ya existe un componente adecuado en `shared/ui` o `shared/components/sections`.
   * En caso afirmativo, **reutilizarlo**, no crear uno nuevo.

2. Para nuevas páginas o vistas:

   * Elegir un **arquetipo de página** de `context/kinesis-conceptual-template.md`.
   * Componer la pantalla usando:

     * Layout base (section + container).
     * Componentes de `shared/ui`.
     * Secciones de `shared/components/sections` cuando encajen.

3. Prohibido:

   * Maquetar pantallas de negocio complejas solo con `<div>` y clases Tailwind, ignorando componentes existentes.
   * Crear una nueva librería de UI paralela (nada de `web/src/components/ui` que duplique `shared/ui`).
   * Añadir dependencias de UI adicionales (MUI, Chakra, otros) salvo que un PRD explícitamente lo pida.

4. Si se necesita un nuevo componente general de UI:

   * Crear primero en `shared/ui` o `shared/components/sections`.
   * Documentar su uso y props de forma similar a esta guía.

---

Así, en los PRDs podré referirme a:

> según `kb-kinesis-stack-ui-implementation.md` (ruta en repo `/context/Stack-UI.md`)…

y estaremos alineados tú, yo y el Agent.

---

## 3. Texto exacto para añadir en `replit.md`

Te propongo dos bloques: uno en la parte de **contexto** y otro en la parte de **reglas para UI**.

### 3.1 Bloque para sección de contexto (p.ej. “Contexto funcional / UI”)

```markdown
### Contexto de UI (Stack-UI Kinesis)

Toda la implementación de interfaces en este monolito (tanto la Web pública en `/web` como el CMS en `/cms`) debe seguir las guías de UI incluidas en la carpeta `context/`:

- `/context/Stack-UI.md`: **Guía técnica del Stack-UI Kinesis**, que describe los componentes base de `shared/ui`, las secciones en `shared/components/sections` y los patrones de uso entre Web y CMS.
- `/context/kinesis-conceptual-template.md`: **Template conceptual de Kinesis**, que define los arquetipos de página (landings, listados, detalle, auth, etc.) y ejemplos de composición usando el Stack-UI.

El Agent debe considerar estos dos documentos como la referencia principal para cualquier decisión de UI/UX antes de maquetar nuevas pantallas o modificar las existentes.
```

### 3.2 Bloque para sección de reglas del Agent (p.ej. en “6. Reglas de trabajo del Agent”)

```markdown
#### Reglas específicas para UI y maquetación

- Antes de crear o modificar vistas React en `/web` o `/cms`, el Agent **DEBE** leer y respetar:
  - `/context/Stack-UI.md`
  - `/context/kinesis-conceptual-template.md`

- El Agent **DEBE**:
  - Reutilizar los componentes definidos en `shared/ui` (Button, Card, Accordion, Sheet, Form, DataTable, etc.) en lugar de maquetar botones y contenedores desde cero con `<button>` o `<div>` + clases Tailwind.
  - Usar las secciones de `shared/components/sections` (`HeroPrimary`, `BusinessModelsSection`, `FeatureGridSection`, `FaqSection`, `FooterSection`, etc.) cuando encajen con el arquetipo de página descrito en `kinesis-conceptual-template.md`.
  - Basarse en los arquetipos de página documentados (landing, listado, detalle, auth, etc.) en lugar de inventar patrones de layout nuevos para cada tarea.

- El Agent **NO DEBE**:
  - Crear una librería de componentes paralela (por ejemplo, `web/src/components/ui`) que duplique lo que existe en `shared/ui`.
  - Maquetar pantallas de negocio complejas usando solo `<div>` y clases Tailwind ignorando los componentes/secciones compartidos.
  - Añadir nuevas dependencias de UI (frameworks de componentes, librerías de estilos o animación) salvo que un PRD lo pida explícitamente.

Estas reglas son de obligado cumplimiento para cualquier tarea que afecte a la UI. Si el Agent necesita un nuevo componente de uso general, deberá definirlo primero en `shared/ui` o `shared/components/sections` y alinearlo con `/context/Stack-UI.md`.
```

Con esto dejamos:

* `/context/kinesis-conceptual-template.md` = demo conceptual / arquetipos.
* `/context/Stack-UI.md` = guía técnica / componentes y patrones.
* `replit.md` = ancla que obliga al Agent a mirar estos dos antes de tocar UI.

Cuando los tengas subidos, el siguiente PRD que generemos ya puede decir “usa el arquetipo X del template y los componentes Y documentados en Stack-UI” y el Agent, al tener ese contexto en `/context`, debería comportarse mucho más alineado y menos “wireframe genérico con fotos”.
