# Plan de Implementación Kinesis Web + CMS (revisado)

## ✅ Tareas Completadas (Base y Datos)

- [x] PRD T0 – Entorno y tooling base en Replit  
  Configuración de Node, TS, pnpm y servidor mínimo en `/api` con `GET /` y `GET /health`.
- [x] PRD T1 – Dominio + Base de Datos SQL Replit  
  Capas `domain` / `application` / `infrastructure` con repos Postgres y `scripts/sql/01_init_core_schema.sql`.

---

## ✅ FASE 2: Backend (API) — Casos de uso y Endpoints

> Objetivo: exponer primero **lectura pública estable** para la Web, y después los **CRUD internos** para el CMS.

### ✅ T2 – API Pública de Lectura (MVP Web)

Endpoints **solo lectura** que la Web usará para mostrar contenido:

- [x] Definir y exponer endpoints GET en Fastify (prefijo `/api/public` o similar) para:
    - [x] `programs` (listado y detalle por slug/id).
    - [x] `instructors` (listado y detalle básico).
    - [x] `pricing_tiers` asociados a programas.
    - [x] `business_models` (los 4 pilares).
    - [x] `page_content` (páginas estáticas: Quiénes somos, modelos, etc.).
    - [x] `faqs` (FAQ de modelos de negocio y servicios).
    - [x] `legal_pages` (solo lectura de textos legales).
- [x] Usar los servicios de `api/application/**` y repos de T1 (sin lógica extra en controladores).
- [x] Validación de entrada/salida con Zod (mínimo en responses).
- [x] **Tests básicos**:
    - [x] Tests unitarios de 1–2 casos de uso clave (e.g. `listProgramsForPublicSite`).
    - [x] Tests de integración sencillos de 2–3 endpoints GET.

### ✅ T3 – API CMS (CRUD Interno de Contenido Central)

Endpoints **CRUD protegidos** para que el CMS gestione el catálogo y el contenido:

- [x] Implementar endpoints internos (e.g. `/api/admin/...`) para:
    - [x] CRUD de `specialties`.
    - [x] CRUD de `instructors`.
    - [x] CRUD de `programs` y relaciones con `specialties` e `instructors`.
    - [x] CRUD de `pricing_tiers`.
- [x] Añadir casos de uso en `api/application` si faltan (create/update/delete).
- [x] Reutilizar y extender el modelo y SQL de T1 (sin romper la API pública).
- [x] Validación con Zod en cuerpos de petición (`POST/PUT/PATCH`).
- [x] **Tests**:
    - [x] Tests de dominio (reglas mínimas: relaciones obligatorias, estados válidos).
    - [x] Tests de integración para al menos 1 flujo CRUD completo.

### ✅ T4 – API CMS para Modelos de Negocio, Páginas y FAQs

- [x] CRUD para:
    - [x] `business_models` (los 4 pilares).
    - [x] `page_content` (Quiénes somos, Modelo de negocio, etc.).
    - [x] `faqs` (por categorías).
- [x] Garantizar que la API pública (T2) se nutre de estos mismos datos (sin duplicar modelos).
- [x] **Tests**:
    - [x] Tests para evitar borrado accidental de contenido crítico (p.ej. negocio principal).

### ✅ T5 – API de Textos Legales, Settings y Leads

- [x] CRUD para:
    - [x] `legal_pages` (Aviso Legal, Privacidad, Cookies).
    - [x] `settings` (datos generales, redes, horarios).
- [x] Endpoints de captura de `leads`:
    - [x] Formulario Contacto general.
    - [x] Formulario Pre-inscripción.
    - [x] Reserva Sesión Élite On Demand.
    - [x] Servicio Coreográfico Nupcial.
- [x] Casos de uso correspondientes en `api/application/leads`.
- [ ] **Tests**:
    - [x] Tests de dominio para creación de leads (validaciones básicas).
    - [x] Tests de integración para al menos un endpoint de cada tipo de formulario.

---

## FASE 3: Frontend (CMS) — Panel de Administración

> Objetivo: construir un CMS usable y coherente con el diseño de `context/kinesis-guia-de-implementacion.md`, consumiendo la API de la FASE 2.

### ✅ T6 – Bootstrap del CMS y Autenticación

- [x] Inicializar `cms/` con React + Vite + Tailwind (+ shadcn/ui).
- [x] Configurar ruteo interno (`/admin/...`).
- [x] Integrar **Replit Auth** u otro mecanismo acordado para:
    - [x] Login.
    - [x] Gestión mínima de sesión/usuario.
    - [x] Protección de rutas de administración.
- [x] Layout base: Sidebar, Topbar, contenido principal.

### T7 – Dashboard y Estructura Base del CMS

- [ ] Implementar `Dashboard` inicial:
    - [ ] KPIs sencillos (nº leads recientes, últimos formularios).
