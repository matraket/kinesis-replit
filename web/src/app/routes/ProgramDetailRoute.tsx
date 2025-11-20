import { useParams } from 'react-router-dom';

export function ProgramDetailRoute() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="mb-6">Detalle del Programa</h1>
      <div className="max-w-3xl">
        <p className="text-lg text-muted mb-4">
          Programa: <strong>{slug}</strong>
        </p>
        <p className="text-muted">
          Esta página se completará en T11–T14 con información detallada del programa,
          incluyendo descripción, objetivos, duración, instructores y más.
        </p>
      </div>
    </section>
  );
}
