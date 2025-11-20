# PRD T11.1 – Refinamiento visual de Homepage + integración de assets

## 1. Metadatos

* **ID:** T11.1
* **Fase:** 4 – Frontend (Web) — Web corporativa
* **Estado:** Iteración de refinamiento sobre T11
* **Depende de:**

  * T10 – Layout base Web + Stack-UI Kinesis 
  * T11 – Homepage (MVP) funcional, hero + BusinessModelsSection ya implementados pero con look “0.5”
* **Módulos afectados (IN):**

  * `web/src/app/layout/PublicLayout.tsx` (branding en header)
  * `web/src/app/routes/HomeRoute.tsx`
  * `shared/components/sections/HeroPrimary.tsx`
  * `shared/components/sections/BusinessModelsSection.tsx`
  * Carpeta de assets estáticos para Web (ver 5.1)
* **Fuera de alcance (OUT):** `api/**`, `cms/**`, `context/**`, `.replit`, `replit.nix`, `replit.md`.

---

## 2. Objetivo

Elevar la Home de Kinesis desde un estado “esqueleto funcional” (T10 + T11) a una **landing visualmente profesional y alineada con la identidad de Kinesis**, sin cambiar todavía flujos ni lógica de datos.

En concreto:

* Integrar **logo y fotografías reales** de Kinesis en el header y en el hero. 
* Refinar `<HeroPrimary>` para que se vea como un bloque Hero de Launch UI / Serene Yoga:
  2 columnas en desktop, imagen protagonista, CTAs como botones de Stack-UI.
* Enriquecer `<BusinessModelsSection>` con imágenes, copy ajustado y layout de cards premium para los 4 modelos de negocio.

Sin tocar todavía: formularios, API, ni comportamiento de leads (eso sigue siendo T14).

---

## 3. Alcance

### 3.1 In Scope (T11.1)

1. **Organización de assets estáticos (Web)**

   * Crear estructura para imágenes y logos de la Web pública, por ejemplo:

     ```text
     web/public/assets/kinesis/
       logo-horizontal.png
       logo-cuadrado.png
       hero-home.jpg
       modelo-elite-on-demand.jpg
       modelo-ritmo-constante.jpg
       modelo-generacion-dance.jpg
       modelo-si-quiero-bailar.jpg
     ```

   * Renombrar los archivos que adjuntas a nombres semánticos (sin espacios / tildes) manteniendo coherencia.

   * Hero y modelos se servirán como imágenes estáticas (vía `/assets/kinesis/...` o `import.meta.env.BASE_URL` según convenga).

2. **Branding en `PublicLayout` (header)**

   * Sustituir el texto “Kinesis” del header por el logo horizontal (`logo-horizontal.png`) manteniendo accesibilidad (`alt="Kinesis Dance Studio"`).
   * Mantener tipografía/menu tal como marca T10, ajustando solo lo necesario para que el logo encaje (altura de header, padding, etc.).
   * En móviles, el logo puede reducirse o usarse la versión cuadrada como icono.

3. **Refinamiento visual de `<HeroPrimary>`**

   * Usar `hero-home.jpg` como imagen principal del hero (la foto grupal que has enviado).

   * Ajustar layout según T11:

     * Mobile: 1 columna (texto + CTAs arriba, imagen debajo).
     * Desktop: grid 2 columnas (`md:grid-cols-2`) con texto a la izquierda e imagen a la derecha. 

   * Asegurar:

     * H1, subtítulo y CTAs con jerarquía visual clara (tipografía, peso, tamaños).
     * CTAs como `Button` de `shared/ui` (primary/secondary) usando variantes de shadcn/ui.
     * Uso de un fondo suave (p. ej. `bg-gradient-to-b` dentro del hero) y suficiente espacio vertical (`py-16`/`py-20`).

4. **Uso de fotografías por modelo de negocio en `<BusinessModelsSection>`**

   * Ampliar cada card de modelo para incluir imagen:

     * Élite On Demand → `elite-on-demand.jpg`
     * Ritmo Constante → `ritmo-constante.jpg`
     * Generación Dance → `generacion-dance.jpg`
     * Sí, Quiero Bailar → `si-quiero-bailar.jpg`

   * Layout:

     * Desktop: `grid sm:grid-cols-2 xl:grid-cols-4` con cards verticales.
     * Mobile: 1 columna (cards apiladas).

   * Cada card debe tener:

     * Imagen en la parte superior (`aspect-[4/3]`, `rounded-2xl`, `object-cover`).
     * Título, subtítulo y descripción corta (ya definidas en docs de modelos). 
     * CTA “Descubrir más” (`Button` `variant="ghost" size="sm"`) con navegación interna, como en T11.

