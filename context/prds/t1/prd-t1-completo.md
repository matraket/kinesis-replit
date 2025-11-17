## PRD T1 – Dominio + Base de Datos SQL Replit

### 1. Resumen ejecutivo

T1 consiste en **dar forma al dominio Kinesis en el backend** y conectarlo a la **Database SQL integrada de Replit (PostgreSQL)**, de forma mínima pero sólida:

* Definir modelos de dominio y repositorios para los primeros módulos clave (contenidos públicos básicos, programas/servicios, horarios y leads).
* Implementar adaptadores de acceso a datos en `api/infrastructure/db` conectados a la DB SQL.
* Mantener `/context` como fuente de verdad (solo lectura) y usar `context/kinesis-database-schema.sql` como **esquema de referencia**, no como script a ejecutar tal cual.
* No se exponen aún endpoints REST para estos casos de uso (eso será T2); aquí solo se prepara **dominio + persistencia**.

---

### 2. Objetivo de T1

Dejar el backend con:

1. **Módulos de dominio iniciales** en `api/domain` y `api/application` que representen:

   * Contenido básico de la web (páginas/secciones principales).
   * Programas / servicios.
   * Horarios/clases.
   * Leads de contacto.

2. **Acceso a datos encapsulado**:

   * Interfaces de repositorio en `api/application/**`.
   * Implementaciones concretas en `api/infrastructure/db/**` usando la Database SQL integrada de Replit.

3. **Conexión a la DB SQL** lista:

   * Módulo de cliente de base de datos centralizado.
   * Variables de entorno configurables (sin credenciales hardcodeadas).
   * Un script SQL inicial (en `scripts/`) derivado de `context/kinesis-database-schema.sql` que defina un **subconjunto mínimo de tablas**, sin automatizar aún las migraciones (eso será T8).

---

### 3. Alcance de T1

#### 3.1 Incluido

1. **Análisis del contexto funcional y del modelo de datos**

   * Leer y tener en cuenta (SOLO LECTURA):

     * `context/kinesis-alcance-web-cms.md`
     * `context/kinesis-secciones.md`
     * `context/kinesis-guia-de-implementacion.md`
     * `context/kinesis-database-schema.sql`
     * Los `.md` relevantes de `context/doc/` (programas, tarifas, FAQs, etc.) cuando sea necesario para entender el dominio.
   * A partir de ahí, seleccionar un **subconjunto mínimo de entidades/tablas** que cubra:

     * Contenidos estructurados básicos de la web (ej.: páginas/sections).
     * Programas/servicios.
     * Horarios relacionados con programas/servicios.
     * Leads captados por formularios de contacto/preinscripción.

2. **Modelado de dominio (api/domain)**

   Crear módulos de dominio iniciales (nombres orientativos, ajústate a lo que tenga más sentido tras leer `/context`):

   * `api/domain/programs` (o equivalente a programas/servicios/cursos).
   * `api/domain/schedules` (horarios/clases).
   * `api/domain/content` (páginas/secciones web).
   * `api/domain/leads`.

   Para cada módulo:

   * Definir **Entidades** y, cuando tenga sentido, **Value Objects** (por ejemplo `ProgramId`, `LeadEmail`, etc.).
   * Codificar **invariantes mínimas** (campos obligatorios, estados válidos, etc.).
   * Mantener el dominio **puro**, sin imports de librerías de DB ni de Fastify/HTTP.

3. **Servicios de aplicación / casos de uso (api/application)**

   Crear servicios de aplicación básicos que orquesten el dominio y hablen en términos de **repositorios**:

   * `api/application/programs`:

     * `listProgramsForPublicSite()`.
     * `getProgramBySlug(slug)`.
   * `api/application/schedules`:

     * `listSchedulesForProgram(programId)`.
   * `api/application/content`:

     * `getPageBySlug(slug)`.
     * (Opcional) `listMainNavigationItems()`.
   * `api/application/leads`:

     * `createLead(input)` (para formularios de contacto/preinscripción).
     * `listRecentLeads()` (para dashboard CMS futuro).

   Características:

   * Usar tipos de resultado (por ejemplo `Result<T, E>` o similar del `core/shared`) en vez de lanzar excepciones a lo loco.
   * No hacer queries directas; siempre usar interfaces de repositorio.

