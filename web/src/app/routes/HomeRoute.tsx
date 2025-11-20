import {
  HeroPrimary,
  BusinessModelsSection,
  FeatureGridSection,
  FaqSection,
  type BusinessModelSummary,
} from '../../../../shared/components/sections';

const STATIC_BUSINESS_MODELS: BusinessModelSummary[] = [
  {
    id: '1',
    slug: 'elite-on-demand',
    name: 'Élite On Demand',
    subtitle: 'Flexibilidad Premium',
    shortDescription: 'Sesiones personalizadas cuando tú lo decidas. Máxima flexibilidad para profesionales exigentes.',
    targetAudience: 'Profesionales con agenda variable',
    format: 'Sesiones individuales bajo reserva',
  },
  {
    id: '2',
    slug: 'ritmo-constante',
    name: 'Ritmo Constante',
    subtitle: 'Membresía Mensual',
    shortDescription: 'Acceso ilimitado a clases grupales y servicios del centro. Tu práctica regular y sostenida.',
    targetAudience: 'Personas que buscan rutina estable',
    format: 'Membresía mensual con acceso ilimitado',
  },
  {
    id: '3',
    slug: 'generacion-dance',
    name: 'Generación Dance',
    subtitle: 'Formación Integral',
    shortDescription: 'Programas de formación intensiva en yoga y danza. Transforma tu pasión en profesión.',
    targetAudience: 'Aspirantes a instructores certificados',
    format: 'Programas trimestrales con certificación',
  },
  {
    id: '4',
    slug: 'si-quiero-bailar',
    name: 'Sí Quiero Bailar',
    subtitle: 'Eventos Especiales',
    shortDescription: 'Eventos únicos, talleres temáticos y experiencias de bienestar grupal.',
    targetAudience: 'Grupos y eventos corporativos',
    format: 'Eventos bajo demanda',
  },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Instructores Certificados',
    description: 'Nuestro equipo cuenta con certificaciones internacionales y años de experiencia en yoga y bienestar.',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Horarios Flexibles',
    description: 'Clases desde las 6:00 AM hasta las 9:00 PM para adaptarnos a tu ritmo de vida.',
  },
  {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Comunidad Activa',
    description: 'Únete a una comunidad de personas comprometidas con su bienestar y crecimiento personal.',
  },
];

const FAQS = [
  {
    question: '¿Necesito experiencia previa para comenzar?',
    answer: 'No es necesario tener experiencia previa. Ofrecemos clases para todos los niveles, desde principiantes hasta avanzados. Nuestros instructores te guiarán paso a paso.',
  },
  {
    question: '¿Qué modelo de negocio es mejor para mí?',
    answer: 'Depende de tus necesidades. Si buscas flexibilidad total, elige Élite On Demand. Para una práctica regular, Ritmo Constante es ideal. Si quieres formarte profesionalmente, Generación Dance es tu opción.',
  },
  {
    question: '¿Puedo probar una clase antes de comprometerme?',
    answer: 'Sí, ofrecemos clases de prueba gratuitas para que conozcas nuestras instalaciones, instructores y metodología antes de tomar una decisión.',
  },
];

export function HomeRoute() {
  return (
    <>
      <HeroPrimary
        eyebrow="Bienvenido a Kinesis"
        title="Transforma tu vida a través del movimiento consciente"
        subtitle="Descubre el poder del yoga y el bienestar integral en nuestro centro dedicado a tu transformación personal."
        primaryCta={{
          label: 'Reserva Élite',
          href: '/horarios-tarifas#elite',
        }}
        secondaryCta={{
          label: 'Preinscríbete',
          href: '/programas#preinscripcion',
        }}
      />

      <BusinessModelsSection models={STATIC_BUSINESS_MODELS} />

      <FeatureGridSection
        subtitle="Por qué Kinesis"
        title="Tu centro de bienestar integral"
        features={FEATURES}
      />

      <FaqSection
        title="Preguntas Frecuentes"
        subtitle="Resuelve tus dudas"
        faqs={FAQS}
      />
    </>
  );
}
