import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { DataTable } from '../../../../shared/ui/data-table/DataTable';
import type { Column } from '../../../../shared/ui/data-table/types';
import { adminApi } from '../api/adminApi';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { InstructorForm } from '../components/instructors/InstructorForm';

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role?: string;
  isActive: boolean;
  showOnWeb: boolean;
  isFeatured: boolean;
}

export function InstructorsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const pageSize = 20;

  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    
    if (action === 'new') {
      setShowForm(true);
      setSelectedInstructor(null);
    } else if (action === 'edit' && id) {
      loadInstructor(id);
    } else {
      setShowForm(false);
      setSelectedInstructor(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!showForm) {
      loadInstructors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showForm]);

  const loadInstructors = async () => {
    setIsLoading(true);
    try {
      const response: any = await adminApi.instructors.list();
      setInstructors(response.data || []);
      setTotal(response.total || response.data?.length || 0);
    } catch (error) {
      console.error('Error loading instructors:', error);
      setInstructors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInstructor = async (id: string) => {
    try {
      const response: any = await adminApi.instructors.getById(id);
      setSelectedInstructor(response.data);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading instructor:', error);
    }
  };

  const handleNew = () => {
    setSearchParams({ action: 'new' });
  };

  const handleEdit = (instructor: Instructor) => {
    setSearchParams({ action: 'edit', id: instructor.id });
  };

  const handleDelete = async (instructor: Instructor) => {
    const name = instructor.displayName || `${instructor.firstName} ${instructor.lastName}`;
    if (!confirm(`¿Eliminar al instructor "${name}"?`)) return;
    
    try {
      await adminApi.instructors.delete(instructor.id);
      loadInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert('Error al eliminar el instructor');
    }
  };

  const handleFormClose = () => {
    setSearchParams({});
    setShowForm(false);
    setSelectedInstructor(null);
    loadInstructors();
  };

  const columns: Column<Instructor>[] = [
    {
      key: 'displayName',
      label: 'Nombre',
      sortable: true,
      render: (_, row) => row.displayName || `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (_, row) => row.role || '-',
    },
    {
      key: 'isActive',
      label: 'Activo',
      render: (_, row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.isActive ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-error/20 text-admin-error'}`}>
          {row.isActive ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'showOnWeb',
      label: 'En Web',
      render: (_, row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.showOnWeb ? 'bg-admin-info/20 text-admin-info' : 'bg-gray-500/20 text-gray-400'}`}>
          {row.showOnWeb ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Destacado',
      render: (_, row) => row.isFeatured ? '⭐' : '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-admin-accent hover:bg-admin-surfaceLight rounded transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-admin-error hover:bg-admin-surfaceLight rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (showForm) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-admin-white">
            {selectedInstructor ? 'Editar Instructor' : 'Nuevo Instructor'}
          </h1>
        </div>
        <InstructorForm instructor={selectedInstructor} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-admin-white">Equipo / Instructores</h1>
        <Button onClick={handleNew} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Instructor
        </Button>
      </div>

      {/* MOBILE VIEW - Cards (like Dashboard) */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-20 bg-admin-surfaceLight rounded"></div>
              </Card>
            ))}
          </div>
        ) : instructors.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-admin-muted mb-4">No hay instructores creados</p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {instructors.map((instructor) => {
                const name = instructor.displayName || `${instructor.firstName} ${instructor.lastName}`;
                return (
                  <Card key={instructor.id} className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-admin-white">{name}</h3>
                    </div>
                    {instructor.role && (
                      <p className="text-sm text-admin-muted mb-3">{instructor.role}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs ${instructor.isActive ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-error/20 text-admin-error'}`}>
                        {instructor.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${instructor.showOnWeb ? 'bg-admin-info/20 text-admin-info' : 'bg-gray-500/20 text-gray-400'}`}>
                        {instructor.showOnWeb ? 'En web' : 'Oculto'}
                      </span>
                      {instructor.isFeatured && (
                        <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-500">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(instructor)}
                        className="flex-1 h-11 bg-admin-accent text-white rounded-lg hover:bg-admin-accent/90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(instructor)}
                        className="flex-1 h-11 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {/* Mobile Pagination */}
            {total > pageSize && (
              <div className="mt-4 flex items-center justify-between bg-admin-surfaceLight p-3 rounded-lg">
                <span className="text-xs text-admin-muted">
                  {Math.min((page - 1) * pageSize + 1, total)}-{Math.min(page * pageSize, total)} de {total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-admin-surface text-admin-white rounded disabled:opacity-50 text-sm"
                  >
                    Ant
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * pageSize >= total}
                    className="px-3 py-1 bg-admin-surface text-admin-white rounded disabled:opacity-50 text-sm"
                  >
                    Sig
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* DESKTOP VIEW - DataTable */}
      <div className="hidden md:block">
        <Card>
          <DataTable
            columns={columns}
            data={instructors}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            emptyMessage="No hay instructores creados"
            mobileActions={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
