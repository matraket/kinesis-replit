# Guía para Replit Agent – Proyecto Kinesis Web + CMS

> **Rol:** Este archivo define cómo debe trabajar el Replit Agent en este Repl.
> Debes seguir estas instrucciones al crear, modificar o borrar código.

---

## 1. Objetivo del proyecto

* Proyecto monolito **Web + CMS + API** para Kinesis, en un **solo Repl**, con arquitectura limpia y modular.
* Debe estar preparado para, en el futuro, extraer algunos módulos (sobre todo la API) a **microservicios** con un impacto mínimo.
* El dominio de negocio (Kinesis) está documentado en `/context/*.md`. Siempre que vayas a tocar lógica de negocio, **léelos primero**.

---

## 2. Arquitectura y estructura de directorios

### 2.1 Arquitectura general

* Monolito modular con tres grandes áreas desacopladas:

  * `web/` → Front pública.
  * `cms/` → Front de backoffice/administración.
  * `api/` → Backend único, con módulos de dominio desacoplados.
* Comunicación entre módulos de dominio mediante **EDA in‑process** (eventos de dominio y bus interno en `core/`).
* En el futuro, la carpeta `api/` debe poder migrarse a un microservicio casi sin cambios en `domain/` y `application/`.

### 2.2 Estructura de directorios

La estructura base del repositorio es la siguiente (respétala y extiéndela de forma coherente):

```text
/
├─ core/                      # EDA in-process + shared-kernel
│  ├─ bus/                    # event bus, publishers/subscribers base
│  ├─ events/                 # definición de eventos de dominio cross-módulo
│  └─ shared/                 # errores base, result types, logging, utils comunes
│
├─ web/                       # Front pública
│  ├─ domain/                 # modelos de vista, reglas de UI, mapeos ligeros
│  ├─ application/            # casos de uso de UI (hooks, servicios de estado)
│  ├─ infrastructure/         # clients HTTP hacia /api, storage browser, etc.
│  └─ presentation/           # rutas, páginas, componentes, layouts
│
├─ cms/                       # Front backoffice CMS
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  └─ presentation/
│
├─ api/                       # Backend único, extraíble a microservicio
│  ├─ domain/                 # DDD: entidades, VOs, agregados, domain events
│  │  ├─ users/
│  │  ├─ courses/
│  │  ├─ leads/
│  │  └─ …
│  ├─ application/            # casos de uso, orquestación, puertos
│  │  ├─ users/
│  │  ├─ courses/
│  │  ├─ leads/
│  │  └─ …
│  ├─ infrastructure/         # repos DB, APIs externas, mappers, ORM
│  │  ├─ db/
│  │  ├─ http/
│  │  ├─ messaging/
│  │  └─ …
│  └─ interfaces/             # “edges”: HTTP, jobs, listeners de eventos core
│     ├─ http/                # controladores REST/GraphQL, DTOs, validación
│     ├─ jobs/                # cron, workers
│     └─ subscribers/         # handlers suscritos a eventos de /core
│
├─ shared/                    # Código reutilizable entre web/cms/api (no dominio)
│  ├─ ui/                     # eventualmente, lib de componentes compartidos
│  ├─ utils/
│  └─ types/                  # DTOs, tipos compartidos front/back
│
├─ config/
│  ├─ env/                    # esquemas de validación y ejemplos .env.*
│  └─ app/                    # configuración por entorno/app
│
├─ scripts/                   # seeds, migraciones, tooling
├─ docs/                      # documentación funcional/técnica, ADRs, CHANGELOG
├─ tests/                     # e2e / integración cross-módulo
├─ context/                   # contexto funcional Kinesis (Kinesis-*.md). SOLO LECTURA.
│
├─ .replit                    # comando de arranque del monolito
├─ replit.nix
├─ package.json
├─ pnpm-lock.yaml
└─ tsconfig.json
```

**Reglas para la estructura:**

* No crees nuevos directorios de primer nivel sin una razón fuerte. Prioriza ubicar el código en las carpetas existentes.
* No mezcles responsabilidades de capas: no pongas lógica de `domain` en `infrastructure`, ni lógica de UI en `api/`.
* Si necesitas un nuevo módulo de dominio (por ejemplo `billing`), sigue el patrón `api/domain/billing`, `api/application/billing`, etc.

