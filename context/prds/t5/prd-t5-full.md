## PRD T5 – API de Textos Legales, Settings y Leads

Estás trabajando en el monorepo **Kinesis Web + CMS**, un monolito modular en TypeScript sobre Fastify que corre en Replit, siguiendo arquitectura **hexagonal/Clean**.
Tu tarea es **T5: API de Textos Legales, Settings y Leads**, construida sobre el modelo de datos ya definido en T1/T2/T3/T4.

---

## 0. RESTRICCIONES CRÍTICAS (NO NEGOCIABLES)

### 0.1. Archivos y estructura prohibidos

Debes respetar estrictamente estas reglas:

* **NO** modificar:

  * `context/**` → solo lectura (documentación y modelo conceptual).
  * `.replit`, `replit.nix`.
* **NO** cambiar la estructura de carpetas de primer nivel:

  * `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`.
* **NO** romper endpoints ya existentes:

  * `GET /`, `GET /health`
  * API pública T2: `/api/public/**`
  * API admin T3/T4: `/api/admin/**` para specialties, instructors, programs, pricing_tiers, business_models, pages, faqs.
* **`replit.md`**:

  * Puedes leerlo.
  * No puedes eliminar secciones, cambiar su estructura ni “refactorizarlo”.
  * Solo se permiten pequeñas notas de estado en bloques ya previstos.

### 0.2. Base de datos

* Modelo conceptual de referencia: `context/kinesis-database-schema.sql`.

  * Incluye tipos `lead_type`, `lead_status`, tabla `leads`, `legal_pages`, `settings`, etc.
* Esquema real ya aplicado (migraciones Replit):

  * `scripts/sql/01_init_core_schema.sql`
  * `scripts/sql/02_public_api_schema.sql`

Para T5:

* **NO crear nuevas tablas** (`leads`, `legal_pages`, `settings` ya existen en el modelo conceptual).
* **NO crear migraciones** salvo que sea estrictamente necesario.
* Si fuese imprescindible una migración (no debería):

  * Nuevo archivo incremental (ej. `scripts/sql/05_leads_and_settings_schema.sql`).
  * Sin recrear tablas ni eliminar/renombrar columnas usadas por T2/T3/T4.
* **NO añadir valores nuevos** a enums SQL ya definidos:

  * `lead_type` (actualmente: `'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter'`).
  * `lead_status` (`'new' | 'contacted' | 'qualified' | 'converted' | 'lost'`).

### 0.3. Arquitectura

* **Stack**: Node + TypeScript + Fastify + Zod.
* **Patrón**: hexagonal / Clean architecture.

  * `api/domain/**`
  * `api/application/**`
  * `api/infrastructure/**`
  * `api/interfaces/**`
* Debes **reutilizar** lo ya creado en T2/T3/T4:

  * Entidades de dominio (`LegalPage`, `Settings` si existen, `Lead` si ya está esbozado).
  * Repositorios y puertos existentes para `legal_pages`.
  * Estilo de controladores, esquemas Zod y rutas admin (`/api/admin/**`) y públicas (`/api/public/**`).

---

## 1. OBJETIVO

Crear y/o completar la API en dos niveles:

1. **API admin (`/api/admin/**`)** para:

   * CRUD de `legal_pages` (Aviso Legal, Privacidad, Cookies).
   * CRUD de `settings` (datos generales, redes, horarios, configuración de sitio).
   * Gestión de `leads` (listado, detalle, cambio de estado, notas, filtros).

2. **API pública (`/api/public/**`)** para captura de leads (solo `POST`):

   * Formulario de **Contacto general**.
   * Formulario de **Pre-inscripción** (Generación Dance / niños/teens).
   * Formulario de **Reserva Élite On Demand**.
   * Formulario de **Servicio Coreográfico Nupcial**.

**Garantizar**:

