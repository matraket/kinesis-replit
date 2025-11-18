## PRD T0 – Entorno y tooling base para Kinesis en Replit

### 1. Resumen ejecutivo

T0 consiste en pasar del estado actual del repo `kinesis-replit` (solo estructura de carpetas + documentación) a un **proyecto ejecutable en Replit** con:

* Tooling básico configurado (`package.json`, `pnpm`, `tsconfig`, `.replit`, `replit.nix`).
* Un **servidor mínimo en `/api`** que arranca sin errores y responde con un mensaje tipo “Kinesis monolith running”.
* Sin lógica de negocio, ni UI real, ni acceso a base de datos todavía (eso llegará en T1+).

Toda la **información de negocio y especificaciones funcionales** vive en la carpeta real `context/` del repo (ficheros `kinesis-alcance-web-cms.md`, `kinesis-secciones.md`, `kinesis-guia-de-implementacion.md`, `kinesis-database-schema.sql` y `context/doc/*.md`). En T0 **solo se usan como referencia de alto nivel**, no se implementa todavía nada de ese dominio.

---

### 2. Objetivo de T0

Dejar el **Repl ya importado desde `kinesis-replit` listo para trabajar**, de forma que:

* El entorno esté configurado para TypeScript + Node + React con **un solo comando Run** (por ejemplo, `pnpm dev` desde `.replit`).
* Exista un servidor HTTP mínimo en `/api` que escuche en el **puerto público de Replit** y devuelva una respuesta simple (p. ej. `"Kinesis monolith running"`) como *smoke test* de la arquitectura.

---

### 3. Situación de partida (estado actual del repo)

En el repo actual ya existe:

* Estructura de directorios: `core/`, `api/`, `web/`, `cms/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`.
* `README.md` raíz con explicación de arquitectura, stack y estructura.
* `replit.md` con instrucciones para el Replit Agent y normas de arquitectura.
* Carpeta `context/` con toda la documentación funcional y técnica **desglosada**:

  * `context/kinesis-alcance-web-cms.md`
  * `context/kinesis-secciones.md`
  * `context/kinesis-guia-de-implementacion.md`
  * `context/kinesis-database-schema.sql` (modelo de datos de referencia, no script operativo)
  * `context/doc/*.md` con todos los textos de negocio (visión, quiénes somos, modelos de negocio, tarifas, FAQs, legales, etc.).
* `.gitignore` y repo Git inicializado.

Todavía **NO existe** (y es lo que debe hacer T0, vía Agent en Replit):

* `.replit`.
* `replit.nix`.
* `package.json`, `pnpm-lock.yaml`.
* `tsconfig.json`.
* Código fuente en `/api`, `/web`, `/cms`.

---

### 4. Alcance de T0

#### 4.1 Incluido

1. **Configuración de `package.json` y gestor de paquetes**

* Crear `package.json` en la raíz del repo con:

  * Nombre del proyecto (p. ej. `"kinesis-replit"`).
  * Tipo `"module"` o lo que defina `replit.md`.
  * Dependencias base mínimas para arrancar el servidor API y preparar futuros frontends (Node + TypeScript + Fastify/Express + tooling mínimo).
  * DevDependencies: `typescript`, tipos de Node, etc.
* Configurar **pnpm** como gestor preferente (objetivo: usar `pnpm dev` como comando principal de Run).

2. **Definición de scripts de npm/pnpm**

* Añadir scripts mínimos:

  * `"dev"`: entorno de desarrollo.

    * Arranca el servidor de `/api` escuchando en el puerto de Replit.
    * De momento no necesita construir ni servir `/web` y `/cms` (pueden quedar como TODO documentado).
  * `"build"`: placeholder para compilación futura (TS, bundles, etc.).
  * `"start"`: arranque “de producción” del servidor de `/api` (similar a `dev` pero sin hot-reload).

> T0 se centra en que el monolito pueda arrancar un servidor mínimo. La integración fina con `/web` y `/cms` se hará en T2/T3.

3. **Creación de `tsconfig.json`**

* Crear `tsconfig.json` en la raíz, alineado con lo que se describe en `replit.md`:

  * `target`, `module`, `moduleResolution`, `strict`, etc.
  * Compatibilidad con código TS en `/api` como mínimo.
