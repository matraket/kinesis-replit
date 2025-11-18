# PRD T2 – API Pública de Lectura (MVP Web)

## 0. Metadatos

* **ID:** PRD T2 – API Pública de Lectura
* **Proyecto:** Kinesis Web + CMS (monolito modular en Replit)
* **Versión:** 1.0 (borrador inicial)
* **Fecha:** (rellenar al aprobar)
* **Owner funcional:** Dirección Kinesis / Product Owner Web + CMS
* **Owner técnico:** Tech Lead Kinesis (Backend/API)

**Dependencias previas:**

* T0: Entorno y tooling base en Replit (Node, TS, pnpm, Fastify mínimo en `/api`).
* T1: Dominio + Base de Datos SQL Replit (capas `domain/application/infrastructure` y repos Postgres básicos).

---

## 1. Objetivo

Exponer una **API pública de solo lectura**, estable y versionable, que sirva como **fuente de datos para la Web corporativa** (FASE 4 del plan), cubriendo el contenido principal de:

* Modelos de negocio (los 4 pilares).
* Programas y servicios.
* Instructores/equipo.
* Tarifas y pricing tiers.
* Páginas de contenido estático (Quiénes somos, Modelos de negocio, etc.).
* FAQs.
* Textos legales.

Esta API se consumirá únicamente desde `web/` (frontend público) en esta fase, pero debe ser **estable y reutilizable** para futuras versiones (por ejemplo, apps móviles o integraciones externas).

---

## 2. Alcance

### 2.1. In Scope (T2)

1. **Diseño y exposición de endpoints GET** bajo un prefijo estable (ej. `/api/public`) para:

   * `business_models`
   * `programs`
   * `instructors`
   * `pricing_tiers`
   * `page_content`
   * `faqs`
   * `legal_pages`

2. **Uso de la capa `application` existente** (T1) como punto de entrada (casos de uso de lectura) + repositorios sobre PostgreSQL (Replit SQL DB).

3. **Validación de salida con Zod** en los DTOs de respuesta (contratos JSON estables).

4. **Contratos de respuesta “orientados a Web”** (limpios, sin exponer detalles internos de la BD ni campos irrelevantes para la presentación).

5. **Tests mínimos de calidad**:

   * 1–2 casos de uso clave a nivel `application` (p. ej. `listProgramsForPublicSite`).
   * 2–3 tests de integración de endpoints GET clave (`/api/public/programs`, `/api/public/business-models/:slug`, etc.).

6. **Compatibilidad con la arquitectura del monolito en Replit**:

   * Mantener el único servidor Fastify actual, añadiendo rutas sin romper `GET /` y `GET /health`.

### 2.2. Out of Scope (T2)

* Endpoints CRUD internos de CMS (`/api/admin/**`) → T3, T4, T5.
* Autenticación/autorización de backoffice (T6+) – solo endpoints públicos sin login.
* Gestión de leads (creación desde formularios) → T5.
* SEO avanzado y meta tags en Web (T16, aunque la API debe permitirlo con meta fields).
* Cambios en `.replit`, `replit.nix` o configuración de despliegue (T17).

---

## 3. Suposiciones y dependencias

1. **Dominio y modelo de datos**

   * El modelo relacional (business_models, programs, instructors, pricing_tiers, etc.) está definido conceptualmente en `context/kinesis-database-schema.sql`.
   * T1 ya ha creado las entidades de dominio y repositorios base sobre la SQL Database integrada de Replit.

2. **Infraestructura Replit**

   * Un solo contenedor y un único puerto público expuesto (Replit deployments solo permiten un puerto externo), por lo que la API pública debe convivir con el resto del monolito en el mismo servidor.
   * La persistencia se hace en la SQL DB integrada, no en el filesystem del deployment.

3. **Frontends**

   * `web/` consumirá esta API vía HTTP desde el browser, usando React Query o similar, siguiendo el diseño y flujos definidos en `Kinesis-Web-y-CMS-Specs.md`.

4. **Stack técnico fijado en replit.md**

   * Node + TypeScript + Fastify.
   * Zod para validación.
   * Arquitectura por capas `domain / application / infrastructure / interfaces`.

---

## 4. Arquitectura de alto nivel (para T2)

### 4.1. Capas afectadas

