## PRD T4 – API CMS para Modelos de Negocio, Páginas y FAQs

Estás trabajando en el monorepo **Kinesis Web + CMS**, un monolito modular en TypeScript que corre en Replit.
Tu tarea es **T4: API CMS para Modelos de Negocio, Páginas y FAQs** sobre el modelo de datos ya definido en T1/T2.

---

### 0. Restricciones globales (OBLIGATORIO LEER)

#### 0.1. Archivos y estructura NO modificables

Debes respetar estrictamente estas reglas:

* **NO** tocar nada bajo `context/**`

  * Es **solo lectura** (documentación funcional y modelo de datos conceptual).
* **NO** cambiar la estructura de carpetas de primer nivel:

  * `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`.
* **NO** modificar `.replit` ni `replit.nix` en esta tarea.
* **NO** romper endpoints existentes:

  * `GET /`
  * `GET /health`
  * API pública de T2 bajo `/api/public/**`
  * API admin ya creada en T3 bajo `/api/admin/**` para specialties, instructors, programs, pricing_tiers.

#### 0.2. replit.md

* Puedes **leer** `replit.md` para entender arquitectura, tareas y convenciones.
* **NO** puedes:

  * Eliminar secciones.
  * Reordenar completamente el archivo.
  * “Refactorizarlo” entero.
* Solo se permite añadir **pequeñas notas de estado o aclaraciones** en los bloques ya previstos, sin alterar la estructura global.

#### 0.3. Base de datos

* Esquema conceptual de referencia: `context/kinesis-database-schema.sql`. 
* Esquema real actual en la BD de Replit:

  * `scripts/sql/01_init_core_schema.sql`
  * `scripts/sql/02_public_api_schema.sql`

En T4:

* **Evita crear nuevas migraciones** si no es imprescindible; el esquema de:

  * `business_models`
  * `page_content`
  * `faqs`
    ya está definido y es suficiente para T4.
* Si, y solo si, fuera estrictamente necesario, crea una migración incremental nueva (p. ej. `scripts/sql/04_cms_content_schema.sql`) que:

  * **No** recree tablas ya existentes.
  * **No** elimine ni renombre columnas usadas por T2/T3.
  * Solo añada campos/índices adicionales necesarios para T4.

#### 0.4. Stack técnico y arquitectura

* Stack:

  * Node + TypeScript.
  * Fastify para HTTP.
  * Zod para validación.
* Arquitectura hexagonal / Clean:

  * `api/domain/**`
  * `api/application/**`
  * `api/infrastructure/**`
  * `api/interfaces/**`
* Debes **reutilizar** patrones y componentes de T2/T3:

  * Entidades de dominio para `BusinessModel`, `PageContent`, `Faq` (si ya existen).
  * Repositorios e interfaces de T2 para estos recursos.
  * Estilo de controladores, Zod schemas y rutas ya usado en `/api/admin/**`.

---

### 1. Objetivo de T4

Crear una **API interna de CMS** bajo `/api/admin/**` para gestionar:

* Modelos de negocio (`business_models`): los 4 pilares (Élite On Demand, Ritmo Constante, Generación Dance, Sí Quiero Bailar). 
* Contenido de páginas estáticas (`page_content`): Quiénes somos, modelos de negocio, home, etc. 
* FAQs (`faqs`): preguntas frecuentes por categorías y asociadas opcionalmente a modelos de negocio y programas. 

Y **garantizar** que:

* La API pública T2 sigue consumiendo **exactamente estas mismas tablas y entidades**, sin duplicar modelos ni crear tablas paralelas para el mismo contenido.

---

### 2. Alcance de T4 (scope)

#### 2.1. In Scope

* Endpoints CRUD bajo `/api/admin/**` para:

  * `business_models`
  * `page_content`
  * `faqs`
* Casos de uso en `api/application`:

  * create / read / update / delete / list para cada recurso.
* Validación exhaustiva con Zod en:

  * Cuerpos de petición (`POST`, `PUT`, `PATCH`).
  * Parámetros de ruta (`:id`, `:slug`).
