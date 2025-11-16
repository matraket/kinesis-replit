-- =====================================================
-- KINESIS CMS - MODELO DE DATOS POSTGRESQL PARA KINESIS
-- =====================================================
-- Diagrama E-R y esquema de base de datos para el CMS
-- Incluye RLS (Row Level Security) policies
-- =====================================================

-- =====================================================
-- ENABLE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS / TIPOS PERSONALIZADOS
-- =====================================================

-- Estado de publicación para contenido del CMS
CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');

-- Tipos de formularios de contacto
CREATE TYPE lead_type AS ENUM ('contact', 'pre_enrollment', 'elite_booking', 'newsletter');

-- Estado de los leads
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

-- Niveles de dificultad de programas
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'professional');

-- =====================================================
-- TABLA: business_models (Modelos de Negocio)
-- =====================================================
-- Los 4 pilares del negocio: Élite On Demand, Ritmo Constante, etc.

CREATE TABLE public.business_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_code VARCHAR(50) UNIQUE NOT NULL, -- elite_on_demand, ritmo_constante, etc.
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    schedule_info VARCHAR(255), -- "L-V 10-13h"
    target_audience VARCHAR(255),
    format VARCHAR(100), -- "Clases privadas", "Grupos regulares"
    
    -- Contenido enriquecido para la web
    feature_title VARCHAR(255), -- "¿Qué es?"
    feature_content TEXT,
    advantage_title VARCHAR(255), -- "¿Por qué lo hacemos?"
    advantage_content TEXT,
    benefit_title VARCHAR(255), -- "¿Qué ganas tú?"
    benefit_content TEXT,
    
    -- Orden y visibilidad
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    show_on_web BOOLEAN DEFAULT true,
    
    -- Metadatos
    meta_title VARCHAR(155),
    meta_description VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_business_models_slug ON public.business_models(slug);
CREATE INDEX idx_business_models_active ON public.business_models(is_active);

-- =====================================================
-- TABLA: specialties (Especialidades de Danza)
-- =====================================================

CREATE TABLE public.specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- clasico, contemporaneo, urbano, etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'professional', 'amateur', 'kids'
    
    -- Visual
    icon VARCHAR(100), -- Nombre del icono o emoji
    color VARCHAR(7), -- Hex color
    image_url TEXT,
    
    -- Configuración
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: instructors (Instructores)
-- =====================================================

CREATE TABLE public.instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200), -- Nombre artístico si aplica
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    
    -- Perfil profesional
    role VARCHAR(100), -- "Director", "Profesor Adjunto", etc.
    tagline VARCHAR(255), -- Frase inspiradora personal
    bio_summary TEXT, -- Resumen para tarjetas
    bio_full TEXT, -- Biografía completa
    achievements TEXT[], -- Array de logros
    education TEXT[], -- Array de formación
    
    -- Media
    profile_image_url TEXT,
    hero_image_url TEXT, -- Imagen para página individual
    video_url TEXT, -- Video de presentación
    
    -- Configuración de visibilidad
    show_on_web BOOLEAN DEFAULT true,
    show_in_team_page BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- Para destacar en home
    is_active BOOLEAN DEFAULT true,
    
    -- Orden y categorización
    display_order INTEGER DEFAULT 0,
    seniority_level INTEGER DEFAULT 0, -- Para ordenar por experiencia
    
    -- Metadatos SEO
    slug VARCHAR(100) UNIQUE,
    meta_title VARCHAR(155),
    meta_description VARCHAR(255),
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) -- Si el instructor tiene acceso al sistema
);

-- Índices
CREATE INDEX idx_instructors_slug ON public.instructors(slug);
CREATE INDEX idx_instructors_active_web ON public.instructors(is_active, show_on_web);

-- =====================================================
-- TABLA: instructor_specialties (Relación M:M)
-- =====================================================

CREATE TABLE public.instructor_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false, -- Especialidad principal
    years_experience INTEGER,
    certification_info TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(instructor_id, specialty_id)
);

-- =====================================================
-- TABLA: programs (Programas/Servicios)
-- =====================================================

CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    description_short TEXT,
    description_full TEXT,
    
    -- Relaciones
    business_model_id UUID REFERENCES public.business_models(id),
    specialty_id UUID REFERENCES public.specialties(id),
    
    -- Configuración del programa
    duration_minutes INTEGER,
    sessions_per_week INTEGER,
    total_sessions INTEGER, -- Para packs cerrados
    min_students INTEGER DEFAULT 1,
    max_students INTEGER DEFAULT 20,
    min_age INTEGER,
    max_age INTEGER,
    difficulty_level difficulty_level,
    
    -- Pricing
    price_per_session DECIMAL(10, 2),
    price_monthly DECIMAL(10, 2),
    price_quarterly DECIMAL(10, 2),
    price_pack DECIMAL(10, 2), -- Para bonos o packs
    enrollment_fee DECIMAL(10, 2), -- Matrícula
    
    -- Detalles adicionales
    requirements TEXT[], -- Array de requisitos
    what_to_bring TEXT[], -- Qué traer a clase
    benefits TEXT[], -- Beneficios del programa
    
    -- Horarios (texto descriptivo, los horarios reales van en groups)
    schedule_description VARCHAR(255), -- "L-V 18:00-20:00"
    
    -- Media
    featured_image_url TEXT,
    gallery_images TEXT[],
    video_url TEXT,
    
    -- Estado y visibilidad
    is_active BOOLEAN DEFAULT true,
    show_on_web BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    allow_online_enrollment BOOLEAN DEFAULT true,
    
    -- Orden
    display_order INTEGER DEFAULT 0,
    
    -- SEO
    slug VARCHAR(100) UNIQUE,
    meta_title VARCHAR(155),
    meta_description VARCHAR(255),
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_programs_slug ON public.programs(slug);
CREATE INDEX idx_programs_model ON public.programs(business_model_id);
CREATE INDEX idx_programs_active_web ON public.programs(is_active, show_on_web);

-- =====================================================
-- TABLA: program_instructors (Relación M:M)
-- =====================================================

CREATE TABLE public.program_instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    is_lead BOOLEAN DEFAULT false, -- Instructor principal
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(program_id, instructor_id)
);

-- =====================================================
-- TABLA: pricing_tiers (Niveles de Precios/Tarifas)
-- =====================================================

CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    
    -- Información de la tarifa
    name VARCHAR(100) NOT NULL, -- "Sesión Única", "Bono 5 Sesiones"
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2), -- Para mostrar descuentos
    
    -- Configuración
    sessions_included INTEGER, -- Número de sesiones incluidas
    validity_days INTEGER, -- Días de validez desde la compra
    max_students INTEGER, -- Si aplica límite específico
    
    -- Condiciones
    conditions TEXT[],
    
    -- Orden y estado
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false, -- Para destacar como "Más Popular"
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: page_content (Contenido de Páginas Estáticas)
-- =====================================================

CREATE TABLE public.page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    page_key VARCHAR(50) UNIQUE NOT NULL, -- 'about', 'mission', 'values', etc.
    page_title VARCHAR(200) NOT NULL,
    
    -- Contenido
    content_html TEXT, -- Contenido rico HTML
    content_json JSONB, -- Contenido estructurado si se prefiere
    
    -- Secciones específicas para páginas como "Quién Somos"
    sections JSONB, -- Array de secciones con título y contenido
    
    -- Media
    hero_image_url TEXT,
    gallery_images TEXT[],
    video_url TEXT,
    
    -- Estado
    status publication_status DEFAULT 'draft',
    
    -- SEO
    slug VARCHAR(100) UNIQUE,
    meta_title VARCHAR(155),
    meta_description VARCHAR(255),
    og_image_url TEXT,
    
    -- Versionado
    version INTEGER DEFAULT 1,
    published_version INTEGER,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    published_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_page_content_key ON public.page_content(page_key);
CREATE INDEX idx_page_content_status ON public.page_content(status);

-- =====================================================
-- TABLA: faqs (Preguntas Frecuentes)
-- =====================================================

CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contenido
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    
    -- Categorización
    category VARCHAR(100), -- 'general', 'enrollment', 'schedule', 'payment'
    tags TEXT[],
    
    -- Relaciones opcionales
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    business_model_id UUID REFERENCES public.business_models(id) ON DELETE SET NULL,
    
    -- Orden y visibilidad
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Métricas
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_active ON public.faqs(is_active);

