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

### ✅ T7 – Dashboard y Estructura Base del CMS

- [x] Implementar `Dashboard` inicial:
    - [x] KPIs sencillos (nº leads recientes, últimos formularios).
- [x] Crear componentes base en `shared/ui`:
    - [x] Tablas (`DataTable`), filtros (`FilterSidebar`), formularios estándar.
- [x] Implementar gestión de:
    - [x] Navegación del CMS (menús, secciones).
    - [x] Branding interno (nombre del estudio, logo en backoffice si aplica).

### ✅ T8 – Vistas de Contenido Web y Horarios (CMS)

- [x] UI para gestionar:
    - [x] `Programas y servicios` (CRUD completo).
    - [x] `Equipo` (fichas de profesores).
    - [x] `Horarios y Tarifas`.
- [x] Conectar cada vista con los endpoints de T3/T4 (react-query, formularios, validación con Zod).

### T9 – Vistas de Leads y Textos Legales (CMS)

- [ ] Pantallas de:
    - [ ] `Leads`: listado, filtros, detalle, cambio de estado.
    - [ ] `Textos Legales y Políticas`: CRUD de `legal_pages`.
    - [ ] `Ajustes del Sitio`: `settings` (contacto, redes, horarios).
- [ ] Acciones masivas mínimas (p.ej. marcar leads como leídos).

---

## FASE 4: Frontend (Web) — Web Corporativa

> Objetivo: Web pública **mobile-first**, basada en el **Stack-UI Kinesis** (React + Vite + Tailwind + shadcn/ui + Launch UI + patrones Serene Yoga), consumiendo la API de lectura (T2).

---

### T10 – Configuración Web, Stack-UI y Layout Base

- [ ] Inicializar `web/` con **React + Vite + Tailwind** (si no existe) siguiendo la guía técnica de Kinesis.
- [ ] Integrar **shadcn/ui** en `web/` según `KB-shadcn-ui.md`:
  - [ ] Configurar CLI (`npx shadcn-ui`) apuntando a la estructura de proyecto acordada.
  - [ ] Crear/ajustar `shared/ui/` como librería de componentes base (Button, Card, Input, Form, Dialog, Avatar, etc.).
- [ ] Integrar **Launch UI Components** según `KB-launch-ui-components.md`:
  - [ ] Añadir bloques de secciones en `shared/components/sections/` (Hero, Features, Pricing, FAQ, Footer…) tomando como referencia el catálogo de Launch UI.
- [ ] Configurar **Tailwind + theming** según `KB-shadcn-ui.md` y paleta Kinesis:
  - [ ] Variables CSS globales (`--background`, `--foreground`, `--brand`, `--radius`, etc.).
  - [ ] Dark mode (si se habilita) mediante clase `.dark`.
- [ ] Configurar **ruteo público** (React Router) con estructura mínima:
  - [ ] `/` (Home).
  - [ ] `/quienes-somos`.
  - [ ] `/modelos-de-negocio`.
  - [ ] `/programas`.
  - [ ] `/programas/:slug`.
  - [ ] `/equipo`.
  - [ ] `/horarios-tarifas`.
  - [ ] Rutas legales (`/legal/aviso`, `/legal/privacidad`) y otras que defina el PRD.
- [ ] Implementar enfoque **Mobile First** siguiendo `KB-patrones-responsive-kinesis-web.md`:
  - [ ] Layout responsive basado en container + grid/flex (`container mx-auto max-w-7xl px-4`, etc.).
  - [ ] Menú tipo **Hamburger** en móvil usando componentes de shadcn/ui (p.ej. `Sheet`/`Dialog`) y nav desktop con `NavigationMenu` o equivalente.
- [ ] Layout principal (Shell de la web):
  - [ ] Definir `LayoutPublic` con **Header + Nav + Footer** reutilizando componentes de `shared/ui` y secciones de Launch UI.
  - [ ] Alinear tipografías, espaciados y componentes con el CMS donde tenga sentido (botones, formularios, mensajes), compartiendo `shared/ui`.

---

### T11 – Homepage (MVP) basada en secciones de Stack-UI

- [ ] Implementar `HomePage` como composición de secciones según `KB-launch-ui-components.md` y `KB-template-serene-yoga.md`:
  - [ ] `<HeroPrimary>` (Hero principal) usando bloque Hero de Launch UI adaptado a Kinesis:
    - [ ] Mensaje principal de propuesta de valor (H1).
    - [ ] Subtítulo inspirador alineado con el PRD.
    - [ ] Imagen/foto acorde a patrones de Serene Yoga (imagen lateral o background controlado).
  - [ ] `<BusinessModelsSection>` para los **4 modelos de negocio**:
    - [ ] Presentar cada modelo como card/feature (icono, título, breve descripción).
    - [ ] Alinear estructura semántica con `kinesis-modelos-negocio` (cuando exista).
- [ ] CTAs principales desde Hero y secciones destacadas:
  - [ ] “Reserva Élite” → abre formulario/modal o navega a sección/formulario específico (ver T14).
  - [ ] “Preinscríbete” → idem, vinculado a endpoints de leads (T5).
- [ ] Asegurar **mobile-first** y patrones de layout de `KB-patrones-responsive-kinesis-web.md`:
  - [ ] Hero 1-col en móvil, 2-col en desktop.
  - [ ] Botones CTA apilados en móvil, alineados en línea en desktop.
- [ ] Conectar contenido dinámico (si aplica en MVP) a la **API pública (T2)**:
  - [ ] Inyectar textos/links de modelos de negocio desde endpoints de lectura si ya están disponibles.
  - [ ] Mantener el resto como contenido estático parametrizable (para futura conexión a CMS).

