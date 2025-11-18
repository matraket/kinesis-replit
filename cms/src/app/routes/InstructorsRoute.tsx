import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  }, [searchParams]);

  useEffect(() => {
    if (!showForm) {
      loadInstructors();
    }
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
      render: (instructor) => instructor.displayName || `${instructor.firstName} ${instructor.lastName}`,
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (instructor) => instructor.role || '-',
    },
    {
      key: 'isActive',
      label: 'Activo',
      render: (instructor) => (
        <span className={`px-2 py-1 rounded text-xs ${instructor.isActive ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-error/20 text-admin-error'}`}>
          {instructor.isActive ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'showOnWeb',
      label: 'En Web',
      render: (instructor) => (
        <span className={`px-2 py-1 rounded text-xs ${instructor.showOnWeb ? 'bg-admin-info/20 text-admin-info' : 'bg-gray-500/20 text-gray-400'}`}>
          {instructor.showOnWeb ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Destacado',
      render: (instructor) => instructor.isFeatured ? '⭐' : '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (instructor) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(instructor)}
            className="p-2 text-admin-accent hover:bg-admin-surfaceLight rounded transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(instructor)}
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-admin-white">
            {selectedInstructor ? 'Editar Instructor' : 'Nuevo Instructor'}
          </h1>
        </div>
        <InstructorForm instructor={selectedInstructor} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-admin-white">Equipo / Instructores</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Instructor
        </Button>
      </div>

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
        />
      </Card>
    </div>
  );
}
