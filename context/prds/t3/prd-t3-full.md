## PRD T3 – API CMS (CRUD Interno de Contenido Central)

Estás trabajando en el monorepo **Kinesis Web + CMS**, un monolito modular en TypeScript que corre en Replit.
Tu tarea es **T3: API CMS (CRUD interno de contenido central)** sobre el mismo modelo de datos que ya usa la **API pública de lectura (T2)**.

---

### 0. Restricciones Globales (OBLIGATORIO LEER)

Estas reglas son **obligatorias** y refuerzan lo que ya está en `replit.md`:

1. **Ficheros y estructura que NO puedes tocar o romper**

   * **NO** modifiques ni borres nada bajo `context/**`. Es **solo lectura** (documentación funcional y modelo de datos).
   * **NO** cambies la estructura de carpetas de primer nivel:

     * `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`.
   * **NO** modifiques `.replit` ni `replit.nix` en esta tarea.
   * **NO** rompas los endpoints ya existentes:

     * `GET /`
     * `GET /health`
     * Endpoints públicos de T2 bajo `/api/public/**`.

2. **replit.md (NO BORRAR BLOQUES NI REFACTORIZAR EL ARCHIVO)**

   * Puedes **leer** `replit.md` para entender convenciones, arquitectura y tareas.
   * **NO** puedes:

     * Eliminar secciones, reordenar todo el archivo o “refactorizarlo” completo.
     * Cambiar títulos o la estructura principal de bloques.
   * Solo se permite añadir **pequeñas notas de estado** donde el propio `replit.md` lo tolere, sin alterar la estructura global.

3. **Base de Datos y migraciones**

   * El modelo conceptual está descrito en `context/kinesis-database-schema.sql`.
   * El esquema base está ya creado por:

     * `scripts/sql/01_init_core_schema.sql`
     * `scripts/sql/02_public_api_schema.sql`
   * Para T3:

     * **Solo crea nuevas migraciones si son estrictamente necesarias**.
     * Si necesitas una nueva migración, usa `scripts/sql/03_cms_admin_schema.sql` (o similar).
     * La migración debe ser **incremental** (no recrear tipos ni tablas existentes).
     * No elimines ni renombres columnas usadas por la API pública T2.

4. **Scope general de T3**

   * T3 se centra en la **API interna de administración** bajo un prefijo tipo `/api/admin/**`.
   * Endpoints **CRUD** (create, read, update, delete) para contenido central:

     * `specialties`
     * `instructors`
     * `programs` (y sus relaciones con `specialties` e `instructors`)
     * `pricing_tiers`
   * Son endpoints para ser consumidos por el **CMS (backoffice)**, no por la web pública.

5. **Stack técnico**

   * Utiliza el mismo stack y arquitectura que T2:

     * Node + TypeScript.
     * Fastify para HTTP.
     * Zod para validación.
     * Arquitectura en capas / hexagonal:

       * `api/domain/**`
       * `api/application/**`
       * `api/infrastructure/**`
       * `api/interfaces/**`
   * Sigue los patrones ya usados en la API pública:

     * Repositorios en `api/application/ports` + implementaciones Postgres en `api/infrastructure/db/**`.
     * Casos de uso en `api/application/use-cases/**`.
     * Controladores + esquemas Zod + rutas en `api/interfaces/http/**`.

---

### 1. Objetivo de T3

Exponer una **API interna de administración (CMS)** que permita a usuarios autorizados:

* Gestionar el catálogo de Kinesis:

  * Especialidades (`specialties`).
  * Instructores (`instructors`).
  * Programas (`programs`) y sus relaciones.
  * Pricing tiers (`pricing_tiers`).
* Mantener la coherencia con:

  * El modelo de dominio definido en T1.
  * El esquema SQL ya desplegado.
  * La API pública de T2 (no romper contratos de lectura).

La T3 **no construye el frontend del CMS** (eso es FASE 3 / T6+), solo prepara la capa de API interna.

---

### 2. Alcance (In / Out)

#### 2.1. In Scope

* Rutas bajo un prefijo tipo `/api/admin/**`.
* CRUD completo para:

  * `specialties`
  * `instructors`
  * `programs` (incluyendo asignación de `specialties` e `instructors`)
  * `pricing_tiers`
* Casos de uso en `api/application` de:

  * create / update / delete / list / getById / getBySlug (según recurso).
* Validación de cuerpos de petición y respuestas con Zod.
* Tests:

  * Tests de dominio (reglas mínimas de integridad).
  * Tests de integración para al menos **un flujo CRUD completo** (crear → leer → actualizar → borrar) por recurso o, como mínimo, para `programs`.

