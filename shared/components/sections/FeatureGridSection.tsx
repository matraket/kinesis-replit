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
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-brand-primary font-semibold mb-2 text-sm uppercase tracking-wide">{subtitle}</p>
            )}
            {title && <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="elevated" className="hover:shadow-xl transition-all duration-300 border-none">
              <CardContent className="text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
