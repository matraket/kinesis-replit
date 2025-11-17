## PRD T2 – API Pública de Lectura para Kinesis Web (Instrucciones para el Agent)

Estás trabajando en el monorepo **Kinesis Web + CMS**, un monolito modular en TypeScript que corre en Replit.
Tu tarea es **T2: API Pública de Lectura** (MVP para la Web pública).

---

### 0. Restricciones Globales (LEER ANTES DE TOCAR CÓDIGO)

Estas reglas son **obligatorias** y refuerzan lo que ya está en `replit.md`:

1. **Ficheros y estructura que NO puedes tocar o romper**

   * **NO** modifiques ni borres nada bajo `context/**`. Es **solo lectura** (documentación funcional y modelo de datos).
   * **NO** cambies la estructura de carpetas de primer nivel:

     * `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`.
   * **NO** modifiques `.replit` ni `replit.nix` en esta tarea.
   * **NO** rompas los endpoints ya existentes:

     * `GET /`
     * `GET /health`

2. **replit.md (NO BORRAR BLOQUES NI REFACTORIZAR EL ARCHIVO)**

   * Puedes **leer** `replit.md` para entender convenciones, arquitectura y tareas.
   * **NO** puedes:

     * Eliminar secciones, reordenar todo el archivo o “refactorizarlo” completo.
     * Cambiar títulos o estructura principal de bloques.
   * Solo se permite añadir **pequeñas notas o aclaraciones** donde tenga sentido, sin alterar la estructura global.

3. **Esquema de Base de Datos: cambios incrementales, no desde cero**

   * El **modelo conceptual de datos** está en:

     * `context/kinesis-database-schema.sql`
     * Otros documentos de `context/` (business models, programas, instructores, FAQs, páginas legales, etc.).
   * El **esquema base** ya está creado en:

     * `scripts/sql/01_init_core_schema.sql`
   * Para T2, si necesitas migraciones:

     * Crea un nuevo script, por ejemplo `scripts/sql/02_public_api_schema.sql`.
     * **NO** recrees tipos o tablas que ya existan en `01_init_core_schema.sql`.
     * Solo añade columnas, tablas o índices que **falten** y sean necesarios para la API pública.
     * Asegúrate de que todo es coherente con `context/kinesis-database-schema.sql`.

4. **Alcance de T2 (Scope)**

   * T2 es **solo API pública de lectura** bajo `/api/public/**`.
   * **NO** crees endpoints de administración (`/api/admin/**`) en esta tarea.
   * **NO** crees endpoints de escritura (no `POST`, `PUT`, `PATCH`, `DELETE` para contenido).
   * Todos los endpoints de T2 son **`GET` y solo lectura**.

5. **Stack técnico**

   * Respeta el stack definido en `replit.md`:

     * Node + TypeScript.
     * Fastify para HTTP.
     * Zod para validación.
   * Arquitectura en capas / hexagonal:

     * `api/domain/**`
     * `api/application/**`
     * `api/infrastructure/**`
     * `api/interfaces/**`
   * Los controladores HTTP viven en `api/interfaces/http/**` y hablan con casos de uso de `api/application/**`, nunca directamente con la base de datos.

---

### 1. Objetivo de T2 (qué debe existir al final)

Implementar una **API pública de solo lectura** bajo `/api/public/**` que exponga los datos necesarios para la **Web pública** (`web/`):

* Modelos de negocio (los 4 pilares).
* Programas y servicios.
* Instructores / equipo.
* Pricing tiers (tarifas).
* Contenido de páginas estáticas (Quiénes somos, Modelos de negocio, etc.).
* FAQs.
* Páginas legales (Aviso Legal, Privacidad, Cookies).

Requisitos generales:

* La API debe usar la arquitectura existente de **dominio / aplicación / infraestructura / interfaces**.
* Solo debe devolver contenido en estado **publicado / visible en web**.
* Debe exponer **DTOs limpios** (sin detalles internos de la BD ni datos sensibles).
* Debe ser lo bastante estable para ser consumida por `web/` y, en el futuro, otros clientes.

---

### 2. Fases Prioritarias (CORE T2 vs OPCIONAL)

