# PRD T6.2 – Theme Toggle + Light Mode para el CMS

## 0. Contexto y Alcance de la Iteración

Esta tarea **T6.2** es una iteración **visual y de UX** sobre el CMS ya implementado:

* **T6** – Bootstrap del CMS y autenticación (`cms/` con React + Vite + Tailwind, rutas `/admin/...`).
* **T6.1** – Aplicación del sistema de diseño Kinesis en **modo Dark** por defecto en el CMS (paleta Admin Navy / Admin Surface, etc.).

Además, se han actualizado los documentos funcionales para reflejar explícitamente el selector de tema:

* `context/kinesis-alcance-web-cms.md`: El CMS se ofrece en modo oscuro por defecto con posibilidad de cambiar a modo claro mediante un selector en la barra superior.
* `context/kinesis-guia-de-implementacion.md`: define el sistema de diseño (paleta, tipografía, efectos) que se debe respetar en ambos modos.

Es **critico** revisar estos documentos para entender con exactitud como se debe aplicar este cambio.

**Objetivo de T6.2:**
Extender el CMS para soportar **dos temas (Dark/Light)** con un **Theme Toggle en el Topbar**, asegurando:

* Dark = tema actual aplicado en T6.1.
* Light = variante clara basada en los mismos tokens de diseño.
* Persistencia por navegador usando **LocalStorage**.
* Sin cambios en backend ni en la API.

---

## 1. Restricciones Críticas

### 1.1. Áreas NO modificables

* `context/**` → solo lectura (los documentos ya están alineados, no tocarlos en T6.2).
* `.replit`, `replit.nix` → no modificar.
* Estructura de primer nivel → no mover ni renombrar:

  * `api/`, `web/`, `cms/`, `core/`, `shared/`, `config/`, `scripts/`, `docs/`, `tests/`.
* Backend:

  * No modificar rutas ni lógica de `/api/admin/**` ni `/api/public/**`.
  * No tocar autenticación basada en `X-Admin-Secret`.

### 1.2. Alcance de T6.2

* **Solo CMS** (`cms/`):

  * Theme toggle y soporte de Light/Dark.
  * Refactor de estilos para depender de tokens de tema.
* **NO** se toca **Web pública (`web/`)** en esta iteración.
* **replit.md**:

  * Solo está permitido añadir una **nota breve** indicando que T6.2 ha implementado Theme Toggle en el CMS (sin reordenar ni borrar secciones).

---

## 2. Requisitos Funcionales del Tema en el CMS

### 2.1. Modos de tema

El CMS soportará dos modos:

* **Dark (predeterminado):**

  * Fondo app: Admin Navy.
  * Superficies: Admin Surface / Admin Surface Light.
  * Texto principal: Admin White, secundario: Admin Muted.

* **Light:**

  * Fondo app: Admin White / grises claros.
  * Superficies: tonos claros coherentes (Gray 100/200, Admin Surface Light).
  * Texto principal: Gray 900, secundario: Admin Muted. 

Los dos modos comparten:

* Misma paleta de acentos: Admin Accent Pink, Admin Success, Admin Warning, Admin Error, Admin Info.
* Misma tipografía: Montserrat para display, Inter para body.

### 2.2. Theme Toggle (solo CMS)

* El CMS arranca en **modo Dark por defecto** si no hay preferencia almacenada.
* El usuario puede alternar entre Dark/Light mediante un **toggle en el Topbar** (por ejemplo icono sol/luna) del layout admin.
* El cambio de tema debe ser:

  * Inmediato (sin recarga de página).
  * Global (aplica a Sidebar, Topbar, cards, tablas, formularios).

### 2.3. Persistencia (LocalStorage)

* Clave de almacenamiento: `kinesis-admin-theme`.
* Valores posibles: `"dark"` | `"light"`.
* Comportamiento:

  * Al montar el CMS, se lee `localStorage.getItem("kinesis-admin-theme")`.

    * Si es válido (`"dark"` o `"light"`), se aplica ese tema.
    * Si no existe o es inválido, se aplica `"dark"`.
  * En cada cambio de tema:

    * Actualizar el estado interno del ThemeProvider.
    * Guardar el nuevo valor en LocalStorage.

---

## 3. Diseño de Tema y Tailwind en el CMS

### 3.1. Tokens basados en variables

Para que Dark/Light sean conmutables sin reescribir clases:

* En `cms/src/index.css` (o stylesheet global equivalente), definir **variables CSS de tema**:

  * Ejemplos (no exhaustivo):

    * `--admin-bg-app`
    * `--admin-bg-surface`
    * `--admin-bg-surface-alt`
    * `--admin-text-main`
    * `--admin-text-muted`
    * `--admin-border`
    * `--admin-accent`

* Definir dos bloques:

  * Tema Dark (por defecto), por ejemplo en `:root[data-theme="dark"]` o en `.theme-dark`.
  * Tema Light, en `:root[data-theme="light"]` o `.theme-light`.

Cada bloque asigna los hex definidos en la guía a las variables.

### 3.2. Tailwind config del CMS

En `cms/tailwind.config.*`:

* Asegurar que `darkMode` está configurado de forma compatible (`"class"` o similar).

