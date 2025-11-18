# PRD T6.1 – Refinar Estilos del CMS según Guía de Diseño Kinesis

## 1. Contexto

El CMS en `cms/` ya está funcionando (T6):

* React + Vite + TS + Tailwind + shadcn/ui
* Autenticación basada en `X-Admin-Secret`
* Rutas `/admin/login`, `/admin`, `/admin/*` con `AuthGuard`
* Layout base con Sidebar + Topbar + contenido

**Problema actual**: el CMS usa estilos por defecto (Tailwind/shadcn) y **no refleja** el sistema de diseño definido en `context/kinesis-guia-de-implementacion.md` para el panel de administración (paleta Admin, tipografía Montserrat/Inter, etc.).

T6.1 es una **iteración visual** sobre el CMS existente. No debe cambiar rutas, lógica de auth ni API.

---

## 2. Restricciones Críticas

* **NO modificar**:

  * `context/**`, `.replit`, `replit.nix`
  * Estructura de primer nivel (`api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`)
* **NO tocar**:

  * Endpoints backend (`/`, `/health`, `/api/public/**`, `/api/admin/**`)
  * Lógica de auth/HTTP client ya implementada en T6
* **replit.md**:

  * Solo añadir una breve nota en la sección de estado de T6/T6.1 (sin borrar ni reordenar bloques)
* **Ámbito de T6.1**:

  * SOLO cambios dentro de `cms/` (Tailwind, componentes React, estilos, layout)
  * NO crear nuevas rutas ni vistas funcionales de CRUD (eso es T7–T9)

---

## 3. Objetivo

Aplicar el **sistema de diseño del CMS Admin** definido en `context/kinesis-guia-de-implementacion.md` al shell actual:

* Paleta “Admin” (Admin Navy, Admin Surface, Admin Accent Pink, etc.)
* Tipografía Montserrat (display) + Inter (body)
* Escala de espaciado (múltiplos de 8px) y radios/alturas de componentes base (botones, cards, inputs)
* Layout admin coherente, limpio y responsive.

---

## 4. Alcance y Tareas

### 4.1. Configuración de Tema Tailwind

**Objetivo**: que todos los colores, fuentes y radios provengan de la configuración de Tailwind (no hex sueltos por el código).

Tareas:

1. Editar `cms/tailwind.config.*` para extender el tema con los tokens:

   ```ts
   theme: {
     extend: {
       colors: {
         admin: {
           navy: '#020617',
           surface: '#0F172A',
           surfaceLight: '#111827',
           accent: '#FB2F72',
           border: '#1E293B',
           muted: '#64748B',
           white: '#FFFFFF',
           success: '#10B981',
           warning: '#F59E0B',
           error: '#EF4444',
           info: '#38BDF8',
         },
       },
       fontFamily: {
         display: ['Montserrat', 'system-ui', 'sans-serif'],
         body: ['Inter', 'system-ui', 'sans-serif'],
       },
       borderRadius: {
         lg: '8px',
         xl: '12px',
       },
       spacing: {
         2: '8px',
         4: '16px',
         6: '24px',
         8: '32px',
         12: '48px',
         16: '64px',
       },
     },
   }
   ```

2. Asegurar que Tailwind escanea todos los archivos de `cms/src/**` (globs correctos).

3. (Opcional) Definir `boxShadow` para cards (`shadow-md` equivalente).

### 4.2. Tipografía Global

Tareas:

1. Importar **Montserrat** y **Inter** en `cms/index.html` (Google Fonts o similar).

2. En el CSS global (`cms/src/index.css` o similar):

   * `body` → `font-family: theme('fontFamily.body')`
   * Clases utilitarias para títulos (ej. `.heading-1`, `.heading-2`) alineadas con los tamaños:

     * H1 móvil/desktop, H2, H3, H4 según guía.

3. Asegurar que:

   * Títulos principales del Dashboard usan Montserrat (`font-display`).
   * Navegación, textos de tabla y formularios usan Inter (`font-body`).

### 4.3. Theming del Layout (Sidebar + Topbar + Content)

Tareas:

1. **Sidebar (`AdminLayout`)**:

   * Fondo: `bg-admin-navy`
   * Texto: `text-admin-muted` y `text-white` donde aplique.
   * Elemento activo: fondo `bg-admin-surface`, borde/marker con `bg-admin-accent`.
   * Hover: leve cambio de fondo (`bg-admin-surface/hover`) y transición `transition-colors`.