5. **Microcopy y jerarquía basada en Kinesis**

   * Ajustar textos de:

     * Eyebrow del hero (ej. “Bienvenido a Kinesis”).
     * Subtítulo del hero (mensaje de bienestar/movimiento consciente, ya muy cercano a lo actual).
     * Intro de sección “4 formas de vivir Kinesis” para que conecte explícitamente con los cuatro modelos.

   * Mantener el tono cercano/premium, sin lorem ipsum.

6. **Revisión responsive y accesibilidad**

   * Comprobar en breakpoints `sm`, `md`, `lg`:

     * Hero sin scroll horizontal, texto legible, CTAs suficientemente grandes en móvil.
     * Cards de modelos con mín. 44px de altura para áreas pulsables.
   * Añadir `alt` significativos a todas las imágenes (p.ej. “Pareja bailando una coreografía nupcial”, “Bailarín en salto en escenario iluminado”, etc.).

### 3.2 Out of Scope (T11.1)

* ❌ No crear ni modificar formularios (contacto, preinscripción, reserva, etc.). Eso sigue en T14.
* ❌ No integrar API (ni React Query) para cargar modelos dinámicamente: seguir usando datos estáticos definidos en T11.
* ❌ No cambiar estructura de rutas ni añadir nuevas páginas.
* ❌ No tocar `api/**`, `cms/**`, migraciones SQL ni esquema de BD.
* ❌ No modificar `.replit`, `replit.nix`, `replit.md`, `context/**`.
* ❌ No instalar nuevas librerías de UI/animación (MUI, Chakra, framer-motion, sliders, etc.).

---

## 4. Reglas y restricciones

### 4.1 Arquitectura Replit / monolito

* Mantener intacta la arquitectura definida en `replit.md`: monolito con `/api`, `/web`, `/cms`, `/shared`, sin nuevos directorios de primer nivel. 
* `pnpm install` y `pnpm dev` deben seguir funcionando sin errores al finalizar la tarea. 

### 4.2 UI/UX – Stack-UI Kinesis

* **Botones y cards:** siempre via `shared/ui` (shadcn/ui).
* **Patrones Launch UI / Serene Yoga:**

  * Hero como gran bloque de entrada con imagen lateral o dominante, espacio blanco y copy claro.
  * Sección modelos con cards limpias, consistentes y bien espaciadas.
* **Mobile-first:** diseñar primero para <640px y luego ampliar (`sm`, `md`, `lg`).

### 4.3 Técnicas

* Reutilizar todas las dependencias existentes, sin añadir nuevas.
* No cambiar firmas públicas de `HeroPrimary` ni `BusinessModelsSection`; solo añadir props opcionales si hiciera falta.

---

## 5. Detalle funcional / de implementación

### 5.1 Assets estáticos

* Al inicio de la tarea, el Agent recibirá los ficheros originales (los que tú has pasado). Debe copiarlos a:

  ```text
  web/public/assets/kinesis/
    logo-horizontal.png          // desde logo_horizontal.png
    logo-cuadrado.png            // desde logo_cuadrado_fondo_blanco_2.png
    hero-home.jpg                // desde hero.jpg
    modelo-elite-on-demand.jpg   // desde elite-on-demand.jpg
    modelo-ritmo-constante.jpg   // desde ritmo-constante.jpg
    modelo-generacion-dance.jpg  // desde generacion-damce.jpg
    modelo-si-quiero-bailar.jpg  // desde si-quiero-bailar.jpg
  ```

* En código, usar rutas relativas tipo `/assets/kinesis/hero-home.jpg` o imports de Vite si se prefiere tipado.

### 5.2 Header de `PublicLayout`

* Sustituir “Kinesis” por:

  ```tsx
  <Link to="/" className="flex items-center gap-2">
    <img
      src="/assets/kinesis/logo-horizontal.png"
      alt="Kinesis Dance Studio"
      className="h-8 w-auto"
    />
  </Link>
  ```

* En mobile, si el ancho no permite bien el logo horizontal, se puede usar `logo-cuadrado.png` con `h-8 w-8`.

### 5.3 `HeroPrimary` con imagen real

* Props de imagen: usar ya la prop `image` (`{ src: "/assets/kinesis/hero-home.jpg", alt: "Grupo de bailarines sobre escenario" }`).
* Comprobar que el wrapper sigue las clases definidas en T11: `section`, `container`, `grid`, etc. 
* CTAs:

  * Primary: “Reserva Élite” → `/horarios-tarifas#elite`.
  * Secondary: “Preinscríbete” → `/programas#preinscripcion`.

### 5.4 `BusinessModelsSection` con imágenes

* Añadir prop opcional `imageSrc` a `BusinessModelSummary` o propiedad similar en el componente de card (no es obligatorio exponerlo en todo el dominio; puede ser solo UI):

  ```ts
  type BusinessModelSummaryUI = BusinessModelSummary & {
    imageSrc?: string;
    imageAlt?: string;
  };
  ```

