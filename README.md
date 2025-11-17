# Kinesis Web + CMS

Repositorio monolito **Web + CMS + API** para la plataforma Kinesis, diseñado para ejecutarse en **Replit** como un único servicio con arquitectura limpia, modular y preparada para escalar a microservicios en el futuro. La arquitectura y el comportamiento del Replit Agent están definidos en detalle en `replit.md`.  

> ⚠️ Este proyecto forma parte de un trabajo de máster y prioriza la claridad arquitectónica y la documentación sobre la velocidad de desarrollo.

---

## Objetivos del proyecto

- Implementar una **web corporativa** de Kinesis.
- Implementar un **CMS** para gestionar contenidos, leads y configuración del sitio.
- Exponer una **API backend** única consumida por Web, CMS y futuras apps (por ejemplo, móvil).
- Mantener un diseño alineado con el **sistema de diseño de Kinesis** (colores, tipografía, componentes base).
- Demostrar buenas prácticas de:
  - **Clean Architecture** y **DDD ligero**.
  - **Event-Driven Architecture (EDA) in-process**.
  - Uso de **Replit** como plataforma de desarrollo, despliegue y asistencia con IA.   

---

## Arquitectura de software

El proyecto es un **monolito modular**:

- Un único backend (`/api`) con módulos de dominio desacoplados.
- Dos frontends independientes:
  - `/web`: front público.
  - `/cms`: panel de administración.
- Un núcleo compartido (`/core`) que implementa:
  - **Event bus in-process**.
  - Eventos de dominio.
  - Utilidades compartidas a bajo nivel.
- Código compartido transversal en `/shared` (tipos, utilidades, posibles componentes UI compartidos).

Esta aproximación sigue la recomendación de **monolito bien modularizado en un solo Repl** y preparado para extraer módulos a microservicios en el futuro.   

---

## Stack tecnológico

Todo el proyecto está escrito en **TypeScript**:

- **Backend (`/api`)**

  - Node.js.
  - Framework HTTP: Fastify o Express.
  - Validación: Zod.
  - Capa de infraestructura desacoplada para:
    - Base de datos: **Database SQL integrada de Replit (PostgreSQL serverless)** como proveedor inicial.
    - Autenticación: Replit Auth.
    - Almacenamiento de archivos: Replit App Storage.

- **Frontends (`/web`, `/cms`)**
  - React.
  - Vite.
  - React Router.
  - Tailwind CSS (+ opcionalmente shadcn/ui).
  - React Query.
  - React Hook Form + Zod.

- **Testing**
  - Estructura preparada para tests unitarios e integración/e2e (p.ej. con Vitest), definidos en `tests/` y junto al código.

Los detalles y normas de uso del stack están recogidos en `replit.md`.

---

## Estructura de directorios

Estructura principal del repositorio:

```text
/
├─ core/        # Event bus in-process, eventos de dominio y shared-kernel
├─ web/         # Front pública (Clean Architecture adaptada a frontend)
├─ cms/         # Front CMS / backoffice
├─ api/         # Backend único con módulos de dominio (DDD ligero)
├─ shared/      # Tipos, utilidades y (eventual) UI compartida
├─ config/      # Configuración de entorno y app
├─ scripts/     # Scripts de tooling, seeds, migraciones, etc.
├─ docs/        # Documentación técnica/funcional y CHANGELOG
├─ tests/       # Tests de integración y end-to-end
├─ context/     # Documentos funcionales de Kinesis (SOLO LECTURA para la IA)
├─ replit.md    # Guía de arquitectura y normas para el Replit Agent
├─ .replit      # Configuración de ejecución en Replit
├─ replit.nix   # Definición de entorno en Replit
└─ package.json / pnpm-lock.yaml / tsconfig.json
```

Cada subcarpeta incluye un `README.md` explicando su responsabilidad.

---

## Replit e IA (Replit Agent)

Este repositorio está pensado para ser usado en **Replit** con:

* Un único Repl que ejecuta:

  * API en `/api` (ruta `/api/**`).
  * Servido de assets estáticos para `/web` y `/cms` desde el mismo servidor y puerto.
* Un archivo `replit.md` que:

  * Define la arquitectura y estructura de carpetas.
  * Fija convenciones de código (naming, capas, etc.).
  * Indica qué directorios puede tocar el Replit Agent y cuáles son solo lectura.
  * Documenta cómo desarrollar y desplegar en Replit (Autoscaling Deploy).

El **Replit Agent** usa `replit.md` como guía para generar y modificar código respetando esta arquitectura. 

---

## Testing

