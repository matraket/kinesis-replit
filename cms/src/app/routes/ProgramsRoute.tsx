import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { DataTable } from '../../../../shared/ui/data-table/DataTable';
import type { Column } from '../../../../shared/ui/data-table/types';
import { adminApi } from '../api/adminApi';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProgramForm } from '../components/programs/ProgramForm';

interface Program {
  id: string;
  name: string;
  code: string;
  businessModelId?: string;
  specialtyId?: string;
  difficultyLevel?: string;
  isActive: boolean;
  showOnWeb: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export function ProgramsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const pageSize = 20;

  // Check if we should show form from URL params
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    
    if (action === 'new') {
      setShowForm(true);
      setSelectedProgram(null);
    } else if (action === 'edit' && id) {
      loadProgram(id);
    } else {
      setShowForm(false);
      setSelectedProgram(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!showForm) {
      loadPrograms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showForm]);

  const loadPrograms = async () => {
    setIsLoading(true);
    try {
      const response: any = await adminApi.programs.list();
      setPrograms(response.data || []);
      setTotal(response.total || response.data?.length || 0);
    } catch (error) {
      console.error('Error loading programs:', error);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgram = async (id: string) => {
    try {
      const response: any = await adminApi.programs.getById(id);
      setSelectedProgram(response.data);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading program:', error);
    }
  };

  const handleNew = () => {
    setSearchParams({ action: 'new' });
  };

  const handleEdit = (program: Program) => {
    setSearchParams({ action: 'edit', id: program.id });
  };

  const handleDelete = async (program: Program) => {
    if (!confirm(`¿Eliminar el programa "${program.name}"?`)) return;
    
    try {
      await adminApi.programs.delete(program.id);
      loadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Error al eliminar el programa');
    }
  };

  const handleFormClose = () => {
    setSearchParams({});
    setShowForm(false);
    setSelectedProgram(null);
    loadPrograms();
  };

  const columns: Column<Program>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'code',
      label: 'Código',
      sortable: true,
    },
    {
      key: 'difficultyLevel',
      label: 'Dificultad',
      render: (value, row) => {
        const levels: Record<string, string> = {
          beginner: 'Principiante',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
          professional: 'Profesional',
        };
        return <span>{levels[row.difficultyLevel || ''] || '-'}</span>;
      },
    },
    {
      key: 'isActive',
      label: 'Activo',
      render: (value, row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.isActive ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-error/20 text-admin-error'}`}>
          {row.isActive ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'showOnWeb',
      label: 'En Web',
      render: (value, row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.showOnWeb ? 'bg-admin-info/20 text-admin-info' : 'bg-gray-500/20 text-gray-400'}`}>
          {row.showOnWeb ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Destacado',
      render: (value, row) => row.isFeatured ? '⭐' : '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value, row) => (
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-admin-white">
            {selectedProgram ? 'Editar Programa' : 'Nuevo Programa'}
          </h1>
        </div>
        <ProgramForm program={selectedProgram} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-admin-white">Programas y Servicios</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Programa
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={programs}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          emptyMessage="No hay programas creados"
        />
      </Card>
    </div>
  );
}