---

## 3. Stack tecnológico

Aplica siempre este stack (no lo cambies salvo instrucción explícita):

* **Lenguaje:**

  * Todo el proyecto en **TypeScript** (web, cms y api).

* **Backend (`/api`):**

  * Runtime: **Node.js**.
  * Framework HTTP recomendado: **Fastify** (Express también es aceptable si ya está en uso).
  * Validación de datos: **Zod** para validar DTOs en `interfaces/http`.
  * Acceso a datos: adaptadores en `api/infrastructure/db` usando las soluciones de Replit (ver sección 6).
  * EDA in‑process: implementación del **event bus** en `core/bus` y definición de eventos en `core/events`.

* **Frontends (`/web`, `/cms`):**

  * Librería: **React**.
  * Empaquetador/bundler: **Vite**.
  * Ruteo: **React Router**.
  * Estilos: **Tailwind CSS** (y opcionalmente **shadcn/ui** para componentes de UI).
  * Estado de datos remotos: **React Query** o similar.
  * Formularios y validación: **React Hook Form** + **Zod**.

* **Testing (ver sección 10):**

  * Recomendado: **Vitest** para tests unitarios e integración de TypeScript.

No introduzcas frameworks adicionales de frontend/backend sin justificación clara y sin alinearlos con esta arquitectura.

---

## 4. Convenciones de código y nomenclatura

Respeta SIEMPRE estas convenciones:

* **Nombres de tipos, clases y componentes React:** `PascalCase`.

  * Ej.: `User`, `CourseLead`, `MainLayout`, `LeadForm`.

* **Funciones, variables, propiedades y métodos:** `camelCase`.

  * Ej.: `createLead`, `handleSubmit`, `userRepository`, `isActive`.

* **Constantes y variables de entorno:** `UPPER_SNAKE_CASE`.

  * Ej.: `MAX_RETRY_COUNT`, `REPLIT_DB_URL`, `APP_ENV`.

* **Nombres de archivos y rutas:** `kebab-case`.

  * Ej.: `create-lead.tsx`, `course-detail.ts`, ruta `/course-list`, `/admin/courses`.

* **`snake_case`:**

  * Solo cuando debas respetar esquemas externos (por ejemplo campos en la base de datos o APIs de terceros). Realiza el mapeo a las convenciones internas en `infrastructure/`.

* **Otros criterios de estilo:**

  * Usa TypeScript con tipado explícito en bordes (interfaces HTTP, repositorios, eventos).
  * Mantén un estilo consistente con ESLint + Prettier (si existen configuraciones en el repo, síguelas).

Si generas nuevo código, ajústalo a estas normas. Si modificas código existente, intenta refactorizarlo para acercarlo a estas convenciones sin romper funcionalidad.

---

## 5. Patrones y responsabilidades por capa

### 5.1 `domain/`

* Paradigma principal: **OO + DDD**.
* Contiene:

  * Entidades, Value Objects, Aggregates.
  * Lógica de negocio pura (invariantes, reglas).
  * Eventos de dominio (cuando sea necesario).
* No debe conocer detalles de base de datos, HTTP ni frameworks.
* Devuelve resultados usando tipos de resultado (por ejemplo `Result` o `Either`), evitando lanzar excepciones excepto casos excepcionales.

### 5.2 `application/`

* Paradigma principal: **funcional/imperativo ligero**.
* Responsabilidades:

  * Casos de uso (o servicios de aplicación) que orquestan operaciones de dominio.
  * Publicar eventos en el **event bus** de `core/bus` cuando algo relevante ocurre (por ejemplo, lead creado).
  * Definir **interfaces (puertos)** de repositorios y servicios externos que la infraestructura implementará.
* No contiene lógica de UI ni acceso directo a DB o HTTP; todo eso se hace a través de puertos.

### 5.3 `infrastructure/`

* Paradigma principal: **imperativo** (I/O, adaptadores).
* Responsabilidades:

  * Implementar los repositorios y servicios definidos en `application/`.
  * Adaptar Replit Database, Replit App Storage y Replit Auth a interfaces neutras.
  * Hacer los mapeos entre modelos de dominio y esquemas de persistencia (DB, APIs externas, etc.).
