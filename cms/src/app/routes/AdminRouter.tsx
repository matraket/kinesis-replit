import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '../auth/AuthGuard';
import { AdminLayout } from '../layout/AdminLayout';
import { LoginRoute } from './LoginRoute';
import { DashboardRoute } from './DashboardRoute';
import { PlaceholderRoute } from './PlaceholderRoute';

export function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginRoute />} />
      
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminLayout>
              <DashboardRoute />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/programs"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Programas" 
                description="Aquí podrás gestionar los programas de baile, sus horarios, especialidades e instructores."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/instructors"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Instructores" 
                description="Gestiona el equipo de instructores, sus perfiles y especialidades."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/business-models"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Modelos de Negocio" 
                description="Configura los cuatro modelos de negocio de Kinesis."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/pages"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Páginas" 
                description="Gestiona el contenido de las páginas estáticas del sitio web."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/faqs"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="FAQs" 
                description="Administra las preguntas frecuentes que se muestran en el sitio."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/leads"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Leads" 
                description="Revisa y gestiona los leads generados desde el sitio web."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route
        path="/admin/settings"
        element={
          <AuthGuard>
            <AdminLayout>
              <PlaceholderRoute 
                title="Ajustes" 
                description="Configura los ajustes generales del sitio."
              />
            </AdminLayout>
          </AuthGuard>
        }
      />
      
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
