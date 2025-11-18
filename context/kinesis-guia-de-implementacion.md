# Kinesis — Sistema de Diseño y Guía de Implementación (Web + CMS)

---

## 🎨 SISTEMA DE DISEÑO BASE

### 🎛 Sistema de temas (Light / Dark)

Tanto la **Web pública** como el **CMS** soportarán dos modos de visualización:

- **Modo Dark (predeterminado en CMS)**: orientado a trabajo prolongado en pantalla, con fondos oscuros y alto contraste.
- **Modo Light (predeterminado en Web)**: orientado a máxima legibilidad en fondos claros, alineado con patrones estándar de navegación.

**Principios generales:**

- La **identidad de marca** (Kinesis Pink / Admin Accent Pink, tipografías, espaciados) se mantiene en ambos temas.
- El toggle solo cambia **fondos, textos y superficies**, NO el color de marca ni la jerarquía de componentes.
- El sistema usará **tokens de diseño** (variables) para fondos, textos, bordes y estados; el código nunca debe usar hexadecimales sueltos.
- La preferencia de tema se persistirá en el navegador y respetará `prefers-color-scheme` cuando sea posible.

### Paleta de Colores Página WEB

Paleta de colores definida para la página WEB Pública

```
Primarios
- Kinesis Pink: #FF3366 (Color principal – CTAs, botones, links destacados)
- Kinesis Night: #050714 (Fondos principales oscuros, hero, footer)
- Kinesis White: #FFFFFF (Fondos claros, texto sobre fondos oscuros)


Secundarios
- Night 800: #0B1020 (Fondos de secciones, header fijo)
- Night 700: #151A2F (Cards oscuras, overlays de imagen)
- Gray 100: #F5F5F5 (Fondos sutiles, secciones claras)
- Gray 200: #E5E7EB (Bordes, divisores, inputs)
- Gray 600: #4B5563 (Texto secundario)
- Gray 900: #111827 (Texto principal sobre fondos claros)


Acentos
- Accent Purple: #8B5CF6 (Badges, pequeños detalles de marca)
- Success Green: #10B981 (Estados correctos, confirmaciones)
- Warning Amber: #F59E0B (Avisos, advertencias suaves)
- Error Red: #EF4444 (Errores, mensajes críticos)
- Info Blue: #3B82F6 (Mensajes informativos, enlaces secundarios)
```

#### Web – Modo Light (predeterminado)

Usa fondos claros y texto oscuro.

- Fondo principal: Gray 100
- Fondo secciones: Gray 100 / Gray 200
- Texto principal: Gray 900
- Texto secundario: Gray 600
- CTAs / links destacados: Kinesis Pink
- Acentos: Accent Purple, Success Green, Warning Amber, Error Red, Info Blue

#### Web – Modo Dark

Reusa los tonos Night y Pink definidos:

- Fondo principal: Kinesis Night
- Fondo secciones: Night 800 / Night 700
- Texto sobre fondo oscuro: Kinesis White
- Bordes y detalles: Gray 200 / Accent Purple
- CTAs: Kinesis Pink


### Paleta de Colores CMS Admin

Paleta de colores definida para el panel de administración (CMS).

```text
Primarios
- Admin Navy:          #020617  (Sidebar principal, fondo app)
- Admin Surface:       #0F172A  (Fondos de tarjetas y módulos)
- Admin Accent Pink:   #FB2F72  (Botones primarios, elementos activos)

Secundarios
- Admin Border:        #1E293B  (Bordes, separadores, contornos de inputs)
- Admin Muted:         #64748B  (Texto secundario, iconos desactivados)
- Admin Surface Light: #111827  (Headers de tablas, barras superiores)
- Admin White:         #FFFFFF  (Fondos de tablas, tarjetas claras, texto sobre fondos muy oscuros)

Acentos
- Admin Success:       #10B981  (Estados OK, chips de "Publicado")
- Admin Warning:       #F59E0B  (Avisos, etiquetas de "Pendiente")
- Admin Error:         #EF4444  (Errores de validación, estados críticos)
- Admin Info:          #38BDF8  (Badges de información, tooltips)
```
#### CMS – Modo Dark (predeterminado)

