import { Link } from 'react-router-dom';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4">Kinesis</h3>
            <p className="text-sm mb-4">
              Centro de movimiento consciente dedicado a transformar vidas a través del yoga y el bienestar integral.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/quienes-somos" className="hover:text-white transition-colors">Quiénes Somos</Link></li>
              <li><Link to="/programas" className="hover:text-white transition-colors">Programas</Link></li>
              <li><Link to="/equipo" className="hover:text-white transition-colors">Equipo</Link></li>
              <li><Link to="/horarios-tarifas" className="hover:text-white transition-colors">Horarios y Tarifas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal/aviso" className="hover:text-white transition-colors">Aviso Legal</Link></li>
              <li><Link to="/legal/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Kinesis. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
