# PRD T8 – Vistas de Contenido Web y Horarios (CMS) + WYSIWYG + Media Library

## 0. Contexto

Monorepo **Kinesis Web + CMS** (TypeScript, Fastify, React/Vite) con arquitectura hexagonal.
T2–T6 ya han entregado:

* API pública de lectura (`/api/public/**`)
* API admin (`/api/admin/**`) para programas, instructores, pricing tiers, business models, pages, FAQs, leads, settings, legal_pages
* CMS base con login, dashboard y theme Dark/Light en `cms/`
* Modelo de datos conceptual con tabla `media_library` y vistas `programs_full`, `instructors_full`, etc.

**T8** se centra en la **UI del CMS** para gestionar Programas, Equipo, Horarios/Tarifas y en un primer **gestor de imágenes** + **editor WYSIWYG HTML** para los textos que se verán en la web.

---

## 1. Restricciones Críticas

### 1.1. No tocar

* `context/**`, `.replit`, `replit.nix`
* Estructura de carpetas de primer nivel (`api/`, `web/`, `cms/`, `core/`, `shared/`, `scripts/`, `docs/`, etc.)
* Endpoints existentes:

  * `/`, `/health`
  * `/api/public/**` (T2)
  * `/api/admin/**` (T3–T5)
* Sistema de autenticación del CMS (X-Admin-Secret + AuthProvider)
* Sistema de temas (Dark/Light) y theme tokens definidos en T6.1 / T6.2

### 1.2. Base de datos

* Seguir utilizando el modelo conceptual de `context/kinesis-database-schema.sql` como referencia, **no ejecutarlo directamente**.
* Migraciones activas: `01_init_core_schema.sql`, `02_public_api_schema.sql`.
* **Solo se permite**:

  * Crear **nueva migración incremental** en `scripts/sql/0X_media_library_schema.sql` (siguiente número libre) para implementar `media_library` si aún no existe.
  * Añadir columnas nuevas necesarias (nunca borrar/renombrar columnas usadas por T2–T5, ni cambiar tipos).
* No modificar enums existentes (`difficulty_level`, `publication_status`, `lead_type`, etc.).

### 1.3. App Storage Replit

* Usar **App Storage** de Replit para almacenar los archivos (imágenes) de forma persistente, siguiendo las recomendaciones de la guía de almacenamiento (no escribir en el filesystem de código).
* El backend solo debe almacenar **metadatos + URLs públicas** en Postgres (`media_library`), nunca binarios en la BD.

---

## 2. Objetivo Funcional

1. **UI CMS completa** para:

   * Programas y servicios (Programas)
   * Equipo (Instructores)
   * Horarios y Tarifas (combinando Programas + Pricing Tiers + horarios)
2. **WYSIWYG HTML** para los textos que se muestran en la Web:

   * Descripción extensa de programa (`programs.description_full`)
   * Bio extendida de instructor (`instructors.bio_full` si existe campo; si no, usar `bio_summary` como fallback)
3. **Gestor de imágenes simple**:

   * Subida de imágenes a Replit App Storage
   * Registro en tabla `media_library`
   * Selección de imagen desde el CMS para:

     * Programas (featured image, galerías)
     * Instructores (foto perfil, hero image)

---

## 3. Alcance de UI (CMS)

Todas las vistas se implementan en `cms/` aprovechando:

* Routing existente (`/admin/programs`, `/admin/instructors`, etc.)
* Componentes base de T7 (`DataTable`, `FilterSidebar`, formularios base)
* Sistema de tema y branding definidos en `kinesis-guia-de-implementacion.md`

### 3.1. Vista "Programas y servicios"

**Ruta**: `/admin/programs`

#### 3.1.1. Listado (DataTable)

* Columnas principales:

  * Nombre del programa
  * Código (`code`)
  * Modelo de negocio (nombre + `internal_code`)
  * Especialidad principal
  * Dificultad (`difficulty_level`)
  * Flags: `is_active`, `show_on_web`, `is_featured`
* Filtros en `FilterSidebar`:

  * `businessModelId`
  * `specialtyId`
  * `difficulty_level`
  * `is_active`
  * `show_on_web`
* Acciones por fila:

  * Editar
  * Duplicar (crear nuevo programa con los mismos datos en estado `draft`)
  * Desactivar (toggle `is_active`/`show_on_web`)

#### 3.1.2. Formulario de Programa

Formulario en modal o página con tabs:

