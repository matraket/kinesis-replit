import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const getDifficultyLabel = (level?: string) => {
    const levels: Record<string, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto',
    };
    return level ? levels[level] || level : '-';
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
      render: (_, row) => getDifficultyLabel(row.difficultyLevel),
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
            {selectedProgram ? 'Editar Programa' : 'Nuevo Programa'}
          </h1>
        </div>
        <ProgramForm program={selectedProgram} onClose={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-admin-white">Programas y Servicios</h1>
        <Button onClick={handleNew} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Programa
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
        ) : programs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-admin-muted mb-4">No hay programas creados</p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {programs.map((program) => (
                <Card key={program.id} className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-admin-white">{program.name}</h3>
                  </div>
                  <p className="text-sm text-admin-muted mb-3">{program.code}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {program.difficultyLevel && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                        {getDifficultyLabel(program.difficultyLevel)}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${program.isActive ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-error/20 text-admin-error'}`}>
                      {program.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${program.showOnWeb ? 'bg-admin-info/20 text-admin-info' : 'bg-gray-500/20 text-gray-400'}`}>
                      {program.showOnWeb ? 'En web' : 'Oculto'}
                    </span>
                    {program.isFeatured && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-500">
                        ⭐ Destacado
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="flex-1 h-11 bg-admin-accent text-white rounded-lg hover:bg-admin-accent/90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(program)}
                      className="flex-1 h-11 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </Card>
              ))}
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
            data={programs}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            emptyMessage="No hay programas creados"
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