* **`api/domain/**`**

  * Reutilizar entidades existentes (BusinessModel, Program, Instructor, PricingTier, PageContent, Faq, LegalPage, etc.).
  * No se añade lógica nueva de negocio en T2 salvo reglas mínimas de filtrado de estado (ej. solo contenidos “publicados”).

* **`api/application/**`**

  * Casos de uso de lectura específicos para Web:

    * `listBusinessModelsForPublicSite` / `getBusinessModelBySlug`
    * `listProgramsForPublicSite` / `getProgramBySlug`
    * `listInstructorsForPublicSite` / `getInstructorBySlug`
    * `listPricingTiersForPublicSite`
    * `getPageContentBySlug`
    * `listFaqsByCategoryForPublicSite`
    * `listLegalPagesForPublicSite` / `getLegalPageBySlug`

* **`api/infrastructure/db/**`**

  * Implementaciones de repositorios usando la SQL DB de Replit (PostgreSQL serverless).

* **`api/interfaces/http/public/**`** (nueva carpeta recomendada)

  * Controladores Fastify + esquemas Zod para inputs/outputs.
  * Enrutador montado con prefijo `/api/public`.

### 4.2. Integración con Replit

* El servidor Fastify se sigue levantando desde `api/main.ts` (u hoja de arranque definida en `.replit`), manteniendo `GET /` y `GET /health` intactos y añadiendo el registro de rutas públicas.

---

## 5. Definición funcional por recurso

> Nota: los nombres de campos son **contratos de API**, no necesariamente idénticos a los nombres de columnas en BD. Los mapeos se resuelven en `infrastructure/db`.

### 5.1. Modelos de negocio (`business_models`)

**Uso en Web:**
Secciones “Modelos de negocio” y bloques de la Home para Élite On Demand, Ritmo Constante, Generación Dance y Sí, Quiero Bailar.

#### Endpoints

1. `GET /api/public/business-models`

   * Devuelve todos los modelos activos y visibles en web, ordenados por `displayOrder`.
   * Parámetros opcionales:

     * `?featured=true|false` (opcional, si queremos destacar uno en la Home en el futuro).

2. `GET /api/public/business-models/:slug`

   * Devuelve el detalle de un modelo concreto por `slug` (`elite-on-demand`, `ritmo-constante`, etc.).

#### Respuesta (conceptual)

* `id`
* `slug`
* `name`
* `subtitle`
* `description`
* `scheduleInfo`
* `targetAudience`
* `format`
* Bloques FAB (feature/advantage/benefit) para las páginas de detalle:

  * `featureTitle`, `featureContent`
  * `advantageTitle`, `advantageContent`
  * `benefitTitle`, `benefitContent`
* Metadatos web:

  * `metaTitle`, `metaDescription`

### 5.2. Programas y servicios (`programs` + relaciones)

**Uso en Web:**
Catálogo de “Programas y servicios”, detalle por programa, filtros por especialidad, nivel, público, etc.

#### Endpoints

1. `GET /api/public/programs`

   * Lista de programas disponibles en web.
   * Parámetros de filtro:

     * `?businessModelSlug=elite-on-demand|ritmo-constante|...`
     * `?specialtyCode=clasico|contemporaneo|urbano|...`
     * `?difficulty=beginner|intermediate|advanced|professional`
     * `?audience=kids|adults|pro|hobby` (si existiese en modelo)
   * Parámetros de paginación:

     * `?page=1&limit=20` (por defecto `page=1`, `limit=50`).

2. `GET /api/public/programs/:slug`

   * Devuelve el detalle de un programa, incluyendo:

     * Relaciones con business_model.
     * Especialidades (`specialties`).
     * Instructores principales.
     * Pricing tiers vinculados.

#### Respuesta (conceptual)

Para listados (versión resumida):

* `id`, `slug`, `name`
* `shortDescription`
* `difficulty`
* `businessModel` (objeto con `slug`, `name`)
* `specialties` (array de `{ code, name }`)
* Tags de presentación (ej. `category: "professional" | "amateur" | "kids"`).

Para detalle:

* Todos los campos anteriores +
* `longDescription`
* `objectives`, `requirements`
* `weeklyHours`, `sessionDuration`
* `ageRange` (si aplica)
* `instructors` (array resumido: id, slug, displayName, role)
* `pricingTiers` (array resumido, ver 5.4)

### 5.3. Instructores (`instructors`)

**Uso en Web:**
Página “Equipo” y fichas de profesor enlazadas desde Programas.

#### Endpoints