* Extender el theme para que las clases utilicen las variables CSS:

  * `bg-admin-app` → `backgroundColor: "var(--admin-bg-app)"`.
  * `bg-admin-surface` → `"var(--admin-bg-surface)"`.
  * `text-admin-main` → `"var(--admin-text-main)"`, etc.

* Mantener los nombres de tokens introducidos en T6.1 (no romper los existentes), simplemente apoyar que ahora lean de variables.

### 3.3. Aplicación en componentes

* Componentes clave (ya existentes en T6/T6.1):

  * Layout: `cms/src/app/layout/AdminLayout.tsx`.
  * Sidebar, Topbar.
  * Componentes base: `Button`, `Card`, `Input`, etc. (en `cms/src/ui/...`).

* Deben usar clases definidas sobre tokens (`bg-admin-surface`, `text-admin-main`, etc.) y no hex directo en `className`.

Resultado esperado:

* Al cambiar el atributo `data-theme` / clase en la raíz, todo el CMS cambia entre Dark/Light sin cambiar JSX.

---

## 4. Arquitectura de Código de Tema (CMS)

### 4.1. ThemeProvider del CMS

Crear (si no existe) un **ThemeProvider específico del CMS**:

* Fichero sugerido: `cms/src/app/theme/ThemeProvider.tsx`.

* Responsabilidades:

  * Guardar el estado: `{ theme: "dark" | "light" }`.
  * Exponer `theme`, `setTheme`, `toggleTheme` vía contexto.
  * En `useEffect` de inicialización:

    * Leer LocalStorage: `kinesis-admin-theme`.
    * Validar el valor.
    * Aplicar tema inicial.
  * En cada cambio de `theme`:

    * Guardar en LocalStorage.
    * Actualizar el DOM:

      * Ejemplo: `document.documentElement.dataset.theme = theme;`
      * Y/o actualizar clase `dark` en el `<html>`/`<body>` si Tailwind lo requiere.

* Añadir hook `useTheme` (por ejemplo en `cms/src/app/theme/useTheme.ts`) que lea el contexto.

### 4.2. Integración en el árbol de React

* En el entrypoint del CMS (`cms/src/main.tsx`):

  * Envolver la App con `ThemeProvider` por encima de `AuthProvider` / routers si tiene sentido (o al mismo nivel, pero que cubra todo el layout).

* En `AdminLayout.tsx`:

  * Llamar a `useTheme()` para obtener `theme` y `toggleTheme`.
  * Renderizar el **Theme Toggle** en el Topbar:

    * Estado visual coherente: por ejemplo icono sol cuando estás en dark (para indicar “ir a claro”) y luna cuando estás en light.
    * Accesible (texto alternativo, `aria-pressed`, etc. si es posible).

---

## 5. Impacto en Pantallas del CMS

T6.2 no añade nuevas vistas de negocio, pero debe garantizar que:

* **Login (`/admin/login`)**:

  * Respeta el tema actual (Dark por defecto, Light si el usuario ya lo había configurado en una sesión previa dentro del CMS).

* **Dashboard (`/admin`)** y placeholders (`/admin/programs`, `/admin/instructors`, etc.):

  * Se ven bien en ambos temas:

    * Contraste correcto de texto.
    * Cards legibles.
    * Sidebar y Topbar con suficiente contraste fondo/texto/iconos.

No es necesario perfeccionar la UI de cada sección (eso llegará en T7–T9), pero sí garantizar que el cambio de tema no rompe la legibilidad.

---

## 6. Tests y QA (solo CMS)

### 6.1. Tests de lógica de tema (opcional pero deseable)

* En tests de componentes o hooks:

  * Verificar que ThemeProvider:

    * Usa `"dark"` cuando LocalStorage no tiene valor.
    * Usa `"light"` cuando LocalStorage contiene `"light"`.
  * Verificar que `toggleTheme()`:

    * Cambia el estado de `"dark"` a `"light"` y viceversa.
    * Llama a `localStorage.setItem("kinesis-admin-theme", ...)`.

### 6.2. QA manual

* Flujo 1:

  * Abrir CMS, logarse, ver tema Dark por defecto.
  * Cambiar a Light con el toggle.
  * Refrescar página:

    * Confirmar que sigue en Light.
  * Cerrar pestaña y volver a abrir:

    * Confirmar que sigue en Light.

* Flujo 2:

  * Cambiar de Light a Dark.
  * Revisar:

    * Sidebar, Topbar, tarjetas, inputs → contraste OK.
  * Navegar por diferentes rutas (`/admin/programs`, `/admin/leads`, etc.) y comprobar consistencia.

---

## 7. Criterios de Aceptación

* [ ] El CMS soporta **dos temas**: Dark (predeterminado) y Light.
* [ ] La preferencia de tema se persiste en **LocalStorage** bajo la clave `kinesis-admin-theme`.
* [ ] El **Theme Toggle** está visible en el Topbar del CMS y cambia correctamente el tema sin recarga.
* [ ] Todo el layout (Sidebar, Topbar, cards, formularios) **depende de tokens de tema**, no de hex directos, siguiendo la guía de diseño.
* [ ] No se ha modificado nada fuera de `cms/` (excepto una nota breve opcional en `replit.md`).
* [ ] No se han roto T6/T6.1: login, rutas `/admin/**` y el sistema actual de autenticación siguen funcionando.
* [ ] No hay errores de compilación en el CMS.
