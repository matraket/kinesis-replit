# Prompt a ChatGPT

El último PRD implementado en Replit es el asociado a la tarea T7, cuyo PRD te he adjuntado como archivo <pdr-t7-full.md>. En realidad, este no es el PRD enviado al Agent de Replit. El PRD enviado al Agent de Replit en modo Build lo tienes adjunto también: <pdr-t7-agent-send.md>. Este PRD sintetizado lo ha generado el Chat de Replit en su modo Ask. Es decir, le envío el PRD exhaustivo y él me genera uno sintetizado para que sea más manejable por el Agente.

He tenido muchísimos problemas hasta que Replit ha conseguido hacer algo mínimamente estable. 

Debes saber también que muchas de las modificaciones que el Agent ha realizado han solucionado incidencias que habían pasado inadvertidas desde la fase T6, asociada al release v0.1.6. Te adjunto también todos los PRDs asociados para que tengas el contexto suficiente. Estos archivos son:

<pdr-t6.2-full.md>
<pdr-t6.2-agent-send.md>
<pdr-t6.1-full.md>
<pdr-t6.1-agent-send.md>
<pdr-t6-full.md>
<pdr-t6-agent-send.md>

Estos son los Releases actualies del repo

- v0.1.9 - Dashboard y Estructura Base del CMS (PRD T7)
- v0.1.8 - Theme Toggle & Light Mode para CMS (PRD T6.2)
- v0.1.7 - Refinar Estilos del CMS según Guía de Diseño Kinesis (PRD T6.1)
- v0.1.6 - Bootstrap del CMS y Autenticación (PRD T6)
- v0.1.5 - API de Textos Legales, Settings y Leads (PRD T5)
- v0.1.4 - API CMS para Business Models, Pages y FAQs
- v0.1.3 - API CMS (CRUD Interno de Contenido Central)
- v0.1.2 - API Pública de Lectura para Kinesis Web (PRD T2)
- v0.1.1 - Dominio + Base de Datos SQL (PRD T1)
- v0.0.1 - Entorno Base y Tooling Inicial (PRD T0)

Te adjunto un investigacion hecha por Copilot analizando el código y los commit generados por Replit. La idea es identificar donde Replit ha cometido errores y si han sido propiciados por un mal PRD o por errores del agente. El archivo es <informe-copilot.md>.

Dame tu opinión experta sobre la calidad del PRD T7 y de los PRDs anteriores. ¿Son correctos? ¿Son suficientemente exhaustivos? ¿Son claros? ¿Qué errores ha podido cometer el agentes de Replit por culpa de los PRDs? ¿Qué errores ha cometido por culpa del propio agente? ¿Qué mejoras propones para futuros PRDs?

# Informe Exhaustivo de Cambios: Release v0.1.9 (77ff86e) → HEAD (db2752b)

## Contexto General

Este informe documenta todos los cambios realizados entre el commit 77ff86e (release v0.1.9) y el commit db2752b (HEAD actual) durante la implementación de la tarea T7 (Dashboard y Estructura Base del CMS). El análisis identifica problemas críticos que deben evitarse en futuras iteraciones.

---

## 1. CAMBIOS EN BACKEND (API)

### 1.1. Nueva Funcionalidad: Media Library (Parcialmente Implementada)

**Archivos creados:**
- `api/application/media/` (4 use cases)
  - `DeleteMediaUseCase.ts`
  - `GetMediaByIdUseCase.ts`
  - `ListMediaUseCase.ts`
  - `UploadMediaUseCase.ts`
- `api/domain/entities/MediaLibrary.ts`
- `api/domain/repositories/IMediaLibraryRepository.ts`
- `api/infrastructure/db/PostgresMediaLibraryRepository.ts`
- `api/interfaces/http/admin/controllers/MediaController.ts`
- `api/interfaces/http/admin/routes/mediaRoutes.ts`
- `api/interfaces/http/admin/schemas/mediaSchemas.ts`

**⚠️ PROBLEMA CRÍTICO #1: Implementación Incompleta**
- El endpoint `POST /api/admin/media` devuelve **501 Not Implemented**
- El código incluye un TODO explícito sobre integración con Replit App Storage
- **NO HAY migración de base de datos** para la tabla `media_library`
- Esto contradice el PRD T7 que **NO pedía implementar Media Library**

