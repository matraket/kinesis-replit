import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../ui';

export type BusinessModelSummary = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  targetAudience?: string;
  format?: string;
};

interface BusinessModelsSectionProps {
  models: BusinessModelSummary[];
  layoutVariant?: 'grid' | 'tabs';
}

export function BusinessModelsSection({
  models,
  layoutVariant = 'grid',
}: BusinessModelsSectionProps) {
  if (layoutVariant === 'tabs') {
    return <BusinessModelsSectionTabs models={models} />;
  }

  return (
    <section id="modelos-de-negocio" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            4 formas de vivir Kinesis
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra el modelo que mejor se adapta a tu estilo de vida y objetivos de bienestar
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {models.map((model) => (
            <Card key={model.id} variant="bordered" className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold">{model.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {model.subtitle && (
                  <p className="text-sm font-medium text-brand-primary mb-2">
                    {model.subtitle}
                  </p>
                )}
                {model.shortDescription && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {model.shortDescription}
                  </p>
                )}
                {model.targetAudience && (
                  <p className="text-xs text-muted-foreground mb-4">
                    <span className="font-semibold">Para:</span> {model.targetAudience}
                  </p>
                )}
                <Link to={`/programas?businessModelSlug=${model.slug}`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver más →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessModelsSectionTabs({ models }: { models: BusinessModelSummary[] }) {
  return (
    <section id="modelos-de-negocio" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            4 formas de vivir Kinesis
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestros modelos de negocio diseñados para cada estilo de vida
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {models.map((model, index) => (
            <Card key={model.id} variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-semibold mb-2">{model.name}</CardTitle>
                    {model.subtitle && (
                      <p className="text-brand-primary font-medium mb-3">{model.subtitle}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 ml-4">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {model.shortDescription && (
                  <p className="text-muted-foreground mb-4">{model.shortDescription}</p>
                )}
                {(model.targetAudience || model.format) && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                    {model.targetAudience && (
                      <div>
                        <span className="font-semibold text-foreground">Para:</span>{' '}
                        <span className="text-muted-foreground">{model.targetAudience}</span>
                      </div>
                    )}
                    {model.format && (
                      <div>
                        <span className="font-semibold text-foreground">Formato:</span>{' '}
                        <span className="text-muted-foreground">{model.format}</span>
                      </div>
                    )}
                  </div>
                )}
                <Link to={`/programas?businessModelSlug=${model.slug}`}>
                  <Button variant="outline" size="md">
                    Explorar programas →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