* Reglas de negocio para **proteger contenido crítico**:

  * No borrar accidentalmente modelos de negocio estratégicos.
  * No borrar páginas clave del sitio.
  * No dejar la Web sin FAQs de categorías básicas.
* Tests:

  * Tests de dominio para reglas de “contenido crítico”.
  * Tests de integración para comprobar que las rutas admin funcionan y que T2 sigue respondiendo bien tras cambios.

#### 2.2. Out of Scope

* CRUD de `legal_pages`, `settings`, `media_library`, etc. (eso irá en otras tareas).
* Cambios en la UI del CMS (`cms/`).
* Integración definitiva con Replit Auth (se abordará en T6).

---

### 3. Arquitectura y organización de código

#### 3.1. Capas afectadas

* `api/domain/**`

  * Reutilizar y/o completar entidades de dominio de:

    * `BusinessModel` (basado en tabla `business_models`). 
    * `PageContent` (basado en `page_content`). 
    * `Faq` (basado en `faqs`). 
  * Añadir value-objects ligeros solo cuando realmente aporten (por ejemplo, un VO para `Slug` si ya existe por T2).

* `api/application/**`

  * Nuevos casos de uso orientados a CMS para cada recurso (por ejemplo):

    * Business Models:

      * `CreateBusinessModel`
      * `UpdateBusinessModel`
      * `DeleteBusinessModel`
      * `ListBusinessModelsForAdmin`
      * `GetBusinessModelById` (y/o `GetBusinessModelBySlug`)
    * Page Content:

      * `CreatePageContent`
      * `UpdatePageContent`
      * `DeletePageContent`
      * `ListPagesForAdmin`
      * `GetPageContentById` / `GetPageContentByKey`
    * FAQs:

      * `CreateFaq`
      * `UpdateFaq`
      * `DeleteFaq`
      * `ListFaqsForAdmin`
      * `GetFaqById`
  * Reutilizar interfaces de repositorio ya creadas para T2, extendiéndolas con métodos de escritura.

* `api/infrastructure/db/**`

  * Extender implementaciones Postgres existentes:

    * Repositorio de `business_models`.
    * Repositorio de `page_content`.
    * Repositorio de `faqs`.
  * Añadir métodos de escritura (insert/update/delete) consistentes con la lógica de T2.

* `api/interfaces/http/admin/**`

  * Crear o extender:

    * `schemas/` (Zod) para DTOs de admin.
    * `controllers/` (Fastify handlers) para endpoints `/api/admin/**`.
    * `routes/` para registrar todas las rutas de T4 bajo el router admin.
  * Conectar estos controladores con los casos de uso de `application`.

#### 3.2. Reutilización y no duplicación

* **No dupliques modelos**:

  * Usa las mismas entidades y DTOs (o DTOs derivados) que en T2 para `BusinessModel`, `PageContent` y `Faq`.
  * Si necesitas campos extra para admin (por ejemplo, flags de borrado seguro), extiende los DTOs de admin, pero sin crear estructuras paralelas completamente distintas.
* **No crees tablas nuevas** para reflejar “copias” de estas entidades (nada tipo `public_business_models` o `page_content_public`).

---

### 4. Recursos y endpoints (detalle)

#### 4.1. Business Models (`business_models`)

**Tabla existente:** `business_models`
Campos clave (resumen): `internal_code`, `name`, `subtitle`, `description`, bloques de contenido (`feature_*`, `advantage_*`, `benefit_*`), flags `is_active`, `show_on_web`, `display_order`, `meta_*`, `slug`.

##### Endpoints admin sugeridos

* `GET   /api/admin/business-models`

  * Filtros opcionales:

    * `isActive`
    * `showOnWeb`
  * Paginación simple (page/limit).
* `GET   /api/admin/business-models/:id`
* `POST  /api/admin/business-models`
* `PUT   /api/admin/business-models/:id`
* `DELETE /api/admin/business-models/:id`

##### Reglas de negocio

* `internal_code`:

  * Debe ser único y estable (p. ej. `elite_on_demand`, `ritmo_constante`).