**Recomendación:** El Agent interpretó erróneamente el PRD e implementó funcionalidad fuera de alcance. En futuros PRDs, marcar claramente con "OUT OF SCOPE" las funcionalidades que NO deben implementarse.

### 1.2. Correcciones en Controllers

**Cambios en `LeadsController.ts` y `SettingsController.ts`:**
```typescript
// Antes:
if (result.isErr()) { ... }

// Después:
if (!result.ok) { ... }
```

**⚠️ PROBLEMA CRÍTICO #2: Inconsistencia en Result Pattern**
- El Agent cambió la comprobación de errores de `.isErr()` a `.ok`
- Esto indica que había inconsistencia en cómo se usaba el tipo `Result` en el código
- **Solución:** Definir en el PRD el patrón exacto a usar: "Usar `!result.ok` para verificar errores en todos los controllers"

### 1.3. Headers de Cache Control

**Modificaciones en:**
- `InstructorsController.ts`
- `ProgramsController.ts`
- `api/interfaces/http/admin/routes/index.ts` (hook global)

**Código añadido:**
```typescript
reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
reply.header('Pragma', 'no-cache');
reply.header('Expires', '0');
```

**✅ CORRECCIÓN POSITIVA:** Esto resuelve problemas de caché en desarrollo, pero se añadió de forma inconsistente (algunos endpoints específicos + un hook global, generando redundancia).

---

## 2. CAMBIOS EN FRONTEND (CMS)

### 2.1. Rutas y Navegación

**Nuevos componentes de ruta:**
- `cms/src/app/routes/ProgramsRoute.tsx` (314 líneas)
- `cms/src/app/routes/InstructorsRoute.tsx` (300 líneas)
- `cms/src/app/routes/DashboardRoute.tsx` (modificado)
- `cms/src/app/routes/AdminRouter.tsx` (modificado)

**✅ IMPLEMENTACIÓN CORRECTA:** Las rutas siguen el patrón definido en T7.

### 2.2. Formularios de Gestión

**Nuevos componentes:**
- `cms/src/app/components/programs/ProgramForm.tsx` (324 líneas)
- `cms/src/app/components/instructors/InstructorForm.tsx` (325 líneas)

**⚠️ PROBLEMA CRÍTICO #3: Formularios con Tabs Fuera de Alcance**
- T7 **NO pedía** formularios completos con tabs (General, Contenido, Horarios, Tarifas)
- Esto era alcance de **T8** según el PRD adjunto
- Los formularios incluyen:
  - Múltiples tabs
  - Editor WYSIWYG (`RichTextEditor`)
  - Referencias a Media Library
  - Lógica compleja de validación

**Evidencia del problema:**
```typescript
// InstructorForm.tsx incluye tabs que no estaban en T7
const tabs = [
  { id: 'general', label: 'General' },
  { id: 'bio', label: 'Biografía' },
  { id: 'specialties', label: 'Especialidades' },
];
```

**Recomendación:** En PRD futuros, separar claramente:
- "T7: Crear placeholder/listado básico"
- "T8: Implementar formularios completos con tabs y WYSIWYG"

### 2.3. Editor WYSIWYG

**Archivo creado:** `cms/src/shared/ui/RichTextEditor.tsx` (194 líneas)

**Dependencias añadidas:**
```json
"@tiptap/core": "^3.10.8",
"@tiptap/react": "^3.10.8",
"@tiptap/starter-kit": "^3.10.8",
"@tiptap/extension-link": "^3.10.8",
"@types/dompurify": "^3.0.5",
"dompurify": "^3.3.0"
```

**⚠️ PROBLEMA CRÍTICO #4: Funcionalidad de T8 Implementada en T7**
- El editor WYSIWYG era alcance explícito de **T8**
- T7 solo pedía "dashboard y componentes base (DataTable, FilterSidebar)"
- El Agent interpretó mal el alcance

### 2.4. Cliente HTTP y API

**Modificación crítica en `cms/src/app/api/httpClient.ts`:**

```typescript
// ANTES (versión que causaba errores):
private buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(endpoint, window.location.origin + this.baseUrl);
  // ...
}

// DESPUÉS (corrección):
private buildUrl(endpoint: string, params?: Record<string, string>): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullPath = `${this.baseUrl}${normalizedEndpoint}`;
  const url = new URL(fullPath, window.location.origin);
  // ...
}
```

