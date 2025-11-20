# PRD T11.1 – Refinamiento Visual Homepage + Integración Assets

## 📋 CONTEXTO

**Tarea:** T11.1 | **Fase:** 4 – Frontend Web | **Dependencias:** T10 (Layout base) + T11 (Homepage MVP)

Elevar la Home de estado "esqueleto funcional" a **landing profesional** con identidad visual de Kinesis, usando Stack-UI + imágenes reales. Sin cambiar flujos ni lógica de datos.

---

## ✅ ALCANCE (IN SCOPE)

### 1. Assets Estáticos

Crear estructura y copiar imágenes a:

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

### 2. Header con Logo (PublicLayout.tsx)

```tsx
<Link to="/" className="flex items-center gap-2">
  <img
    src="/assets/kinesis/logo-horizontal.png"
    alt="Kinesis Dance Studio"
    className="h-8 w-auto"
  />
</Link>
```

En mobile, si no cabe el horizontal, usar `logo-cuadrado.png` con `h-8 w-8`.

### 3. Hero (HeroPrimary.tsx)

**Imagen:** `hero-home.jpg` como imagen principal

**Layout responsive:**
- **Mobile**: 1 columna (texto + CTAs arriba, imagen debajo)
- **Desktop**: `md:grid-cols-2` (texto izquierda, imagen derecha)

**Elementos:**
- H1 + subtítulo con jerarquía clara
- CTAs como `Button` de `shared/ui` (shadcn/ui variants)
- Fondo suave (`bg-gradient-to-b`), espacio vertical (`py-16`/`py-20`)

**CTAs:**
- Primary: "Reserva Élite" → `/horarios-tarifas#elite`
- Secondary: "Preinscríbete" → `/programas#preinscripcion`

### 4. Business Models Section (BusinessModelsSection.tsx)

Añadir imágenes a cada card de modelo:

**Mapeo de imágenes:**
- Élite On Demand → `modelo-elite-on-demand.jpg`
- Ritmo Constante → `modelo-ritmo-constante.jpg`
- Generación Dance → `modelo-generacion-dance.jpg`
- Sí, Quiero Bailar → `modelo-si-quiero-bailar.jpg`

**Layout:**
- **Desktop**: `grid sm:grid-cols-2 xl:grid-cols-4`
- **Mobile**: 1 columna apilada

**Estructura de card:**

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

Cada card: imagen + título + descripción + CTA "Descubrir más" (`Button variant="ghost" size="sm"`).

**En HomeRoute.tsx, crear tipo y datos:**

```typescript
type BusinessModelSummaryUI = BusinessModelSummary & {
  imageSrc?: string;
  imageAlt?: string;
};

const businessModels: BusinessModelSummaryUI[] = [
  {
    slug: "elite-on-demand",
    name: "Élite On Demand",
    imageSrc: "/assets/kinesis/modelo-elite-on-demand.jpg",
    imageAlt: "Bailarín en salto en escenario iluminado",
    // ... resto propiedades
  },
  // ... resto modelos
];
```

### 5. Microcopy y Textos

Ajustar:
- **Eyebrow del hero**: "Bienvenido a Kinesis"
- **Subtítulo**: mensaje de bienestar/movimiento consciente
- **Intro sección**: "4 formas de vivir Kinesis" conectando con los modelos
- Sin lorem ipsum, tono cercano/premium

### 6. Responsive & Accesibilidad

**Breakpoints:** `sm` (≥640px), `md` (≥768px), `lg` (≥1024px)

**Mobile** (~375–414px):
- Hero 1 col, CTAs apiladas, cards una sobre otra

**Tablet** (~768px):
- Hero 2 cols, grid modelos 2×2

**Desktop** (>1024px):
- Hero amplia, grid 4 cols

**Accesibilidad:**
- CTAs ≥44px altura (área pulsable)
- `alt` significativos en todas las imágenes (ej: "Pareja bailando coreografía nupcial", "Bailarín en salto en escenario iluminado")
- Sin scroll horizontal en móvil

---

## ❌ FUERA DE ALCANCE (OUT OF SCOPE)

**NO HACER:**

- ❌ No crear/modificar formularios (contacto, preinscripción, reserva) → T14
- ❌ No integrar API ni React Query (datos siguen estáticos)
- ❌ No cambiar estructura de rutas ni añadir páginas
- ❌ No tocar: `api/**`, `cms/**`, migraciones SQL, esquema BD
- ❌ No modificar: `.replit`, `replit.nix`, `replit.md`, `context/**`
- ❌ No instalar nuevas librerías (MUI, Chakra, framer-motion, sliders, etc.)
- ❌ No eliminar `React.StrictMode`

---

## 📁 ARCHIVOS A MODIFICAR

### Permitidos:

- `web/public/assets/kinesis/*` → copiar imágenes aquí
- `web/src/app/layout/PublicLayout.tsx` → logo en header
- `web/src/app/routes/HomeRoute.tsx` → props con rutas de imágenes
- `shared/components/sections/HeroPrimary.tsx` → layout + imagen
- `shared/components/sections/BusinessModelsSection.tsx` → soporte imagen en cards

### Prohibidos:

- `.replit`, `replit.nix`, `replit.md`, `context/**`, `api/**`, `cms/**`

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Build & Run

- ✅ `pnpm install` sin errores
- ✅ `pnpm dev` arranca API + CMS + Web correctamente

### Header

- ✅ Logo gráfico visible (desktop + mobile)
- ✅ Click → navega a `/`

### Hero

- ✅ Muestra `hero-home.jpg` en desktop
- ✅ Layout: 1 col móvil, 2 cols desktop
- ✅ CTAs son `Button` de `shared/ui`, apilados móvil/línea desktop

### BusinessModelsSection

- ✅ 4 cards con imagen + título + texto + CTA
- ✅ Grid responsive: 1 col mobile, 2–4 cols desktop

### Contenido

- ✅ Sin lorem ipsum
- ✅ Alt texts significativos en todas las imágenes

### UX Responsive

- ✅ Sin scroll horizontal en móvil
- ✅ Botones/CTAs ≥44px altura

### Stack

- ✅ Sin nuevas dependencias
- ✅ Archivos prohibidos intactos

---

## 🎯 REGLAS TÉCNICAS

### Arquitectura

- Mantener monolito: `/api`, `/web`, `/cms`, `/shared`
- `pnpm install` y `pnpm dev` deben funcionar sin errores

### UI/UX Stack-UI Kinesis

- Botones y cards: siempre vía `shared/ui` (shadcn/ui)
- Patrón Launch UI / Serene Yoga:
  - **Hero**: gran bloque entrada con imagen lateral, espacio blanco, copy claro
  - **Sección modelos**: cards limpias, consistentes, bien espaciadas
- Mobile-first: diseñar primero <640px, luego ampliar

### Técnicas

- Reutilizar dependencias existentes
- No cambiar firmas públicas de `HeroPrimary` ni `BusinessModelsSection` (solo añadir props opcionales si necesario)

---

## ✅ CHECKLIST RÁPIDO

- [ ] Assets copiados a `web/public/assets/kinesis/`
- [ ] Logo en header (mobile + desktop)
- [ ] Hero: imagen + texto + CTAs responsive
- [ ] 4 cards modelos con imágenes funcionando
- [ ] Grid responsive correcto en todos los breakpoints
- [ ] Alt texts significativos
- [ ] Sin scroll horizontal móvil
- [ ] CTAs ≥44px altura
- [ ] `pnpm install` y `pnpm dev` OK
- [ ] Sin nuevas dependencias instaladas
- [ ] Archivos prohibidos sin tocar