# PRD T5 – API de Textos Legales, Settings y Leads

Monorepo **Kinesis Web + CMS** (TypeScript + Fastify) con arquitectura hexagonal/Clean en Replit.
**Tarea**: Crear API para `legal_pages`, `settings` y `leads` (admin + público).

---

## 1. RESTRICCIONES CRÍTICAS

### 1.1. NO Modificar
- `context/**`, `.replit`, `replit.nix` (solo lectura)
- Estructura de carpetas: `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`
- Endpoints existentes: `/`, `/health`, `/api/public/**` (T2), `/api/admin/**` (T3/T4)
- `replit.md`: solo pequeñas notas de estado en bloques existentes

### 1.2. Base de Datos
- **NO crear tablas** (`leads`, `legal_pages`, `settings` ya existen en esquema conceptual: `context/kinesis-database-schema.sql`)
- **NO crear migraciones** (solo si absolutamente necesario: `scripts/sql/05_*.sql`)
- **NO añadir valores a enums SQL**:
  - `lead_type`: `'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter'`
  - `lead_status`: `'new' | 'contacted' | 'qualified' | 'converted' | 'lost'`

### 1.3. Arquitectura
- Stack: Node + TypeScript + Fastify + Zod
- Patrón hexagonal: `api/domain`, `api/application`, `api/infrastructure`, `api/interfaces`
- **Reutilizar** código de T2/T3/T4: entidades, repositorios, controladores, schemas Zod, rutas

---

## 2. OBJETIVO

Crear dos niveles de API:

### API Admin (`/api/admin/**`)
- CRUD `legal_pages` (Aviso Legal, Privacidad, Cookies)
- CRUD `settings` (configuración del sitio)
- Gestión `leads` (listado, detalle, cambio estado, filtros)

### API Pública (`/api/public/leads/**`)
Captura de leads (solo POST) para:
- Contacto general
- Pre-inscripción (Generación Dance)
- Reserva Élite On Demand
- Servicio Coreográfico Nupcial

**Garantías**: API T2 sigue funcionando. No alterar tablas/enums BD.
**Garantías**: en T5 no se crean nuevos endpoints públicos ajenos a leads (`/api/public/**`), solo los endpoints de captura de leads descritos en este PRD.

---

## 3. ENDPOINTS Y REGLAS

### 3.1. Legal Pages

**Tabla**: `public.legal_pages`
Campos: `page_type` (UNIQUE), `title`, `content`, `version`, `effective_date`

**Admin (`/api/admin/legal-pages`):**
- `GET /` - Lista (filtro opcional: `pageType`)
- `GET /:id` - Detalle
- `GET /by-type/:pageType` - Por tipo
- `POST /` - Crear
- `PUT /:id` - Actualizar
- `DELETE /:id` - **NO permitir borrado** de tipos estándar (`legal`, `privacy`, `cookies`, `terms`)

**Validación Zod**: `pageType`, `title`, `content`, `version`, `effectiveDate` (todos obligatorios en POST/PUT)

---

### 3.2. Settings

**Tabla**: `public.settings`
Campos: `setting_key` (UNIQUE), `setting_value` (JSONB), `setting_type`, `description`

Ejemplos de `setting_key`: `site.name`, `site.address`, `site.phone`, `social.instagram`, `legal.contact_email`

**Admin (`/api/admin/settings`):**
- `GET /` - Lista (filtro opcional: `type`)
- `GET /:key` - Por clave
- `PUT /:key` - Actualizar
- `POST /` - Crear nueva (opcional)

**NO implementar DELETE** (no prioritario)

**Validación Zod**: `setting_key`, `setting_value` (JSON), `setting_type` (`site`, `email`, `social`, `analytics`)

---

### 3.3. Leads

**Tabla**: `public.leads`
Campos clave: `first_name`, `last_name`, `email`, `phone`, `lead_type`, `lead_status`, `source`, `message`, `interested_in_programs`, `student_name`, `student_age`, `previous_experience`, `preferred_date`, `preferred_time`, `session_type`

#### Mapeo Formularios → lead_type
- **Contacto general** → `'contact'`
- **Pre-inscripción** → `'pre_enrollment'`
- **Élite On Demand** → `'elite_booking'`
- **Coreográfico Nupcial** → `'elite_booking'` + `session_type='couple'` y/o `interested_in_programs` con código nupcial