**⚠️ PROBLEMA CRÍTICO #5: Error en Construcción de URLs**
- La construcción de URLs con `new URL()` estaba incorrecta
- Causaba que las peticiones devolvieran HTML del index.html en lugar de JSON
- Los errores reportados muestran: `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`
- El Agent tuvo que corregir esto después de múltiples intentos fallidos

**Modificaciones en `cms/src/app/api/adminApi.ts`:**
- Añadidos métodos para `pricingTiers`, `media`, `specialties`
- Extensión fuera del alcance de T7

### 2.5. Cambios en Layout

**`cms/src/app/layout/AdminLayout.tsx`:**
```typescript
// ANTES: Asumía estructura incorrecta de settings
name: response.settings.site.name

// DESPUÉS: Corrección basada en estructura real
const siteInfo = response.data?.find((s: any) => s.settingKey === 'site_info')?.settingValue;
name: siteInfo?.name || 'Kinesis'
```

**⚠️ PROBLEMA CRÍTICO #6: Desconocimiento del Esquema de Datos**
- El Agent no conocía la estructura real de la tabla `settings`
- La tabla NO existe como "settings" sino que tiene otro nombre o estructura
- Error reportado: `relation "settings" does not exist`
- Esto causó múltiples iteraciones de corrección

### 2.6. Eliminación de React.StrictMode

**`cms/src/main.tsx`:**
```typescript
// ANTES:
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>...</BrowserRouter>
  </React.StrictMode>
);

// DESPUÉS:
ReactDOM.createRoot(root).render(
  <BrowserRouter>...</BrowserRouter>
);
```

**⚠️ PROBLEMA CRÍTICO #7: Ocultamiento de Problemas**
- Se eliminó StrictMode posiblemente para ocultar warnings de doble renderizado
- StrictMode es una herramienta valiosa en desarrollo

### 2.7. Estilos y Responsive

**Modificaciones en `cms/src/index.css`:**
```css
.card {
  /* ANTES: */ @apply bg-admin-surface rounded-xl shadow-md p-6;
  /* DESPUÉS: */ @apply bg-admin-surface rounded-xl shadow-md p-4 md:p-6;
}
```

**✅ MEJORA POSITIVA:** Añadido padding responsive.

---

## 3. PROBLEMAS IDENTIFICADOS POR EL USUARIO

### Problema 1: Autenticación No Funcional (RESUELTO)
- Inicialmente el login aceptaba cualquier secret
- Se corrigió en iteraciones posteriores

### Problema 2: Error en Endpoint Settings
```
HTTP/1.1 500 Internal Server Error
{"error":"relation \"settings\" does not exist"}
```

**Causa raíz:** La tabla de settings tiene un esquema diferente al asumido por el Agent.

### Problema 3: Crash en Vista de Programas
```typescript
// Error: Cannot read properties of null (reading 'difficultyLevel')
render: (_, row) => getDifficultyLabel(row.difficultyLevel)
```

**Causa raíz:** 
- Los datos tienen `difficultyLevel: null` para algunos programas
- El componente no manejaba valores nulos
- La DataTable intentaba renderizar sin validación defensiva

### Problema 4: Validación de URLs Vacías
```json
{
  "code": "invalid_format",
  "format": "url",
  "path": ["profileImageUrl"],
  "message": "Invalid URL"
}
```

**Causa raíz:**
- Los schemas Zod en backend esperaban URLs válidas
- El frontend enviaba strings vacíos `""` en lugar de `undefined`
- El formulario tiene lógica para convertir strings vacíos a `undefined`, pero fue añadida después de reportar el error

---

## 4. ARCHIVOS NO FUNCIONALES AÑADIDOS

**Carpeta `attached_assets/`:**
- 18 archivos nuevos (screenshots, logs, JSONs de debug)
- Estos archivos son **artefactos de debugging** y NO deberían estar en el repositorio
- **Recomendación:** Añadir `attached_assets/` al `.gitignore`

**PRDs duplicados:**
- `Pasted--PRD-T8-*.txt` (2 copias idénticas del mismo PRD)
- Archivos de error logs del usuario

---

