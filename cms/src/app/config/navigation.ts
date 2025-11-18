import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Building2,
  FileText,
  HelpCircle,
  Mail,
  Settings,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  section: string;
  isEnabled: boolean;
}

export interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
}

export interface NavigationConfig {
  groups: NavGroup[];
}

export const navigationConfig: NavigationConfig = {
  groups: [
    {
      id: 'panel',
      label: 'Panel',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/admin',
          icon: LayoutDashboard,
          section: 'panel',
          isEnabled: true,
        },
      ],
    },
    {
      id: 'contenido',
      label: 'Contenido',
      items: [
        {
          id: 'programs',
          label: 'Programas',
          path: '/admin/programs',
          icon: GraduationCap,
          section: 'contenido',
          isEnabled: true,
        },
        {
          id: 'instructors',
          label: 'Instructores',
          path: '/admin/instructors',
          icon: Users,
          section: 'contenido',
          isEnabled: true,
        },
        {
          id: 'business-models',
          label: 'Modelos de Negocio',
          path: '/admin/business-models',
          icon: Building2,
          section: 'contenido',
          isEnabled: true,
        },
        {
          id: 'pages',
          label: 'Páginas',
          path: '/admin/pages',
          icon: FileText,
          section: 'contenido',
          isEnabled: true,
        },
        {
          id: 'faqs',
          label: 'FAQs',
          path: '/admin/faqs',
          icon: HelpCircle,
          section: 'contenido',
          isEnabled: true,
        },
      ],
    },
    {
      id: 'operacion',
      label: 'Operación',
      items: [
        {
          id: 'leads',
          label: 'Leads',
          path: '/admin/leads',
          icon: Mail,
          section: 'operacion',
          isEnabled: true,
        },
      ],
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      items: [
        {
          id: 'settings',
          label: 'Ajustes',
          path: '/admin/settings',
          icon: Settings,
          section: 'configuracion',
          isEnabled: true,
        },
      ],
    },
  ],
};