* La API pública T2 sigue funcionando sin cambios de contrato.
* No se alteran tablas ni enums de BD, solo se utilizan tal como están definidos.
* Los leads capturados se almacenan en `public.leads` con `lead_type` coherente.

---

## 2. ALCANCE (Scope)

### 2.1. In Scope

* Endpoints **admin** bajo `/api/admin/**` para:

  * `legal_pages`
  * `settings`
  * `leads` (lectura/actualización, no necesariamente borrado duro).
* Endpoints **públicos** bajo `/api/public/leads/**` para los 4 formularios.
* Casos de uso en `api/application/leads/**` (y módulos análogos para legales/settings):

  * Validaciones de negocio y orquestación.
* Validaciones con Zod en:

  * Bodies de `POST/PUT/PATCH`.
  * Params (`:id`, `:pageType`, etc.).
* Tests:

  * Dominio (validaciones básicas de leads + reglas de negocio).
  * Integración para al menos un endpoint de cada tipo de formulario de leads.

### 2.2. Out of Scope

* UI del CMS (`cms/`) para ver leads o editar settings/legales (eso será FASE 3).
* Integración con herramientas externas (Mailchimp, CRM, etc.).
* Implementación de CAPTCHA/anti-spam avanzada (solo dejarlo preparado / fácil de añadir).

---

## 3. ARQUITECTURA Y ORGANIZACIÓN

### 3.1. Capas afectadas

* `api/domain/**`

  * Entidades a usar/completar:

    * `LegalPage`
    * `Setting` (clave-valor)
    * `Lead`
  * Enums/Value Objects recomendados (TypeScript):

    * `LeadType = 'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter'` (alineado con enum SQL, no añadir valores nuevos).
    * `LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'`.
  * **No** crear enums TS más ricos que el enum SQL (no inventar tipos que luego no existan en BD).

* `api/application/**`

  * Módulo `legal-pages` (o similar): casos de uso admin.
  * Módulo `settings`: lectura/actualización de settings.
  * Módulo `leads`: creación (formularios públicos) + gestión admin.
  * Mantener la convención ya usada para T3/T4 (use cases por dominio).

* `api/infrastructure/db/**`

  * Repositorios Postgres:

    * `PostgresLegalPageRepository`: extendido con métodos admin (create/update/delete/list).
    * `PostgresSettingsRepository`: lectura/actualización clave-valor.
    * `PostgresLeadRepository`: creación y consultas filtradas.
  * Respetar estructura y estilo de repos existentes.

* `api/interfaces/http/**`

  * Admin:

    * `api/interfaces/http/admin/controllers/LegalPagesController.ts`
    * `api/interfaces/http/admin/controllers/SettingsController.ts`
    * `api/interfaces/http/admin/controllers/LeadsController.ts`
    * `api/interfaces/http/admin/schemas/*` (Zod para admin).
    * `api/interfaces/http/admin/routes/*` (rutas admin).
  * Público:

    * `api/interfaces/http/public/controllers/LeadsController.ts` (o dividido por tipo).
    * `api/interfaces/http/public/schemas/leads.schemas.ts`.
    * `api/interfaces/http/public/routes/leads.routes.ts`.

---

## 4. RECURSOS Y ENDPOINTS

### 4.1. Legal Pages (`legal_pages`)

**Tabla**: `public.legal_pages`
Campos relevantes (según esquema conceptual):

* `page_type` (UNIQUE, NOT NULL): `'legal'`, `'privacy'`, `'cookies'`, `'terms'`…
* `title` (NOT NULL).
* `content` (TEXT, NOT NULL).
* `version` (ej: `"1.0"`).
* `effective_date` (DATE).
* Auditoría: timestamps, etc.

#### 4.1.1. Endpoints Admin

Prefijo: `/api/admin/legal-pages`

* `GET   /api/admin/legal-pages`

  * Lista todas las páginas legales.
  * Filtros opcionales:

    * `pageType` (ej: `legal`, `privacy`, `cookies`).
