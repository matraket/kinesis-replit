# PRD T10 – Configuración Web, Stack-UI y Layout Base

## 🚨 RESTRICCIONES CRÍTICAS (NO NEGOCIABLES)

### NO puedes:
- Modificar ni borrar nada bajo `context/**`
- Cambiar estructura de carpetas de primer nivel: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`
- Modificar `.replit`, `replit.nix` o `replit.md`
- Romper endpoints existentes: `GET /`, `GET /health`, `/api/public/**`, `/api/admin/**`
- Crear ni modificar tablas, migraciones SQL o tipos/enums
- Tocar código de `api/**` (solo lectura)
- Eliminar `React.StrictMode` de ningún entrypoint
- Crear carpetas de debug (`attached_assets/`, `Pasted-*`)
- Mantener `pnpm install` y `pnpm dev` funcionando sin degradar T0–T9

### ❌ EXPRESAMENTE PROHIBIDO EN T10 (OUT OF SCOPE):
- Formularios públicos funcionales (contacto, preinscripción, newsletter, etc.) → T14
- Integrar Web con API pública T2 (no `fetch`, no React Query, no hooks de datos) → T11–T13
- Implementar WYSIWYG, Media Library o integración con Replit App Storage → T8
- Formularios complejos con tabs o layouts avanzados de contenido editable → T12–T14
- Añadir dependencias pesadas (editores, prosemirror, TipTap, DOMPurify, Media Library, analytics, etc.)
- Animaciones avanzadas o microinteracciones complejas
- SEO avanzado (meta tags dinámicos, sitemap, OG/meta) → T16

---

## 🎯 OBJETIVO

Crear la **infraestructura visual y técnica de la Web pública** (`web/`):
1. App React + Vite + TypeScript + Tailwind coherente con el monolito
2. Integrar **Stack-UI Kinesis**: reutilizar `shared/ui` (shadcn/ui) + crear secciones Landing (Hero, Features, Pricing, FAQ, Footer)
3. Layout público (`PublicLayout`) con Header + Nav + Footer, **mobile-first**
4. Ruteo público con placeholders para 9 páginas principales
5. **SIN contenido real ni integración con API** → solo esqueleto responsive

---

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR

### En `web/`:

```
web/
├── index.html
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    └── app/
        ├── layout/
        │   └── PublicLayout.tsx
        └── routes/
            ├── PublicRouter.tsx
            ├── HomeRoute.tsx
            ├── AboutRoute.tsx
            ├── BusinessModelsRoute.tsx
            ├── ProgramsRoute.tsx
            ├── ProgramDetailRoute.tsx
            ├── TeamRoute.tsx
            ├── SchedulePricingRoute.tsx
            ├── LegalNoticeRoute.tsx
            └── PrivacyPolicyRoute.tsx
```

### En `shared/components/sections/`:

```
shared/components/sections/
├── HeroPrimary.tsx
├── FeatureGridSection.tsx
├── PricingSection.tsx
├── FaqSection.tsx
└── FooterSection.tsx
```

### Archivos a MODIFICAR:
- `tailwind.config.*` → añadir `web/**/*.{ts,tsx,js,jsx}` al `content`
- `package.json` (raíz) → solo si faltan deps mínimas para `web/` (sin borrar scripts existentes)

---

## 🔧 ESPECIFICACIONES TÉCNICAS

### 1. `web/src/main.tsx`

Debe montar:

```tsx
<React.StrictMode>
  <BrowserRouter>
    <PublicRouter />
  </BrowserRouter>
</React.StrictMode>
```
```

**Restricciones**:
- NO añadir providers de React Query ni lógica de datos
- Si existe ThemeProvider compartido, se puede usar (sin nuevas dependencias)

### 2. PublicLayout (Shell principal)

**Estructura base**:

```tsx
<div className="min-h-screen flex flex-col bg-background text-foreground">
  <Header />
  <main className="flex-1">
    <Outlet />
  </main>
  <FooterSection />
</div>
```

**Header**:
- Logo "Kinesis" (texto por ahora)
- Menú con links a rutas públicas
- CTA principal (ej. "Preinscríbete") apuntando a `/programas` o `/horarios-tarifas`

**Responsive**:
- **Mobile**: botón hamburger (Sheet/Dialog shadcn/ui) → menú vertical
- **Desktop**: navegación horizontal visible

### 3. PublicRouter - Rutas públicas

Definir con `Routes`/`Route` o `useRoutes`:

- `/` → `HomeRoute`
- `/quienes-somos` → `AboutRoute`
- `/modelos-de-negocio` → `BusinessModelsRoute`
- `/programas` → `ProgramsRoute`
- `/programas/:slug` → `ProgramDetailRoute`
- `/equipo` → `TeamRoute`
- `/horarios-tarifas` → `SchedulePricingRoute`
- `/legal/aviso` → `LegalNoticeRoute`
- `/legal/privacidad` → `PrivacyPolicyRoute`

