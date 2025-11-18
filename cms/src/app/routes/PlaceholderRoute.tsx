interface PlaceholderRouteProps {
  title: string;
  description?: string;
}

export function PlaceholderRoute({ title, description }: PlaceholderRouteProps) {
  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <p className="text-yellow-800 font-medium mb-2">
            🚧 Sección en construcción
          </p>
          <p className="text-yellow-700 text-sm">
            {description || `La gestión de ${title.toLowerCase()} se implementará en próximas iteraciones (T7-T9).`}
          </p>
        </div>
      </div>
    </div>
  );
}
