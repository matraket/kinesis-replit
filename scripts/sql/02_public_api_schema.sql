-- =====================================================
-- KINESIS - PUBLIC API SCHEMA (T2)
-- =====================================================
-- Este script añade las tablas necesarias para la API pública
-- que no estaban en 01_init_core_schema.sql
--
-- Tablas añadidas:
-- - business_models
-- - specialties
-- - instructors
-- - instructor_specialties (M:M)
-- - pricing_tiers
-- - faqs
-- - legal_pages
-- =====================================================

-- =====================================================
-- TABLA: business_models (Modelos de Negocio)
-- =====================================================

CREATE TABLE IF NOT EXISTS business_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    schedule_info VARCHAR(255),
    target_audience VARCHAR(255),
    format VARCHAR(100),
    
    -- Contenido enriquecido para la web
    feature_title VARCHAR(255),
    feature_content TEXT,
    advantage_title VARCHAR(255),
    advantage_content TEXT,
    benefit_title VARCHAR(255),
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
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para business_models
CREATE INDEX IF NOT EXISTS idx_business_models_slug ON business_models(slug);
CREATE INDEX IF NOT EXISTS idx_business_models_active ON business_models(is_active);
CREATE INDEX IF NOT EXISTS idx_business_models_web ON business_models(show_on_web);

-- Trigger updated_at para business_models
CREATE TRIGGER update_business_models_updated_at 
    BEFORE UPDATE ON business_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: specialties (Especialidades de Danza)
-- =====================================================

CREATE TABLE IF NOT EXISTS specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    
    -- Visual
    icon VARCHAR(100),
    color VARCHAR(7),
    image_url TEXT,
    
    -- Configuración
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para specialties
CREATE INDEX IF NOT EXISTS idx_specialties_code ON specialties(code);
CREATE INDEX IF NOT EXISTS idx_specialties_active ON specialties(is_active);

-- Trigger updated_at para specialties
CREATE TRIGGER update_specialties_updated_at 
    BEFORE UPDATE ON specialties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: instructors (Instructores)
-- =====================================================

CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    
    -- Perfil profesional
    role VARCHAR(100),
    tagline VARCHAR(255),
    bio_summary TEXT,
    bio_full TEXT,
    achievements TEXT[],
    education TEXT[],
    
    -- Media
    profile_image_url TEXT,
    hero_image_url TEXT,
    video_url TEXT,
    
    -- Configuración de visibilidad
    show_on_web BOOLEAN DEFAULT true,
    show_in_team_page BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Orden y categorización
    display_order INTEGER DEFAULT 0,
    seniority_level INTEGER DEFAULT 0,
    
    -- Metadatos SEO
    slug VARCHAR(100) UNIQUE,
    meta_title VARCHAR(155),
    meta_description VARCHAR(255),
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para instructors
CREATE INDEX IF NOT EXISTS idx_instructors_slug ON instructors(slug);
CREATE INDEX IF NOT EXISTS idx_instructors_active_web ON instructors(is_active, show_on_web);
CREATE INDEX IF NOT EXISTS idx_instructors_featured ON instructors(is_featured);

-- Trigger updated_at para instructors
CREATE TRIGGER update_instructors_updated_at 
    BEFORE UPDATE ON instructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: instructor_specialties (Relación M:M)
-- =====================================================

CREATE TABLE IF NOT EXISTS instructor_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    years_experience INTEGER,
    certification_info TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(instructor_id, specialty_id)
);

-- Índices para instructor_specialties
CREATE INDEX IF NOT EXISTS idx_instructor_specialties_instructor ON instructor_specialties(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_specialties_specialty ON instructor_specialties(specialty_id);

-- =====================================================
-- TABLA: pricing_tiers (Niveles de Precios/Tarifas)
-- =====================================================

CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Información de la tarifa
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    
    -- Configuración
    sessions_included INTEGER,
    validity_days INTEGER,
    max_students INTEGER,
    
    -- Condiciones
    conditions TEXT[],
    
    -- Orden y estado
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para pricing_tiers
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_program ON pricing_tiers(program_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_active ON pricing_tiers(is_active);

-- Trigger updated_at para pricing_tiers
CREATE TRIGGER update_pricing_tiers_updated_at 
    BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: faqs (Preguntas Frecuentes)
-- =====================================================

CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contenido
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    
    -- Categorización
    category VARCHAR(100),
    tags TEXT[],
    
    -- Relaciones opcionales
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    business_model_id UUID REFERENCES business_models(id) ON DELETE SET NULL,
    
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

-- Índices para faqs
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_business_model ON faqs(business_model_id);

-- Trigger updated_at para faqs
CREATE TRIGGER update_faqs_updated_at 
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA: legal_pages (Páginas Legales)
-- =====================================================

CREATE TABLE IF NOT EXISTS legal_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación
    page_type VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    
    -- Contenido
    content TEXT NOT NULL,
    
    -- Versionado
    version VARCHAR(20) NOT NULL,
    effective_date DATE NOT NULL,
    
    -- Estado
    is_current BOOLEAN DEFAULT false,
    
    -- SEO
    slug VARCHAR(100) UNIQUE,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- Índices para legal_pages
CREATE INDEX IF NOT EXISTS idx_legal_pages_type_current ON legal_pages(page_type, is_current);
CREATE INDEX IF NOT EXISTS idx_legal_pages_slug ON legal_pages(slug);

-- =====================================================
-- AÑADIR FK A PROGRAMS PARA RELACIONES
-- =====================================================
-- Ahora que business_models y specialties existen, podemos añadir las FK

DO $$ 
BEGIN
    -- Solo añadir si no existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_programs_business_model'
    ) THEN
        ALTER TABLE programs 
        ADD CONSTRAINT fk_programs_business_model 
        FOREIGN KEY (business_model_id) REFERENCES business_models(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_programs_specialty'
    ) THEN
        ALTER TABLE programs 
        ADD CONSTRAINT fk_programs_specialty 
        FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE SET NULL;
    END IF;
END $$;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================
-- 
-- Este script completa el esquema para la API pública.
-- Todas las tablas necesarias están ahora disponibles.
-- 
-- Próximos pasos:
-- - Implementar entidades de dominio
-- - Crear repositorios
-- - Desarrollar casos de uso
-- - Exponer endpoints públicos
-- =====================================================
