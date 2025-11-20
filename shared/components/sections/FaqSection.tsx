import { Accordion, AccordionItem } from '../../ui';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
}

export function FaqSection({ title, subtitle, faqs }: FaqSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-brand-primary font-semibold mb-2">{subtitle}</p>
            )}
            {title && <h2 className="text-balance">{title}</h2>}
          </div>
        )}

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.question}
              defaultOpen={index === 0}
            >
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
