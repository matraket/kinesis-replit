# PRD T7 – Dashboard y Estructura Base del CMS

## 0. Contexto

Monorepo **Kinesis Web + CMS** (TypeScript + Fastify + React) en Replit, con arquitectura modular/hexagonal y sistema de diseño definido en `context/kinesis-guia-de-implementacion.md`.

T6–T6.2 han dejado listo:

* CMS en `cms/` con React + Vite + Tailwind + shadcn/ui.
* Layout base (Sidebar + Topbar + área de contenido).
* Autenticación mínima basada en `X-Admin-Secret`.
* Theme toggle Light/Dark para el CMS, con preferencia persistida en `localStorage`.

T5 ha expuesto la API de `leads`, `settings` y `legal_pages` (admin + pública).

Este PRD define T7 como **una iteración de producto sobre el CMS**, centrada en: Dashboard con KPIs, componentes base reutilizables y una navegación de CMS coherente con el alcance funcional.

---

## 1. Restricciones críticas

**NO modificar:**

* `context/**` (solo lectura).
* `.replit`, `replit.nix`.
* Estructura de primer nivel: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`.
* Contratos de API ya publicados (`/api/public/**`, `/api/admin/**` de T2–T5). Puedes consumirlos, pero **no** cambiar rutas, tipos ni enums de BD.

**Cambios permitidos:**

* Código de front en `cms/**` (layouts, rutas, componentes, estilos).
* Creación de librería de UI compartida en `shared/ui/**`, siempre que:

  * No rompa el build de `api/` ni de `web/`.
  * Se consuma de momento solo desde `cms/` (la Web lo usará en fases posteriores).

**replit.md:**

* Solo añadir una nota breve de estado de T7. No reordenar, eliminar bloques ni refactorizar el archivo.

---

## 2. Objetivo de T7

1. **Dashboard inicial** en `/admin`:

   * Mostrar KPIs básicos sobre leads recientes y formularios recibidos por tipo (contacto, preinscripción, Élite, boda).
   * Lista de los últimos N leads en formato tabla.

2. **Componentes base reutilizables** en `shared/ui` (consumidos desde el CMS):

   * `DataTable`
   * `FilterSidebar`
   * Componentes de formulario estándar (inputs, selects, layout de formulario).

3. **Gestión de navegación y branding interno del CMS**:

   * Menú lateral definido por configuración (no hardcodeado en JSX).
   * Branding configurable a partir de `settings` (nombre del estudio, logo), con *fallbacks* sensatos.

---

## 3. Dashboard inicial del CMS

### 3.1. Ubicación y rutas

* Ruta protegida por `AuthGuard`: `/admin` → `DashboardRoute`.
* Seguir la estructura de rutas ya existente en `cms/src/app/routes`.

### 3.2. KPIs a mostrar

Usar **únicamente** la API admin de `leads` ya implementada (`GET /api/admin/leads` con filtros) para calcular los indicadores.

KPIs mínimos:

1. **Leads nuevos últimos 7 días**

   * Filtro: `lead_status = 'new'`, `created_at BETWEEN now()-7d AND now()`.
   * Mostrar número total y pequeña etiqueta “últimos 7 días”.

2. **Leads por tipo (últimos 30 días)**

   * Agrupar por `lead_type` (`contact`, `pre_enrollment`, `elite_booking`).
   * Mostrar 3–4 tarjetas tipo `StatsCounter` con:

     * Etiqueta (“Contacto general”, “Preinscripciones”, “Élite / Nupcial”).
     * Número de leads.
     * Icono simple.

3. **Embudo básico (estado de leads)**

   * Contar `lead_status` (`new`, `contacted`, `qualified`, `converted`, `lost`).
   * Mostrar mini gráfico de barras o lista horizontal con etiquetas y número.

4. **Últimos leads**

   * Tabla con los últimos 10–15 leads:

     * Columnas: Fecha, Nombre, Tipo, Estado, Origen (source/utm_campaign), Acción rápida (“Ver en Leads”).
   * Reutilizar el nuevo `DataTable` (ver sección 4).

### 3.3. Comportamiento

* Carga:

  * Mostrar `Skeleton`/spinners mientras se resuelven las peticiones.
  * En caso de error (401 por secret inválido → ya lo maneja la capa de auth), mostrar mensaje “Error al cargar métricas” sin romper el resto de la UI.

* Actualización:

  * Los KPIs se refrescan al entrar en el Dashboard.
  * (Opcional) botón “Actualizar” en la esquina.

* Accesibilidad:

  * Todos los KPIs deben incluir texto alternativo y ser legibles sin depender exclusivamente del color.

---

## 4. Componentes base en `shared/ui`

Crear una pequeña librería de componentes en `shared/ui/**` siguiendo el sistema de diseño (tipografía, radios, espaciados) y los componentes sugeridos en la guía (DataTable, FilterSidebar).

> Nota: en esta fase, **solo** se usarán desde el CMS, pero deben diseñarse pensando también en la futura Web.

### 4.1. `DataTable`

Ubicación sugerida:

* `shared/ui/data-table/DataTable.tsx`
* `shared/ui/data-table/types.ts`

Requisitos:

* Genérico, tipado (`<TData>`).
* Props mínimas: `columns`, `data`, `isLoading`, `onRowClick?`, `page`, `pageSize`, `total`, `onPageChange`.
* Funcionalidades:

  * Ordenación clickando en cabecera (si la columna lo permite).
  * Fila clicable opcional.
  * Paginación básica (siguiente/anterior, nº actual).
  * Estado `empty`: mensaje “Sin datos que mostrar” y CTA opcional.

Estilo:

* Usa tokens de tema (clases Tailwind que ya mapean a colores Admin Light/Dark).
* Cabecera con `bg-admin-surfaceLight`, filas alternas ligeras.
* Altura de filas cómoda para uso de backoffice (mín. 44px).

### 4.2. `FilterSidebar`

Ubicación:

* `shared/ui/filter-sidebar/FilterSidebar.tsx`
* `shared/ui/filter-sidebar/types.ts`

Requisitos:

* Pensado como contenedor de filtros reutilizable (no hardcodear campos de Leads).
* Props mínimas:

  * `sections`: array con secciones de filtros (`title`, `fields`…).
  * `isOpen` / `onToggle` para móvil.
  * `onApply(filters)` y `onReset()`.

Tipos de filtros soportados en T7:

* Checkboxes (ej. tipos de lead).
* Radios (ej. estado).
* Rangos de fechas (desde/hasta).

Layout:

* En desktop: panel lateral izquierdo o derecho fijo.
* En móvil: panel deslizante tipo *drawer*.

### 4.3. Formularios estándar

Crear un pequeño set de helpers:

* `Form`: wrapper con título, descripción, distribución en columnas.
* `FormField`: etiqueta, input, mensaje de error.
* `FormActions`: zona para botones primario/secundario.

Estos componentes se usarán primero en:

* Futuras vistas de edición (T8–T9).
* Formularios pequeños del Dashboard (p.ej. filtros rápidos).

---

## 5. Navegación y branding CMS

Basado en la estructura de menú definida para el CMS (Panel de inicio, Contenido Web, Formularios y Leads, etc.).

### 5.1. Configuración centralizada de navegación

Crear un archivo de configuración (por ejemplo `cms/src/app/config/navigation.ts`) que exporte un árbol de navegación:

* Grupos:

  * `panel` → “Dashboard”.
  * `contenido` → “Programas”, “Instructores”, “Modelos de negocio”, “Páginas”, “FAQs”.
  * `operacion` → “Leads”.
  * `configuracion` → “Ajustes”.
* Cada entrada incluye:

  * `id`, `label`, `path`, `icon`, `section` (para agrupar), `isEnabled` (por si se quieren ocultar rutas futuras).

El `Sidebar` del CMS debe leer **solo** de esta configuración; nada de menú hardcodeado dentro del JSX.

### 5.2. Branding interno

Aprovechar la tabla `settings` y la API admin correspondiente para obtener:

* `site.name` (nombre comercial de Kinesis).
* `site.logo.cms` (URL de logo para el CMS, si existe).

Comportamiento:

* En la parte superior del sidebar, mostrar:

  * Logo (si hay `site.logo.cms`, si no iniciales “Kinesis”).
  * Nombre del centro.
  * Subtítulo “CMS”.

* Si la llamada a `settings` falla:

  * Usar fallback `"Kinesis"` y texto “CMS”.

> Importante: no crear nuevas claves ni tablas; solo consumir `settings` tal y como se definió en T5.

---

## 6. Arquitectura y ficheros afectados

Resumen de cambios esperados:

* `shared/ui/**`

  * `data-table/…`
  * `filter-sidebar/…`
  * `form/…` (o similar)

* `cms/src/app/layout/AdminLayout.tsx`

  * Adaptar para leer el menú desde `navigation.ts`.
  * Usar componentes `DataTable`/`FilterSidebar` donde proceda (p.ej. lado Leads en futuras tareas; para T7 solo en Dashboard/table).

* `cms/src/app/routes/DashboardRoute.tsx` (nombre aproximado)

  * Implementar KPIs y tabla de últimos leads, consumiendo `adminApi`.

* `cms/src/app/api/adminApi.ts`

  * Asegurarse de que existen helpers para `getLeads` con filtros y `getSettings`.
  * No cambiar la forma en que se inyecta el `X-Admin-Secret`.

* `docs/CHANGELOG.md`

  * Añadir entrada para T7 (Dashboard + shared/ui).

* `replit.md`

  * Nota corta indicando que T7 ha creado el dashboard básico y los componentes compartidos.

---

## 7. Testing y criterios de aceptación

### 7.1. Tests recomendados

* Tests de componentes (Vitest + Testing Library) para:

  * `DataTable`: render con datos, estado vacío, ordenación básica.
  * `FilterSidebar`: renderización de filtros y callbacks de `onApply`/`onReset`.

* Tests de integración ligeros (si ya hay infraestructura):

  * Dashboard que renderiza KPIs con datos *mockeados* de `adminApi`.

### 7.2. Checklist de aceptación

* [ ] `/admin` muestra un Dashboard con:

  * [ ] Nº de leads nuevos últimos 7 días.
  * [ ] Nº de leads por tipo últimos 30 días.
  * [ ] Estado embudo básico (por `lead_status`).
  * [ ] Tabla con últimos leads (mínimo columnas Fecha, Nombre, Tipo, Estado).
* [ ] `DataTable` y `FilterSidebar` viven en `shared/ui/**` y se usan desde el CMS.
* [ ] El sidebar del CMS se alimenta exclusivamente de una configuración de navegación.
* [ ] El branding del CMS muestra nombre del estudio y logo (o fallback) usando `settings`.
* [ ] El theme toggle Light/Dark sigue funcionando y todos los nuevos componentes respetan los tokens de tema.
* [ ] No se han modificado `.replit`, `replit.nix`, `context/**` ni contratos de API.
* [ ] El proyecto compila y los workflows existentes siguen funcionando en Replit.