Si no puedes completar todos los bloques de trabajo en una sola sesión, **esta es la prioridad**:

#### 2.1. CORE T2 (imprescindible)

1. **Recurso: Modelos de negocio**

   * Endpoints `GET /api/public/business-models` y `GET /api/public/business-models/:slug`.
   * Casos de uso en `api/application` para listar y obtener por `slug`.
   * Repositorio de lectura en `api/infrastructure/db` usando el esquema existente.

2. **Recurso: Programas**

   * Endpoints `GET /api/public/programs` (con filtros y paginación) y `GET /api/public/programs/:slug`.
   * Casos de uso en `api/application` para listados y detalle.
   * Repositorio en `api/infrastructure/db` que resuelva relaciones con modelos de negocio, especialidades y (al menos de forma básica) instructores/pricing tiers.

3. **Recurso: Instructores**

   * Endpoints `GET /api/public/instructors` y `GET /api/public/instructors/:slug`.
   * Solo instructores con flags de visibilidad en web (según el modelo de datos).
   * No exponer datos sensibles (emails privados, teléfonos internos, etc.).

4. **Recurso: Pricing Tiers**

   * Endpoint `GET /api/public/pricing-tiers` con filtros por modelo de negocio y, opcionalmente, programa.
   * Casos de uso en `application` + repositorio en `infrastructure`.

5. **Recurso: Page Content (mínimo)**

   * Endpoint `GET /api/public/pages/:slug` o similar.
   * Soportar al menos las páginas clave:

     * `about-us`
     * `business-models`
   * Respetar el esquema de `page_content` (incluyendo `page_key` / `pageKey` como identificador lógico interno aun cuando el endpoint se base en `slug`).

6. **Recurso: Legal Pages (mínimo)**

   * Endpoints:

     * `GET /api/public/legal-pages`
     * `GET /api/public/legal-pages/:slug`
   * Mínimo:

     * Aviso Legal.
     * Política de Privacidad.
     * Política de Cookies.

7. **Routing e integración**

   * Crear/usar un router público bajo `api/interfaces/http/public/**`.
   * Montar todas las rutas públicas con prefijo `/api/public`.
   * Integrar el router en el servidor principal (ej. en `api/main.ts`) **sin romper** `GET /` ni `GET /health`.

8. **Tests y documentación mínimos**

   * Al menos:

     * 1–2 tests de casos de uso en `application` (por ejemplo, listados de programas).
     * 2–3 tests de integración para endpoints clave (`programs`, `business-models`, `legal-pages`).
   * Documentar los endpoints públicos en `docs/` (por ejemplo, `docs/api-public-endpoints.md`).
   * Añadir una entrada a `docs/CHANGELOG.md` explicando los cambios de T2.

#### 2.2. Opcional / Nice to Have (no bloquea cerrar T2)

Si después de completar el **CORE T2** aún hay tiempo:

* Añadir seeds de datos más completos en un script tipo `scripts/sql/03_seed_public_data.sql`.
* Completar endpoints para más páginas estáticas o bloques avanzados de `PageContent`.
* Añadir más cobertura de tests (más casos de uso, más endpoints de integración).
* Ajustar/actualizar `README.md` con ejemplos de consumo desde `web/`.

---

### 3. Requisitos funcionales por recurso (resumen)

> Nota: los nombres concretos de campos pueden adaptarse al dominio y al esquema SQL, pero la idea general debe respetarse.

#### 3.1. Business Models

* Endpoints:

  * `GET /api/public/business-models`

    * Lista de modelos de negocio publicados y visibles.
  * `GET /api/public/business-models/:slug`

    * Detalle por `slug`.
* Campos típicos (respuesta):

  * `slug`, `name`, `subtitle`, `description`.
  * `scheduleInfo`, `targetAudience`, `format`.
  * Bloques de valor (feature / advantage / benefit).
  * `metaTitle`, `metaDescription`.
  * Solo modelos con estado “publicado” y visibles en web.

#### 3.2. Programs

