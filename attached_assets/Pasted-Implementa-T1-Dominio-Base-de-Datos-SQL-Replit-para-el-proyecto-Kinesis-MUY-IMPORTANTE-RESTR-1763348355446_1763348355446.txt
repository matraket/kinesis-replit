Implementa T1: Dominio + Base de Datos SQL Replit para el proyecto Kinesis

MUY IMPORTANTE – RESTRICCIONES PREVIAS:
- NO modifiques ni borres nada dentro de la carpeta `context/`. Es SOLO LECTURA.
- NO modifiques ni sobrescribas `replit.md`. Puedes leerlo, pero NO tocarlo.
- NO toques `.replit` ni `replit.nix` en esta tarea.
- NO cambies la estructura principal de carpetas (`api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`).
- NO crees endpoints HTTP nuevos todavía (no añadas rutas nuevas a Fastify para T1).
- El servidor Fastify actual en `api/main.ts` debe seguir funcionando exactamente igual para `GET /` y `GET /health`.

Contexto:

- Lee SOLO para consulta (NO modificar):
  - `context/kinesis-*.md`
  - `context/doc/*.md`
  - `context/kinesis-database-schema.sql`
- El servidor Fastify ya existe en `api/main.ts` (T0 completo).
- Debes usar la Database SQL integrada de Replit (PostgreSQL).

Tareas principales:

1) Crear módulos de dominio en `api/domain/` (sin dependencias de infraestructura):

- `api/domain/programs/`  → Programas/servicios/cursos con entidades y value objects.
- `api/domain/schedules/` → Horarios/clases.
- `api/domain/content/`   → Páginas/secciones web.
- `api/domain/leads/`     → Capturas de formularios.

Cada módulo debe:
- Definir entidades con los campos mínimos razonables según los documentos de `context/`.
- Mantener el dominio PURO (sin imports de librerías de DB ni de Fastify).

2) Crear servicios de aplicación en `api/application/`:

- `api/application/programs/`:
  - `listProgramsForPublicSite()`
  - `getProgramBySlug(slug)`
- `api/application/schedules/`:
  - `listSchedulesForProgram(programId)`
- `api/application/content/`:
  - `getPageBySlug(slug)`
  - `listMainNavigationItems()`
- `api/application/leads/`:
  - `createLead(input)`
  - `listRecentLeads()`

Reglas:
- Usa tipos `Result<T, E>` de `core/shared` (o un patrón similar) en vez de lanzar excepciones sin controlar.
- Estos servicios NO deben hacer SQL directo; deben usar interfaces de repositorio.

3) Definir interfaces de repositorio en `api/application/ports/`:

- Interfaces:
  - `ProgramsRepository`
  - `SchedulesRepository`
  - `ContentRepository`
  - `LeadsRepository`

Cada interfaz debe:
- Describir los métodos mínimos para soportar los casos de uso anteriores (list, get, create).
- Ser completamente pura, sin detalles de Postgres ni de librerías de infraestructura.

4) Implementar adaptadores de DB en `api/infrastructure/db/`:

- Crear `api/infrastructure/db/client.ts` (o nombre equivalente) como cliente PostgreSQL centralizado usando la librería `pg`.
  - Debe leer la connection string desde una variable de entorno, por ejemplo `DATABASE_URL`.
  - NO debes hardcodear credenciales.

- Crear repositorios concretos:
  - `PostgresProgramsRepository`
  - `PostgresSchedulesRepository`
  - `PostgresContentRepository`
  - `PostgresLeadsRepository`

Cada repositorio debe:
- Usar consultas SQL parametrizadas seguras.
- Mapear filas de la DB ↔ entidades de dominio.
- No filtrar detalles SQL hacia la capa de aplicación (solo devuelve entidades o resultados de dominio).

5) Crear script SQL inicial en `scripts/sql/01_init_core_schema.sql`:

- Basado en `context/kinesis-database-schema.sql`, define SOLO las tablas mínimas necesarias para:
  - Contenidos (páginas/secciones).
  - Programas/servicios.
  - Horarios.
  - Leads.

- Simplifica:
  - No hace falta incluir toda la complejidad (triggers avanzados, vistas, políticas RLS) todavía.
  - Añade comentarios en el SQL donde estés simplificando respecto al schema de referencia.

- Marca claramente el archivo como:
  - “NO AUTOMÁTICO”, es decir, no debe ejecutarse todavía de forma automática.
  - Base para migraciones futuras (se usará en una tarea posterior de migraciones, no en T1).

6) Ajustar health check (OPCIONAL, solo si es sencillo y seguro):

- Puedes mejorar `GET /health` para incluir un campo que refleje el estado de la DB, por ejemplo:
  - `dbStatus: "unknown" | "ok" | "error"`.
- Si decides hacerlo:
  - Debe usar el cliente de DB de `api/infrastructure/db/client.ts`.
  - No debe romper el endpoint si la DB no está configurada aún (manejar errores con cuidado).
- Si complica demasiado o añade fragilidad, puedes dejar `/health` como está y solo preparar comentarios/TODOs.

Restricciones (resúmen):

- NO crear endpoints REST nuevos (eso será T2).
- NO modificar nada en `/context/`.
- NO automatizar migraciones (eso será T8).
- NO tocar `web/` ni `cms/`.
- NO tocar `replit.md`, `.replit` ni `replit.nix`.
- El servidor debe seguir funcionando: `GET /` y `GET /health` deben seguir respondiendo sin errores.

Criterios de éxito:

- Dominio puro en `api/domain/**` sin dependencias de infraestructura.
- Servicios de aplicación en `api/application/**` usando interfaces de repositorio.
- Interfaces de repositorio claras en `api/application/ports/**`.
- Adaptadores Postgres en `api/infrastructure/db/**` usando `pg` y `DATABASE_URL` (o similar) desde variables de entorno, sin credenciales hardcodeadas.
- Script SQL legible en `scripts/sql/01_init_core_schema.sql` y alineado conceptualmente con `context/kinesis-database-schema.sql`, pero reducido a tablas mínimas.
- El servidor Fastify arranca sin errores y los endpoints existentes (`/` y `/health`) siguen funcionando correctamente.
