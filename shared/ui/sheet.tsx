import { ReactNode, useEffect } from 'react';
import { clsx } from 'clsx';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className={clsx(
        'fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-xl',
        'transform transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        {children}
      </div>
    </>
  );
}

interface SheetContentProps {
  children: ReactNode;
  className?: string;
}

export function SheetContent({ children, className = '' }: SheetContentProps) {
  return (
    <div className={clsx('h-full overflow-y-auto p-6', className)}>
      {children}
    </div>
  );
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
}

export function SheetHeader({ children, className = '' }: SheetHeaderProps) {
  return (
    <div className={clsx('mb-6', className)}>
      {children}
    </div>
  );
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

export function SheetTitle({ children, className = '' }: SheetTitleProps) {
  return (
    <h2 className={clsx('text-xl font-semibold', className)}>
      {children}
    </h2>
  );
}
