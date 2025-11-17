# T2: API Pública de Lectura - Instrucciones Ejecutables

## 🎯 OBJETIVO
Crear endpoints GET públicos bajo `/api/public` para que la web consuma datos de: business models, programs, instructors, pricing tiers, page content, faqs y legal pages.

---

## 🚨 RESTRICCIONES CRÍTICAS

**NO TOCAR:**
- `context/**` (solo lectura)
- `.replit`, `replit.nix`
- Estructura de carpetas raíz
- `GET /` y `GET /health` existentes

**ALCANCE:**
- Solo endpoints `GET` (lectura)
- Solo `/api/public/**` (NO crear `/api/admin/**`)
- No crear endpoints de escritura (POST/PUT/DELETE)

**BASE DE DATOS:**
- Lee `context/kinesis-database-schema.sql` para entender el modelo
- Lee `scripts/sql/01_init_core_schema.sql` para ver qué tablas existen
- Crea `scripts/sql/02_public_api_schema.sql` SOLO con lo que falte (no recrees tablas existentes)

---

## 📝 QUÉ IMPLEMENTAR (en este orden)

### FASE 1: Business Models
1. Crear entidad `api/domain/entities/BusinessModel.ts`
2. Crear interfaz repositorio `api/application/ports/IBusinessModelRepository.ts`
3. Implementar `api/infrastructure/db/PostgresBusinessModelRepository.ts`
4. Crear casos de uso en `api/application/use-cases/public/`:
   - `ListBusinessModelsForPublicSite.ts`
   - `GetBusinessModelBySlug.ts`
5. Crear en `api/interfaces/http/public/`:
   - `schemas/business-model.schemas.ts` (Zod)
   - `controllers/business-models.controller.ts`
   - `routes/business-models.routes.ts`
6. Endpoints: `GET /api/public/business-models` y `GET /api/public/business-models/:slug`

### FASE 2: Programs
Igual que Fase 1 pero para Programs:
- Endpoints: `GET /api/public/programs` (con filtros `businessModelSlug`, `specialtyCode`, `difficulty` + paginación `page`, `limit`)
- `GET /api/public/programs/:slug`
- Resolver relaciones con business_models y specialties

### FASE 3: Instructors
- Endpoints: `GET /api/public/instructors` (filtro `featured`, `specialtyCode`)
- `GET /api/public/instructors/:slug`
- Solo mostrar si `showOnWeb = true`

### FASE 4: Pricing Tiers
- Endpoint: `GET /api/public/pricing-tiers` (filtros `businessModelSlug`, `programSlug`)

### FASE 5: Page Content
- Endpoint: `GET /api/public/pages/:slug`
- Mínimo soportar: `about-us`, `business-models`

### FASE 6: FAQs
- Endpoint: `GET /api/public/faqs` (filtros `category`, `businessModelSlug`)

### FASE 7: Legal Pages
- Endpoints: `GET /api/public/legal-pages` y `GET /api/public/legal-pages/:slug`
- Mínimo: aviso-legal, privacidad, cookies

### FASE 8: Integración
1. Crear `api/interfaces/http/public/routes/index.ts` que importe todos los routers
2. En `api/main.ts`, registrar con `app.register(publicRoutes, { prefix: '/api/public' })`
3. Verificar que `GET /` y `GET /health` siguen funcionando

### FASE 9: Tests
- 2 tests unitarios de casos de uso
- 3 tests de integración de endpoints

### FASE 10: Documentación
- Crear `docs/api-public-endpoints.md`
- Actualizar `docs/CHANGELOG.md`

---

## ✅ REGLAS DE ORO

1. **Solo contenido publicado**: Filtrar por `publication_status = 'published'` y flags de visibilidad
2. **Errores HTTP**: 404 (not found), 400 (validación), 500 (error interno) con JSON `{ error, message }`
3. **DTOs limpios**: No exponer campos internos BD ni datos sensibles
4. **Arquitectura**: Controllers → Use Cases → Repositories → BD (nunca saltar capas)
5. **Validación Zod**: En todos los schemas de response
6. **Paginación**: Default `page=1, limit=20` en programs, instructors, faqs
7. **Ordenación**: Por `displayOrder` (business models, programs, faqs) o `seniorityLevel` (instructors)

---

## 🎯 CRITERIOS DE ACEPTACIÓN MÍNIMOS

- [ ] 7 recursos implementados con sus endpoints
- [ ] Todos son GET y solo lectura
- [ ] Filtros y paginación funcionan
- [ ] Solo devuelve contenido publicado
- [ ] Arquitectura en capas respetada
- [ ] 2 tests unitarios + 3 tests integración
- [ ] Documentación en `docs/`
- [ ] `GET /` y `GET /health` intactos
- [ ] Servidor en `process.env.PORT`

---

## 💡 TIPS PARA ÉXITO

- Inspecciona `scripts/sql/01_init_core_schema.sql` ANTES de crear migraciones
- Revisa `context/kinesis-database-schema.sql` para entender relaciones
- Sigue convenciones de `replit.md`: PascalCase (clases), camelCase (funciones), kebab-case (rutas)
- Mapea snake_case (BD) → camelCase (código) en repositorios
- Si una tabla no existe, créala en `02_public_api_schema.sql`
- Crea seeds básicos para probar (opcional pero recomendado)

**EMPIEZA POR FASE 1 y avanza secuencialmente.**