import { Link } from 'react-router-dom';
import { Button } from '../../ui';

interface HeroPrimaryProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
    variant?: 'primary' | 'outline';
  };
  secondaryCta?: {
    label: string;
    href: string;
    variant?: 'ghost' | 'outline';
  };
  image?: {
    src: string;
    alt: string;
  };
}

export function HeroPrimary({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
}: HeroPrimaryProps) {
  return (
    <section id="home-hero" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            {eyebrow && (
              <p className="text-brand-primary font-semibold text-sm uppercase tracking-wide mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {primaryCta && (
                <Link to={primaryCta.href}>
                  <Button
                    variant={primaryCta.variant || 'primary'}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {primaryCta.label}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link to={secondaryCta.href}>
                  <Button
                    variant={secondaryCta.variant || 'ghost'}
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30"
                  >
                    {secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="w-full">
            {image ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent rounded-3xl z-10"></div>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl border border-slate-700/50"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-2xl border border-slate-700/50">
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