1. `GET /api/public/instructors`

   * Lista de instructores activos con `showOnWeb=true` y `showInTeamPage=true`.
   * Parámetros opcionales:

     * `?featured=true` → solo destacados en Home.
     * `?specialtyCode=...` → filtrar por especialidad principal.

2. `GET /api/public/instructors/:slug`

   * Devuelve la ficha completa de un instructor.

#### Respuesta (conceptual)

Listado:

* `id`, `slug`
* `firstName`, `lastName`, `displayName`
* `role` (Director, Profesor adjunto, etc.)
* `tagline`
* `profileImageUrl`
* `mainSpecialties` (ej. `["clasico", "contemporaneo"]`)

Detalle:

* Todo lo anterior +
* `bioSummary`, `bioFull`
* `achievements[]`, `education[]`
* `heroImageUrl`, `videoUrl` (si aplica).
* `programs` (lista resumida de programas que imparte).

### 5.4. Pricing tiers (`pricing_tiers`)

**Uso en Web:**
Sección “Horarios y tarifas” y bloques de precios por modelo de negocio.

#### Endpoints

1. `GET /api/public/pricing-tiers`

   * Lista de planes tarifarios activos.
   * Filtros:

     * `?businessModelSlug=...`
     * `?programSlug=...` (si se necesitan tarifas específicas por programa).

#### Respuesta (conceptual)

* `id`
* `name` (ej. “Suscripción PRO (4h/sem)”)
* `businessModel` (slug, name)
* `price` (importe numérico + moneda, p. ej. `amount: 95, currency: "EUR"`)
* `billingPeriod` (ej. `monthly`, `per_session`)
* `description` (texto corto con beneficios)
* Flags:

  * `isRecommended` (para destacar en tablas de precios)
  * `isVisibleOnWeb`

### 5.5. Page content (`page_content`)

**Uso en Web:**
Páginas estáticas: Home (bloques), Quiénes somos, Modelos de negocio (texto principal), etc.

#### Endpoints

1. `GET /api/public/pages/:slug`

   * Recupera el contenido de una página estática por `slug`:

     * `home`, `about-us`, `business-models`, `programs-overview`, etc.

#### Respuesta (conceptual)

* `id`, `slug`, `title`
* `subtitle`
* `sections[]`:

  * Cada sección puede ser un bloque estructurado (ej. hero, bloques modelo, testimonios…), pero para T2 basta con un esquema flexible tipo:

    * `type` (ej. `hero`, `rich_text`, `cta_block`, etc.)
    * `content` (JSON genérico con campos específicos de cada tipo).
* `metaTitle`, `metaDescription`

> En T2 solo es obligatorio soportar páginas básicas (Quiénes somos, Modelos de negocio, etc.); se puede empezar con bloques `rich_text` e iterar en T4.

### 5.6. FAQs (`faqs`)

**Uso en Web:**
Secciones de preguntas frecuentes, especialmente asociadas a modelos de negocio y servicios.

#### Endpoints

1. `GET /api/public/faqs`

   * Devuelve FAQs visibles en web.
   * Parámetros:

     * `?category=business_models|programs|pricing|legal|...`
     * `?businessModelSlug=...`

#### Respuesta (conceptual)

* `id`
* `question`
* `answer`
* `category`
* `businessModel` (opcional – slug)
* `displayOrder`

### 5.7. Textos legales (`legal_pages`)

**Uso en Web:**
Aviso Legal, Política de Privacidad, Política de Cookies.

#### Endpoints

1. `GET /api/public/legal-pages`

   * Lista de textos legales (solo campos básicos: slug, título).

2. `GET /api/public/legal-pages/:slug`

   * Detalle de un texto legal concreto.

#### Respuesta (conceptual)

* `id`, `slug`
* `title` (ej. “Aviso Legal”)
* `content` (HTML seguro o Markdown renderizable en la Web)
* `lastUpdatedAt`

---

## 6. Comportamiento y reglas de negocio

1. **Visibilidad pública**

   * Todos los endpoints filtran por estados de publicación (`publication_status = 'published'` o equivalente).
   * Contenido archivado/inactivo no debe aparecer en la API pública.

2. **Estabilidad de slugs**

   * Los `slug` de recursos públicos (modelos de negocio, programas, instructores, páginas, legales) se consideran **identificadores de URL** y no se cambian sin migración/control.