* Dejarlo preparado para que más adelante pueda ampliarse con `paths` y configuración específica para `/web` y `/cms`.

4. **Configuración del entorno Replit: `.replit` + `replit.nix`**

* `.replit`:

  * Definir el lenguaje/runner apropiado.
  * Configurar el botón **Run** para ejecutar `pnpm dev` (o script equivalente).
  * Asegurar que el comando se ejecuta en la raíz.

* `replit.nix`:

  * Incluir Node.js y pnpm (y herramientas de sistema básicas).
  * Configuración mínima y reproducible para que el entorno instale dependencias y ejecute el proyecto.

5. **Servidor mínimo en `/api`**

* Crear estructura base en `/api` siguiendo la arquitectura del repo:

  * Carpetas propuestas: `domain/`, `application/`, `infrastructure/`, `interfaces/` (aunque en T0 pueden estar casi vacías).
* Implementar un **entrypoint** (por ejemplo `api/main.ts` o el nombre indicado en `replit.md`) que:

  * Tome el puerto desde `process.env.PORT` (patrón Replit).
  * Inicie Fastify o Express.
  * Exponga como mínimo:

    * `GET /health` → JSON `{ "status": "ok", "service": "kinesis-api" }`.
    * `GET /` → texto plano o HTML muy simple con la cadena `"Kinesis monolith running"`.
  * Todavía **no es necesario** servir estáticos de `/web` ni `/cms`; eso se deja explícito como trabajo de T2/T3.

6. **Respeto de carpetas existentes y contexto**

* Mantener **intactos**:

  * `context/` y todo su contenido (`kinesis-*` y `context/doc/*.md`): solo lectura, no se crean ni modifican archivos allí.
* Mantener los `README.md` ya escritos en cada carpeta (puede ampliarse el raíz para explicar scripts de ejecución, pero sin romper el sentido actual).

7. **Integración con Git en Replit**

* Tras completar T0, comprobar que:

  * El estado se puede **commitear y pushear** a GitHub desde Replit.
  * No se añaden artefactos innecesarios (node_modules, builds, etc.) gracias a `.gitignore`.

---

### 5. Fuera de alcance (NO incluido en T0)

* Cualquier implementación basada en el contenido funcional de `context/`:

  * No se crean tablas reales aún.
  * No se mapean entidades de negocio ni casos de uso.
  * No se implementan flujos web/CMS.
* En concreto, quedan fuera:

  * Base de datos y migraciones (`context/kinesis-database-schema.sql` solo se lee como referencia conceptual a futuro).
  * Lógica de dominio (event bus, entidades, casos de uso).
  * Frontends (`/web`, `/cms`) con páginas reales o integración con API.
  * Autenticación (Replit Auth), permisos, roles.
  * App Storage, subida de ficheros, leads, contenidos, etc.
* Cualquier modificación en:

  * Estructura de `context/`.
  * Estructura raíz de carpetas (`api`, `web`, `cms`, `core`, etc.).

---

### 6. Restricciones y consideraciones de plataforma

* **Un solo contenedor / un solo puerto público**

  * El servidor de `/api` debe escuchar en el puerto expuesto por Replit (`PORT`).
  * No se crean servicios separados ni microservicios en otros Repls; el enfoque es monolito.

* **Configuración de entorno mediante `.replit` + `replit.nix`**

  * El botón Run debe llamar al script de desarrollo (`pnpm dev` u otro documentado).
  * La configuración de Nix debe ser lo bastante simple como para no entorpecer la experiencia de hackathon.

* **Recursos limitados**

  * En T0 solo se instalan dependencias imprescindibles.

* **Uso de Replit Agent y `replit.md`**

  * El Agent debe respetar las instrucciones de `replit.md`:

    * Qué carpetas tocar (p. ej. `/api`, raíz, config).
    * Qué carpetas son solo lectura (`context/`).

---

### 7. Requisitos funcionales

#### RF1 – Configuración de proyecto Node/TS

* RF1.1: Debe existir `package.json` en la raíz con nombre de proyecto y scripts `dev`, `build`, `start`.
* RF1.2: `pnpm install` debe ejecutarse sin errores en Replit.
* RF1.3: `tsconfig.json` debe permitir compilar el código de `/api`.