-- =====================================================
-- TABLA: leads (Leads/Contactos)
-- =====================================================

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información de contacto
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Tipo y origen
    lead_type lead_type NOT NULL,
    lead_status lead_status DEFAULT 'new',
    source VARCHAR(100), -- 'web', 'facebook', 'google', etc.
    campaign VARCHAR(100), -- Campaña específica si aplica
    
    -- Detalles del lead
    message TEXT,
    interested_in_programs TEXT[], -- Array de programas de interés
    preferred_schedule VARCHAR(255),
    
    -- Para pre-inscripciones
    student_name VARCHAR(200), -- Si es para un hijo/a
    student_age INTEGER,
    previous_experience TEXT,
    
    -- Para reservas élite
    preferred_date DATE,
    preferred_time TIME,
    session_type VARCHAR(50), -- 'individual', 'couple'
    
    -- Consentimientos
    accepts_marketing BOOLEAN DEFAULT false,
    accepts_terms BOOLEAN DEFAULT true,
    
    -- Seguimiento
    contacted_at TIMESTAMPTZ,
    contacted_by UUID REFERENCES auth.users(id),
    conversion_date TIMESTAMPTZ,
    notes TEXT,
    
    -- UTM Parameters para tracking
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    
    -- IP y User Agent para analytics
    ip_address INET,
    user_agent TEXT,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_leads_status ON public.leads(lead_status);
CREATE INDEX idx_leads_type ON public.leads(lead_type);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);

-- =====================================================
-- TABLA: legal_pages (Páginas Legales)
-- =====================================================

CREATE TABLE public.legal_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    page_type VARCHAR(50) UNIQUE NOT NULL, -- 'terms', 'privacy', 'cookies', 'legal'
    title VARCHAR(200) NOT NULL,
    
    -- Contenido
    content TEXT NOT NULL,
    
    -- Versionado
    version VARCHAR(20) NOT NULL, -- "1.0", "2.1", etc.
    effective_date DATE NOT NULL,
    
    -- Estado
    is_current BOOLEAN DEFAULT false, -- Solo una versión activa por tipo
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_legal_pages_type_current ON public.legal_pages(page_type, is_current);

-- =====================================================
-- TABLA: media_library (Biblioteca de Medios)
-- =====================================================

CREATE TABLE public.media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información del archivo
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    
    -- URLs
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Metadatos
    alt_text TEXT,
    caption TEXT,
    tags TEXT[],
    
    -- Categorización
    folder VARCHAR(100), -- 'instructors', 'programs', 'gallery', etc.
    
    -- Dimensiones (para imágenes)
    width INTEGER,
    height INTEGER,
    
    -- Auditoría
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_media_folder ON public.media_library(folder);
CREATE INDEX idx_media_tags ON public.media_library USING gin(tags);

-- =====================================================
-- TABLA: settings (Configuración del Sistema)
-- =====================================================

CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Clave-valor para configuraciones
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50), -- 'site', 'email', 'social', 'analytics'
    description TEXT,
    
    -- Auditoría
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Configuraciones iniciales
INSERT INTO public.settings (setting_key, setting_value, setting_type) VALUES
('site_info', '{"name": "Kinesis", "tagline": "Centro de Danza Zaragoza", "email": "info@kinesis.es", "phone": "+34 976 000 000", "address": "C/ Ejemplo 123, Zaragoza"}', 'site'),
('social_media', '{"instagram": "@kinesisdanza", "facebook": "kinesiszaragoza", "youtube": "KinesisDanza"}', 'social'),
('business_hours', '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-22:00", "saturday": "10:00-14:00", "sunday": "closed"}', 'site');

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.business_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para contenido web
CREATE POLICY "Public read access" ON public.business_models
    FOR SELECT USING (is_active = true AND show_on_web = true);

CREATE POLICY "Public read access" ON public.specialties
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access" ON public.instructors
    FOR SELECT USING (is_active = true AND show_on_web = true);

CREATE POLICY "Public read access" ON public.programs
    FOR SELECT USING (is_active = true AND show_on_web = true);

CREATE POLICY "Public read published content" ON public.page_content
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read active FAQs" ON public.faqs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read current legal pages" ON public.legal_pages
    FOR SELECT USING (is_current = true);

