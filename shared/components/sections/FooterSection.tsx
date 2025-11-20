import { Link } from 'react-router-dom';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-foreground text-xl font-bold mb-3">Kinesis</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Centro de movimiento consciente dedicado a transformar vidas a través del yoga y el bienestar integral.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-brand-primary transition-colors">Inicio</Link></li>
              <li><Link to="/quienes-somos" className="text-muted-foreground hover:text-brand-primary transition-colors">Quiénes Somos</Link></li>
              <li><Link to="/programas" className="text-muted-foreground hover:text-brand-primary transition-colors">Programas</Link></li>
              <li><Link to="/equipo" className="text-muted-foreground hover:text-brand-primary transition-colors">Equipo</Link></li>
              <li><Link to="/horarios-tarifas" className="text-muted-foreground hover:text-brand-primary transition-colors">Horarios y Tarifas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/aviso" className="text-muted-foreground hover:text-brand-primary transition-colors">Aviso Legal</Link></li>
              <li><Link to="/legal/privacidad" className="text-muted-foreground hover:text-brand-primary transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} Kinesis. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/legal/aviso" className="text-muted-foreground hover:text-brand-primary transition-colors">Aviso Legal</Link>
            <Link to="/legal/privacidad" className="text-muted-foreground hover:text-brand-primary transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