#### RF2 – Configuración del entorno Replit

* RF2.1: Debe existir `.replit` que ejecute el comando principal (`pnpm dev`).
* RF2.2: Debe existir `replit.nix` con Node + pnpm configurados.
* RF2.3: Al pulsar **Run**, Replit debe:

  * Instalar dependencias si faltan.
  * Arrancar el servidor en `/api` sin errores.
  * Exponer el servicio en el puerto público.

#### RF3 – Servidor mínimo en `/api`

* RF3.1: Debe haber un entrypoint en `/api` que levante un servidor HTTP.
* RF3.2: `GET /health` devuelve JSON con estado OK.
* RF3.3: `GET /` devuelve una respuesta que contenga explícitamente `"Kinesis"` y `"running"`.
* RF3.4: El servidor usa `process.env.PORT` y gestiona el caso en que no esté definido (aunque en Replit siempre lo estará).

#### RF4 – Respeto de documentación y estructura

* RF4.1: Ningún archivo de `context/` (incluyendo `kinesis-alcance-web-cms.md`, `kinesis-secciones.md`, `kinesis-guia-de-implementacion.md`, `kinesis-database-schema.sql`, `context/doc/*.md`) debe cambiar.
* RF4.2: Los `README.md` existentes se conservan; solo se permiten ampliaciones suaves.
* RF4.3: No se altera la estructura raíz de carpetas.

#### RF5 – Integración con Git

* RF5.1: Los cambios de T0 se limitan a:

  * Nuevos archivos: `.replit`, `replit.nix`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, ficheros de `/api` necesarios.
  * Cambios menores en `README.md` raíz si se documentan los scripts.
* RF5.2: `git push` a GitHub funciona desde Replit sin conflictos.

---

### 8. Requisitos no funcionales

* **RNF1 – Simplicidad**: El servidor de `/api` debe ser trivial de entender y fácil de tirar a la basura cuando entre la lógica real.
* **RNF2 – Reproducibilidad**: Cualquier persona que importe el repo en Replit debe poder:

  * Pulsar Run.
  * Ver el mensaje `"Kinesis monolith running"` en el navegador sin pasos extra.
* **RNF3 – Mantenibilidad**: La configuración inicial no debe bloquear la futura integración de `/web`, `/cms`, BD, Auth, etc.

---

### 9. Dependencias

Para T0, las dependencias conceptuales son:

* `replit.md` del repo: guía de arquitectura y zonas editables/no editables para el Agent.
* Carpeta `context/` como **fuente de verdad funcional**, solo lectura:

  * `context/kinesis-alcance-web-cms.md`
  * `context/kinesis-secciones.md`
  * `context/kinesis-guia-de-implementacion.md`
  * `context/kinesis-database-schema.sql`
  * `context/doc/*.md` (visión, modelos de negocio, tarifas, FAQs, legales, etc.)
* KB de Replit (en este Project) para:

  * Configuración de entorno (`.replit`, `replit.nix`).
  * Arquitectura monolito y límites de plataforma.
  * Integración Git/GitHub.
  * Comportamiento del Replit Agent.

---

### 10. Entregables

1. `package.json` + `pnpm-lock.yaml` en la raíz.
2. `tsconfig.json` listo para backend TS.
3. `.replit` con comando Run configurado.
4. `replit.nix` con entorno Node + pnpm.
5. Servidor mínimo en `/api` que responda:

   * `GET /health`.
   * `GET /`.
6. (Opcional) Actualización ligera de `README.md` raíz explicando cómo ejecutar el proyecto en Replit.

---

### 11. Criterios de aceptación

* CA1: Al importar el repo en Replit y pulsar **Run**, la app arranca y el navegador muestra una respuesta que contenga `"Kinesis monolith running"` o equivalente.
* CA2: `GET /health` devuelve JSON válido indicando estado OK.
* CA3: Ningún archivo de `context/` ha sido modificado.
* CA4: `pnpm install` funciona sin errores críticos en Replit.
* CA5: El commit de T0 se puede empujar a GitHub y el `README.md` sigue alineado con la arquitectura descrita.

---