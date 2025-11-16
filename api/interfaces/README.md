# API / Interfaces

"Edges" del sistema: controladores HTTP (REST/GraphQL), DTOs, validación con Zod, jobs/cron y subscribers de eventos del bus de `core`. Punto de entrada del backend. NO debe contener lógica de negocio (va en `domain` y `application`) ni acceso directo a DB.
