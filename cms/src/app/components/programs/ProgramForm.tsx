import { useState, useEffect } from 'react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { RichTextEditor } from '../../../shared/ui/RichTextEditor';
import { adminApi } from '../../api/adminApi';
import { Save, X } from 'lucide-react';

interface ProgramFormProps {
  program: any | null;
  onClose: () => void;
}

export function ProgramForm({ program, onClose }: ProgramFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'schedules' | 'pricing'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [businessModels, setBusinessModels] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: program?.name || '',
    code: program?.code || '',
    subtitle: program?.subtitle || '',
    businessModelId: program?.businessModelId || '',
    specialtyId: program?.specialtyId || '',
    difficultyLevel: program?.difficultyLevel || 'beginner',
    slug: program?.slug || '',
    displayOrder: program?.displayOrder ?? '',
    descriptionShort: program?.descriptionShort || '',
    descriptionFull: program?.descriptionFull || '',
    scheduleDescription: program?.scheduleDescription || '',
    isActive: program?.isActive ?? true,
    showOnWeb: program?.showOnWeb ?? true,
    isFeatured: program?.isFeatured ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bmResponse, specResponse] = await Promise.all([
        adminApi.businessModels.list(),
        adminApi.specialties.list(),
      ]);
      setBusinessModels(bmResponse.data || []);
      setSpecialties(specResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize empty strings to undefined for optional fields
      const payload = {
        ...formData,
        subtitle: formData.subtitle?.trim() || undefined,
        businessModelId: formData.businessModelId?.trim() || undefined,
        specialtyId: formData.specialtyId?.trim() || undefined,
        slug: formData.slug?.trim() || undefined,
        descriptionShort: formData.descriptionShort?.trim() || undefined,
        descriptionFull: formData.descriptionFull?.trim() || undefined,
        scheduleDescription: formData.scheduleDescription?.trim() || undefined,
        displayOrder: formData.displayOrder === '' ? undefined : Number(formData.displayOrder),
      };

      if (program?.id) {
        await adminApi.programs.update(program.id, payload);
      } else {
        await adminApi.programs.create(payload);
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving program:', error);
      alert(error.response?.data?.error || error.message || 'Error al guardar el programa');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'content', label: 'Contenido' },
    { id: 'schedules', label: 'Horarios' },
    { id: 'pricing', label: 'Tarifas' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-admin-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-admin-accent border-b-2 border-admin-accent'
                  : 'text-admin-muted hover:text-admin-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <Card title="Información General">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Nombre *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
              />
              <Input
                label="Código *"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                error={errors.code}
                required
              />
              <Input
                label="Subtítulo"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-admin-white mb-1">
                  Modelo de Negocio
                </label>
                <select
                  value={formData.businessModelId}
                  onChange={(e) => handleChange('businessModelId', e.target.value)}
                  className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent"
                >
                  <option value="">Seleccionar...</option>
                  {businessModels.map(bm => (
                    <option key={bm.id} value={bm.id}>{bm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-white mb-1">
                  Especialidad
                </label>
                <select
                  value={formData.specialtyId}
                  onChange={(e) => handleChange('specialtyId', e.target.value)}
                  className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent"
                >
                  <option value="">Seleccionar...</option>
                  {specialties.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-white mb-1">
                  Nivel de Dificultad
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                  <option value="professional">Profesional</option>
                </select>
              </div>
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="mi-programa"
              />
              <Input
                label="Orden de visualización"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', e.target.value)}
              />
              <div className="col-span-2 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="rounded bg-admin-navy border-admin-border text-admin-accent focus:ring-admin-accent"
                  />
                  <span className="text-sm text-admin-white">Activo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.showOnWeb}
                    onChange={(e) => handleChange('showOnWeb', e.target.checked)}
                    className="rounded bg-admin-navy border-admin-border text-admin-accent focus:ring-admin-accent"
                  />
                  <span className="text-sm text-admin-white">Mostrar en web</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange('isFeatured', e.target.checked)}
                    className="rounded bg-admin-navy border-admin-border text-admin-accent focus:ring-admin-accent"
                  />
                  <span className="text-sm text-admin-white">Destacado</span>
                </label>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'content' && (
          <Card title="Contenido">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-admin-white mb-2">
                  Descripción Corta
                </label>
                <textarea
                  value={formData.descriptionShort}
                  onChange={(e) => handleChange('descriptionShort', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent resize-none"
                  placeholder="Resumen breve del programa..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-white mb-2">
                  Descripción Completa (HTML)
                </label>
                <RichTextEditor
                  value={formData.descriptionFull}
                  onChange={(html) => handleChange('descriptionFull', html)}
                  placeholder="Descripción detallada del programa..."
                />
              </div>
              <Input
                label="Descripción de Horarios"
                value={formData.scheduleDescription}
                onChange={(e) => handleChange('scheduleDescription', e.target.value)}
                placeholder="Ej: Lunes y Miércoles 18:00-20:00"
              />
            </div>
          </Card>
        )}

        {activeTab === 'schedules' && (
          <Card title="Horarios">
            <div className="text-admin-muted text-center py-8">
              <p>Funcionalidad de horarios en desarrollo.</p>
              <p className="text-sm mt-2">Use la descripción de horarios en la pestaña de Contenido.</p>
            </div>
          </Card>
        )}

        {activeTab === 'pricing' && (
          <Card title="Tarifas">
            <div className="text-admin-muted text-center py-8">
              <p>Funcionalidad de tarifas en desarrollo.</p>
              <p className="text-sm mt-2">Use los endpoints de pricing_tiers para gestionar tarifas.</p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </form>
  );
}
