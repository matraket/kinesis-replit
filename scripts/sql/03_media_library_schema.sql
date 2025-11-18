-- =====================================================
-- MIGRATION 03: Media Library Schema
-- =====================================================
-- Creates media_library table for managing uploaded images
-- and media files with Replit App Storage integration
-- =====================================================

-- Media Library table
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- File information
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    
    -- Storage URLs (from Replit App Storage)
    url TEXT NOT NULL,           -- Public URL from App Storage
    thumbnail_url TEXT,          -- Optional thumbnail URL
    
    -- Metadata
    alt_text TEXT,
    caption TEXT,
    tags TEXT[],
    folder TEXT,                 -- Organization: 'programs', 'instructors', 'gallery', etc.
    
    -- Auditoría
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_tags ON public.media_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON public.media_library(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_filename ON public.media_library(filename);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_media_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_media_library_updated_at
    BEFORE UPDATE ON public.media_library
    FOR EACH ROW
    EXECUTE FUNCTION update_media_library_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE public.media_library IS 'Almacena metadatos de archivos multimedia subidos a Replit App Storage';
COMMENT ON COLUMN public.media_library.url IS 'URL pública del archivo en Replit App Storage';
COMMENT ON COLUMN public.media_library.folder IS 'Carpeta organizativa: programs, instructors, gallery, etc.';
COMMENT ON COLUMN public.media_library.tags IS 'Etiquetas para búsqueda y categorización';