2. **Topbar**:

   * Fondo: `bg-admin-surfaceLight`
   * Texto: `text-admin-white`/`text-admin-muted`
   * Botón “Cerrar sesión”: botón secundario con borde `border-admin-border` y hover `bg-admin-surface`.

3. **Contenido principal**:

   * Fondo general: `bg-slate-950` o combinación `bg-admin-navy` + tarjeta central `bg-admin-surface`.
   * Sección central del Dashboard en `card`: `bg-admin-surface`, `rounded-xl`, `shadow-md`, `p-6` (24px).

4. Estados:

   * Añadir estados `hover`, `focus-visible:outline` con acento púrpura (`#8B5CF6`) para accesibilidad y coherencia con la guía.

### 4.4. Componentes Base: Botones, Inputs, Cards

Tareas:

1. Crear un pequeño set de componentes UI en `cms/src/ui/` (o similar):

   * `Button`:

     * Altura fija ~48px, `rounded-lg`, `px-6`, `font-medium`.
     * Variantes: `primary` (bg `admin.accent`), `secondary` (border `admin.border`), `ghost`.
     * Hover: ligera elevación/oscurecimiento.

   * `Card`:

     * `bg-admin-surface`, `rounded-xl`, `shadow-md`, `p-6`.

   * `Input` / `TextArea`:

     * Altura ~48px, `rounded-lg`, `border-admin-border`, foco con `ring` púrpura.

2. Reemplazar los botones/inputs “raw” actuales del login y dashboard por estos componentes.

3. Mantener compatibilidad con shadcn/ui: **puede reutilizar** los componentes pero estilizarlos via `className` y tokens del tema.

### 4.5. Pantallas clave

**Login (/admin/login):**

* Fondo general oscuro (`bg-admin-navy`).
* Card central con `bg-admin-surface`, sombra suave, bordes redondeados.
* Título “Acceso al CMS de Kinesis” con Montserrat.
* Botón “Entrar” con `primary button` y hint del secret (sin mostrar nunca el valor).
* Mensajes de error con `text-admin-error`.

**Dashboard (/admin):**

* Título y subtítulo siguiendo la guía (tipografía, espaciado).
* Card principal con mensaje de bienvenida, “Note” en tono info (`bg-admin-surfaceLight` + borde `admin-info`).

**Placeholders de secciones (Programas, Instructores, etc.):**

* Cada vista debe tener:

  * Título H2 con Montserrat.
  * Texto “En construcción” en tono `admin-muted` dentro de una card.

No hace falta implementar DataTable real, pero dejar el layout preparado para que T7–T9 puedan “sustituir” el contenido.

### 4.6. Responsive & Microinteracciones Básicas

Tareas:

1. Asegurar que:

   * Sidebar colapsable en móvil (ya existe, solo ajustar colores/espaciados).
   * Tipografía y paddings respetan los breakpoints de la guía (mobile / tablet / desktop).

2. Microinteracciones mínimas (no todo el listado de la guía):

   * Transición suave `transition` en hover de botones y elementos de navegación.
   * Focus visible y accesible (outline púrpura).
   * Spinner/loading coherente en botones si ya está implementado.

---

## 5. Requisitos No Funcionales

* No introducir dependencias nuevas salvo que sean necesarias para fuentes (Google Fonts) y se integren sólo en `cms/`.
* No duplicar constantes de color/tipografía; todo debe venir del `tailwind.config`.
* Mantener la app sin errores de TypeScript/ESLint.
* Mantener tiempos de build aceptables (no abusar de CSS global custom si se puede hacer con utilidades Tailwind).

---

## 6. Criterios de Aceptación

* [ ] El CMS en `/admin` utiliza la paleta Admin (sidebar oscuro, contenido claro, acentos rosas/verde/ambar/rojo/azul según estados).
* [ ] Tipografías Montserrat (display) + Inter (body) cargadas y aplicadas globalmente.
* [ ] Login y Dashboard presentan cards, botones e inputs con diseño consistente (altura, radios, sombras) según la guía.
* [ ] Navegación lateral y topbar usan el esquema de colores y estados hover/active definidos.
* [ ] El CMS es usable y legible en móvil, tablet y desktop (sin desbordes graves ni layouts rotos).
* [ ] No se han creado ni modificado endpoints backend.
* [ ] No se ha modificado `.replit`, `replit.nix` ni `context/**`.
* [ ] `replit.md` actualizado solo con una nota breve de estado de T6.1.