#### 2.2. Out of Scope

* Gestión de `page_content`, `faqs`, `legal_pages` en T3 (eso se cubre en T4/T5).
* Diseño de la UI del CMS (`cms/`) y componentes React.
* Integración completa con Replit Auth / sesiones de usuario (T6).
* Optimización avanzada de performance o paginación muy compleja (puede quedar para iteraciones posteriores).

---

### 3. Suposiciones y dependencias

* T0: entorno base y servidor Fastify ya están operativos.
* T1: dominio + repos base + esquema SQL inicial implementados.
* T2: API pública de lectura `/api/public/**` está implementada y funcionando contra la BD actual.
* La BD PostgreSQL de Replit está provisionada y las migraciones `01` y `02` ya se han ejecutado.
* Los datos de ejemplo insertados para T2 pueden usarse para probar los CRUD de T3.

---

### 4. Arquitectura de alto nivel para T3

1. **Capas afectadas**

   * `api/domain/**`

     * Entidades ya existentes: `Specialty`, `Instructor`, `Program`, `PricingTier`.
     * Puede ser necesario añadir value-objects simples o enums suaves (sin romper la flexibilidad del SQL).
   * `api/application/**`

     * Casos de uso por recurso:

       * `CreateSpecialty`, `UpdateSpecialty`, `DeleteSpecialty`, `ListSpecialties`, `GetSpecialtyById`.
       * Análogos para `Instructor`, `Program`, `PricingTier`.
   * `api/infrastructure/db/**`

     * Implementaciones de repositorios ya existentes ampliadas con métodos `create/update/delete`.
   * `api/interfaces/http/admin/**`

     * Nueva capa para controladores, esquemas Zod y rutas de `/api/admin`.

2. **Organización sugerida para admin**

   * `api/interfaces/http/admin/`

     * `controllers/`
     * `schemas/`
     * `routes/`
   * Un router principal admin (`registerAdminRoutes`) montado con el prefijo `/api/admin`.

---

### 5. Requisitos funcionales por recurso

#### 5.1. Specialties (CRUD básico)

**Objetivo:** gestionar el catálogo de especialidades (clásico, contemporáneo, urbano, infantil, etc.) usado por programas e instructores.

* **Endpoints sugeridos**

  * `GET   /api/admin/specialties`

    * Lista todas las especialidades (con filtros básicos opcionales: `isActive`, `category`).
  * `GET   /api/admin/specialties/:id`
  * `POST  /api/admin/specialties`
  * `PUT   /api/admin/specialties/:id`
  * `DELETE /api/admin/specialties/:id`

* **Validaciones mínimas**

  * `code`: único y no vacío.
  * `name`: no vacío.
  * No se puede borrar una especialidad si está vinculada a programas o instructores (debe devolver error de negocio claro).

#### 5.2. Instructors (CRUD)

**Objetivo:** gestión de fichas de instructores y su visibilidad en web.

* **Endpoints sugeridos**

  * `GET   /api/admin/instructors` (con filtros: `isActive`, `showOnWeb`...)
  * `GET   /api/admin/instructors/:id`
  * `POST  /api/admin/instructors`
  * `PUT   /api/admin/instructors/:id`
  * `DELETE /api/admin/instructors/:id`
  * Opcionalmente, endpoints específicos para gestionar relaciones con especialidades:

    * `POST /api/admin/instructors/:id/specialties` (añadir relación)
    * `DELETE /api/admin/instructors/:id/specialties/:specialtyId`

* **Validaciones mínimas**

  * `displayName`, `role`: obligatorios.
  * Flags `showOnWeb`, `showInTeamPage`: control para que CMS decida visibilidad.
  * No permitir borrar un instructor asociado a programas activos sin una regla clara (por ejemplo: forzar antes a desasignar del programa).

#### 5.3. Programs + relaciones

**Objetivo:** mantener el catálogo de programas y sus relaciones con modelos de negocio, especialidades e instructores.

* **Endpoints sugeridos**

  * `GET   /api/admin/programs` (con filtros: `businessModelId`, `specialtyId`, `isActive`).
  * `GET   /api/admin/programs/:id`
  * `POST  /api/admin/programs`
  * `PUT   /api/admin/programs/:id`
  * `DELETE /api/admin/programs/:id`
  * Endpoints auxiliares de relaciones (pueden ser parte del `PUT` o rutas dedicadas):

    * Asignar / desasignar `specialties` a un programa.
    * Asignar / desasignar `instructors` a un programa.