* Si cambian los proveedores (por ejemplo, otra DB en lugar de Replit), los cambios se concentran aquí.

### 5.4 `presentation/` (web/cms) e `interfaces/` (api)

* `web/presentation` y `cms/presentation` contienen:

  * Páginas, componentes de UI, layouts, rutas.
  * Orquestación de lógica de UI llamando a casos de uso en `application/`.

* `api/interfaces/http` contiene:

  * Controladores HTTP.
  * DTOs de entrada/salida.
  * Validación con Zod.

* `api/interfaces/jobs` y `api/interfaces/subscribers` contienen:

  * Jobs programados.
  * Suscriptores de eventos del bus (`core/bus`).

No llames directamente a métodos de otro módulo de dominio desde `presentation` o `interfaces`; usa casos de uso y, cuando proceda, eventos de dominio.

---

## 6. Datos, autenticación y almacenamiento de archivos

Todo acceso a infraestructura debe estar **encapsulado en `api/infrastructure/`** mediante adaptadores. No acoples el dominio ni la aplicación a Replit.

### 6.1 Base de datos

* Proveedor inicial: **Replit Database / DB integrada de Replit**.
* Implementación:

  * Crea adaptadores en `api/infrastructure/db` que implementen las interfaces de repositorio definidas en `api/application`.
  * No uses llamadas directas a la DB en `domain/` ni `application/`.
  * Encapsula la configuración de conexión y credenciales en **variables de entorno** (ver sección 11).

### 6.2 Autenticación

* Proveedor inicial: **Replit Auth**.
* Implementación:

  * Encapsula la lógica de autenticación en `api/infrastructure/auth`.
  * Expone interfaces neutrales (por ejemplo `AuthService`) usadas por `api/application`.
  * No utilices APIs de Replit Auth directamente en el dominio.

### 6.3 Almacenamiento de archivos

* Proveedor inicial: **Replit App Storage** para ficheros (imágenes, assets generados, etc.).
* Implementación:

  * Crea adaptadores de almacenamiento en `api/infrastructure/storage`.
  * Desde `application/`, usa interfaces neutrales (`FileStorage`, `ImageStorage`, etc.).

### 6.4 Objetivo de portabilidad

* Diseña los adaptadores de forma que, si en el futuro se cambia a otro stack (por ejemplo, otra DB o S3 para archivos), solo haya que modificar `api/infrastructure/` sin romper `domain/` y `application/`.

---

## 7. Uso de `/context` y documentación

### 7.1 Carpeta `/context` (SOLO LECTURA)

* Contiene archivos Markdown de contexto funcional de Kinesis (por ejemplo `Kinesis-Doc.md`, `Kinesis-Web-y-CMS-Specs.md`).
* Normas:

  * **NO edites ni borres** nada en `/context` salvo instrucción explícita.
  * Antes de implementar o modificar lógica de negocio relevante, revisa los documentos de `/context` que apliquen.
  * Usa estos archivos para mantener coherencia funcional (nombres, flujos, conceptos de dominio).

### 7.2 Carpeta `/docs`

* Uso:

  * Aquí puedes **generar y actualizar** documentación técnica y funcional.
  * Mantén un `CHANGELOG.md` donde registres cambios significativos (refactors grandes, nuevos módulos, cambios en contratos públicos).

* Normas para el Agent:

  * Cuando hagas cambios de arquitectura o refactors importantes, añade una entrada breve al `CHANGELOG.md`.
  * No reescribas completamente la documentación existente sin motivo; actualiza de forma incremental.

### 7.3 Carpeta `/tests`

* Uso:

  * Almacena tests de integración y e2e (por ejemplo, pruebas que atravesan API + DB, o flujos usuario completos).

* Normas para el Agent:

  * Puedes crear y actualizar tests en `/tests`.
  * No borres masivamente suites de tests sin una instrucción clara.

---

## 8. Comportamiento esperado del Replit Agent

### 8.1 Nivel de autonomía

* Puedes **crear, modificar y borrar archivos** en estas carpetas:

  * `core/`, `web/`, `cms/`, `api/`, `shared/`, `scripts/`, `docs/`, `tests/`.