* Hay una carpeta `tests/` preparada para pruebas:

  * **Integración**: escenarios que combinan API + DB.
  * **End-to-end**: flujos completos de usuario (web / CMS) contra la API.
* Se recomienda:

  * Añadir tests unitarios para los casos de uso en `api/application` y reglas de negocio en `api/domain`.
  * No introducir nuevas funcionalidades sin tests asociados, tal y como se describe en `replit.md`.

---

## Contexto funcional

Toda la información de negocio de Kinesis (visión, flows, secciones web/CMS, prioridades, etc.) está documentada en la carpeta `context/`:

### Documentos principales

* **`context/kinesis-alcance-web-cms.md`**: Análisis completo del alcance funcional de la Web Corporativa y del CMS. Define qué secciones públicas existirán (Inicio, Quiénes somos, Modelos de negocio, Programas y servicios, Equipo, Horarios y tarifas, Contacto) y qué áreas de gestión incluirá el CMS (Panel de inicio, Contenido web, Formularios y leads, Estructura y navegación, Textos legales, Ajustes del sitio).

* **`context/kinesis-secciones.md`**: Especificación detallada de las secciones de la Web (estructura de navegación, contenido de cada página) y del CMS (menús principales y funcionalidades de gestión).

* **`context/kinesis-guia-de implementacion.md`**: Sistema de diseño y guía de implementación con la paleta de colores completa (Web y CMS), tipografía (Montserrat + Inter), espaciado, componentes reutilizables, flujos de interacción principales, efectos y microinteracciones, y plan de fases de desarrollo.

* **`context/kinesis-database-schema.sql`**: Esquema de referencia de base de datos relacional para Kinesis Web + CMS (formato PostgreSQL). Define el modelo de datos objetivo (tablas, relaciones, políticas RLS, triggers, funciones y vistas) que se implementará sobre la **Database SQL integrada de Replit**; no implica que la base de datos esté ya creada.

### Contenido de negocio detallado

La subcarpeta `context/doc/` contiene la información específica de cada sección de la web:

* **`03.00-kinesis.md`**: Visión general de Kinesis
* **`03.01-kinesis-quien-somos.md`**: Contenido para la sección "Quiénes somos"
* **`03.02-kinesis-modelos-negocio.md`**: Descripción de los 4 modelos de negocio (Élite On Demand, Ritmo Constante, Generación Dance, Sí Quiero Bailar)
* **`03.03-kinesis-programas-actividades.md`**: Catálogo de programas y servicios
* **`03.04-kinesis-equipo.md`**: Información del equipo docente
* **`03.05-kinesis-tarifas.md`**: Estructura de precios y tarifas
* **`03.06-kinesis-faqs.modelos-negocio.md`**: FAQs sobre modelos de negocio
* **`03.07-kinesis-faqs-servicios.md`**: FAQs sobre servicios
* **`03.08-kinesis-condiciones-contratacion.md`**: Condiciones de contratación
* **`03.09-kinesis-aviso-legal.md`**: Aviso legal
* **`03.10-kinesis-politica-privadidad.md`**: Política de privacidad
* **`03.11-kinesis-cokkies.md`**: Política de cookies

### Uso de estos documentos

Estos documentos son la **referencia funcional y de diseño** para entender:

* **Qué** debe hacer el sistema (alcance, secciones, funcionalidades)
* **Cómo** debe verse (colores, tipografía, componentes)
* **Por qué** existe cada elemento (modelos de negocio, propuesta de valor)
* **Con qué estructura de datos** se implementa (esquema de base de datos)

Son especialmente importantes para el trabajo con el Replit Agent, ya que definen de forma exhaustiva tanto los requisitos funcionales como las especificaciones técnicas y de diseño.

---

## Estado del proyecto

Este repositorio arranca con:

* Arquitectura base definida.
* Estructura de directorios creada y documentada.
* Guía del Replit Agent (`replit.md`) lista.
* Sistema de diseño y secciones Web/CMS documentadas.

A partir de aquí se irán implementando los módulos de dominio, la API, los frontends y los tests siguiendo las normas de este README y de `replit.md`.

## Participación en el hackathon y originalidad del código

Este repositorio se ha preparado antes del inicio del hackathon únicamente con:

- Arquitectura base definida y estructura de directorios vacía.
- Documentación funcional y técnica en `context/` y `docs/`.
- Archivo `replit.md` como guía de trabajo para el Replit Agent.

No incluye lógica de negocio implementada, componentes de UI funcionales ni endpoints de API operativos.

Todo el **código de aplicación** (API, Web, CMS y tests automatizados) se implementará exclusivamente durante el periodo oficial del hackathon, siguiendo las bases de originalidad del concurso.