4. **Interfaces de repositorio (ports)**

   En `api/application/**` o en un subdirectorio como `api/application/ports`:

   * Definir interfaces como `ProgramsRepository`, `SchedulesRepository`, `ContentRepository`, `LeadsRepository`.
   * Métodos mínimos para soportar los casos de uso anteriores (list, get, create).
   * Interfaces neutras, sin detalles de Postgres ni de Replit.

5. **Adaptadores de base de datos (api/infrastructure/db)**

   * Crear un módulo `api/infrastructure/db/client.ts` (o similar) que:

     * Use una librería estándar de PostgreSQL en Node (por ejemplo `pg`).
     * Lea la **connection string** de una variable de entorno (por ejemplo `DATABASE_URL` o la que definas explícitamente).
     * Gestione conexiones de forma segura (pool) y exponga una función utilitaria (`query`, `getClient`, etc.).

   * Implementar repositorios concretos:

     * `PostgresProgramsRepository`
     * `PostgresSchedulesRepository`
     * `PostgresContentRepository`
     * `PostgresLeadsRepository`

   * Cada implementación:

     * Mapea filas de la DB ↔ entidades de dominio.
     * Encapsula SQL en consultas parametrizadas.
     * No expone detalles SQL hacia `application` ni `domain`.

6. **Script SQL inicial (scripts/)**

   * Crear un archivo tipo `scripts/sql/01_init_core_schema.sql` que:

     * Copie/adapte desde `context/kinesis-database-schema.sql` **solo las tablas mínimas** para:

       * contenidos básicos,
       * programas/servicios,
       * horarios,
       * leads.
     * Respete nombres de tablas y columnas lo más coherentes posible con el contexto.
     * No incluya toda la complejidad avanzada si no es necesaria aún (triggers, RLS, vistas complejas, etc.).

   * Importante:

     * Este script NO se ejecutará automáticamente en T1.
     * Se documentará como “script inicial de referencia” para ser integrado en el sistema de migraciones en T8.

7. **Integración ligera con el servidor actual**

   * Ajustar, si es necesario, el handler de `GET /health` para que:

     * Opcionalmente consulte la DB (por ejemplo, un `SELECT 1`) a través de un pequeño health-check del cliente Postgres, o añada un campo `dbStatus: "unknown" | "ok" | "error"`.
     * Esta parte debe seguir siendo sencilla: si complica demasiado o añade fragilidad, se puede dejar solo un health-check lógico (y añadir comentarios para T9).

---

#### 3.2 Fuera de alcance

* No crear todavía endpoints REST/HTTP nuevos (ni `/api/programs`, ni `/api/leads`, etc.): eso es T2.
* No implementar todavía:

  * Event bus (`core/bus`) ni eventos de dominio complejos.
  * Lógica avanzada de validación de DTO HTTP (Zod) – vendrá con las interfaces HTTP.
* No automatizar migraciones ni pipelines de despliegue: eso será T8/T9.
* No tocar:

  * Carpeta `web/` ni `cms/` (salvo crear tipos compartidos más tarde, pero no en T1).
  * Cualquier archivo dentro de `context/` (se mantienen 100% solo lectura).

---

### 4. Restricciones y consideraciones de plataforma

* **Proveedor de BD**: Database SQL integrada de Replit (PostgreSQL).
* **Encapsulación**: todo acceso a DB debe vivir en `api/infrastructure/db`; ni `domain` ni `application` deben importar el cliente directamente.
* **Variables de entorno**:

  * La connection string (y cualquier parámetro de DB) se debe leer de env vars.
  * No se hacen supuestos dogmáticos sobre el nombre exacto; pero se define uno claro (`DATABASE_URL`, por ejemplo) y se documenta en comentarios para que el usuario lo configure en Replit.
* **Monolito**:

  * No se crean servicios adicionales; esto es parte del mismo servidor Fastify que ya existe en `api/main.ts`.
* **/context**:

  * Se usa solo para leer especificaciones; no se modifica ninguno de sus archivos.

---

### 5. Requisitos funcionales

#### RF1 – Modelos de dominio

