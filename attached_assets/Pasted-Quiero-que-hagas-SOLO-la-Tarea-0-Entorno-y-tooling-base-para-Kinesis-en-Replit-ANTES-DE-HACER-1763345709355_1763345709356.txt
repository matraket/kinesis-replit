Quiero que hagas SOLO la Tarea 0: “Entorno y tooling base para Kinesis en Replit”.

ANTES DE HACER NADA:
- Lee completo el archivo `replit.md` para entender la arquitectura, los directorios y las reglas del proyecto.

RESTRICCIONES IMPORTANTES (RESPÉTALAS ESTRICTAMENTE):
- NO modifiques, borres ni crees archivos dentro de `context/`. Es solo documentación, es SOLO LECTURA.
- NO modifiques ni sustituyas `replit.md`. Puedes leerlo, pero no tocarlo.
- NO cambies la estructura de directorios principal (`api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`, `context/`).
- NO crees proyectos/servicios adicionales ni microservicios. Todo es un monolito Web + CMS + API en este único Repl.

OBJETIVO DE ESTA TAREA T0:
Dejar este Repl listo para trabajar con:
1) Tooling básico configurado (Node + TypeScript + pnpm).
2) Un servidor mínimo en `/api` que:
   - Escuche en `process.env.PORT`.
   - Responda:
     - `GET /` con un texto simple que incluya EXACTAMENTE la cadena: "Kinesis monolith running".
     - `GET /health` con JSON tipo: `{ "status": "ok", "service": "kinesis-api" }`.

TRABAJO QUE DEBES HACER (Y SOLO ESTO):

1) TOOLING Y CONFIGURACIÓN EN LA RAÍZ
- Crear `package.json` si no existe, con:
  - Nombre del proyecto (por ejemplo `kinesis-replit`).
  - Dependencias mínimas para el servidor HTTP en `/api` (Node + TypeScript + Fastify o Express, lo que prefieras).
  - DevDependencies: `typescript` y tipos necesarios.
  - Scripts:
    - `"dev"`: arranca el servidor de `/api` en modo desarrollo.
    - `"start"`: arranca el servidor de `/api` en modo producción (puede ser similar a `dev` sin hot-reload).
    - `"build"`: por ahora puede ser una compilación TS sencilla o un placeholder documentado.
- Configurar pnpm como gestor (generar `pnpm-lock.yaml`).
- Crear `tsconfig.json` en la raíz, preparado para TypeScript en Node y, como mínimo, para compilar el código de `/api`.

2) CONFIGURACIÓN DE REPLIT
- Crear `.replit` para que el botón Run ejecute el comando de desarrollo, por ejemplo:
  - `run = "pnpm dev"` (o la forma correcta según la guía de Replit).
- Crear `replit.nix` con las dependencias de sistema necesarias (Node.js + pnpm) siguiendo las buenas prácticas de Replit.

3) SERVIDOR MÍNIMO EN `/api`
- Mantén la estructura de carpetas que marca `replit.md` (por ejemplo `api/domain`, `api/application`, `api/infrastructure`, `api/interfaces`), aunque el contenido sea mínimo.
- Crear un entrypoint en `/api` (por ejemplo `api/main.ts` o el nombre que mejor encaje con `replit.md`) que:
  - Use `process.env.PORT` como puerto (si no está definido, mostrar un error claro en logs).
  - Arranque Fastify o Express en TypeScript.
  - Exponga:
    - `GET /` → texto plano o HTML muy simple que incluya la cadena EXACTA "Kinesis monolith running".
    - `GET /health` → JSON con `{ "status": "ok", "service": "kinesis-api" }` o equivalente.

FUERA DE ALCANCE EN ESTA TAREA T0:
- NO implementar lógica de negocio de Kinesis (dominio, casos de uso, event bus, etc.).
- NO implementar páginas reales en `web/` ni en `cms/`.
- NO configurar base de datos ni migraciones.
- NO integrar autenticación, App Storage, ni nada avanzado.
- NO tocar los archivos de `context/` (como `kinesis-alcance-web-cms.md`, `kinesis-secciones.md`, `kinesis-guia-de-implementacion.md`, `kinesis-database-schema.sql` y `context/doc/*.md`).

Cuando termines:
- Asegúrate de que en Replit, pulsando Run, se arrancan las dependencias y el servidor en `/api`, y puedo abrir la URL pública y ver el mensaje con "Kinesis monolith running".
- No hagas cambios masivos adicionales fuera de lo descrito arriba.
