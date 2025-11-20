export function LegalNoticeRoute() {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="mb-6">Aviso Legal</h1>
      <div className="max-w-3xl">
        <p className="text-muted mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
        
        <div className="prose prose-lg">
          <h2>Información General</h2>
          <p className="text-muted">
            Esta página se completará en T11–T14 con el aviso legal completo,
            incluyendo información sobre el titular, datos de contacto, y condiciones
            de uso del sitio web.
          </p>
        </div>
      </div>
    </section>
  );
}
