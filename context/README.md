# Carpeta `context/`

Esta carpeta contiene el **contexto funcional y técnico de negocio** de Kinesis para la Web corporativa y el CMS.  
Es la referencia principal para entender qué debe hacer el sistema, cómo debe verse y con qué modelo de datos se implementa.

## Documentos principales

- `kinesis-alcance-web-cms.md`  
  Análisis completo del alcance funcional de la Web y del CMS: secciones públicas (Inicio, Quiénes somos, Modelos de negocio, Programas y servicios, Equipo, Horarios y tarifas, Contacto) y áreas de gestión del CMS (Panel, Contenido web, Formularios y leads, Estructura y navegación, Textos legales, Ajustes del sitio).

- `kinesis-secciones.md`  
  Especificación detallada de las secciones de la Web y del CMS: estructura de navegación, contenido de cada página, menús y funcionalidades de gestión.

- `kinesis-guia-de-implementacion.md`  
  Sistema de diseño y guía de implementación: paleta de colores (Web y CMS), tipografía (Montserrat + Inter), espaciado, componentes reutilizables, flujos de interacción principales, animaciones/microinteracciones y plan de fases de desarrollo.

- `kinesis-database-schema.sql`  
  Esquema completo de base de datos PostgreSQL para Kinesis Web + CMS: tablas, relaciones, políticas RLS, triggers, funciones y vistas optimizadas.

## Subcarpeta `context/doc/`

La carpeta `doc/` contiene el **contenido de negocio detallado** para cada sección de la web (visión, modelos de negocio, programas, equipo, tarifas, FAQs, textos legales, etc.).

## Uso

- Antes de implementar o modificar lógica de negocio, consulta primero estos documentos.
- No modifiques ni elimines archivos de `context/` salvo que se indique explícitamente (especialmente importante para el trabajo con Replit Agent).