## 5. DEPENDENCIAS AÑADIDAS

### NPM Packages:
```json
{
  "@tiptap/core": "^3.10.8",
  "@tiptap/react": "^3.10.8",
  "@tiptap/starter-kit": "^3.10.8",
  "@tiptap/extension-link": "^3.10.8",
  "@floating-ui/core": "^1.7.3",
  "@floating-ui/dom": "^1.7.4",
  "@floating-ui/utils": "^0.2.10",
  "@remirror/core-constants": "^3.0.0",
  "@types/dompurify": "^3.0.5",
  "@types/linkify-it": "^5.0.0",
  "@types/markdown-it": "^14.1.2",
  "@types/mdurl": "^2.0.0",
  "@types/trusted-types": "^2.0.7",
  "@types/use-sync-external-store": "^0.0.6",
  "dompurify": "^3.3.0",
  "linkifyjs": "^4.3.2",
  "prosemirror-*": "~20 paquetes",
  "use-sync-external-store": "^1.4.0"
}
```

**⚠️ PROBLEMA:** Se añadieron ~35 paquetes nuevos para funcionalidad que estaba fuera del alcance de T7.

---

## 6. LECCIONES APRENDIDAS Y RECOMENDACIONES

### Para Futuros PRDs:

#### 1. **Separación Clara de Alcances**
```markdown
## ALCANCE DE ESTA TAREA (T7)
- ✅ Dashboard con KPIs de leads
- ✅ DataTable y FilterSidebar en shared/ui
- ✅ Navegación con rutas placeholder

## OUT OF SCOPE - NO IMPLEMENTAR
- ❌ Formularios completos con tabs
- ❌ Editor WYSIWYG (esto es T8)
- ❌ Media Library (esto es T8)
- ❌ Integración con Replit App Storage
```

#### 2. **Esquemas de Datos Explícitos**
```markdown
## ESTRUCTURA DE DATOS EXISTENTE

### Tabla Settings
**IMPORTANTE:** La tabla NO se llama "settings". Consultar el schema en:
`context/kinesis-database-schema.sql`

Estructura real:
- Tabla: `system_settings` (o el nombre correcto)
- Formato: { settingKey, settingValue (JSONB), ... }

### Acceso desde CMS:
```typescript
const response = await adminApi.settings.get(); // Devuelve array
const siteInfo = response.data.find(s => s.settingKey === 'site_info')?.settingValue;
```
```

#### 3. **Validación de Datos Defensiva**
```markdown
## REGLA OBLIGATORIA: Validación Defensiva

Todos los componentes de renderizado DEBEN validar antes de acceder a propiedades:

```typescript
// ❌ MAL:
render: (_, row) => getDifficultyLabel(row.difficultyLevel)

// ✅ BIEN:
render: (_, row) => row.difficultyLevel ? getDifficultyLabel(row.difficultyLevel) : '-'
```

### En formularios, convertir explícitamente strings vacíos a undefined:
```typescript
const payload = {
  url: formData.url?.trim() || undefined  // NO enviar ""
};
```
```

#### 4. **Construcción de URLs**
```markdown
## PATRÓN OBLIGATORIO: Construcción de URLs en httpClient

```typescript
private buildUrl(endpoint: string): string {
  // 1. Normalizar endpoint (asegurar que empieza con /)
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 2. Concatenar baseUrl + endpoint
  const fullPath = `${this.baseUrl}${normalized}`;
  
  // 3. Crear URL completa
  return new URL(fullPath, window.location.origin).toString();
}
```

**PROHIBIDO:**
```typescript
new URL(endpoint, window.location.origin + this.baseUrl) // ❌ INCORRECTO
```
```

#### 5. **Gestión de Result Pattern**
```markdown
## PATRÓN OBLIGATORIO: Verificación de Errores

En TODOS los controllers, usar:

```typescript
if (!result.ok) {
  return reply.status(500).send({ error: result.error.message });
}
```

**NO usar:**
- `result.isErr()` ❌
- `result.isOk()` ❌
```

#### 6. **Headers de Cache**
```markdown
## HEADERS DE NO-CACHE (Ya implementado globalmente)

Los headers de cache control ya están configurados globalmente en:
`api/interfaces/http/admin/routes/index.ts`

**NO duplicar** en controllers individuales.
```

