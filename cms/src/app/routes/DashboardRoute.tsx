import { Card } from '../../ui/Card';

export function DashboardRoute() {
  return (
    <div className="max-w-4xl">
      <Card>
        <h1 className="text-3xl font-display font-bold text-admin-white mb-4">
          Bienvenido al CMS de Kinesis
        </h1>
        <p className="text-admin-muted mb-6">
          Desde aquí podrás gestionar todo el contenido de la plataforma Kinesis.
        </p>
        
        <div className="bg-admin-surfaceLight border border-admin-info rounded-lg p-4">
          <p className="text-sm text-admin-info">
            <strong className="font-semibold">Nota:</strong> Este es el panel de administración. 
            Utiliza el menú lateral para navegar entre las diferentes secciones.
          </p>
        </div>
      </Card>
    </div>
  );
}