* `GET   /api/admin/legal-pages/:id`
* `GET   /api/admin/legal-pages/by-type/:pageType`

  * Acceso directo por `page_type`.
* `POST  /api/admin/legal-pages`

  * Crear nueva página legal (poco frecuente, pero posible para textos adicionales).
* `PUT   /api/admin/legal-pages/:id`

  * Actualizar contenido y metadatos.
* `DELETE /api/admin/legal-pages/:id`

  * **Con restricciones** (ver reglas de negocio).

#### 4.1.2. Reglas de negocio

* Para tipos estándar (`legal`, `privacy`, `cookies`, `terms`):

  * **No permitir borrado duro** → devolver error de dominio.
  * Alternativa: permitir versiones nuevas (mismo `page_type`, diferente `version` y `effective_date`).
* Si hay múltiples versiones:

  * La versión “vigente” es la de `effective_date` más reciente (o un campo `is_current` si existe).
* API pública T2:

  * Sigue leyendo de `legal_pages` sin cambios; T5 no puede romper el contrato actual.

#### 4.1.3. Validación Zod (admin)

Entrada mínima para `POST/PUT`:

* `pageType`: string no vacío, valores recomendados (`legal`, `privacy`, `cookies`, `terms`).
* `title`: obligatorio.
* `content`: obligatorio.
* `version`: string tipo `"1.0"`.
* `effectiveDate`: fecha válida.

---

### 4.2. Settings (`settings`)

**Tabla**: `public.settings`
Campos relevantes:

* `setting_key` (UNIQUE, NOT NULL) → p. ej.:

  * `site.name`
  * `site.address`
  * `site.phone`
  * `site.schedule`
  * `social.instagram`
  * `social.facebook`
  * `legal.contact_email`
* `setting_value` (JSONB, NOT NULL).
* `setting_type` (ej: `'site' | 'email' | 'social' | 'analytics'`).
* `description` (opcional).
* Auditoría: `updated_at`, `updated_by`.

#### 4.2.1. Endpoints Admin

Prefijo: `/api/admin/settings`

* `GET   /api/admin/settings`

  * Lista todas las settings, con filtros opcionales:

    * `type` (site/email/social/analytics).
* `GET   /api/admin/settings/:key`

  * Recupera una configuración concreta por `setting_key`.
* `PUT   /api/admin/settings/:key`

  * Actualiza el `setting_value` (y opcionalmente `description`).
* (Opcional) `POST /api/admin/settings`

  * Crear nuevas claves; se puede limitar a ciertos roles/usuarios en el futuro.

**No es prioritario** implementar `DELETE`; habitualmente no se borran settings, solo se actualizan.

#### 4.2.2. Reglas de negocio

* No permitir dejar claves críticas sin valor (site.name, site.address, etc.).
* Mantener la semántica de `setting_type`:

  * `site` → datos del centro.
  * `social` → redes.
  * `email` → configuración de correo.
  * `analytics` → tracking, etc.

#### 4.2.3. Validación Zod

* `setting_key`: string no vacío.
* `setting_value`: JSON, al menos asegurar tipo básico (string/number/objeto según la clave).
* `setting_type`: string, con valores recomendados.

---

### 4.3. Leads (`leads`)

**Tipos**:

* `lead_type` enum: `'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter'`.
* `lead_status` enum: `'new' | 'contacted' | 'qualified' | 'converted' | 'lost'`.

**Tabla**: `public.leads`
Campos relevantes (resumen):

* Datos de contacto: `first_name`, `last_name`, `email`, `phone`.
* Tipo: `lead_type`.
* Estado: `lead_status` (por defecto `'new'`).
* Origen: `source` (`'web'`, `'facebook'`, etc.), `campaign`.
* Detalles:

  * `message`
  * `interested_in_programs` (TEXT[] – slugs o códigos de programas).
  * `preferred_schedule`
* Pre-inscripción:

  * `student_name`, `student_age`, `previous_experience`.
