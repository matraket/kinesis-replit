export function PrivacyPolicyRoute() {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="mb-6">Política de Privacidad</h1>
      <div className="max-w-3xl">
        <p className="text-muted mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
        
        <div className="prose prose-lg">
          <h2>Protección de Datos</h2>
          <p className="text-muted">
            Esta página se completará en T11–T14 con la política de privacidad completa,
            incluyendo información sobre recopilación de datos, uso, almacenamiento,
            derechos del usuario según GDPR, y más.
          </p>
        </div>
      </div>
    </section>
  );
}
