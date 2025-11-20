import { ReactNode } from 'react';
import { Card, CardContent } from '../../ui';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureGridSectionProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

export function FeatureGridSection({ title, subtitle, features }: FeatureGridSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-brand-primary font-semibold mb-2">{subtitle}</p>
            )}
            {title && <h2 className="text-balance">{title}</h2>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="mb-4 text-brand-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
