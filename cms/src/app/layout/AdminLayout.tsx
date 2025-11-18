import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../theme/useTheme';
import { navigationConfig } from '../config/navigation';
import { adminApi, Settings } from '../api/adminApi';
import { 
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [branding, setBranding] = useState<{ name: string; logo?: string }>({
    name: 'Kinesis',
  });

  useEffect(() => {
    adminApi.settings.get()
      .then((response) => {
        setBranding({
          name: response.settings.site.name || 'Kinesis',
          logo: response.settings.site.logo?.cms,
        });
      })
      .catch(() => {
        setBranding({ name: 'Kinesis' });
      });
  }, []);

  const getPageTitle = () => {
    const currentPath = location.pathname;
    for (const group of navigationConfig.groups) {
      const item = group.items.find(i => i.path === currentPath);
      if (item) return item.label;
    }
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-admin-navy">
      <div className="flex h-screen overflow-hidden">
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-admin-navy border-r border-admin-border transform transition-transform duration-200 ease-in-out
            lg:relative lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-admin-border">
              <div className="flex items-center gap-3">
                {branding.logo ? (
                  <img 
                    src={branding.logo} 
                    alt={branding.name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-md bg-admin-accent flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {branding.name.substring(0, 1)}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-sm font-display font-bold text-admin-white">{branding.name}</h1>
                  <p className="text-xs text-admin-muted">CMS</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-admin-surface transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5 text-admin-muted" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              {navigationConfig.groups.map((group) => (
                <div key={group.id} className="mb-6">
                  {group.label && (
                    <h2 className="px-3 mb-2 text-xs font-semibold text-admin-muted uppercase tracking-wider">
                      {group.label}
                    </h2>
                  )}
                  <div className="space-y-1">
                    {group.items
                      .filter(item => item.isEnabled)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                              relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                              ${isActive 
                                ? 'bg-admin-surface text-admin-white' 
                                : 'text-admin-muted hover:bg-admin-surface hover:text-admin-white'
                              }
                            `}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-admin-accent rounded-r" />
                            )}
                            <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-admin-accent' : 'text-admin-muted'}`} />
                            {item.label}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-admin-border">
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-admin-muted rounded-lg hover:bg-admin-surface hover:text-admin-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-admin-surfaceLight border-b border-admin-border flex items-center justify-between px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mr-4 p-2 rounded-md hover:bg-admin-surface transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5 text-admin-muted" />
              </button>
              <h2 className="text-lg font-semibold text-admin-white">{getPageTitle()}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-admin-surface transition-colors"
                aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                aria-pressed={theme === 'light'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-admin-muted hover:text-admin-white transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 text-admin-muted hover:text-admin-white transition-colors" />
                )}
              </button>
              <span className="text-sm text-admin-muted">Admin</span>
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
