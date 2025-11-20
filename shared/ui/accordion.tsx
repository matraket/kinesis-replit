import { ReactNode, useState, Children, cloneElement, isValidElement } from 'react';
import { clsx } from 'clsx';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({ title, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle }: AccordionItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="border border-border rounded-xl mb-3 overflow-hidden bg-white">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-lg">{title}</span>
        <svg
          className={clsx('w-5 h-5 transition-transform text-brand-primary', isOpen && 'transform rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}

export function Accordion({ children, className = '', type = 'multiple', collapsible = true }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (type === 'single') {
    return (
      <div className={className}>
        {Children.map(children, (child, index) => {
          if (isValidElement<AccordionItemProps>(child)) {
            return cloneElement(child, {
              isOpen: openIndex === index,
              onToggle: () => {
                if (collapsible && openIndex === index) {
                  setOpenIndex(null);
                } else {
                  setOpenIndex(index);
                }
              },
            });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}
