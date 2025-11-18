import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Building2, 
  FileText, 
  HelpCircle, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Panel',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { label: 'Programas', path: '/admin/programs', icon: GraduationCap },
      { label: 'Instructores', path: '/admin/instructors', icon: Users },
      { label: 'Modelos de Negocio', path: '/admin/business-models', icon: Building2 },
      { label: 'Páginas', path: '/admin/pages', icon: FileText },
      { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    title: 'Operación',
    items: [
      { label: 'Leads', path: '/admin/leads', icon: Mail },
      { label: 'Ajustes', path: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    const currentPath = location.pathname;
    for (const section of navigation) {
      const item = section.items.find(i => i.path === currentPath);
      if (item) return item.label;
    }
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
            lg:relative lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Kinesis CMS</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              {navigation.map((section) => (
                <div key={section.title} className="mb-6">
                  <h2 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h2>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive 
                              ? 'bg-gray-100 text-gray-900' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
