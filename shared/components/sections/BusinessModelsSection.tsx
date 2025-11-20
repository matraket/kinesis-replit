import { Link } from 'react-router-dom';
import { Card, CardTitle, CardContent, Button } from '../../ui';

export type BusinessModelSummary = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  shortDescription?: string;
  targetAudience?: string;
  format?: string;
  imageSrc?: string;
  imageAlt?: string;
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

        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {models.map((model) => (
            <Card key={model.id} variant="bordered" className="hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                {model.imageSrc && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
                    <img
                      src={model.imageSrc}
                      alt={model.imageAlt ?? model.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <CardTitle className="text-xl font-semibold mb-2">{model.name}</CardTitle>
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
                      Descubrir más →
                    </Button>
                  </Link>
                </div>
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
          {models.map((model) => (
            <Card key={model.id} variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {model.imageSrc && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={model.imageSrc}
                      alt={model.imageAlt ?? model.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <CardTitle className="text-2xl font-semibold mb-2">{model.name}</CardTitle>
                  {model.subtitle && (
                    <p className="text-brand-primary font-medium mb-3">{model.subtitle}</p>
                  )}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