- [ ] Crear componentes base en `shared/ui`:
    - [ ] Tablas (`DataTable`), filtros (`FilterSidebar`), formularios estándar.
- [ ] Implementar gestión de:
    - [ ] Navegación del CMS (menús, secciones).
    - [ ] Branding interno (nombre del estudio, logo en backoffice si aplica).

### T8 – Vistas de Contenido Web y Horarios (CMS)

- [ ] UI para gestionar:
    - [ ] `Programas y servicios` (CRUD completo).
    - [ ] `Equipo` (fichas de profesores).
    - [ ] `Horarios y Tarifas`.
- [ ] Conectar cada vista con los endpoints de T3/T4 (react-query, formularios, validación con Zod).

### T9 – Vistas de Leads y Textos Legales (CMS)

- [ ] Pantallas de:
    - [ ] `Leads`: listado, filtros, detalle, cambio de estado.
    - [ ] `Textos Legales y Políticas`: CRUD de `legal_pages`.
    - [ ] `Ajustes del Sitio`: `settings` (contacto, redes, horarios).
- [ ] Acciones masivas mínimas (p.ej. marcar leads como leídos).

---

## FASE 4: Frontend (Web) — Web Corporativa

> Objetivo: Web pública mobile-first, consumiendo la API de lectura (T2).

### T10 – Configuración Web y Layout Base

- [ ] Inicializar `web/` con React + Vite + Tailwind.
- [ ] Configurar ruteo público.
- [ ] Implementar enfoque **Mobile First**:
    - [ ] Layout responsive.
    - [ ] Menú tipo **Hamburger** en móvil.
- [ ] Layout principal (Header, Nav, Footer) compartiendo diseño con CMS donde tenga sentido (`shared/ui`).

### T11 – Homepage (MVP)

- [ ] Sección Hero con mensaje principal de propuesta de valor.
- [ ] Bloques para los **4 modelos de negocio**.
- [ ] CTAs principales:
    - [ ] “Reserva Élite”.
    - [ ] “Preinscríbete”.
- [ ] Contenido dinámico consumiendo API pública (T2) donde aplique.

### T12 – Contenido Estático y Propuesta de Valor

- [ ] Página `Quiénes Somos` (misión, valores) consumiendo `page_content`.
- [ ] Página `Modelos de Negocio` (detalle de cada modelo).
- [ ] FAQ pública usando `faqs` de la API.

### T13 – Catálogo de Programas y Equipo

- [ ] Página `Programas y Servicios`:
    - [ ] Listado, filtros (especialidad, nivel, etc.).
- [ ] Páginas de detalle de `Programa/Servicio`.
- [ ] Página `Equipo`:
    - [ ] Listado y fichas de profesores.

### T14 – Horarios, Tarifas y Formularios Públicos

- [ ] Sección `Horarios y Tarifas` (vista de cuadrante + explicación).
- [ ] Formularios:
    - [ ] Contacto general.
    - [ ] Preinscripción.
    - [ ] Reserva Élite On Demand.
    - [ ] Servicio Coreográfico Nupcial.
- [ ] Conectar formularios a los endpoints de leads (T5) y mostrar mensajes de éxito/error.

---

## FASE 5: QA, Testing y Despliegue

> Objetivo: endurecer la calidad, cumplir requisitos legales y desplegar en Replit.

### T15 – Refuerzo de Pruebas de Calidad

- [ ] **Aumentar cobertura de tests unitarios** en:
    - [ ] `api/domain/**`.
    - [ ] `api/application/**`.
- [ ] **Tests de integración/E2E**:
    - [ ] Flujos críticos de API (altas de leads, obtención de programas).
    - [ ] Flujos Web (navegar, enviar formulario).
    - [ ] Flujos CMS (login, editar contenido clave).

### T16 – Cumplimiento Legal y SEO

- [ ] Revisar e implementar páginas legales en la Web:
    - [ ] Aviso Legal.
    - [ ] Política de Privacidad.
    - [ ] Política de Cookies.
- [ ] SEO técnico:
    - [ ] Meta tags dinámicos (título, descripción).
    - [ ] `sitemap.xml`, `robots.txt`.
    - [ ] Open Graph / social sharing.
- [ ] Revisar que la API sirve todo lo necesario para SEO donde aplique.

### T17 – Optimización y Despliegue Final en Replit

- [ ] Revisar performance (Core Web Vitals) en `web/` y `cms/`.
- [ ] Cerrar scripts definitivos:
    - [ ] `build`: build de `web` y `cms` + preparación de `api`.
    - [ ] `start`: servidor único sirviendo `/api/**`, `/` (web) y `/admin` (CMS).
- [ ] Configurar **Autoscaling Deploy** en Replit con los comandos anteriores.
- [ ] Revisar `CHANGELOG.md` y `docs/` para documentar estado final del proyecto.