#### Endpoints Públicos (`/api/public/leads/**`)
Solo POST, sin auth:
- `POST /contact` - Contacto general (requiere: `firstName`, `lastName`, `email`, `message`)
- `POST /pre-enrollment` - Pre-inscripción (requiere: `firstName/lastName/email`, `studentName`, `studentAge`, `previousExperience`)
- `POST /elite-booking` - Élite (requiere: `firstName/lastName/email`, `preferredDate`, `preferredTime`, `sessionType`)
- `POST /wedding` - Nupcial (como élite, pero marcar en `interested_in_programs`)

Todos marcan `lead_status='new'`, `source='web'`, capturan `utm_*` si se recibe.

**Validación Zod**: Campos específicos según formulario, validar email, limitar longitudes

#### Endpoints Admin (`/api/admin/leads/**`)
- `GET /` - Lista con filtros: `leadType`, `status`, `from`, `to`, `source`, `campaign` + paginación
- `GET /:id` - Detalle
- `PATCH /:id/status` - Cambiar estado + registrar `contacted_at`, `conversion_date`, `notes`
- `PATCH /:id` - Actualizar notas/tags (opcional)
- `DELETE /:id` - Evitar borrado físico (opcional)

**Reglas**:
- Siempre requerir: `first_name`, `last_name`, `email`, `lead_type` válido
- NO permitir cambiar `lead_type` después de creación
- Registrar tracking en cambios de estado

---

## 4. ESTRUCTURA CÓDIGO

### Domain (`api/domain/**`)
Entidades: `LegalPage`, `Setting`, `Lead`
Enums TS: `LeadType`, `LeadStatus` (alineados con SQL, NO añadir valores)

### Application (`api/application/**`)
Módulos: `legal-pages`, `settings`, `leads` (casos de uso)

### Infrastructure (`api/infrastructure/db/**`)
Repositorios:
- `PostgresLegalPageRepository` (extender con create/update/delete/list)
- `PostgresSettingsRepository` (read/update clave-valor)
- `PostgresLeadRepository` (create + queries filtradas)

### Interfaces (`api/interfaces/http/**`)
**Admin**:
- Controllers: `LegalPagesController.ts`, `SettingsController.ts`, `LeadsController.ts`
- Schemas Zod: `api/interfaces/http/admin/schemas/*`
- Routes: `api/interfaces/http/admin/routes/*`

**Público**:
- Controllers: `LeadsController.ts`
- Schemas: `api/interfaces/http/public/schemas/leads.schemas.ts`
- Routes: `api/interfaces/http/public/routes/leads.routes.ts`

---

## 5. SEGURIDAD

**Admin**: Reutilizar protección T3/T4 (`X-Admin-Secret` desde `process.env`)
**Público**: Sin auth, limitar payload, NO loguear bodies, preparar para anti-spam futuro

---

## 6. TESTING

### Domain
- Lead sin `first_name/last_name/email` → error
- `lead_type` inválido → error
- Pre-enrollment sin `student_name/student_age` → error
- Elite sin `preferred_date/preferred_time` → error

### Integración
1 test por formulario público:
- `POST /api/public/leads/contact`
- `POST /api/public/leads/pre-enrollment`
- `POST /api/public/leads/elite-booking`
- `POST /api/public/leads/wedding`

Verificar: 200/201, BD correcta (`lead_type`, campos), `lead_status='new'`

Admin:
- `GET /api/admin/leads` con filtros
- `PATCH /api/admin/leads/:id/status`
- CRUD legal_pages (error al borrar estándar, update OK)
- `GET/PUT /api/admin/settings`

---

## 7. CRITERIOS ACEPTACIÓN

- [ ] Endpoints CRUD admin funcionales: `legal-pages`, `settings`, `leads`
- [ ] 4 endpoints públicos de leads funcionando
- [ ] Validación Zod en todos los endpoints
- [ ] NO modificadas tablas/enums SQL
- [ ] API T2/T3/T4 funcionando sin cambios
- [ ] Tests dominio + integración (mínimo 1 por formulario)
- [ ] Actualizar `docs/api-admin-endpoints.md`, `docs/api-public-endpoints.md`, `docs/CHANGELOG.md`

---

## 8. REQUISITOS NO FUNCIONALES

- Reutilizar entidades, repos y tipos de T2/T3/T4 (no duplicar lógica).
- Mantener la lógica de negocio en `domain`/`application`, no en controladores.
- Paginación en listados admin donde tenga sentido (leads, settings si crecen).
- Logging básico (método, ruta, código de respuesta) sin incluir datos sensibles.
- NO convertir campos textuales flexibles (`source`, `campaign`, `setting_key`, etc.) en enums TypeScript más restrictivos que el modelo SQL.

---

## 9. OUT OF SCOPE

- UI CMS para leads/settings (FASE 3)
- Integración externa (Mailchimp, CRM)
- CAPTCHA/anti-spam (solo preparar diseño)