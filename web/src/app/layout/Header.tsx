import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, Button } from '../../../../shared/ui';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Quiénes Somos', href: '/quienes-somos' },
  { name: 'Modelos de Negocio', href: '/modelos-de-negocio' },
  { name: 'Programas', href: '/programas' },
  { name: 'Equipo', href: '/equipo' },
  { name: 'Horarios y Tarifas', href: '/horarios-tarifas' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/kinesis/logo-horizontal.png"
              alt="Kinesis Dance Studio"
              className="hidden sm:block h-8 w-auto"
            />
            <img
              src="/assets/kinesis/logo-cuadrado.png"
              alt="Kinesis Dance Studio"
              className="sm:hidden h-8 w-8"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-brand-primary'
                    : 'text-foreground hover:text-brand-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/horarios-tarifas'}
            >
              Preinscríbete
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-brand-primary'
                    : 'text-foreground hover:text-brand-primary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = '/horarios-tarifas';
              }}
            >
              Preinscríbete
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
