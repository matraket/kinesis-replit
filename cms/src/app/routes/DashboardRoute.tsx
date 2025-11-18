export function DashboardRoute() {
  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido al CMS de Kinesis
        </h1>
        <p className="text-gray-600 mb-6">
          Desde aquí podrás gestionar todo el contenido de la plataforma Kinesis.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Este es el panel de administración. 
            Utiliza el menú lateral para navegar entre las diferentes secciones.
          </p>
        </div>
      </div>
    </div>
  );
}