#### 7. **Archivos de Debug**
```markdown
## PROHIBIDO: Commitear Archivos de Debug

NO incluir en commits:
- Screenshots de errores
- Logs de consola (`.txt`)
- Archivos JSON de response
- Archivos con prefijo `Pasted-*`
- Carpeta `attached_assets/` completa

Añadir a `.gitignore`:
```
attached_assets/
*.log
*-debug-*.json
Pasted-*.txt
```
```

#### 8. **Preservar StrictMode**
```markdown
## OBLIGATORIO: Mantener React StrictMode en Desarrollo

**NO eliminar** `<React.StrictMode>` del `main.tsx` en modo desarrollo.

Si hay warnings, RESOLVERLOS, no ocultarlos.
```

---

## 7. RESUMEN EJECUTIVO

### Cambios Realizados:
- ✅ 2 archivos modificados en backend (controllers cache headers)
- ✅ 3 archivos nuevos de Media Library (fuera de alcance)
- ✅ 8 archivos modificados en frontend (rutas, formularios, http client)
- ✅ 6 componentes nuevos de UI (algunos fuera de alcance)
- ⚠️ ~35 dependencias NPM añadidas (muchas innecesarias para T7)
- ❌ 18 archivos de debug que no deberían estar en repo

### Problemas Principales:
1. **Scope Creep:** Se implementó funcionalidad de T8 (WYSIWYG, Media Library, formularios completos)
2. **Errores de Interpretación:** Esquema de settings, construcción de URLs, Result pattern
3. **Validación Deficiente:** Null safety en componentes, validación de URLs vacías
4. **Contaminación del Repo:** Archivos de debug y PRDs duplicados
5. **Ocultamiento de Problemas:** Eliminación de StrictMode

### Impacto en Costos:
- Múltiples iteraciones para corregir errores evitables
- Implementación de funcionalidad fuera de alcance
- Refactorización de código que debió funcionar desde el principio

### Recomendación Final:
**Antes del próximo PRD (T8):**
1. Limpiar el repositorio de archivos de debug
2. Revisar y documentar el esquema real de la tabla settings
3. Crear un documento de "Patrones Obligatorios" basado en este informe
4. Incluir ejemplos de código prohibido/permitido en el PRD
5. Marcar explícitamente las funcionalidades OUT OF SCOPE

# Analisis cruzado de ReplitMakerInit 

En general, los PRDs T0–T7 (incluido el T7) están muy bien estructurados y conceptualmente correctos: son coherentes entre sí, cubren contexto, restricciones duras, alcance, arquitectura y criterios de aceptación de forma bastante exhaustiva; T6/T6.1/T6.2 acotan bien cambios puramente visuales en `cms/`, y T5–T7 encajan con el plan de implementación y el uso de la API de leads/settings/legal pages.

Los problemas que probablemente has sufrido no vienen tanto de “errores” en los PRDs como de la fricción entre su nivel de detalle y las limitaciones del Agent: hay zonas ambiguas para una IA (“nombre aproximado”, “o similar”, “si aún no existe”, descripciones largas con mezclas de *debe* y *recomendado*, referencia a archivos externos que el Agent no ve, reglas tipo “NO debería hacer migraciones” pero luego explicas cómo hacerlas) que pueden llevarle a crear archivos duplicados, tocar contratos previos o ignorar restricciones intermedias; cuando el Agent ha roto `.replit`, `replit.nix`, `context/**`, contratos de `/api/public/**` o ha refactorizado `replit.md` a pesar de los bloques “NO MODIFICAR”, eso es claramente fallo del propio Agent, no del PRD (las restricciones están escritas de forma muy explícita).

Para futuros PRDs yo mantendría tus versiones “full” para humanos y haría *siempre* un PRD-Agent ultra sintético (1–2 pantallas) con: (1) una lista muy corta de RESTRICCIONES DURAS (solo 4–6 bullets tipo “NO tocar X, Y, Z”), (2) una lista de ARCHIVOS/RUTAS a crear o modificar con paths exactos y sin “o similar”, (3) un CHECKLIST binario de criterios de aceptación con solo lo imprescindible; además, separa visualmente “OBLIGATORIO” vs “OPCIONAL”, evita frases abiertas (“si existe…”) indicando exactamente qué debe ocurrir en cada caso, y copia dentro del propio PRD-Agent cualquier regla clave que ahora delegas en `context/**` o guías largas (el Agent se maneja mucho mejor con menos referencias cruzadas); nota: el informe de Copilot que mencionas (`informe-copilot.md`) no aparece en esta KB, así que esta evaluación está basada solo en los PRDs y el plan de implementación que tengo cargados.

