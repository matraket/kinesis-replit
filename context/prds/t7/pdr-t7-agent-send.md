# PRD T7 – Dashboard y Estructura Base del CMS

## Contexto
Monorepo Kinesis Web + CMS en Replit con arquitectura modular/hexagonal.
- T6: CMS base en `cms/` con React + Vite + Tailwind + shadcn/ui, Layout (Sidebar + Topbar), Auth `X-Admin-Secret`, Theme toggle Light/Dark
- T5: API de `leads`, `settings`, `legal_pages` (admin + pública)
- Sistema de diseño definido en `context/kinesis-guia-de-implementacion.md`

## Restricciones Críticas

**NO MODIFICAR:**
- `context/**` (solo lectura)
- `.replit`, `replit.nix`
- Estructura raíz: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`
- Contratos API existentes `/api/public/**`, `/api/admin/**` (no cambiar rutas, tipos, enums)

**PERMITIDO:**
- Código front en `cms/**`
- Crear librería UI en `shared/ui/**` (consumida solo desde CMS por ahora)

**replit.md:**
- Solo añadir nota breve de estado T7, sin reordenar/eliminar bloques

## Objetivo de T7

1. **Dashboard inicial** en `/admin`:
   - KPIs básicos sobre leads (recientes, por tipo, por estado)
   - Tabla últimos N leads

2. **Componentes base reutilizables** en `shared/ui`:
   - `DataTable`
   - `FilterSidebar`
   - Componentes formulario (inputs, selects, layout)

3. **Navegación y branding CMS**:
   - Menú lateral desde configuración (no hardcodeado)
   - Branding desde API `settings` con fallbacks

## Dashboard (/admin)

### Ruta
- Protegida por `AuthGuard`: `/admin` → `DashboardRoute`

### KPIs (usar API `GET /api/admin/leads` con filtros)

1. **Leads nuevos últimos 7 días**
   - Filtro: `lead_status = 'new'`, `created_at` últimos 7 días
   - Mostrar número + etiqueta "últimos 7 días"

2. **Leads por tipo (últimos 30 días)**
   - Agrupar por `lead_type`: `contact`, `pre_enrollment`, `elite_booking`
   - 3 tarjetas con etiqueta, número, icono

3. **Embudo por estado**
   - Contar por `lead_status`: `new`, `contacted`, `qualified`, `converted`, `lost`
   - Mini gráfico barras o lista horizontal

4. **Tabla últimos 10-15 leads**
   - Columnas: Fecha, Nombre, Tipo, Estado, Origen (source/utm_campaign), Acción
   - Usar nuevo `DataTable`

### Comportamiento
- Skeleton/spinners durante carga
- Error sin romper UI
- Refresh al entrar (opcional: botón "Actualizar")
- Accesibilidad: texto alternativo, no depender solo de color

## Componentes shared/ui

### 4.1 DataTable
**Ubicación:** `shared/ui/data-table/DataTable.tsx` + `types.ts`

**Props:**
```typescript
interface DataTableProps<TData> {
  columns: Column<TData>[]
  data: TData[]
  isLoading: boolean
  onRowClick?: (row: TData) => void
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}
```

**Funcionalidades:**

- Genérico tipado `<TData>`
- Ordenación clickando cabecera (si columna lo permite)
- Fila clicable opcional
- Paginación básica (siguiente/anterior, nº actual)
- Estado empty: mensaje "Sin datos" + CTA opcional

**Estilo:**

- Tokens tema (Tailwind Admin Light/Dark)
- Cabecera `bg-admin-surfaceLight`, filas alternas
- Altura fila mín. 44px

### 4.2 FilterSidebar

**Ubicación:** `shared/ui/filter-sidebar/FilterSidebar.tsx` + `types.ts`

**Props:**

```typescript
interface FilterSidebarProps {
  sections: FilterSection[]
  isOpen: boolean
  onToggle: () => void
  onApply: (filters: any) => void
  onReset: () => void
}
```

**Tipos filtros soportados:**

- Checkboxes
- Radios
- Rangos fechas (desde/hasta)

**Layout:**

- Desktop: panel lateral fijo
- Móvil: drawer deslizante

### 4.3 Formularios

**Helpers básicos:**

- `Form`: wrapper con título, descripción, columnas
- `FormField`: etiqueta, input, error
- `FormActions`: botones primario/secundario

---

## Navegación y Branding

### 5.1 Configuración navegación

**Archivo:** `cms/src/app/config/navigation.ts`

**Estructura:**

```typescript
{
  groups: [
    { id: 'panel', label: 'Dashboard', path: '/admin', icon: '...', section: '...', isEnabled: true },
    { id: 'contenido', items: [
      { label: 'Programas', path: '/admin/programs', ... },
      { label: 'Instructores', path: '/admin/instructors', ... },
      // ... Modelos, Páginas, FAQs
    ]},
    { id: 'operacion', items: [
      { label: 'Leads', path: '/admin/leads', ... }
    ]},
    { id: 'configuracion', items: [
      { label: 'Ajustes', path: '/admin/settings', ... }
    ]}
  ]
}
```

**Importante:** Sidebar debe leer SOLO de esta configuración (no hardcodear en JSX)

### 5.2 Branding

Usar API `settings` para obtener:

- `site.name` (nombre comercial)
- `site.logo.cms` (URL logo CMS)

**Mostrar en sidebar superior:**

- Logo (si hay `site.logo.cms`, sino iniciales "Kinesis")
- Nombre centro
- Subtítulo "CMS"

**Fallback:** Si falla API → "Kinesis" + "CMS"

**IMPORTANTE:** NO crear nuevas claves/tablas, solo consumir settings de T5

---

## Archivos Afectados

```
shared/ui/
├── data-table/
│   ├── DataTable.tsx
│   └── types.ts
├── filter-sidebar/
│   ├── FilterSidebar.tsx
│   └── types.ts
└── form/
    ├── Form.tsx
    ├── FormField.tsx
    ├── FormActions.tsx
    └── types.ts

cms/src/app/
├── config/
│   └── navigation.ts
├── layout/
│   └── AdminLayout.tsx (adaptar para leer navigation.ts)
├── routes/
│   └── DashboardRoute.tsx (nuevo)
└── api/
    └── adminApi.ts (helpers getLeads, getSettings)

docs/
└── CHANGELOG.md (añadir entrada T7)

replit.md (nota corta T7)
```

---

## Testing

**Tests recomendados:**

- `DataTable`: render, vacío, ordenación
- `FilterSidebar`: render filtros, callbacks
- `Dashboard`: KPIs con datos mockeados

---

## Criterios de Aceptación

- ✅ `/admin` muestra Dashboard con:
  - Leads nuevos últimos 7 días
  - Leads por tipo últimos 30 días
  - Embudo por estado
  - Tabla últimos leads (Fecha, Nombre, Tipo, Estado)
- ✅ `DataTable` y `FilterSidebar` en `shared/ui/**` usados desde CMS
- ✅ Sidebar CMS lee configuración navegación
- ✅ Branding CMS muestra nombre/logo desde settings (o fallback)
- ✅ Theme toggle Light/Dark funciona, componentes respetan tokens
- ✅ NO modificados: `.replit`, `replit.nix`, `context/**`, contratos API
- ✅ Proyecto compila, workflows funcionan