-- ===============================
-- KINESIS - Datos de ejemplo T2
-- ===============================
-- Ejecuta este script DESPUÉS de aplicar:
--   01_init_core_schema.sql
--   02_public_api_schema.sql
-- en la misma base de datos.

-- 1) Modelos de negocio (business_models)
INSERT INTO public.business_models (
    internal_code, name, subtitle, description,
    schedule_info, target_audience, format,
    feature_title, feature_content,
    advantage_title, advantage_content,
    benefit_title, benefit_content,
    display_order, is_active, show_on_web,
    meta_title, meta_description, slug
) VALUES
  ('elite_on_demand',
   'Élite On Demand',
   'Entrenamiento de alto rendimiento para bailarines exigentes',
   'Programa flexible pensado para profesionales y semiprofesionales que necesitan sesiones de alta precisión técnica, coaching escénico y preparación específica para audiciones.',
   'Sesiones a medida según agenda del alumno',
   'Bailarines profesionales, semiprofesionales y alumnos avanzados',
   'Sesiones individuales o grupos muy reducidos',
   '¿Qué es Élite On Demand?',
   'Un sistema de entrenamiento intensivo que se adapta al calendario, objetivos y nivel técnico del bailarín.',
   '¿Por qué lo hacemos?',
   'Porque los bailarines de alto nivel necesitan un espacio donde trabajar detalles finos, prevenir lesiones y preparar momentos clave de su carrera.',
   '¿Qué ganas tú?',
   'Seguridad escénica, precisión técnica y un plan claro de mejora continua.',
   1, TRUE, TRUE,
   'Kinesis – Élite On Demand',
   'Entrenamiento de danza de alto rendimiento a medida para profesionales y avanzados en Kinesis.',
   'elite-on-demand'
  ),
  ('ritmo_constante',
   'Ritmo Constante',
   'Tu rutina de baile semanal para desconectar y ponerte en forma',
   'Programa estable de clases regulares para adultos que quieren mantener una práctica de baile constante, mejorar su forma física y disfrutar de un espacio social saludable.',
   'Bloques regulares de tarde entre semana',
   'Adultos que buscan una actividad estable, saludable y divertida',
   'Grupos regulares por niveles',
   '¿Qué es Ritmo Constante?',
   'Un calendario de clases semanales que combina técnica, trabajo físico y disfrute del baile.',
   '¿Por qué lo hacemos?',
   'Porque la constancia es la que realmente transforma el cuerpo, la técnica y la relación con el movimiento.',
   '¿Qué ganas tú?',
   'Más energía en tu día a día, mejora de condición física y una comunidad con la que compartir el baile.',
   2, TRUE, TRUE,
   'Kinesis – Ritmo Constante',
   'Clases regulares de baile para adultos en Zaragoza con enfoque en salud, técnica y comunidad.',
   'ritmo-constante'
  ),
  ('generacion_dance',
   'Generación Dance',
   'La cantera de Kinesis para peques y teens',
   'Programa pensado para niñas, niños y adolescentes que quieren crecer con el baile, combinando técnica, juego y valores como la disciplina y el trabajo en equipo.',
   'Tardes entre semana y sábados por la mañana',
   'Niñas, niños y adolescentes a partir de 6 años',
   'Grupos por edades y niveles',
   '¿Qué es Generación Dance?',
   'La puerta de entrada a la danza para las nuevas generaciones, cuidando tanto el proceso como la experiencia emocional.',
   '¿Por qué lo hacemos?',
   'Porque el baile es una herramienta poderosa para el desarrollo físico, social y emocional de los más jóvenes.',
   '¿Qué ganas tú?',
   'Un entorno seguro y motivador donde tus hijos crecen en coordinación, autoestima y creatividad.',
   3, TRUE, TRUE,
   'Kinesis – Generación Dance',
   'Programas de danza para niños y adolescentes en Zaragoza, con técnica, juego y valores.',
   'generacion-dance'
  ),
  ('si_quiero_bailar',
   'Sí, Quiero Bailar',
   'Coreografías nupciales y momentos únicos en pareja',
   'Servicio especializado en crear coreografías personalizadas para bodas y eventos especiales, adaptadas al estilo, canción e historia de cada pareja.',
   'Sesiones concertadas según disponibilidad de la pareja',
   'Parejas que preparan su baile nupcial u otro momento especial',
   'Sesiones privadas o semiprivadas',
   '¿Qué es Sí, Quiero Bailar?',
   'Un acompañamiento completo para que vuestro baile sea un recuerdo emocionante y fluido, sin estrés.',
   '¿Por qué lo hacemos?',
   'Porque los momentos importantes se recuerdan toda la vida y queremos que el baile sea un lugar de disfrute, no de nervios.',
   '¿Qué ganas tú?',
   'Una coreografía a vuestra medida y la tranquilidad de llegar al gran día con seguridad y complicidad.',
   4, TRUE, TRUE,
   'Kinesis – Sí, Quiero Bailar',
   'Coreografías nupciales personalizadas y preparación del baile de boda en Kinesis.',
   'si-quiero-bailar'
  );