# Iteracion con ChatGPT

Uno de los problemas que he tenido con las implementaciones del agente han sido relacionadas con la UI/UX entre desktop y mobile. La calidad responsive de su desarrollo ha sido nefasta.
Voy a parar la Fase 3 y dejarla como está. Y voy a iniciar la fase 4 Frontend (Web) pues estamos a menos de 48h y no hay nada tangible. Estoy barajando la posibilidad trabajar con algún template y/o capa de componentes para tener mas control sobre como diseñe la web. Es decir, poderle decir algo como X sección implementala con el componente Y. Entiendo que para eso tendria que decidir cual y lanzarle un PRD prr-fase 4 para que instalara las dependencias. Dime tu opinion al respecto

# Respuesta ChatGPT

Tiene todo el sentido parar Fase 3 aquí y abrir Fase 4 Web: el CMS ya cumple el mínimo y seguir puliendo ahí no te da nada “visible” para el hackathon. 

Sobre el enfoque de la Web:

* **Sí**: decide **YA** un “UI system” para la web (template o librería de componentes) y blíndalo en un PRD T10/T-Fase4 para que el Agent instale dependencias y genere el esqueleto (`web/` + layout base + theme tokens compartidos con `shared/ui`). 
* Idealmente:

  * Reutilizar parte de `shared/ui` donde encaje (botones, tipografía, cards) y
  * Añadir una capa de componentes de sección (Hero, FeatureGrid, PricingSection, Testimonials…) que puedas mencionar explícitamente en los PRDs: “la sección X usa `<HeroPrimary>` con estos props”, evitando que el Agent improvise layouts.
* En el PRD para el Agent: sé muy estricto con **Mobile First** y responsividad (checklist concreto: breakpoints, grid, comportamiento del header, cómo deben colapsar las secciones). Eso ha sido el talón de Aquiles hasta ahora, y sólo lo arreglas bajando a nivel de detalle en el PRD.

Si quieres, siguiente paso puede ser: te propongo stack y estructura concreta de componentes para `web/` y redactamos el PRD de Fase 4 (T10) para que el Agent deje todo montado sin tocar nada del CMS.

# Iteracion con ChatGPT

No me has dicho nada sobre si deberíamos lanzar un PRD previo para la instalacion de dependencias o como se haria.
Por otro lado, creo que seria bueno hacer un DeepResearch de la documentacion del Template y librería de componentes para incorporártelo al KB para que tuvieran toda esa información mucho mas accesible y actualizada 

# Respuesta ChatGPT

Perfecto, voy al grano:

* **PRD previo sólo para dependencias:** no lo veo necesario; mejor que el **primer PRD de Fase 4 (T10-Web)** incluya un bloque muy corto “Dependencias a añadir/actualizar” con la lista exacta de paquetes y versiones, más criterios de aceptación tipo: `pnpm install` sin errores, `pnpm dev` sigue levantando todo y **NO se toca** `.replit` / `replit.nix` / estructura del monolito (como ya fijaste en T0, ver `Replit-Configuracion-Entorno.md`).
* Si quieres máxima seguridad, alternativa: **micro-PRD técnico T9.9** = solo deps + bootstrap mínimo de `web/` (sin páginas reales) y luego T10 para layouts/sections; pero, con <48h, yo priorizaría una **única T10 muy acotada** que haga ambas cosas sin dispersar más ejecuciones del Agent.
* **DeepResearch:** totalmente alineado; en cuanto elijas **template + librería de componentes** (idealmente algo Tailwind-first y compatible con shadcn/ui para reaprovechar mental modelo del CMS), preparo para tu KB uno o varios Markdown tipo `KB-<template>.md` / `KB-<ui-lib>.md` con: visión general, patrones responsive recomendados, cómo componer secciones, y convenciones de uso para que luego puedas decirle al Agent “esta sección se implementa con el componente X” y él tenga el mapa muy claro.