* Élite:

  * `preferred_date`, `preferred_time`, `session_type` (`'individual'`, `'couple'`).
* Consentimientos, tracking (utm_*), IP, user_agent, notas, etc.

#### 4.3.1. Mapeo de formularios a `lead_type`

No se deben añadir nuevos valores al enum SQL `lead_type`.
Usaremos los existentes así:

* **Contacto general**:

  * `lead_type = 'contact'`
* **Pre-inscripción**:

  * `lead_type = 'pre_enrollment'`
* **Reserva Sesión Élite On Demand**:

  * `lead_type = 'elite_booking'`
* **Servicio Coreográfico Nupcial**:

  * También `lead_type = 'elite_booking'`
  * Diferenciado por:

    * `session_type = 'couple'` y/o
    * `interested_in_programs` conteniendo el código/slug del programa de coreografía nupcial.

#### 4.3.2. Endpoints públicos (captura de leads)

Prefijo: `/api/public/leads/**`

Los endpoints deben ser **solo POST**, sin auth, con validación fuerte y protección básica (no logs de datos sensibles, tamaño máximo, etc.).

Propuesta:

* `POST /api/public/leads/contact`

  * Crea lead de contacto general.
* `POST /api/public/leads/pre-enrollment`

  * Crea lead de pre-inscripción (Generación Dance, etc.).
* `POST /api/public/leads/elite-booking`

  * Crea lead de reserva Élite On Demand.
* `POST /api/public/leads/wedding`

  * Crea lead para Servicio Coreográfico Nupcial (internamente `elite_booking` diferenciado por campos).

Cada endpoint:

* Asigna el `lead_type` correcto.
* Rellena campos específicos según el formulario.
* Marca `lead_status = 'new'`.
* Rellena `source = 'web'` y, si se recibe, `utm_*`.

##### Validación Zod (público)

Ejemplos mínimos:

* Contact:

  * `firstName`, `lastName`, `email`, `message` → obligatorios.
* Pre-enrollment:

  * Datos de madre/padre/tutor (`firstName/lastName/email`).
  * `studentName`, `studentAge`, `previousExperience`.
* Élite:

  * `firstName/lastName/email`.
  * `preferredDate`, `preferredTime`, `sessionType`.
* Wedding:

  * Como Élite, pero debe marcarse de modo que en CMS se identifique claramente como nupcial (por ejemplo, `interested_in_programs` con el código del programa de boda).

También:

* Validar formato de email.
* Limitar longitudes máximas (message, notas, etc.).

#### 4.3.3. Endpoints admin (gestión de leads)

Prefijo: `/api/admin/leads/**`

* `GET   /api/admin/leads`

  * Filtros:

    * `leadType` (contact/pre_enrollment/elite_booking/newsletter).
    * `status` (new/contacted/qualified/converted/lost).
    * Rango de fechas: `from`, `to` (creación).
    * Opcional: `source`, `campaign`.
  * Paginación (page/limit).
* `GET   /api/admin/leads/:id`
* `PATCH /api/admin/leads/:id/status`

  * Cambiar `lead_status`.
  * Registrar campos de seguimiento (`contacted_at`, `contacted_by`, `conversion_date`, `notes`).
* (Opcional) `PATCH /api/admin/leads/:id`

  * Actualizar otros campos (notas internas, tags).
* (Opcional) `DELETE /api/admin/leads/:id`

  * Mejor evitar borrado físico; si se implementa, documentar claramente.

##### Reglas de negocio (leads)

* Un lead **siempre** debe tener:

  * `first_name`, `last_name`, `email`.
  * `lead_type` válido.
* No permitir cambiar `lead_type` una vez creado (evitar inconsistencias de reporting).
* `lead_status`:

  * Flujo recomendable, aunque no es obligatorio implementar transiciones complejas:

    * `new → contacted → qualified → converted` (o `lost`).
* Registrar tracking básico en cambios de estado:

  * `contacted_at`, `conversion_date`, `notes`.