**Cada página debe**:
- Usar `<PublicLayout />` como layout raíz
- Renderizar un `<h1>` semántico con título de página
- Contener breve descripción placeholder en `div` con `container` + spacing
- Texto ejemplo: "Esta página se completará en T11–T14"

### 4. Secciones en `shared/components/sections/`

**HeroPrimary**:
- Layout 1 columna mobile, 2 columnas (texto + imagen placeholder) desktop
- Título, subtítulo, 1-2 CTAs (botones sin funcionalidad real)

**FeatureGridSection**:
- Grid responsive de 3-4 features (icono + título + texto)

**PricingSection**:
- 3-4 cards de precios
- Un plan marcado como "recomendado" (badge)

**FaqSection**:
- Acordeón con `Accordion` de shadcn/ui (Radix)
- Varias Q&A estáticas

**FooterSection**:
- Nombre del estudio, año
- Enlaces a secciones legales
- Redes sociales placeholder

**Todos los componentes**:
- Viven en `shared/components/sections/`
- Usan `shared/ui` (Button, Card, Accordion, etc.) + Tailwind

### 5. Mobile-First y Responsive

**Siempre usar**:
- `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` para contenido principal
- Layout `flex flex-col min-h-screen` en raíz

**Mobile** (<640px):
- Secciones en 1 columna
- Menú colapsado en header

**Desktop**:
- Hero y secciones en 2 columnas donde tenga sentido
- Inspiración: patrones Launch UI / Serene Yoga

### 6. Configuración Tailwind

- Incluir `web/**/*.{ts,tsx,js,jsx}` en `content` del config
- Asegurar variables CSS globales disponibles: `--background`, `--foreground`, `--brand`, `--radius`, etc.
- Alineadas con paleta Kinesis ya usada en CMS

---

## 📦 DEPENDENCIAS

**Principios**:
- Reutilizar versiones existentes: `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `@tanstack/react-query`, `react-hook-form`, `zod`, shadcn/ui
- Solo instalar paquetes mínimos de plantilla Vite React TS si faltan

**Permitidos** (si faltan):
- `@vitejs/plugin-react-swc` (o el que ya use `cms/`)
- Paquetes mínimos de Vite React TS que no estén ya en el monolito

**Prohibidos**:
- WYSIWYG, ProseMirror, TipTap, DOMPurify, Media Library, analytics, etc.

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Obligatorios:
- ✅ `pnpm install` en raíz termina sin errores
- ✅ `pnpm dev` levanta API + CMS + Web sin romper nada existente
- ✅ Se puede navegar a todas las rutas y renderizan sin errores JS:
  - `/`, `/quienes-somos`, `/modelos-de-negocio`, `/programas`, `/programas/:slug`, `/equipo`, `/horarios-tarifas`, `/legal/aviso`, `/legal/privacidad`
- ✅ Header responsive:
  - Móvil: hamburger + menú deslizante funcional
  - Desktop: nav horizontal visible
- ✅ No se han modificado `.replit`, `replit.nix`, `replit.md`, `context/**`
- ✅ No se ha eliminado `React.StrictMode`
- ✅ No se han añadido dependencias prohibidas (WYSIWYG/Media Library)
- ✅ Secciones `HeroPrimary`, `FeatureGridSection`, `PricingSection`, `FaqSection`, `FooterSection` creadas y compilando
- ✅ Sin scroll horizontal en mobile/tablet/desktop
- ✅ Textos legibles, header usable en todos los breakpoints

### Opcionales:
- ✅ `PublicLayout` incluye lógica "scroll to top" al cambiar ruta
- ✅ `FooterSection` expone placeholders para redes sociales y contacto
- ✅ README en `web/` explicando cómo arrancar solo la Web

---

## 📝 ENTREGABLES

- Carpeta `web/` configurada y compilando
- `tailwind.config.*` actualizado con `web/**/*`
- `PublicLayout` + `PublicRouter` + 9 páginas placeholder operativas
- 5 secciones en `shared/components/sections/` compilando
- Navegación responsive funcional
- Sin errores en `pnpm install` ni `pnpm dev`

---

## 📌 NOTAS FINALES

- Se mantienen todas las restricciones críticas (sección 🚨 completa)
- Especificaciones técnicas concretas con ejemplos de código cerrados correctamente
- Explícito con el OUT OF SCOPE para evitar scope creep
- La estructura de archivos está completamente detallada
- Los criterios de aceptación son verificables
- Se han eliminado redundancias pero mantenido toda la información esencial
- La extensión es manejable (~200 líneas) pero completa para ejecución exitosa