3. **Ordenación por defecto**

   * Listados devueltos ordenados por:

     * `displayOrder` en catálogos (business_models, programs, faqs).
     * `seniorityLevel` o similar en instructores (cuando exista).

4. **Paginación**

   * Listados que potencialmente crecen (programs, instructors, faqs) deben soportar paginación `page + limit`, con valores por defecto razonables (ej. `page=1`, `limit=20`).

5. **Errores y estados**

   * Recurso no encontrado: `404` con JSON `{ error: "NotFound", message: "..." }`.
   * Parámetros inválidos: `400` con detalle de validación de Zod.
   * Error interno inesperado: `500` con mensaje genérico, log trazado en servidor.

---

## 7. Requisitos no funcionales (NFR)

1. **Performance**

   * Tiempo de respuesta objetivo (P95) < 300ms para listados sin filtros pesados en un entorno de recursos moderados de Replit (CPU y RAM limitadas).
   * Añadir índices en BD (sobre `slug`, `is_active`, etc.) cuando sea necesario para cumplirlo.

2. **Seguridad**

   * Endpoints públicos no requieren autenticación, pero:

     * No exponer datos sensibles (emails internos, teléfonos del staff si no están destinados a la Web, etc.).
     * Las cabeceras de CORS deben permitir el dominio de la Web (mismo dominio en el monolito, sin cambios especiales).

3. **Escalabilidad dentro de Replit**

   * Diseño compatible con un despliegue Autoscale o VM reservada (un solo puerto, servidor único).

4. **Observabilidad**

   * Logging mínimo por endpoint (método, ruta, código de respuesta, duración).
   * En caso de error 5xx, log detallado solo en servidor (no en respuesta pública).

5. **Evolutividad**

   * Los contratos de respuesta deben ser pensados para poder extenderse (añadir campos) sin romper clientes existentes.
   * Cambios de ruptura (breaking changes) deberían ir siempre acompañados de versionado (ej. `/api/v2/public/...` en el futuro), aunque T2 solo implementa `/api/public` (v1 implícita).

---

## 8. Testing y criterios de aceptación

### 8.1. Testing mínimo requerido

1. **Unit tests (application)**

   * `listProgramsForPublicSite`:

     * Devuelve solo programas publicados.
     * Respeta filtros de `businessModelSlug` y `specialtyCode`.
   * `getBusinessModelBySlug`:

     * Retorna modelo cuando existe.
     * Lanza/propaga error controlado cuando no existe (mapeado a 404 en interfaz HTTP).

2. **Tests de integración (HTTP)**

   * `GET /api/public/programs`:

     * 200 OK, JSON con array.
     * Paginación funcional (`page`, `limit`).
   * `GET /api/public/business-models/:slug`:

     * 200 OK para slug válido.
     * 404 para slug inexistente.
   * `GET /api/public/legal-pages/:slug`:

     * 200 OK y campos mínimos (`title`, `content`, `lastUpdatedAt`).

### 8.2. Criterios de aceptación (checklist de negocio)

Se considera T2 completada cuando:

* [ ] Existen endpoints GET documentados y accesibles bajo `/api/public/**`.
* [ ] La Home puede obtener desde la API:

  * Los 4 modelos de negocio.
  * Programas destacados.
  * Instructores destacados.
* [ ] Las páginas “Quiénes somos”, “Modelos de negocio”, “Programas y servicios”, “Equipo”, “Horarios y tarifas”, “FAQ” y “Textos legales” tienen **todos los datos necesarios** accesibles vía API sin tener que “hardcodear” contenido en el frontend (puede haber textos provisionales, pero el mecanismo de datos debe existir).
* [ ] Las respuestas cumplen con los esquemas Zod definidos (validación en responses).
* [ ] No se ha roto el comportamiento de `GET /` y `GET /health`.
* [ ] Los tests definidos arriba pasan en el entorno de Replit.

---

## 9. Impacto en Replit y despliegue

* No se requieren cambios en `.replit` para T2, siempre que el comando de arranque ya utilice `api/main.ts` como entrypoint del servidor.
* La API pública se desplegará junto con el monolito en el futuro **Autoscaling Deployment** o **Reserved VM** definido para T17; T2 solo prepara el código para ello.
* El uso de la SQL DB integrada asegura que el contenido servido por `/api/public` es persistente y compartido entre entorno de desarrollo y despliegue (con la debida migración/aplicación de esquema).

---