* **Validaciones de negocio**

  * Un `program` debe:

    * Pertenecer a un `business_model` válido.
    * Tener al menos una `specialty` asociada.
  * Validar que `slug` es único y estable (no cambiarlo alegremente si ya se usa en la API pública).
  * Controles básicos sobre `isActive` / `publicationStatus` para no romper la Web pública.

#### 5.4. Pricing Tiers

**Objetivo:** gestionar las tarifas asociadas a programas y/o modelos de negocio.

* **Endpoints sugeridos**

  * `GET   /api/admin/pricing-tiers`
  * `GET   /api/admin/pricing-tiers/:id`
  * `POST  /api/admin/pricing-tiers`
  * `PUT   /api/admin/pricing-tiers/:id`
  * `DELETE /api/admin/pricing-tiers/:id`

* **Validaciones mínimas**

  * `price` > 0.
  * `program_id` o `business_model_id` deben apuntar a recursos existentes.
  * No permitir borrar un `pricing_tier` si está marcado como recomendado en la Web sin una lógica clara (puede bastar con desactivar antes).

---

### 6. Reglas de negocio y coherencia con la API pública

1. **Estados de publicación**

   * Campos tipo `is_active`, `publication_status`, `show_on_web` se editan por CMS:

     * La API pública T2 filtra usando esos campos.
     * T3 no debe romper esa lógica; solo la gestiona.

2. **Integridad referencial**

   * No permitir:

     * Crear un programa con `business_model_id` inexistente.
     * Crear pricing tiers apuntando a programas inexistentes.
   * Manejar de forma controlada los intentos de borrado con dependencias.

3. **Slugs y URLs**

   * Slugs (`programs.slug`, `instructors.slug`, etc.) son identificadores de URL usados en `/api/public/**`.
   * Cambiarlos debe ser posible, pero con cautela; si se cambia un slug, la Web pública dejará de encontrar ese recurso por el slug anterior.

---

### 7. Seguridad / Protecciones mínimas

* Estos endpoints son para el CMS, no para usuarios anónimos.
* En T3 **no es obligatorio integrar aún Replit Auth completo**, pero:

  * Deja preparado el código para añadir autenticación después (T6).
  * Como mínimo, encapsula la lógica de autorización en un lugar claro (por ejemplo, un hook o preHandler de Fastify) que pueda sustituirse después por un chequeo real de usuario/sesión.

*(Si decides establecer un guardado temporal tipo `X-Admin-Secret` desde variables de entorno, documenta claramente que es temporal y se revisará en T6.)*

---

### 8. Requisitos no funcionales (NFR)

* **Consistencia con T2**:

  * Reutilizar entidades, repos y tipos que ya existen.
  * No duplicar lógica que pueda vivir en `domain` o `application`; no meter reglas complejas en los controladores.
* **Performance razonable**:

  * Paginar listados de `programs`, `instructors` y `pricing_tiers`.
* **Observabilidad**:

  * Logs básicos en endpoints admin (método, ruta, resultado).
  * No loguear datos sensibles.

---

### 9. Testing y criterios de aceptación

#### 9.1. Tests

* **Tests de dominio**

  * Casos típicos:

    * No se puede crear un programa sin `business_model_id` válido.
    * No se puede borrar una especialidad en uso (programs/instructors).
    * Precio debe ser > 0.
* **Tests de integración**

  * Al menos **un flujo CRUD completo** probado end-to-end, preferiblemente sobre `programs`:

    * `POST /api/admin/programs` → `GET` → `PUT` → `DELETE`.
  * Tests básicos también para:

    * Un CRUD sencillo de `specialties` o `pricing_tiers`.

#### 9.2. Criterios de aceptación

T3 se considera completada cuando:

* [ ] Existen endpoints CRUD funcionales para `specialties`, `instructors`, `programs` y `pricing_tiers` bajo `/api/admin/**`.
* [ ] Todos los endpoints validan la entrada (body, params) con Zod.
* [ ] Las reglas de integridad básicas se respetan (no se rompen relaciones ni estados de publicación).
* [ ] La API pública T2 sigue funcionando correctamente (sin errores 500 ni cambios de contrato).
* [ ] Hay al menos 1–2 tests de dominio y 1 flujo CRUD de integración pasando.
* [ ] Se ha documentado brevemente la API admin (por ejemplo, en `docs/api-admin-endpoints.md`) y se ha añadido entrada en `docs/CHANGELOG.md` indicando los cambios de T3.