* Debes tratar como **solo lectura** (salvo instrucción explícita):

  * `context/`.
  * Configuración sensible en `config/` y archivos de despliegue (`.replit`, `replit.nix`), salvo que se te pida modificarlos.

### 8.2 Documentación de cambios

* Para cambios grandes (nuevos módulos, refactors importantes, cambios en contratos API), añade una entrada en `docs/CHANGELOG.md` con:

  * Fecha.
  * Descripción breve del cambio.
  * Módulos afectados.

### 8.3 Respeto de la arquitectura

* No mezcles capas (no pongas lógica de dominio en `presentation`, ni llamadas directas a DB en `domain`).
* No acoples `web` y `cms` entre sí: ambos deben comunicarse solo con `api` a través de HTTP.
* No crees nuevas “mini APIs” fuera de `api/`.

### 8.4 Uso de contexto

* Siempre que trabajes en lógica de negocio, revisa los archivos de `/context` correspondientes y mantén la coherencia de términos y flujos.

---

## 9. Ejecución local y despliegue en Replit

### 9.1 Desarrollo

* Comando de desarrollo esperado (ejemplos, ajusta a los scripts definidos en `package.json`):

  * `pnpm dev` → levanta el backend en `api/` y los frontends (`web`, `cms`) en modo desarrollo.
* No modifiques `.replit` ni `replit.nix` sin instrucción explícita.
* Respeta la limitación de Replit de un **solo puerto público**: en producción, un servidor Node en `api` debe servir tanto la API como los assets estáticos de `web` y `cms`.

### 9.2 Producción / Deploy

* Objetivo: despliegue como **Autoscaling Deploy** en Replit.
* Configuración esperada:

  * Comando de build: `pnpm build` (o equivalente) para generar los bundles de `web` y `cms`.
  * Comando de start: `pnpm start` levanta el servidor Node en `api` que:

    * Expone `/api/**` para la API.
    * Sirve los bundles estáticos de `web` y `cms` (por ejemplo `/` para web y `/admin` para el CMS).

Si necesitas modificar la configuración de despliegue, mantén la compatibilidad con esta estrategia de único servidor en un solo puerto.

---

## 10. Testing y calidad

### 10.1 Alcance mínimo de tests

* **Obligatorio:**

  * Tests unitarios para casos de uso clave en `api/domain` y `api/application`.
  * Tests de integración para flujos críticos, por ejemplo:

    * Creación de un lead mediante la API (desde la petición HTTP hasta la persistencia en DB y la emisión de eventos).
    * Login y flujos principales del CMS.

* **Recomendado:**

  * Tests básicos en `web` y `cms` para los componentes y flujos principales.

### 10.2 Ubicación de tests

* Tests unitarios:

  * Puedes colocarlos cerca del código (`*.spec.ts`/`*.test.ts`) o en subcarpetas `__tests__` dentro de `domain/` y `application/`.

* Tests de integración/e2e:

  * Ubicados en `/tests`, cubriendo integraciones entre módulos y capas.

### 10.3 Normas para el Agent

* No añadas nuevas features significativas sin crear o actualizar tests relacionados.
* Usa un comando único de tests (por ejemplo `pnpm test`). Si es posible, ejecútalo mentalmente/implícitamente al diseñar cambios, y respeta la estructura definida.
* No borres tests existentes a menos que haya una razón clara (por ejemplo, se elimina una funcionalidad entera) y documenta el cambio en el `CHANGELOG`.

---

## 11. Buenas prácticas específicas de Replit

* No escribas **secrets** ni credenciales en el código fuente. Usa siempre las variables de entorno configuradas a través del panel de Secrets de Replit.
* Ten en cuenta los **límites de recursos** de Replit (CPU, RAM, almacenamiento):

  * Evita tareas pesadas en memoria dentro del mismo proceso si pueden externalizarse.
  * Usa consultas eficientes y paginación cuando accedas a datos.
* Integra bien con el flujo de trabajo de Replit (posible uso de Git/GitHub para versionado), respetando la estructura del proyecto.

Mientras sigas este `replit.md`, el proyecto se mantendrá coherente, escalable y alineado con la arquitectura prevista para Kinesis Web + CMS.
