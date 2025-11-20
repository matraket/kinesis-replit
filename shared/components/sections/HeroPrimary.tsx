import { ReactNode } from 'react';
import { Button } from '../../ui';

interface HeroPrimaryProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  imagePlaceholder?: ReactNode;
}

export function HeroPrimary({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  imagePlaceholder,
}: HeroPrimaryProps) {
  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {subtitle && (
              <p className="text-brand-primary font-semibold mb-4">{subtitle}</p>
            )}
            <h1 className="text-balance mb-6">{title}</h1>
            {description && (
              <p className="text-lg text-muted mb-8">{description}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCta && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = primaryCta.href}
                >
                  {primaryCta.text}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = secondaryCta.href}
                >
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block">
            {imagePlaceholder || (
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <div className="text-center text-purple-600">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Imagen del hero</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