* `slug`:

  * Único, no obligatorio cambiarlo salvo que el usuario lo requiera.
  * La API pública T2 probablemente lo usa para URLs → cambiarlo puede romper links; documentar esta implicación.
* **Contenido crítico**:

  * Los 4 modelos principales (por su `internal_code`) deben considerarse “no borrables” por defecto:

    * `elite_on_demand`
    * `ritmo_constante`
    * `generacion_dance`
    * `si_quiero_bailar`
  * Si se intenta borrarlos:

    * El caso de uso debe devolver un error de dominio claro (por ejemplo, `BusinessRuleViolation`).
    * Opcional: permitir marcar `is_active = false` o `show_on_web = false`, pero no borrar filas.

##### Validación Zod (entrada)

* `name`: obligatorio, longitud razonable.
* `description`: no vacía.
* `display_order`: entero >= 0.
* Flags booleanos coherentes (`isActive`, `showOnWeb`).
* No convertir campos tipo `target_audience`, `format` en enums rígidos; mantenerlos como strings. 

---

#### 4.2. Page Content (`page_content`)

**Tabla existente:** `page_content`
Campos clave: `page_key`, `page_title`, `content_html`, `content_json`, `sections` (JSONB), media (`hero_image_url`, `gallery_images`, `video_url`), `status` (enum `publication_status`), `slug`, `meta_*`, versionado básico.

##### Endpoints admin sugeridos

* `GET   /api/admin/pages`

  * Filtros:

    * `status` (draft/published/archived).
    * `pageKey`.
* `GET   /api/admin/pages/:id`
* `GET   /api/admin/pages/by-key/:pageKey` (para localizar páginas por clave lógica).
* `POST  /api/admin/pages`
* `PUT   /api/admin/pages/:id`
* `DELETE /api/admin/pages/:id` (con restricciones de contenido crítico).

##### Reglas de negocio

* `page_key`:

  * Es la **clave lógica** (p. ej. `home`, `about-us`, `business-models`…).
  * Debe ser única y estable; no se debería cambiar a la ligera.
* `status` (`publication_status`):

  * `draft` / `published` / `archived`.
  * La API pública T2 solo debe servir contenido con `status = 'published'`.
* Versionado:

  * Se pueden usar los campos `version` / `published_version` para futuras evoluciones; en T4, basta con mantener la coherencia, sin implementar un sistema complejo de versionado si no es necesario.

##### Contenido crítico

* Ciertas páginas no deberían borrarse fácilmente (solo despublicarse):

  * Ejemplos: `home`, `about-us`, `business-models` (ajusta según tus claves reales en DB).
* Reglas sugeridas:

  * Intentar borrar una página con `page_key` dentro de un conjunto “protegido”:

    * Devuelve error de dominio.
    * Ofrece alternativa de marcar `status = 'archived'` o `status = 'draft'` en lugar de borrado duro.

##### Validación Zod

* `page_key`: string no vacío, formato simple (kebab-case, sin espacios).
* `page_title`: obligatorio.
* `sections`: validar como JSON estructurado simple (opcionalmente con shape `{ type: string; content: any }[]` si ya lo tienes en T2).
* `status`: restringido a `'draft' | 'published' | 'archived'`.

---

#### 4.3. FAQs (`faqs`)

**Tabla existente:** `faqs`
Campos: `question`, `answer`, `category` (texto flexible), `tags` (TEXT[]), opcionales `program_id`, `business_model_id`, flags `is_active`, `is_featured`, `display_order`, métricas (`view_count`, `helpful_count`).

##### Endpoints admin sugeridos

* `GET   /api/admin/faqs`

  * Filtros:

    * `category`
    * `isActive`
    * `businessModelId`, `programId`
* `GET   /api/admin/faqs/:id`
* `POST  /api/admin/faqs`
* `PUT   /api/admin/faqs/:id`
* `DELETE /api/admin/faqs/:id`

##### Reglas de negocio

* `category`:

  * En la BD es un `VARCHAR(100)` (texto flexible) con ejemplos como `'general'`, `'enrollment'`, `'schedule'`, `'payment'`.
  * **Muy importante**: no convertirlo en enum TypeScript rígido que limite valores; mejor string + lista recomendada.