1. **General**

   * Campos básicos: `name`, `code`, `subtitle`, `business_model_id`, `specialty_id`, `difficulty_level`, `slug`, `display_order`
   * Flags: `is_active`, `show_on_web`, `is_featured`, `allow_online_enrollment`

2. **Contenido**

   * `description_short` → textarea normal
   * `description_full` → **WYSIWYG HTML** (ver sección 4)
   * `schedule_description` (texto breve de horarios)

3. **Horarios**

   * Si existen endpoints admin para `schedules`, usar tabla editable para:

     * día (`day_of_week`)
     * hora inicio/fin
     * aula (si aplica)
   * Si aún no hay endpoints, limitarse a `schedule_description` y marcar en comentarios de código el TODO para T8.x.

4. **Tarifas**

   * Tabla embebida de `pricing_tiers` asociados al programa (`pricing_tiers` T3/T5):

     * nombre, precio, periodo, flag `is_visible_on_web`, `is_recommended`
   * Acciones: añadir, editar, eliminar (usando endpoints `/api/admin/pricing-tiers`)

5. **Media**

   * Selector de **imagen destacada** (usa Media Library)
   * Galería opcional (lista de imágenes relacionadas)

---

### 3.2. Vista "Equipo" (Instructores)

**Ruta**: `/admin/instructors`

#### 3.2.1. Listado

* Columnas:

  * Nombre completo (`first_name` + `last_name`)
  * Rol (`role`: director, profesor, etc.)
  * Especialidades principales
  * Flags: `is_active`, `show_on_web`, `featured`
* Filtros:

  * Rol
  * Especialidad
  * `show_on_web`
  * `featured`

#### 3.2.2. Formulario de Instructor

Tabs:

1. **General**

   * `first_name`, `last_name`, `display_name`, `role`
   * Flags: `is_active`, `show_on_web`, `featured`, `show_in_team_page`
2. **Bio**

   * `bio_summary` (texto corto)
   * `bio_full` (o campo equivalente) → **WYSIWYG HTML**
3. **Especialidades**

   * Multi-select de specialties (usa admin API de specialties)
4. **Media**

   * `profile_image_url`, `hero_image_url`, `video_url` (opcional)
   * Selección de imágenes desde Media Library

---

### 3.3. Vista "Horarios y Tarifas"

**Ruta**: `/admin/schedules-pricing` (o la que ya tengas en el router para “Horarios y Tarifas”)

Objetivo: ofrecer una vista consolidada para el equipo interno donde puedan ver y editar:

* Horarios por programa
* Tarifas asociadas

#### 3.3.1. Listado Consolidado

* DataTable con una fila por programa:

  * Programa
  * Modelo de negocio
  * `schedule_description` + resumen de horarios estructurados (si existen)
  * Número de pricing tiers activos
* Acciones:

  * “Editar horarios”
  * “Editar tarifas” (abre modal/tab correspondiente del programa)

---

## 4. Editor WYSIWYG HTML

### 4.1. Librería sugerida

* Usar un editor React ligero: por ejemplo **Tiptap**, **React Quill** o similar (el que mejor encaje en Replit).
* Integrarlo como componente compartido `RichTextEditor` en `cms/src/shared/ui/RichTextEditor.tsx`.

### 4.2. Requisitos funcionales

* Toolbar mínima:

  * Negrita, cursiva, subrayado
  * Listas ordenadas/no ordenadas
  * Encabezados (H2, H3)
  * Enlaces
* Salida: **HTML seguro** (string) que se almacena en:

  * `programs.description_full`
  * `instructors.bio_full` (o campo equivalente)
* Sanitización:

  * Limitar etiquetas permitidas (`p`, `strong`, `em`, `ul`, `ol`, `li`, `a`, `h2`, `h3`, `br`)
  * Quitar atributos peligrosos (`on*`, `style` en general salvo whitelists básicas)
* Vista previa opcional mínima (mismo componente renderizando HTML).

### 4.3. Validación

* Integrar con Zod en formularios:

  * longitud mínima de contenido
  * urls válidas en enlaces
* Si el HTML vacío tras sanitización → error de validación.

---

## 5. Media Library + Replit App Storage

### 5.1. Modelo de datos

Basarse en la tabla conceptual `media_library`:

Campos clave:

* `id` (UUID)
* `filename` / `original_name`
* `mime_type`, `size_bytes`
* `url` (URL pública App Storage)
* `thumbnail_url` (opcional)
* `alt_text`, `caption`, `tags[]`
* `folder` (ej: `programs`, `instructors`, `gallery`)
* `uploaded_at`