* Endpoints:

  * `GET /api/public/programs`

    * Con filtros:

      * `businessModelSlug`
      * `specialtyCode`
      * `difficulty`, etc.
    * Paginación: `page`, `limit`.
  * `GET /api/public/programs/:slug`

    * Detalle de un programa con:

      * Modelo de negocio asociado.
      * Especialidades.
      * Instructores principales (versión resumida).
      * Pricing tiers asociados.
* Campos de salida:

  * Listado: datos resumidos (nombre, slug, shortDescription, dificultad, tags).
  * Detalle: descripción larga, objetivos, requisitos, info de horarios, etc.

#### 3.3. Instructors

* Endpoints:

  * `GET /api/public/instructors`

    * Solo instructores con flags de visibilidad en web.
    * Filtros opcionales: `featured`, `specialtyCode`.
  * `GET /api/public/instructors/:slug`

    * Detalle de instructor (bio, logros, formación, especialidades).
* Importante:

  * No exponer datos personales internos.
  * Incluir, en detalle, un listado **resumido** de programas asociados (nombre + slug).

#### 3.4. Pricing Tiers

* Endpoint:

  * `GET /api/public/pricing-tiers`

    * Filtros: `businessModelSlug`, `programSlug` (si aplica).
* Campos de salida:

  * `name`, `price` (cantidad + moneda), `billingPeriod`.
  * Descripción corta, lista de features si existe.
  * Flags como `isRecommended`, `isVisibleOnWeb`, `displayOrder`.

#### 3.5. Page Content (mínimo)

* Endpoint:

  * `GET /api/public/pages/:slug`
* Campos:

  * `slug`, `title`, `subtitle`.
  * `pageKey` / `pageKey` (clave lógica interna).
  * `sections[]`:

    * Esquema flexible tipo `{ type: string, content: any }` para representar bloques de contenido.
  * Metadatos SEO (`metaTitle`, `metaDescription`).

#### 3.6. FAQs

* Endpoint:

  * `GET /api/public/faqs`

    * Filtros: `category`, `businessModelSlug` (si aplica).
* Campos:

  * `question`, `answer`, `category`, `displayOrder`.
* Importante:

  * **No fuerces un enum duro** para `category` en dominio si el esquema lo maneja como texto flexible. Permite nuevos valores definidos en contenido.

#### 3.7. Legal Pages

* Endpoints:

  * `GET /api/public/legal-pages`
  * `GET /api/public/legal-pages/:slug`
* Campos:

  * `slug`, `title`, `content`, `lastUpdatedAt`.
* Contenido:

  * El campo `content` debe ser representable en la Web (Markdown o HTML seguro).

---

### 4. No Funcionales y Estándares

* **Solo contenido publicado**:

  * Filtrar por estados tipo `publication_status = 'published'`, `is_active = true`, `show_on_web = true`, etc., según el esquema.
* **Errores HTTP coherentes**:

  * `404` para recursos no encontrados (por slug).
  * `400` para parámetros inválidos (validación con Zod).
  * `500` para errores internos.
* **Validación con Zod**:

  * Validar al menos las respuestas (DTOs) antes de enviarlas al cliente.
* **Arquitectura limpia**:

  * Los controladores HTTP **no** deben hablar directamente con la base de datos.
  * `domain` no depende de frameworks.
  * `infrastructure` implementa interfaces definidas en `application`.

---

### 5. Testing, Documentación y Cierre de T2

Para considerar T2 como “completado”:

1. **Tests mínimos**

   * Al menos:

     * 2 casos de uso de `application` con tests unitarios (por ejemplo, listar programas y obtener modelo de negocio por slug).
     * 3 endpoints públicos con tests de integración (`programs`, `business-models`, `legal-pages`).
2. **Documentación**

   * Un documento tipo `docs/api-public-endpoints.md` describiendo:

     * Lista de endpoints.
     * Parámetros de consulta.
     * Ejemplos de respuesta.
   * Entrada en `docs/CHANGELOG.md` indicando:

     * Que se ha implementado T2 (API pública de lectura).
     * Qué recursos están cubiertos.
3. **Servidor y rutas base intactas**

   * `GET /` y `GET /health` siguen funcionando igual.
   * El servidor sigue escuchando en el puerto configurado (`process.env.PORT` en Replit).