---

## 5. SEGURIDAD

* Endpoints **admin** (`/api/admin/**`):

  * Deben reutilizar la protección ya usada en T3/T4:

    * Autenticación vía cabecera `X-Admin-Secret` (valor desde `process.env` si está implementado).
  * No añadir un segundo mecanismo distinto; usa la misma abstracción de auth admin que ya existe.
* Endpoints **públicos** de leads:

  * Sin autenticación (formularios públicos).
  * Recomendaciones:

    * Limitar tamaño de payload (Fastify body limit).
    * No loguear bodies completos en logs.
    * Preparar el diseño para añadir más adelante un middleware anti-spam (CAPTCHA, rate limit).

---

## 6. REQUISITOS NO FUNCIONALES

* Reutilizar entidades, repos, tipos y patrones de T2/T3/T4.
* No duplicar lógica:

  * Reglas de negocio en `domain` / `application`, no en controladores.
* Paginación en listados admin (leads, settings, legales si crecieran).
* Logging básico:

  * Método, ruta, código de respuesta, sin datos sensibles.
* **No convertir campos textuales flexibles en enums TS más restrictivos** que el SQL.

  * Ej: `source`, `campaign` en leads, `setting_key` y `setting_type` en settings.

---

## 7. TESTING Y CRITERIOS DE ACEPTACIÓN

### 7.1. Tests de dominio

Casos mínimos:

* Creación de lead:

  * Falla si falta `first_name`, `last_name` o `email`.
  * Falla si `lead_type` no es uno de los permitidos.
* Reglas de formularios:

  * Pre-enrollment: exige campos de alumno (`student_name`, `student_age`).
  * Elite/Wedding: exige `preferred_date` y `preferred_time`.
* Cambio de estado:

  * No permite estados fuera del enum (`lead_status`).
  * Al marcar `converted`, registra `conversion_date`.

### 7.2. Tests de integración

* Para cada tipo de formulario público, al menos 1 test:

  * `POST /api/public/leads/contact`
  * `POST /api/public/leads/pre-enrollment`
  * `POST /api/public/leads/elite-booking`
  * `POST /api/public/leads/wedding`

  Verificar:

  * 200/201 según diseño.
  * Registro correcto en BD (`lead_type`, campos específicos).
  * `lead_status = 'new'`.

* Tests admin:

  * `GET /api/admin/leads` con filtros.
  * `PATCH /api/admin/leads/:id/status` (cambio de estado).
  * CRUD de `legal_pages`:

    * Intento de borrar una página legal estándar → error de dominio.
    * Actualización de contenido y versión.
  * `GET/PUT` de `settings`.

### 7.3. Criterios de aceptación

T5 se considera completada cuando:

* [ ] Existen endpoints CRUD admin funcionales para:

  * `legal_pages` bajo `/api/admin/legal-pages/**`.
  * `settings` bajo `/api/admin/settings/**`.
  * `leads` bajo `/api/admin/leads/**`.
* [ ] Existen endpoints públicos de captura de leads:

  * `/api/public/leads/contact`
  * `/api/public/leads/pre-enrollment`
  * `/api/public/leads/elite-booking`
  * `/api/public/leads/wedding`
* [ ] Todos los endpoints usan Zod para validar la entrada.
* [ ] No se han modificado tablas ni enums SQL existentes.
* [ ] La API pública T2 y las APIs admin T3/T4 siguen funcionando sin cambios de contrato.
* [ ] Hay tests de dominio para validaciones de leads y reglas de negocio críticas.
* [ ] Hay tests de integración para al menos un endpoint de cada tipo de formulario.
* [ ] `docs/api-admin-endpoints.md` y, si aplica, `docs/api-public-endpoints.md` se han actualizado con los endpoints de T5.
* [ ] `docs/CHANGELOG.md` contiene una entrada para T5 describiendo cambios y nuevos endpoints.