**Migración:**

* Crear script nuevo `scripts/sql/0X_media_library_schema.sql` que:

  * Crea la tabla `public.media_library` + índices `idx_media_folder` e `idx_media_tags`
  * **No** define RLS complicada ni triggers en esta fase.

### 5.2. API Backend

Nuevo módulo admin `/api/admin/media`:

* `GET /api/admin/media`

  * Filtros: `folder`, búsqueda por `filename`/`tags`, paginación.
* `POST /api/admin/media`

  * Payload: metadata + resultado de subida (URL ya generada) **o** multipart form-data si se decide subir el binario.
  * El handler debe:

    * Guardar archivo en App Storage siguiendo las guías de Replit (ruta `media/{folder}/{uuid}.{ext}`).
    * Obtener URL pública para servirlo.
    * Insertar registro en `media_library`.
* `DELETE /api/admin/media/:id`

  * Marca lógico (opcional) o elimina registro + archivo en App Storage.

**Restricciones:**

* Tamaño máximo razonable (ej. 5–10MB por imagen)
* Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`

### 5.3. UI Media Library en CMS

Componente reutilizable `MediaPicker`:

* Modal con:

  * Tabs “Biblioteca” y “Subir”
  * Grid de thumbnails (usa `thumbnail_url` o `url`)
  * Filtros por `folder` y búsqueda por texto
* Acciones:

  * Seleccionar imagen → devuelve objeto `{ id, url, alt_text }`
  * Subir nueva imagen:

    * Input tipo file
    * Selección de `folder` (según contexto: `programs`, `instructors`, `gallery`)
    * Campos opcionales: `alt_text`, `caption`, `tags`

Integrar `MediaPicker` en formularios de Programas e Instructores.

---

## 6. Integración con API Admin (T3/T4/T5)

### 6.1. adminApi.ts (CMS)

* Extender `cms/src/api/adminApi.ts` con hooks `usePrograms`, `useProgram`, `useUpsertProgram`, `useInstructors`, `usePricingTiersByProgram`, etc., usando React Query.
* Añadir métodos para `/api/admin/media` nuevo.
* Usar `X-Admin-Secret` automáticamente como ya hace el httpClient.

### 6.2. Validación y control de errores

* Todos los formularios deben:

  * Validar con Zod (schema en `cms/src/app/schemas/...`)
  * Mostrar errores de backend (400, 422) como mensajes bajo el campo correspondiente.
* Manejo de estados:

  * Loading → Skeletons o spinners
  * Error → toast “Ha ocurrido un error…” con detalle técnico opcional en consola
  * Success → toast de éxito + cierre de modal / redirección

---

## 7. Testing

### 7.1. Frontend (CMS)

* Tests de componentes críticos (si hay infraestructura de tests en cms/):

  * `ProgramsPage` carga y muestra datos simulados.
  * `RichTextEditor`:

    * renderiza toolbar
    * produce HTML esperado para negrita/listas
  * `MediaPicker`:

    * lista elementos mock
    * dispara callback `onSelect` al seleccionar uno

### 7.2. Backend

* Unit tests de repositorio `PostgresMediaLibraryRepository` (si se crea).
* Tests de integración:

  * `POST /api/admin/media` crea registro y devuelve URL.
  * E2E simplificado: crear programa con imagen destacada vía API.

---

## 8. Criterios de Aceptación

* [ ] CMS tiene vistas funcionales para:

  * [ ] Programas y servicios (listado + formulario completo)
  * [ ] Equipo (listado + formulario completo)
  * [ ] Horarios y Tarifas (vista consolidada basada en programas + tarifas)
* [ ] Textos largos de programas e instructores se editan con WYSIWYG HTML, se guardan en BD y se muestran correctamente en el CMS.
* [ ] Existe Media Library:

  * [ ] Nueva tabla `media_library` creada mediante migración incremental.
  * [ ] Endpoints `/api/admin/media` permiten listar y subir imágenes.
  * [ ] MediaPicker funcional en formularios de programas/instructores.
* [ ] App Storage de Replit se utiliza para guardar archivos, y en BD solo se almacenan URLs/metadatos.
* [ ] No se rompe ningún endpoint existente (T2–T6).
* [ ] No se modifican `context/**`, `.replit`, `replit.nix`.
* [ ] CMS compila sin errores y mantiene funcionamiento de T6/T6.1/T6.2.
