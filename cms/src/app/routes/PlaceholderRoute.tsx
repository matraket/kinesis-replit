import { Card } from '../../ui/Card';

interface PlaceholderRouteProps {
  title: string;
  description?: string;
}

export function PlaceholderRoute({ title, description }: PlaceholderRouteProps) {
  return (
    <div className="max-w-4xl">
      <Card>
        <h2 className="text-2xl font-display font-bold text-admin-white mb-4">{title}</h2>
        
        <div className="bg-admin-warning/10 border border-admin-warning rounded-lg p-6">
          <p className="text-admin-warning font-medium mb-2">
            🚧 Sección en construcción
          </p>
          <p className="text-admin-muted text-sm">
            {description || `La gestión de ${title.toLowerCase()} se implementará en próximas iteraciones (T7-T9).`}
          </p>
        </div>
      </Card>
    </div>
  );
}