* En `HomeRoute`, construir el array con mapeo a archivos:

  ```ts
  const businessModels: BusinessModelSummaryUI[] = [
    {
      slug: "elite-on-demand",
      name: "Élite On Demand",
      // ...
      imageSrc: "/assets/kinesis/modelo-elite-on-demand.jpg",
      imageAlt: "Bailarín en salto en un escenario iluminado",
    },
    // resto modelos...
  ];
  ```

* En cada card:

  ```tsx
  {model.imageSrc && (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4">
      <img
        src={model.imageSrc}
        alt={model.imageAlt ?? model.name}
        className="h-full w-full object-cover"
      />
    </div>
  )}
  ```

* El resto del contenido (título, descripción, CTA) se mantiene como ya definiste en T11.

### 5.5 Revisión responsive

* Verificar manualmente:

  * iPhone/Android (~375–414px): hero 1 columna, CTAs apiladas; cards una sobre otra.
  * Tablet (~768px): hero sigue 2 columnas, grid de modelos 2x2.
  * Desktop (>1024px): hero amplia, grid 4 columnas (si hay espacio).

---

## 6. Criterios de aceptación

1. **Build & run**

   * `pnpm install` sin errores.
   * `pnpm dev` arranca API + CMS + Web sin cambios en comportamiento.

2. **Header**

   * Logo gráfico visible en desktop y mobile.
   * Click en logo lleva a `/`.

3. **Hero**

   * Se muestra la imagen `hero-home.jpg` en desktop junto al texto.
   * Layout: 1 columna en móvil, 2 columnas en desktop.
   * CTAs son botones (`Button` de `shared/ui`), apilados en móvil y en línea en desktop.

4. **BusinessModelsSection**

   * Cada modelo tiene imagen, título, texto y CTA.
   * Al menos 4 cards se muestran sin errores.
   * Grid responsive: 1 columna mobile, 2–4 columnas desktop.

5. **Identidad & copy**

   * No hay textos lorem ipsum en hero ni en títulos de modelos.
   * Alt texts significativos en todas las imágenes.

6. **UX responsive**

   * No hay scroll horizontal en móvil.
   * Los botones y CTAs tienen altura clickable ≥44px.

7. **Stack & restricciones**

   * No se han añadido nuevas dependencias.
   * No se ha tocado `.replit`, `replit.nix`, `replit.md`, `context/**`, `api/**`, `cms/**`.

---

## 7. Bloque PRD-Agent T11.1 (resumen para el Agent)

> Este bloque es el que puedes pegar en Replit (modo Build) junto con los ficheros de imagen.

### Objetivo

Refinar visualmente la Home (`/`) usando **Stack-UI Kinesis + imágenes reales**:

* Poner logo gráfico en el header.
* Hero con imagen grande + CTAs como botones (mobile-first, 1 col móvil / 2 cols desktop).
* `BusinessModelsSection` con cards con foto para los 4 modelos.

### NO HACER

* No tocar: `.replit`, `replit.nix`, `replit.md`, `context/**`, `api/**`, `cms/**`.
* No cambiar rutas ni crear páginas nuevas.
* No añadir librerías nuevas (UI, sliders, animaciones).
* No crear formularios ni llamadas a API (datos siguen estáticos).
* No eliminar `React.StrictMode`.

### Dónde puedes trabajar

* `web/public/assets/kinesis/*` → copiar aquí las imágenes que te adjunto.
* `web/src/app/layout/PublicLayout.tsx` → solo para sustituir el texto “Kinesis” por el logo.
* `web/src/app/routes/HomeRoute.tsx` → preparar props para Hero + BusinessModelsSection (incluyendo rutas de imágenes).
* `shared/components/sections/HeroPrimary.tsx` → ajustar layout y usar la imagen del hero.
* `shared/components/sections/BusinessModelsSection.tsx` → añadir soporte para imagen en cada card.

### Comportamiento esperado

* Header con logo `logo-horizontal.png` enlazando a `/`.

* Hero:

  * Imagen principal `hero-home.jpg`.
  * H1 + subtítulo + CTAs “Reserva Élite” y “Preinscríbete”.
  * 1 columna móvil, 2 columnas desktop.

* Sección “4 formas de vivir Kinesis”:

  * Cards con imagen + texto para:

    * Élite On Demand
    * Ritmo Constante
    * Generación Dance
    * Sí, Quiero Bailar
  * Grid responsive (1 col móvil, 2–4 cols desktop).

### Checklist rápido

* [ ] `pnpm install` y `pnpm dev` OK.
* [ ] Logo gráfico visible en header (mobile + desktop).
* [ ] Hero: imagen + texto + CTAs con botones; layout responsive correcto.
* [ ] BusinessModelsSection: 4 cards con imagen, título, texto y CTA.
* [ ] Sin scroll horizontal en móvil.
* [ ] No se han tocado archivos prohibidos ni añadido librerías nuevas.
