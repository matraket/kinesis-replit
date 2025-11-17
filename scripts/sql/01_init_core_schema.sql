-- =====================================================
-- KINESIS - ESQUEMA DE BASE DE DATOS INICIAL (T1)
-- =====================================================
-- Este script define las tablas mínimas necesarias para
-- el funcionamiento básico de la aplicación Kinesis.
--
-- IMPORTANTE: NO AUTOMÁTICO
-- Este archivo NO debe ejecutarse automáticamente.
-- Es una base para migraciones futuras (tarea T8).
-- 
-- Para crear la base de datos manualmente en Replit:
-- 1. Usar el panel Database de Replit
-- 2. O ejecutar este script manualmente con psql/pgAdmin
--
-- Basado en: context/kinesis-database-schema.sql
-- Simplificaciones respecto al schema de referencia:
-- - No incluye todas las tablas (solo las core para T1)
-- - No incluye triggers avanzados ni funciones complejas
-- - No incluye RLS (Row Level Security) policies
-- - No incluye todas las relaciones M:M
-- - Enums simplificados solo con valores básicos
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

-- Tipos de formularios de contacto/leads
CREATE TYPE lead_type AS ENUM ('contact', 'pre_enrollment', 'elite_booking', 'newsletter');

-- Estado de los leads
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

-- Niveles de dificultad de programas
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'professional');

-- Días de la semana para horarios
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- =====================================================
-- TABLA: programs (Programas/Servicios)
-- =====================================================
-- Simplificación: No incluye todas las relaciones FK a business_models ni specialties
-- en esta versión inicial. Se pueden añadir más adelante en migraciones.

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    description_short TEXT,
    description_full TEXT,
    
    -- Relaciones (simplificado - sin FK constraints por ahora)
    business_model_id UUID,
    specialty_id UUID,
    
    -- Configuración del programa
    duration_minutes INTEGER,
    sessions_per_week INTEGER,
    min_students INTEGER DEFAULT 1,
    max_students INTEGER DEFAULT 20,
    min_age INTEGER,
    max_age INTEGER,
    difficulty_level difficulty_level,
    
    -- Pricing
    price_per_session DECIMAL(10, 2),
    price_monthly DECIMAL(10, 2),
    price_quarterly DECIMAL(10, 2),
    
    -- Horarios (texto descriptivo)
    schedule_description VARCHAR(255),
    
    -- Media
    featured_image_url TEXT,
    
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
    published_at TIMESTAMPTZ
);

-- Índices para programs
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_active_web ON programs(is_active, show_on_web);
CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code);

-- =====================================================
-- TABLA: schedules (Horarios/Clases)
-- =====================================================
-- Simplificación: Estructura básica de horarios sin todas las 
-- validaciones y relaciones complejas del schema original

CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relación con programa
    program_id UUID NOT NULL,
    
    -- Horario
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Instructor y ubicación (sin FK por ahora)
    instructor_id UUID,
    location VARCHAR(200),
    
    -- Capacidad
    max_capacity INTEGER,
    current_enrollment INTEGER DEFAULT 0,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    
    -- Validez temporal
    valid_from DATE,
    valid_until DATE,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para schedules
CREATE INDEX IF NOT EXISTS idx_schedules_program ON schedules(program_id);
CREATE INDEX IF NOT EXISTS idx_schedules_active ON schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day_of_week);

-- =====================================================
-- TABLA: page_content (Contenido de Páginas Estáticas)
-- =====================================================

CREATE TABLE IF NOT EXISTS page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    page_key VARCHAR(50) UNIQUE NOT NULL,
    page_title VARCHAR(200) NOT NULL,
    
    -- Contenido
    content_html TEXT,
    content_json JSONB,
    
    -- Secciones específicas (JSONB para flexibilidad)
    sections JSONB,
    
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
    published_at TIMESTAMPTZ
);

-- Índices para page_content
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(page_key);
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(slug);
CREATE INDEX IF NOT EXISTS idx_page_content_status ON page_content(status);

-- =====================================================
-- TABLA: leads (Leads/Contactos)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información de contacto
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Tipo y origen
    lead_type lead_type NOT NULL,
    lead_status lead_status DEFAULT 'new',
    source VARCHAR(100),
    campaign VARCHAR(100),
    
    -- Detalles del lead
    message TEXT,
    interested_in_programs TEXT[],
    preferred_schedule VARCHAR(255),
    
    -- Para pre-inscripciones
    student_name VARCHAR(200),
    student_age INTEGER,
    previous_experience TEXT,
    
    -- Para reservas élite
    preferred_date DATE,
    preferred_time TIME,
    session_type VARCHAR(50),
    
    -- Consentimientos
    accepts_marketing BOOLEAN DEFAULT false,
    accepts_terms BOOLEAN DEFAULT true,
    
    -- Seguimiento (sin FK a users por ahora)
    contacted_at TIMESTAMPTZ,
    contacted_by UUID,
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

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- =====================================================
-- TRIGGERS BÁSICOS
-- =====================================================
-- Simplificación: Solo el trigger de updated_at, sin triggers complejos

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER update_programs_updated_at 
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at 
    BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================
-- 
-- TABLAS NO INCLUIDAS EN ESTA VERSIÓN (se añadirán en futuras migraciones):
-- - business_models
-- - specialties  
-- - instructors
-- - program_instructors (M:M)
-- - instructor_specialties (M:M)
-- - pricing_tiers
-- - faqs
-- - legal_pages
-- - media_library
-- - settings
--
-- CARACTERÍSTICAS NO INCLUIDAS:
-- - Row Level Security (RLS) policies
-- - Funciones complejas (generate_slug, etc.)
-- - Constraints de FK entre tablas
-- - Validaciones avanzadas
-- - Vistas materializadas
-- 
-- Estas características se añadirán progresivamente en las
-- siguientes tareas de migración (T8 y posteriores).
-- =====================================================