Tema oscuro optimizado para trabajo prolongado en pantalla:

- Fondo app: Admin Navy (#020617)
- Superficies principales: Admin Surface (#0F172A)
- Headers y barras: Admin Surface Light (#111827)
- Bordes y separadores: Admin Border (#1E293B)
- Texto principal: Admin White (#FFFFFF)
- Texto secundario: Admin Muted (#64748B)
- Sidebar: Admin Navy con iconos en Admin Muted y item activo en Admin Accent Pink
- Botones primarios: Admin Accent Pink (#FB2F72)
- Estados: Admin Success, Admin Warning, Admin Error, Admin Info (con contraste adecuado sobre fondos oscuros)

#### CMS – Modo Light

Tema claro para trabajar en entornos muy iluminados:

- Fondo app: Admin White
- Superficies principales: Gray 100 / Gray 200
- Bordes: Admin Border
- Texto principal: Gray 900
- Texto secundario: Admin Muted
- Sidebar: Admin Surface Light con iconos en Admin Muted y item activo en Admin Accent Pink
- Estados: Admin Success, Admin Warning, Admin Error, Admin Info (mismos colores que en Dark pero adaptando texto/bordes para contraste)

### Comportamiento del Toggle de Tema

**En la Web pública:**

- Tema predeterminado: **Light**.
- Se respeta `prefers-color-scheme` del sistema operativo.
- El usuario puede alternar entre Light/Dark desde el header (icono sol/luna).
- La preferencia de tema se guarda en el almacenamiento local del navegador (localStorage, clave recomendada kinesis-theme) y se aplica automáticamente en visitas posteriores.
- El cambio de tema es instantáneo y animado suavemente (fade/transición de opacidad).

**En el CMS:**

- Tema predeterminado: **Dark** (Admin Navy + Admin Surface).
- Toggle accesible en el **Topbar**, cerca de la zona de usuario.
- La preferencia de tema del CMS se guardará también en localStorage (por ejemplo, con la clave kinesis-admin-theme), de forma que cada navegador recuerde si el usuario prefiere modo Dark o Light.
- Todo el layout (Sidebar, Topbar, cards, tablas, formularios) debe depender de tokens de tema, nunca de hex fijos.

### Tipografía
```
Display: Montserrat (700, 800)
- H1: 48px móvil / 72px desktop
- H2: 36px móvil / 48px desktop

Body: Inter (400, 500, 600)
- H3: 24px / 32px
- H4: 20px / 24px
- Body: 16px / 18px
- Small: 14px
```

### Espaciado (múltiplos de 8px)
```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
2xl: 64px
3xl: 96px
```

### Componentes Base
- **Botones**: Rounded-lg (8px), altura 48px, padding horizontal 24px
- **Cards**: Rounded-xl (12px), shadow-md, padding 24px
- **Inputs**: Height 48px, rounded-lg, border gray-200
- **Modales**: Rounded-xl, overlay negro 50% opacidad

---


## 📱 CONSIDERACIONES RESPONSIVE

### Mobile First Approach

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptaciones Mobile:**
- Navigation: Hamburger menu con drawer lateral
- Grid columns: Colapsar a stack vertical
- Cards: Full width con padding reducido
- Tablas: Convertir a cards apiladas
- Modales: Full screen en móvil
- Formularios: Inputs full width
- Imágenes: Aspect ratio adaptativo

**Touch Targets:**
- Mínimo 44x44px para elementos clickables
- Spacing aumentado entre elementos
- Swipe gestures para carousels
- Pull to refresh en listados

---

## 🎯 COMPONENTES REUTILIZABLES

### Para crear en el sistema:

1. **ProgramCard**
   - Imagen, título, precio, badges
   - Variantes: horizontal, vertical, minimal

2. **InstructorCard**
   - Foto circular/cuadrada, nombre, bio
   - Tamaños: small, medium, large

3. **PricingTable**
   - Comparativa de planes
   - Highlight del recomendado

4. **ContactForm**
   - Validación en tiempo real
   - Mensajes de error/éxito

5. **StatsCounter**
   - Números animados
   - Icono y label

6. **TestimonialCard**
   - Quote, autor, rating
   - Con/sin imagen

7. **ScheduleGrid**
   - Vista semanal de horarios
   - Códigos de color por programa

8. **FAQAccordion**
   - Expandible/colapsable
   - Iconos +/-

9. **FilterSidebar**
   - Checkboxes, radios, sliders
   - Botón reset

10. **DataTable**
    - Sortable, filtrable
    - Acciones por fila
    - Selección múltiple

---

## 🚀 FLUJOS DE INTERACCIÓN PRINCIPALES

### Flujo de Inscripción:
1. Usuario navega servicios → 
2. Click en programa → 
3. Ver detalles → 
4. Click "Inscribirse" → 
5. Formulario pre-inscripción → 
6. Confirmación → 
7. Lead guardado en CMS

### Flujo de Gestión CMS:
1. Admin login → 
2. Dashboard → 
3. Seleccionar sección → 
4. CRUD operations → 
5. Preview cambios → 
6. Publicar → 
7. Ver en web pública

### Flujo de Contacto:
1. Usuario tiene duda → 
2. Click en "Contacto" → 
3. Rellena formulario → 
4. Envío con validación → 
5. Mensaje de éxito → 
6. Lead aparece en CMS → 
7. Admin gestiona lead

---

## 🎨 EFECTOS Y MICROINTERACCIONES

### Animaciones:
- **Fade in** en scroll para secciones
- **Slide up** para cards al aparecer
- **Hover scale** en botones y cards
- **Skeleton loading** mientras carga contenido
- **Progress bars** animadas
- **Smooth scroll** entre secciones
- **Parallax** suave en heroes

### Estados:
- **Hover**: Elevación, cambio de color
- **Active**: Pressed effect
- **Focus**: Outline púrpura
- **Disabled**: Opacidad 50%
- **Loading**: Spinner púrpura
- **Success**: Check verde animado
- **Error**: Shake animation

### Feedback:
- **Toasts** para notificaciones
- **Modales** de confirmación
- **Tooltips** en iconos
- **Progress indicators** en forms
- **Validación** en tiempo real
- **Autocomplete** en búsquedas

---

## 📋 NOTAS PARA IMPLEMENTACIÓN

### Prioridades de Desarrollo:
1. **FASE 1 - MVP Web**
   - Homepage
   - Páginas estáticas (Quiénes somos)
   - Catálogo de servicios
   - Formulario de contacto
   - Responsive design

2. **FASE 2 - CMS Básico**
   - Login admin
   - Dashboard
   - CRUD programas
   - CRUD instructores
   - Gestión de contenido

3. **FASE 3 - Avanzado**
   - Gestión de leads
   - Analytics
   - Optimizaciones SEO
   - Integraciones
   - PWA features

### SEO Checklist:
- Meta tags dinámicos
- Schema.org markup
- Sitemap.xml
- Robots.txt
- Open Graph tags
- Twitter Cards
- Alt text en imágenes
- URLs amigables
- Contenido indexable

---

## 🎯 RESULTADO ESPERADO

Al implementar estos diseños en Replit, obtendrás:

1. **Web pública** moderna y atractiva que convierte visitantes en leads
2. **CMS intuitivo** para gestión sin conocimientos técnicos
3. **Sistema escalable** preparado para crecer
4. **Experiencia móvil** optimizada
5. **SEO-friendly** para posicionamiento
6. **Performance** optimizada (Core Web Vitals)
7. **Accesible** cumpliendo WCAG 2.1 AA

