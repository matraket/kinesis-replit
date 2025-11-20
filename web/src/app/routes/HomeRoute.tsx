import { HeroPrimary } from '../../../../shared/components/sections';

export function HomeRoute() {
  return (
    <div>
      <HeroPrimary
        subtitle="Bienvenido a Kinesis"
        title="Transforma tu vida a través del movimiento consciente"
        description="Descubre el poder del yoga y el bienestar integral en nuestro centro dedicado a tu transformación personal."
        primaryCta={{
          text: 'Explorar Programas',
          href: '/programas',
        }}
        secondaryCta={{
          text: 'Conocer Más',
          href: '/quienes-somos',
        }}
      />
      
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted text-center">
          Esta página se completará en T11–T14 con contenido dinámico y más secciones.
        </p>
      </section>
    </div>
  );
}
