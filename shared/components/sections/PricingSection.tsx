import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../ui';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
  ctaHref: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

export function PricingSection({ title, subtitle, plans }: PricingSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-brand-primary font-semibold mb-2">{subtitle}</p>
            )}
            {title && <h2 className="text-balance">{title}</h2>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              variant={plan.recommended ? 'elevated' : 'bordered'}
              className={plan.recommended ? 'border-2 border-brand-primary' : ''}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.recommended && (
                    <Badge variant="primary">Recomendado</Badge>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
                <p className="text-muted text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.recommended ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => window.location.href = plan.ctaHref}
                >
                  {plan.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
