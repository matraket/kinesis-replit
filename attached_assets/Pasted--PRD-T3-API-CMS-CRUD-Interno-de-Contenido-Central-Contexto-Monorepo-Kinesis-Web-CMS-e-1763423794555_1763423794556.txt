# PRD T3 – API CMS (CRUD Interno de Contenido Central)

**Contexto:** Monorepo Kinesis Web + CMS en TypeScript sobre Fastify. Implementar API interna de administración sobre el modelo de datos existente (T1/T2).

---

## RESTRICCIONES OBLIGATORIAS

### Archivos y estructura NO modificables
- **NO** tocar `context/**` (solo lectura)
- **NO** cambiar estructura de primer nivel: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`
- **NO** modificar `.replit` ni `replit.nix`
- **NO** romper endpoints existentes: `GET /`, `GET /health`, `/api/public/**`

### replit.md
- Puedes leer para entender convenciones
- **NO** eliminar secciones, reordenar o refactorizar el archivo
- Solo añadir pequeñas notas de estado sin alterar estructura

### Base de datos
- Modelo conceptual en `context/kinesis-database-schema.sql`
- Migraciones existentes: `01_init_core_schema.sql`, `02_public_api_schema.sql`
- Solo crear nueva migración (`03_cms_admin_schema.sql`) si es estrictamente necesaria
- Migraciones deben ser incrementales
- No eliminar ni renombrar columnas usadas por API pública T2

### Stack técnico
- Node + TypeScript + Fastify + Zod
- Arquitectura hexagonal en capas: `api/domain/**`, `api/application/**`, `api/infrastructure/**`, `api/interfaces/**`
- Al implementar T3, reutiliza en la medida de lo posible las entidades, DTOs, repositorios y esquemas Zod ya definidos para la API pública T2, extendiéndolos solo cuando sea necesario. Evita duplicar modelos o crear variantes paralelas para admin/público si se pueden compartir.

---

## OBJETIVO

Crear API interna (`/api/admin/**`) para gestión CRUD de:
- `specialties`
- `instructors`
- `programs` (con relaciones a specialties e instructors)
- `pricing_tiers`

**NO incluye:** frontend CMS, autenticación completa (T6), gestión de `page_content`/`faqs`/`legal_pages` (T4/T5)

---

## ARQUITECTURA

Organizar en: `api/interfaces/http/admin/` con subcarpetas `controllers/`, `schemas/`, `routes/`

Router principal: `registerAdminRoutes` montado en `/api/admin`

**Capas afectadas:**
- `api/domain/**`: usar entidades existentes
- `api/application/use-cases/**`: crear casos de uso CRUD
- `api/infrastructure/db/**`: ampliar repos con create/update/delete
- `api/interfaces/http/admin/**`: nueva capa para controladores admin

---

## ENDPOINTS Y VALIDACIONES

### Specialties

GET /api/admin/specialties (filtros: isActive, category)
GET /api/admin/specialties/:id
POST /api/admin/specialties
PUT /api/admin/specialties/:id
DELETE /api/admin/specialties/:id

**Validaciones:**
- `code`: único, no vacío
- `name`: no vacío
- No borrar si vinculada a programs/instructors (error claro)

### Instructors

GET /api/admin/instructors (filtros: isActive, showOnWeb)
GET /api/admin/instructors/:id
POST /api/admin/instructors
PUT /api/admin/instructors/:id
DELETE /api/admin/instructors/:id

**Validaciones:**
- `displayName`, `role`: obligatorios
- No borrar si asociado a programas activos

### Programs

GET /api/admin/programs (filtros: businessModelId, specialtyId, isActive)
GET /api/admin/programs/:id
POST /api/admin/programs
PUT /api/admin/programs/:id (incluir asignación specialties/instructors)
DELETE /api/admin/programs/:id

**Validaciones:**
- Debe pertenecer a `business_model` válido
- Tener al menos una `specialty` asociada
- `slug` único y estable
- Controlar `isActive`/`publicationStatus` para no romper API pública

### Pricing Tiers

GET /api/admin/pricing-tiers
GET /api/admin/pricing-tiers/:id
POST /api/admin/pricing-tiers
PUT /api/admin/pricing-tiers/:id
DELETE /api/admin/pricing-tiers/:id

**Validaciones:**
- `price` > 0
- `program_id` o `business_model_id` deben existir
- Controlar borrado si está marcado como recomendado

---

## REGLAS DE NEGOCIO

1. **Integridad referencial:** No crear/actualizar con referencias inexistentes. Controlar borrados con dependencias.
2. **Estados de publicación:** `is_active`, `publication_status`, `show_on_web` afectan a API pública T2 - no romper esa lógica.
3. **Slugs:** Son URLs en API pública - permitir cambio pero con cautela.

---

## SEGURIDAD

- Endpoints para CMS, no para usuarios anónimos
- No obligatorio integrar Replit Auth completo en T3
- Encapsular lógica de autorización (hook/preHandler Fastify) preparado para T6
- Si usas `X-Admin-Secret` temporal, documentar que se revisará en T6

---

## REQUISITOS NO FUNCIONALES

- Reutilizar entidades, repos y tipos existentes
- No duplicar lógica - mantener reglas en domain/application
- Paginar listados (programs, instructors, pricing_tiers)
- Logs básicos (método, ruta, resultado) sin datos sensibles
- **No convertir campos textuales flexibles como `role` (instructors) o futuras `category` en enums TypeScript rígidos que limiten los valores posibles. Usa strings (y, como mucho, literales recomendados) de forma compatible con el esquema SQL.**
- 
---

## TESTING

**Tests de dominio:**
- No crear programa sin `business_model_id` válido
- No borrar specialty en uso
- Precio > 0

**Tests de integración:**
- Al menos 1 flujo CRUD completo en `programs`: POST → GET → PUT → DELETE
- Tests básicos en 1-2 recursos más (specialties o pricing_tiers)

---

## CRITERIOS DE ACEPTACIÓN

- [ ] Endpoints CRUD funcionales para specialties, instructors, programs, pricing_tiers bajo `/api/admin/**`
- [ ] Validación Zod en todos los endpoints (body, params)
- [ ] Reglas de integridad respetadas (relaciones, estados)
- [ ] API pública T2 sigue funcionando sin errores
- [ ] 1-2 tests de dominio + 1 flujo CRUD integración pasando
- [ ] Documentación en `docs/api-admin-endpoints.md` y entrada en `docs/CHANGELOG.md`