---

### T12 – Contenido Estático y Propuesta de Valor (Pages + PageLayout)

- [ ] Definir un componente `PageLayout` base para páginas de contenido estático:
  - [ ] Encabezado de página (title + subtitle).
  - [ ] Contenido tipográfico con estilos consistentes (`prose` o equivalente con Tailwind + shadcn).
- [ ] Página `Quiénes Somos`:
  - [ ] Construida sobre `PageLayout`.
  - [ ] Consumir `page_content` de la API de lectura cuando esté disponible.
  - [ ] Alinear secciones (misión, valores, historia) con el PRD.
- [ ] Página `Modelos de Negocio`:
  - [ ] Presentar cada modelo como sección propia, reutilizando patrones de cards/bloques de Launch UI.
  - [ ] Permitir navegación a secciones internas (anchor links) si hay contenido extenso.
- [ ] FAQ pública:
  - [ ] Implementar `<FaqSection>` usando `Accordion` de shadcn/ui según `KB-patrones-responsive-kinesis-web.md`.
  - [ ] Cargar contenido desde `faqs` de la API (T2).
  - [ ] Garantizar accesibilidad (estructura de Accordion de Radix).

---

### T13 – Catálogo de Programas y Equipo (Stack-UI + API lectura)

- [ ] Página `Programas y Servicios` (`/programas`):
  - [ ] Implementar `<ProgramsSection>` siguiendo patrones de cards de `KB-launch-ui-components.md`:
    - [ ] Cards con título, descripción, nivel, tipo de programa.
    - [ ] Etiquetas (`Badge`) para especialidad, nivel, edad, etc.
  - [ ] Integrar **filtros** (especialidad, nivel, modalidad):
    - [ ] Diseño mobile-first (filtros en Drawer o Accordion en móvil, barra lateral/superior en desktop).
    - [ ] Uso de componentes de formulario de shadcn/ui (`Select`, `Checkbox`, etc.).
  - [ ] Consumir datos de `programas/servicios` desde la API pública (T2).
- [ ] Páginas de detalle de `Programa/Servicio` (`/programas/:slug`):
  - [ ] Componente `ProgramDetailPage`:
    - [ ] Sección hero contextual (nombre programa, nivel, breve summary).
    - [ ] Descripción detallada, requisitos, objetivos.
    - [ ] Bloque de horarios relacionados (si aplica, enlazado con T14).
    - [ ] CTA “Preinscríbete” o “Reserva Élite” según tipo de programa.
  - [ ] Reutilizar bloques UI de descripción/beneficios definidos en `KB-shadcn-ui.md` + `KB-launch-ui-components.md`.
- [ ] Página `Equipo` (`/equipo`):
  - [ ] Implementar `<TeamSection>` según `KB-template-serene-yoga.md` y `KB-patrones-responsive-kinesis-web.md`:
    - [ ] Grid de instructores con `Avatar`, nombre, especialidad, mini-bio.
    - [ ] Adaptación responsive (1 col móvil, 2-3 col tablet, 4 col desktop).
  - [ ] Opcional: página de detalle por profesor (`/equipo/:slug`) si está en alcance:
    - [ ] Bio ampliada, especialidades, programas que imparte.
  - [ ] Consumir datos desde endpoint `instructores` de la API de lectura.

---

### T14 – Horarios, Tarifas y Formularios Públicos (Leads)

- [ ] Sección `Horarios y Tarifas` (`/horarios-tarifas`):
  - [ ] Implementar vista de horarios inspirada en `KB-template-serene-yoga.md`:
    - [ ] Opción A: cuadrante semanal (tabla) con `overflow-x-auto` en móvil.
    - [ ] Opción B: vista por día con `Accordion` en móvil, grid en desktop.
  - [ ] Implementar `<PricingSection>` usando bloques de Launch UI (pricing cards) según `KB-launch-ui-components.md`:
    - [ ] Planes principales (Mensual, Ilimitado, Clase suelta, etc.).
    - [ ] Destacar plan recomendado con badge/estilo diferenciado.
- [ ] Formularios públicos:
  - [ ] Implementar componentes de formulario reutilizables en `shared/ui` (basados en `Form`, `Input`, `Textarea`, `Select` de shadcn/ui):
    - [ ] Validación client-side (React Hook Form + Zod) alineada con prácticas de `KB-shadcn-ui.md`.
  - [ ] Formularios específicos:
    - [ ] **Contacto general** (nombre, email, mensaje).
    - [ ] **Preinscripción** (datos básicos + selección de programa).
    - [ ] **Reserva Élite On Demand** (datos + preferencia de horario/modelo Élite).
    - [ ] **Servicio Coreográfico Nupcial** (datos de pareja, fecha prevista, tipo de coreografía).
  - [ ] Integrar formularios con endpoints de **leads (T5)**:
    - [ ] Enviar payload estructurado (incluyendo origen de la petición y tipo de lead).
    - [ ] Manejar estados de carga, éxito y error con componentes de feedback (Alerts, Toasts).
    - [ ] Mostrar mensajes de éxito/error acordes a UX (mensajes claros, no técnicos).
- [ ] Garantizar **accesibilidad y mobile-first** en todos los formularios:
  - [ ] Labels asociadas, mensajes de error visibles, focus states adecuados.
  - [ ] Layout de campos en una columna en móvil, posibilidad de 2 columnas en desktop para campos cortos.

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