-- 2) Especialidades (specialties)
INSERT INTO public.specialties (
    code, name, description, category,
    icon, color, image_url, is_active, display_order
) VALUES
  ('clasico',
   'Danza Clásica',
   'Trabajo técnico basado en la danza clásica y el repertorio académico.',
   'professional',
   'tiara',
   '#C5A3FF',
   NULL,
   TRUE, 1
  ),
  ('contemporaneo',
   'Contemporáneo',
   'Lenguajes contemporáneos centrados en el movimiento orgánico, el suelo y la investigación.',
   'professional',
   'wave',
   '#9AD0C2',
   NULL,
   TRUE, 2
  ),
  ('urbano',
   'Urban y Comercial',
   'Estilos urbanos y comerciales enfocados en la música actual, musicalidad y presencia escénica.',
   'amateur',
   'music',
   '#FFC857',
   NULL,
   TRUE, 3
  ),
  ('infantil',
   'Iniciación Infantil',
   'Primeros pasos en danza para peques, mezclando juego, coordinación y musicalidad.',
   'kids',
   'sparkles',
   '#FFB3C6',
   NULL,
   TRUE, 4
  );

-- 3) Programas (programs)
INSERT INTO public.programs (
    code, name, subtitle,
    description_short, description_full,
    business_model_id, specialty_id,
    duration_minutes, sessions_per_week,
    slug, meta_title, meta_description
) VALUES
  ('elite_technique',
   'Élite Técnica Pro',
   'Sesiones de técnica avanzada a medida',
   'Entrenamiento individual o en grupos muy reducidos para pulir técnica y preparar exámenes, audiciones o piezas concretas.',
   'Programa diseñado para bailarines avanzados que necesitan revisar con lupa piruetas, saltos, línea y presencia escénica, con un plan de trabajo personalizado.',
   (SELECT id FROM public.business_models WHERE internal_code = 'elite_on_demand'),
   (SELECT id FROM public.specialties WHERE code = 'clasico'),
   90, 1,
   'elite-tecnica-pro',
   'Élite Técnica Pro – Entrenamiento avanzado en Kinesis',
   'Sesiones avanzadas de técnica clásica y preparación escénica para bailarines exigentes.'
  ),
  ('elite_coaching_escenico',
   'Coaching Escénico',
   'Acompañamiento 1:1 para piezas y audiciones',
   'Trabajo específico sobre una coreografía, pieza libre o solo para escenarios, certámenes o pruebas.',
   'Sesiones enfocadas en interpretación, musicalidad, uso del espacio y gestión del miedo escénico, pensando en audiciones, muestras y competiciones.',
   (SELECT id FROM public.business_models WHERE internal_code = 'elite_on_demand'),
   (SELECT id FROM public.specialties WHERE code = 'contemporaneo'),
   75, 1,
   'coaching-escenico',
   'Coaching escénico para bailarines – Kinesis',
   'Sesiones de coaching escénico personalizadas para preparar audiciones y piezas clave.'
  ),
  ('ritmo_constante_multi',
   'Ritmo Constante Adultos',
   'Multiestilo para mantenerte en movimiento',
   'Clases regulares que combinan técnica, coordinación y trabajo físico en un entorno cercano.',
   'Un grupo pensado para adultos que quieren una rutina de baile estable y sostenible, sin necesidad de experiencia previa.',
   (SELECT id FROM public.business_models WHERE internal_code = 'ritmo_constante'),
   (SELECT id FROM public.specialties WHERE code = 'urbano'),
   60, 1,
   'ritmo-constante-adultos',
   'Ritmo Constante Adultos – Clases regulares de baile',
   'Programa de clases semanales de baile para adultos que buscan salud, diversión y comunidad.'
  ),
  ('generacion_dance_kids',
   'Generación Dance Kids',
   'Danza para peques con juego y técnica',
   'Clases para niñas y niños que quieren iniciarse en la danza y aprender a través del juego.',
   'Trabajamos coordinación, musicalidad y trabajo en grupo en un entorno seguro y motivador para la infancia.',
   (SELECT id FROM public.business_models WHERE internal_code = 'generacion_dance'),
   (SELECT id FROM public.specialties WHERE code = 'infantil'),
   60, 1,
   'generacion-dance-kids',
   'Generación Dance Kids – Danza para peques',
   'Programa de danza para niños y niñas que quieren disfrutar del movimiento y crecer con el baile.'
  ),
  ('wedding_coreography',
   'Coreografía Nupcial a Medida',
   'Diseñamos vuestro baile de boda paso a paso',
   'Servicio de baile nupcial personalizado para parejas que quieren un momento especial sin estrés.',
   'Definimos juntos canción, estilo y nivel técnico, y creamos una coreografía que tenga sentido para vuestra historia y vuestro cuerpo.',
   (SELECT id FROM public.business_models WHERE internal_code = 'si_quiero_bailar'),
   (SELECT id FROM public.specialties WHERE code = 'contemporaneo'),
   60, 1,
   'coreografia-nupcial-kinesis',
   'Baile de boda – Coreografía nupcial personalizada en Kinesis',
   'Sesiones privadas para preparar un baile de boda bonito, cómodo y fiel a vuestra personalidad.'
  );