* RF1.1: Existen módulos de dominio para al menos: contenido, programas/servicios, horarios y leads.
* RF1.2: Cada entidad tiene un identificador estable (id/UUID) y los campos clave alineados con lo descrito en `/context`.
* RF1.3: El dominio no contiene imports de librerías de infraestructura.

#### RF2 – Casos de uso

* RF2.1: Existen servicios de aplicación con métodos para:

  * Listar programas y obtener detalle por slug/id.
  * Listar horarios de un programa.
  * Obtener contenido de página por slug.
  * Crear un lead y listar leads recientes.
* RF2.2: Todos los servicios usan interfaces de repositorio; no acceden directamente a la DB.

#### RF3 – Repositorios e infraestructura DB

* RF3.1: Existen interfaces `ProgramsRepository`, `SchedulesRepository`, `ContentRepository`, `LeadsRepository`.
* RF3.2: Existen implementaciones Postgres de cada repositorio en `api/infrastructure/db`.
* RF3.3: Existe un módulo `db/client` (o similar) que centraliza la conexión y se reutiliza por los repos.
* RF3.4: La connection string se obtiene de una variable de entorno documentada.

#### RF4 – Script SQL inicial

* RF4.1: Existe `scripts/sql/01_init_core_schema.sql` (nombre aproximado) con el SQL mínimo para tablas de contenidos, programas, horarios y leads.
* RF4.2: El script está claramente marcado como “no automático” y como base para futuras migraciones.
* RF4.3: El SQL se basa en `context/kinesis-database-schema.sql`, pero no copia toda la complejidad avanzada innecesaria.

#### RF5 – Integración con el servidor existente

* RF5.1: El servidor Fastify sigue levantándose correctamente.
* RF5.2: Los nuevos módulos de dominio/aplicación/infrastructura no rompen `GET /` ni `GET /health`.
* RF5.3: Si se añade lógica de health-check de DB, el endpoint `/health` sigue respondiendo rápidamente y sin lanzar errores no controlados cuando la DB no está configurada todavía.

---

### 6. Requisitos no funcionales

* **RNF1 – Simplicidad**: el código de T1 debe ser entendible por alguien que llegue más tarde, sin introducir patrones excesivamente complejos.
* **RNF2 – Testeabilidad futura**: los repositorios tienen interfaces claras que facilitan mocks para tests (que llegarán en T7).
* **RNF3 – Evolutividad**: el modelo inicial debe poder crecer (más campos, más tablas) sin romper toda la base.

---

### 7. Dependencias

* `replit.md` (ya en el repo): reglas sobre arquitectura, capas y BD.
* Carpeta `context/`:

  * `context/kinesis-alcance-web-cms.md`
  * `context/kinesis-secciones.md`
  * `context/kinesis-guia-de-implementacion.md`
  * `context/kinesis-database-schema.sql`
  * `context/doc/*.md`
* T0 ya completada:

  * `api/main.ts` con Fastify y endpoints básicos.
  * `package.json` + `tsconfig.json` + `.replit` + `replit.nix`.

---

### 8. Entregables

1. Módulos de dominio en `api/domain/**` para contenido, programas, horarios y leads.
2. Servicios de aplicación en `api/application/**` con casos de uso básicos.
3. Interfaces de repositorio en `api/application/**` (o subcarpeta `ports`).
4. Cliente de DB central en `api/infrastructure/db/client.ts` (o nombre equivalente).
5. Implementaciones de repositorios Postgres en `api/infrastructure/db/**`.
6. Script SQL inicial en `scripts/sql/01_init_core_schema.sql`.
7. (Opcional) Pequeña mejora del `/health` para reflejar, de forma segura, el estado de la DB.

---

### 9. Criterios de aceptación

* CA1: Existen entidades de dominio y servicios de aplicación para contenidos, programas, horarios y leads, sin dependencias directas de Postgres ni Fastify.
* CA2: Existen interfaces de repositorio y sus implementaciones Postgres en `api/infrastructure/db`.
* CA3: Hay un módulo cliente que usa una env var de conexión; no hay credenciales en claro en el código.
* CA4: El script SQL inicial existe, es legible y está alineado conceptualmente con `context/kinesis-database-schema.sql`.
* CA5: El servidor sigue arrancando correctamente (`GET /` y `GET /health` funcionan) tras integrar T1.
* CA6: No se ha modificado ningún archivo dentro de `context/`.