-- Políticas para leads (solo inserción pública)
CREATE POLICY "Public can insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Políticas de administración (requiere autenticación)
CREATE POLICY "Admins can manage all" ON public.business_models
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.specialties
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.instructors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.programs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.page_content
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.faqs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.legal_pages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON public.settings
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- FUNCTIONS Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_business_models_updated_at BEFORE UPDATE ON public.business_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON public.page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar slugs automáticamente
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                TRANSLATE(input_text, 'áéíóúñÁÉÍÓÚÑ', 'aeiounAEIOUN'),
                '[^a-zA-Z0-9\-]+', '-', 'g'
            ),
            '\-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTAS ÚTILES PARA EL FRONTEND
-- =====================================================

-- Vista de programas con toda su información relacionada
CREATE OR REPLACE VIEW public.programs_full AS
SELECT 
    p.*,
    bm.name as business_model_name,
    bm.internal_code as business_model_code,
    s.name as specialty_name,
    s.code as specialty_code,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', i.id,
                'name', i.first_name || ' ' || i.last_name,
                'role', i.role,
                'image', i.profile_image_url
            )
        ) FILTER (WHERE i.id IS NOT NULL), 
        '[]'::json
    ) as instructors,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', pt.id,
                'name', pt.name,
                'price', pt.price,
                'sessions', pt.sessions_included
            )
        ) FILTER (WHERE pt.id IS NOT NULL), 
        '[]'::json
    ) as pricing_tiers
FROM public.programs p
LEFT JOIN public.business_models bm ON p.business_model_id = bm.id
LEFT JOIN public.specialties s ON p.specialty_id = s.id
LEFT JOIN public.program_instructors pi ON p.id = pi.program_id
LEFT JOIN public.instructors i ON pi.instructor_id = i.id AND i.is_active = true
LEFT JOIN public.pricing_tiers pt ON p.id = pt.program_id AND pt.is_active = true
WHERE p.is_active = true AND p.show_on_web = true
GROUP BY p.id, bm.name, bm.internal_code, s.name, s.code;

-- Vista de instructores con sus especialidades
CREATE OR REPLACE VIEW public.instructors_full AS
SELECT 
    i.*,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', s.id,
                'name', s.name,
                'code', s.code,
                'is_primary', ins.is_primary
            )
        ) FILTER (WHERE s.id IS NOT NULL), 
        '[]'::json
    ) as specialties
FROM public.instructors i
LEFT JOIN public.instructor_specialties ins ON i.id = ins.instructor_id
LEFT JOIN public.specialties s ON ins.specialty_id = s.id
WHERE i.is_active = true AND i.show_on_web = true
GROUP BY i.id;

-- =====================================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- =====================================================

-- Para búsquedas de texto completo
CREATE INDEX idx_programs_search ON public.programs 
    USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description_short, '') || ' ' || COALESCE(description_full, '')));

CREATE INDEX idx_instructors_search ON public.instructors 
    USING gin(to_tsvector('spanish', first_name || ' ' || last_name || ' ' || COALESCE(bio_summary, '')));

-- Para filtros comunes
CREATE INDEX idx_programs_filters ON public.programs(business_model_id, specialty_id, is_active, show_on_web);
CREATE INDEX idx_leads_date_status ON public.leads(created_at DESC, lead_status);

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.business_models IS 'Los 4 modelos de negocio principales de Kinesis';
COMMENT ON TABLE public.instructors IS 'Perfiles de instructores para mostrar en la web';
COMMENT ON TABLE public.programs IS 'Catálogo de programas y servicios ofrecidos';
COMMENT ON TABLE public.leads IS 'Leads capturados desde formularios web';
COMMENT ON TABLE public.page_content IS 'Contenido editable de páginas estáticas del CMS';

COMMENT ON COLUMN public.leads.lead_type IS 'Tipo de formulario: contact=Contacto general, pre_enrollment=Pre-inscripción, elite_booking=Reserva élite';
COMMENT ON COLUMN public.programs.slug IS 'URL amigable para la página del programa';
COMMENT ON COLUMN public.instructors.show_on_web IS 'Si el instructor aparece en la página de equipo';