-- 4) Instructores (instructors)
INSERT INTO public.instructors (
    first_name, last_name, display_name,
    email, phone,
    role, tagline,
    bio_summary, bio_full,
    achievements, education,
    is_active, show_on_web, show_in_team_page,
    slug
) VALUES
  ('Ana', 'López', 'Ana López',
   'ana.lopez@kinesis.dance', NULL,
   'Directora Artística',
   'La precisión técnica al servicio de la emoción.',
   'Directora de Kinesis y responsable del área de técnica clásica y repertorio.',
   'Ana combina más de diez años de experiencia en compañías y escuelas profesionales con una mirada muy afinada sobre la prevención de lesiones y la progresión a largo plazo.',
   ARRAY['Ex-bailarina en compañías nacionales','Certificada en pedagogía de la danza clásica'],
   ARRAY['Conservatorio Superior de Danza','Formación en anatomía aplicada al movimiento'],
   TRUE, TRUE, TRUE,
   'ana-lopez'
  ),
  ('Marcos', 'García', 'Marcos García',
   'marcos.garcia@kinesis.dance', NULL,
   'Responsable de Programas Urban y Comercial',
   'Energía, musicalidad y mucho groove.',
   'Especialista en estilos urbanos y comerciales, coordina el área adulta de Ritmo Constante.',
   'Marcos trabaja desde la musicalidad y la presencia escénica para que cualquier persona pueda disfrutar bailando música actual.',
   ARRAY['Coreógrafo para eventos y videoclips','Profesor en diferentes escuelas urbanas'],
   ARRAY['Formación continua en estilos urbanos','Workshops internacionales'],
   TRUE, TRUE, TRUE,
   'marcos-garcia'
  ),
  ('Laura', 'Sanz', 'Laura Sanz',
   'laura.sanz@kinesis.dance', NULL,
   'Responsable Área Infantil y Juvenil',
   'Juego, técnica y cuidado para las nuevas generaciones.',
   'Coordina los grupos de Generación Dance y el vínculo con las familias.',
   'Laura combina herramientas de pedagogía, psicomotricidad y danza para crear entornos de aprendizaje seguros y motivadores para peques y teens.',
   ARRAY['Experiencia en proyectos educativos y artísticos con infancia y juventud'],
   ARRAY['Grado en Educación','Formación en danza contemporánea e infantil'],
   TRUE, TRUE, TRUE,
   'laura-sanz'
  );

-- 5) Relación instructor_specialties
INSERT INTO public.instructor_specialties (
    instructor_id, specialty_id, is_primary, years_experience
) VALUES
  (
    (SELECT id FROM public.instructors WHERE slug = 'ana-lopez'),
    (SELECT id FROM public.specialties WHERE code = 'clasico'),
    TRUE, 10
  ),
  (
    (SELECT id FROM public.instructors WHERE slug = 'marcos-garcia'),
    (SELECT id FROM public.specialties WHERE code = 'urbano'),
    TRUE, 8
  ),
  (
    (SELECT id FROM public.instructors WHERE slug = 'laura-sanz'),
    (SELECT id FROM public.specialties WHERE code = 'infantil'),
    TRUE, 6
  );