* Relaciones:

  * Si `business_model_id` o `program_id` se informan, deben apuntar a recursos existentes.
  * Si se borra un programa o modelo, las FAQs relacionadas pueden quedar con `*_id = NULL` o deben actualizarse según tu criterio (no hace falta resolver esto ahora; basta con respetar constraints actuales).
* Contenido crítico:

  * Puedes definir ciertas FAQs que no se puedan borrar por categoría y/o flag `is_featured`, o simplemente confiar en que haya suficientes FAQs activas por categoría.
  * Al menos debe haber tests que aseguren que no se borra “la última FAQ activa” de una categoría clave (p. ej. `'enrollment'`) sin advertencia (regla sugerida como test de dominio).

##### Validación Zod

* `question` y `answer`: obligatorias.
* `category`: string con longitud razonable; sugerir valores conocidos pero no imponer un enum cerrado.
* `tags`: array de strings.
* `display_order`: entero >= 0.
* `is_active`, `is_featured`: boolean.

---

### 5. Seguridad y auth (coherente con T3)

* Todos los endpoints de T4 van bajo `/api/admin/**` y deben estar **protegidos**:

  * Reutilizar el mismo mecanismo que en T3 (cabecera `X-Admin-Secret`), o la abstracción de auth admin que ya tengas.
  * Idealmente, el valor del secret debe venir de variable de entorno, no hardcodeado.
* No es obligatorio completar integración con Replit Auth en T4, solo mantener la API lista para ello.

---

### 6. Requisitos no funcionales

* Reutilizar entidades, repos y tipos existentes de T2/T3.
* No duplicar lógica:

  * Mantener reglas de negocio en `domain` / `application`, no en controladores.
* Paginar listados de `business_models`, `page_content`, `faqs`.
* Logging básico:

  * Método, ruta, resultado, sin incluir datos sensibles.
* **No convertir campos textuales flexibles** como `category` (FAQs) o textos genéricos de negocio en enums TypeScript rígidos; usa strings (y, si quieres, tipos literales recomendados) compatibles con el esquema SQL.

---

### 7. Testing y criterios de aceptación

#### 7.1. Tests de dominio

Casos mínimos:

* No permitir borrar:

  * Un `business_model` marcado como crítico (por `internal_code`) sin devolver un error de dominio.
  * Una `page_content` con `page_key` crítica (por ejemplo, `home` o `about-us`) sin control.
* Validar:

  * Que `status` de `page_content` solo toma valores `draft/published/archived`.
  * Que `category` en `faqs` puede aceptar valores nuevos sin romper el dominio.

#### 7.2. Tests de integración

* Al menos un **flujo CRUD completo** para:

  * `business_models` **o** `page_content`:

    * `POST` → `GET` → `PUT` → `DELETE` (o intento de borrado fallido si es crítico).
* Tests adicionales recomendables:

  * Crear y listar FAQs por categoría.
  * Verificar que, tras crear/editar contenido vía `/api/admin/**`, la API pública T2 sigue sirviendo los datos correctos (por ejemplo: crear un `business_model` o cambiar `show_on_web` y ver efecto en `/api/public/business-models`).

#### 7.3. Criterios de aceptación globales para T4

T4 se considera completada cuando:

* [ ] Existen endpoints CRUD funcionales para:

  * `business_models`
  * `page_content`
  * `faqs`
    bajo `/api/admin/**`.
* [ ] La API pública T2 sigue funcionando correctamente, sin cambios de contrato.
* [ ] No se ha creado ninguna tabla duplicada para estos recursos.
* [ ] Existen reglas y tests que impiden el borrado accidental de contenido crítico (modelos y páginas clave).
* [ ] Todos los endpoints de T4 validan entradas con Zod.
* [ ] Hay al menos:

  * 2 tests de dominio relevantes.
  * 1 flujo CRUD de integración probado.
* [ ] Se ha documentado la API admin de T4 (por ejemplo, actualizando `docs/api-admin-endpoints.md`) y se ha añadido entrada en `docs/CHANGELOG.md` indicando los cambios de T4.
