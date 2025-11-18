# PRD T6.1 – Aplicar Sistema de Diseño Kinesis al CMS

## Objetivo
Aplicar el sistema de diseño definido en `context/kinesis-guia-de-implementacion.md` al CMS existente en `cms/`. Esta es una iteración **solo visual** sobre el CMS funcional de T6.

## Restricciones Críticas

**NO MODIFICAR:**
- `context/**`, `.replit`, `replit.nix`
- Estructura de primer nivel (`api/`, `web/`, `cms/`, `core/`, etc.)
- Endpoints backend ni lógica de auth/HTTP client
- Rutas o funcionalidad del CMS (solo estilos)

**SOLO MODIFICAR:**
- Archivos dentro de `cms/` (configuración Tailwind, componentes React, estilos CSS)
- T6.1 no debe crear nuevas rutas ni componentes funcionales, solo estilizar los existentes en `cms/`.

**replit.md:**
- Añadir solo una nota breve en estado de T6/T6.1 (no borrar ni reordenar)

## Referencia de Diseño
Consultar `context/kinesis-guia-de-implementacion.md` para:
- Paleta "Admin" (Admin Navy, Admin Surface, Admin Accent Pink, etc.)
- Tipografía: Montserrat (display) + Inter (body)
- Espaciado (múltiplos de 8px), radios y alturas de componentes

## Tareas

### 1. Configurar Tema Tailwind (`cms/tailwind.config.*`)
Extender tema con tokens del sistema de diseño:
- **Colores**: `admin.navy`, `admin.surface`, `admin.surfaceLight`, `admin.accent`, `admin.border`, `admin.muted`, `admin.white`, `admin.success`, `admin.warning`, `admin.error`, `admin.info`
- **Tipografía**: `fontFamily.display` (Montserrat), `fontFamily.body` (Inter)
- **Radios**: `lg: 8px`, `xl: 12px`
- **Espaciado**: escala de 8px (2, 4, 6, 8, 12, 16)

### 2. Tipografía Global
- Importar **Montserrat** e **Inter** desde Google Fonts en `cms/index.html`
- Aplicar `font-body` (Inter) globalmente en `body`
- Crear clases para títulos (H1-H4) con Montserrat según guía
- Títulos principales usan `font-display`, navegación/textos usan `font-body`

### 3. Layout: Sidebar + Topbar + Content
**Sidebar:**
- Fondo: `bg-admin-navy`
- Texto: `text-admin-muted` / `text-white`
- Activo: `bg-admin-surface` + borde/marker `bg-admin-accent`
- Hover: `bg-admin-surface` con `transition-colors`

**Topbar:**
- Fondo: `bg-admin-surfaceLight`
- Texto: `text-admin-white` / `text-admin-muted`
- Botón logout: secundario con `border-admin-border`, hover `bg-admin-surface`

**Contenido:**
- Fondo: `bg-slate-950` o `bg-admin-navy`
- Cards: `bg-admin-surface`, `rounded-xl`, `shadow-md`, `p-6`
- Focus: outline púrpura `#8B5CF6` para accesibilidad

### 4. Componentes Base (`cms/src/ui/` o similar)
Crear o estilizar:

**Button:**
- Altura ~48px, `rounded-lg`, `px-6`, `font-medium`
- Variantes: `primary` (bg `admin-accent`), `secondary` (border `admin-border`), `ghost`
- Hover con transición suave

**Card:**
- `bg-admin-surface`, `rounded-xl`, `shadow-md`, `p-6`

**Input/TextArea:**
- Altura ~48px, `rounded-lg`, `border-admin-border`
- Focus: ring púrpura

Reemplazar botones/inputs actuales por estos componentes.

### 5. Pantallas Clave

**Login (/admin/login):**
- Fondo: `bg-admin-navy`
- Card central: `bg-admin-surface`, sombra suave
- Título con Montserrat
- Botón primary, errores en `text-admin-error`

**Dashboard (/admin):**
- Título con Montserrat
- Card de bienvenida con nota info (`bg-admin-surfaceLight` + borde `admin-info`)

**Placeholders (Programas, Instructores, etc.):**
- Título H2 Montserrat
- Texto "En construcción" en `text-admin-muted` dentro de card

### 6. Responsive
- Sidebar colapsable en móvil (ajustar colores/espaciados)
- Tipografía y paddings según breakpoints de guía
- Transiciones suaves en hover/focus
- Focus visible accesible

## Criterios de Aceptación
- [ ] Paleta Admin aplicada (sidebar oscuro, contenido claro, acentos según estados)
- [ ] Montserrat + Inter cargadas y aplicadas
- [ ] Cards, botones, inputs con diseño consistente según guía
- [ ] Navegación con colores y estados hover/active correctos
- [ ] Responsive funcional (móvil, tablet, desktop)
- [ ] Sin errores TypeScript/ESLint
- [ ] Backend no modificado
- [ ] `context/**`, `.replit`, `replit.nix` no modificados
- [ ] `replit.md` actualizado solo con nota breve