-- 6) Pricing tiers (pricing_tiers)
INSERT INTO public.pricing_tiers (
    program_id,
    name, description,
    price, original_price,
    sessions_included, validity_days
) VALUES
  (
    (SELECT id FROM public.programs WHERE code = 'elite_technique'),
    'Sesión Élite Individual',
    'Sesión de 90 minutos 1:1 para trabajo técnico específico.',
    75.00, NULL,
    1, 30
  ),
  (
    (SELECT id FROM public.programs WHERE code = 'ritmo_constante_multi'),
    'Cuota Mensual Ritmo Constante',
    'Acceso a una clase semanal del programa Ritmo Constante Adultos.',
    60.00, NULL,
    4, 30
  ),
  (
    (SELECT id FROM public.programs WHERE code = 'generacion_dance_kids'),
    'Cuota Mensual Generación Dance Kids',
    'Cuota mensual para grupo infantil Generación Dance Kids.',
    50.00, NULL,
    4, 30
  ),
  (
    (SELECT id FROM public.programs WHERE code = 'wedding_coreography'),
    'Pack Baile Nupcial Básico',
    '4 sesiones privadas de 60 minutos para preparar el baile de boda.',
    220.00, 240.00,
    4, 90
  );

-- 7) Contenido de páginas estáticas (page_content)
INSERT INTO public.page_content (
    page_key, page_title,
    content_html, content_json, sections,
    hero_image_url
) VALUES
  (
    'about-us',
    'Quiénes somos',
    '<h1>Kinesis</h1><p>Kinesis es el centro de danza de referencia en Zaragoza, especializado en unir precisión técnica, innovación y acompañamiento cercano.</p>',
    NULL,
    NULL,
    NULL
  ),
  (
    'business-models',
    'Modelos de negocio Kinesis',
    '<h1>Modelos de negocio</h1><p>En Kinesis articulamos nuestra propuesta en cuatro pilares: Élite On Demand, Ritmo Constante, Generación Dance y Sí, Quiero Bailar.</p>',
    NULL,
    NULL,
    NULL
  );

-- 8) FAQs
INSERT INTO public.faqs (
    question, answer,
    category, tags,
    program_id, business_model_id,
    display_order, is_featured, is_active
) VALUES
  (
    'No tengo experiencia previa, ¿puedo apuntarme a Ritmo Constante?',
    'Sí. Ritmo Constante está pensado precisamente para adultos que quieren empezar o retomar el baile. Ajustamos el nivel del grupo para que todo el mundo se sienta cómodo.',
    'enrollment',
    ARRAY['ritmo_constante','adultos'],
    (SELECT id FROM public.programs WHERE code = 'ritmo_constante_multi'),
    (SELECT id FROM public.business_models WHERE internal_code = 'ritmo_constante'),
    1, TRUE, TRUE
  ),
  (
    '¿A partir de qué edad pueden entrar en Generación Dance?',
    'Generalmente a partir de 6 años, pero valoramos cada caso para ver cuál es el grupo más adecuado.',
    'general',
    ARRAY['generacion_dance','infantil'],
    (SELECT id FROM public.programs WHERE code = 'generacion_dance_kids'),
    (SELECT id FROM public.business_models WHERE internal_code = 'generacion_dance'),
    2, FALSE, TRUE
  ),
  (
    '¿Cuánto tiempo antes de la boda tenemos que empezar con la coreografía?',
    'Lo ideal es empezar al menos 2–3 meses antes para poder adaptar la coreografía y ensayar sin prisas.',
    'schedule',
    ARRAY['si_quiero_bailar','bodas'],
    (SELECT id FROM public.programs WHERE code = 'wedding_coreography'),
    (SELECT id FROM public.business_models WHERE internal_code = 'si_quiero_bailar'),
    3, FALSE, TRUE
  );

-- 9) Páginas legales (legal_pages)
INSERT INTO public.legal_pages (
    page_type, title,
    content, version, effective_date,
    is_current
) VALUES
  (
    'legal',
    'Aviso Legal',
    'Contenido provisional del Aviso Legal de Kinesis. Sustituir por el texto legal definitivo proporcionado por el asesor jurídico.',
    '1.0',
    CURRENT_DATE,
    TRUE
  ),
  (
    'privacy',
    'Política de Privacidad',
    'Contenido provisional de la Política de Privacidad de Kinesis. Sustituir por el texto validado a nivel legal y de protección de datos.',
    '1.0',
    CURRENT_DATE,
    TRUE
  ),
  (
    'cookies',
    'Política de Cookies',
    'Contenido provisional de la Política de Cookies de Kinesis. Sustituir por el texto que detalle el uso de cookies y tecnologías similares.',
    '1.0',
    CURRENT_DATE,
    TRUE
  );
