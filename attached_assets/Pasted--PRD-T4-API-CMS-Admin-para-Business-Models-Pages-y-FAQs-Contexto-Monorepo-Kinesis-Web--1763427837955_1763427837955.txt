# PRD T4 – API CMS Admin para Business Models, Pages y FAQs

## Contexto
Monorepo **Kinesis Web + CMS** en TypeScript/Fastify con arquitectura hexagonal.
Implementar API admin CMS para `business_models`, `page_content` y `faqs` reutilizando infraestructura de T2/T3.

---

## RESTRICCIONES CRÍTICAS (No Negociables)

### Archivos Prohibidos
- **NO modificar**: `context/**` (solo lectura), `.replit`, `replit.nix`
- **NO cambiar estructura** de carpetas primer nivel: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`
- **NO romper endpoints** existentes: `GET /`, `GET /health`, `/api/public/**` (T2), `/api/admin/**` (T3: specialties, instructors, programs, pricing_tiers)
- **replit.md**: solo añadir pequeñas notas sin eliminar/reordenar secciones

### Base de Datos
- **Esquema existente**: `scripts/sql/01_init_core_schema.sql`, `scripts/sql/02_public_api_schema.sql`
- **NO crear migraciones** salvo estrictamente necesario
- **NO crear tablas duplicadas** (nada tipo `public_business_models` o `page_content_public`)
- Si migración imprescindible: solo incremental (`04_cms_content_schema.sql`) sin recrear/eliminar columnas existentes

### Arquitectura
- **Stack**: Node + TypeScript + Fastify + Zod
- **Patrón**: Hexagonal (Clean) - `api/domain/`, `api/application/`, `api/infrastructure/`, `api/interfaces/`
- **REUTILIZAR**: Entidades, repositorios, controladores, schemas de T2/T3 - **NO duplicar modelos**

---

## OBJETIVO

Crear API admin bajo `/api/admin/**` para CRUD de:
1. **Business Models** (`business_models`) - 4 pilares estratégicos
2. **Page Content** (`page_content`) - Contenido páginas estáticas
3. **FAQs** (`faqs`) - Preguntas frecuentes

**Garantizar**: API pública T2 sigue consumiendo las mismas tablas/entidades sin cambios de contrato.
**Garantizar**: en T4 no se crean nuevos endpoints públicos (`/api/public/**`), solo endpoints internos de administración bajo `/api/admin/**`.

---

## ENDPOINTS REQUERIDOS

### 1. Business Models (`/api/admin/business-models`)

**Tabla**: `business_models` (existente)  
**Campos clave**: `internal_code`, `name`, `subtitle`, `description`, `feature_*`, `advantage_*`, `benefit_*`, `is_active`, `show_on_web`, `display_order`, `slug`, `meta_*`

#### Endpoints
- `GET /api/admin/business-models` - Filtros: `isActive`, `showOnWeb`. Paginación: `page`/`limit`
- `GET /api/admin/business-models/:id`
- `POST /api/admin/business-models`
- `PUT /api/admin/business-models/:id`
- `DELETE /api/admin/business-models/:id`

#### Reglas de Negocio
- **Contenido Crítico**: NO permitir DELETE de los 4 modelos estratégicos por `internal_code`:
  - `elite_on_demand`, `ritmo_constante`, `generacion_dance`, `si_quiero_bailar`
  - Al intentar borrarlos: devolver error de dominio (`BusinessRuleViolation`)
  - Alternativa: permitir `is_active=false` o `show_on_web=false`
- `internal_code`: único y estable
- `slug`: único (cuidado: cambio rompe URLs públicas)

#### Validación Zod
- `name`: obligatorio, longitud razonable
- `description`: no vacía
- `display_order`: integer >= 0
- `isActive`, `showOnWeb`: boolean
- **NO usar enums rígidos** para `target_audience`, `format` (mantener strings flexibles)

---

### 2. Page Content (`/api/admin/pages`)

**Tabla**: `page_content` (existente)  
**Campos clave**: `page_key`, `page_title`, `content_html`, `content_json`, `sections` (JSONB), `hero_image_url`, `gallery_images`, `video_url`, `status` (enum `publication_status`), `slug`, `meta_*`, `version`

#### Endpoints
- `GET /api/admin/pages` - Filtros: `status` (draft/published/archived), `pageKey`. Paginación
- `GET /api/admin/pages/:id`
- `GET /api/admin/pages/by-key/:pageKey`
- `POST /api/admin/pages`
- `PUT /api/admin/pages/:id`
- `DELETE /api/admin/pages/:id`

#### Reglas de Negocio
- **Contenido Crítico**: NO permitir DELETE de páginas con `page_key` protegidas:
  - Ejemplos: `home`, `about-us`, `business-models`
  - Devolver error de dominio
  - Alternativa: `status='archived'` o `status='draft'`
- `page_key`: clave lógica única y estable (no cambiar a la ligera)
- `status`: solo valores `'draft' | 'published' | 'archived'`
- API pública T2 solo sirve `status='published'`
- Versionado: mantener coherencia sin sistema complejo

#### Validación Zod
- `page_key`: string no vacío, kebab-case, sin espacios
- `page_title`: obligatorio
- `sections`: JSON estructurado `{ type: string; content: any }[]` (si existe en T2)
- `status`: restringido a `'draft' | 'published' | 'archived'`

---

### 3. FAQs (`/api/admin/faqs`)

**Tabla**: `faqs` (existente)  
**Campos**: `question`, `answer`, `category` (VARCHAR flexible), `tags` (TEXT[]), `program_id`, `business_model_id`, `is_active`, `is_featured`, `display_order`, `view_count`, `helpful_count`

#### Endpoints
- `GET /api/admin/faqs` - Filtros: `category`, `isActive`, `businessModelId`, `programId`. Paginación
- `GET /api/admin/faqs/:id`
- `POST /api/admin/faqs`
- `PUT /api/admin/faqs/:id`
- `DELETE /api/admin/faqs/:id`

#### Reglas de Negocio
- `category`: texto flexible (ej: `'general'`, `'enrollment'`, `'schedule'`, `'payment'`)
  - **CRÍTICO**: NO convertir a enum TypeScript rígido - usar string con valores recomendados
- Relaciones: `business_model_id`, `program_id` deben apuntar a recursos existentes (si informados)
- Contenido crítico: tests deben verificar que no se borra última FAQ activa de categoría clave

#### Validación Zod
- `question`, `answer`: obligatorias
- `category`: string longitud razonable, NO enum cerrado
- `tags`: array de strings
- `display_order`: integer >= 0
- `is_active`, `is_featured`: boolean

---

## ARQUITECTURA DE CÓDIGO

### Capas Afectadas

#### `api/domain/**`
- Reutilizar/completar entidades: `BusinessModel`, `PageContent`, `Faq`
- Value-objects solo si aportan valor (ej: `Slug` si ya existe)

#### `api/application/**`
Casos de uso por recurso:
- Business Models: `CreateBusinessModel`, `UpdateBusinessModel`, `DeleteBusinessModel`, `ListBusinessModelsForAdmin`, `GetBusinessModelById`
- Page Content: `CreatePageContent`, `UpdatePageContent`, `DeletePageContent`, `ListPagesForAdmin`, `GetPageContentById`, `GetPageContentByKey`
- FAQs: `CreateFaq`, `UpdateFaq`, `DeleteFaq`, `ListFaqsForAdmin`, `GetFaqById`
- **Extender interfaces de repositorio T2** con métodos de escritura

#### `api/infrastructure/db/**`
- Extender repos Postgres existentes con métodos insert/update/delete
- Consistentes con lógica T2

#### `api/interfaces/http/admin/**`
- `schemas/`: Zod DTOs para admin
- `controllers/`: Fastify handlers
- `routes/`: registrar rutas bajo router admin
- Conectar con casos de uso `application`

---

## SEGURIDAD

- Todos endpoints bajo `/api/admin/**` protegidos
- Reutilizar mecanismo T3: cabecera `X-Admin-Secret` o abstracción auth admin existente
- Secret desde variable entorno (no hardcoded)

---

## TESTING Y CRITERIOS DE ACEPTACIÓN

### Tests de Dominio (Mínimos)
- No permitir borrar `business_model` crítico sin error de dominio
- No permitir borrar `page_content` con `page_key` crítico sin control
- Validar `status` de `page_content` solo acepta `draft/published/archived`
- Validar `category` en FAQs acepta valores nuevos sin romper

### Tests de Integración
- Al menos 1 flujo CRUD completo (`business_models` o `page_content`):
  - `POST` → `GET` → `PUT` → `DELETE` (o intento fallido si crítico)
- Crear/listar FAQs por categoría
- Verificar API pública T2 sigue sirviendo datos correctos tras cambios admin

### Checklist Aceptación
- [ ] Endpoints CRUD funcionales para `business_models`, `page_content`, `faqs` bajo `/api/admin/**`
- [ ] API pública T2 funciona sin cambios de contrato
- [ ] No hay tablas duplicadas
- [ ] Reglas y tests impiden borrado accidental de contenido crítico
- [ ] Validación Zod en todos endpoints
- [ ] Mínimo 2 tests de dominio + 1 flujo CRUD integración
- [ ] Documentación actualizada: `docs/api-admin-endpoints.md` y `docs/CHANGELOG.md`

---

## REQUISITOS NO FUNCIONALES

- Reutilizar entidades, repos, tipos de T2/T3 - NO duplicar lógica
- Reglas de negocio en `domain`/`application`, NO en controladores
- Paginación en listados
- Logging básico: método, ruta, resultado (sin datos sensibles)
- NO convertir campos textuales flexibles en enums TypeScript rígidos