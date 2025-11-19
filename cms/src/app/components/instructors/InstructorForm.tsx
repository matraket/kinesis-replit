import { useState, useEffect } from 'react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { RichTextEditor } from '../../../shared/ui/RichTextEditor';
import { adminApi } from '../../api/adminApi';
import { Save, X } from 'lucide-react';

interface InstructorFormProps {
  instructor: any | null;
  onClose: () => void;
}

export function InstructorForm({ instructor, onClose }: InstructorFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'bio' | 'specialties'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: instructor?.firstName || '',
    lastName: instructor?.lastName || '',
    displayName: instructor?.displayName || '',
    email: instructor?.email || '',
    phone: instructor?.phone || '',
    role: instructor?.role || '',
    tagline: instructor?.tagline || '',
    bioSummary: instructor?.bioSummary || '',
    bioFull: instructor?.bioFull || '',
    profileImageUrl: instructor?.profileImageUrl || '',
    heroImageUrl: instructor?.heroImageUrl || '',
    videoUrl: instructor?.videoUrl || '',
    slug: instructor?.slug || '',
    displayOrder: instructor?.displayOrder ?? '',
    seniorityLevel: instructor?.seniorityLevel ?? '',
    isActive: instructor?.isActive ?? true,
    showOnWeb: instructor?.showOnWeb ?? true,
    showInTeamPage: instructor?.showInTeamPage ?? true,
    isFeatured: instructor?.isFeatured ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      const response = await adminApi.specialties.list();
      setSpecialties(response.data || []);
    } catch (error) {
      console.error('Error loading specialties:', error);
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
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
        profileImageUrl: formData.profileImageUrl?.trim() || undefined,
        heroImageUrl: formData.heroImageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        displayName: formData.displayName?.trim() || undefined,
        role: formData.role?.trim() || undefined,
        tagline: formData.tagline?.trim() || undefined,
        bioSummary: formData.bioSummary?.trim() || undefined,
        bioFull: formData.bioFull?.trim() || undefined,
        slug: formData.slug?.trim() || undefined,
        displayOrder: formData.displayOrder === '' ? undefined : Number(formData.displayOrder),
        seniorityLevel: formData.seniorityLevel === '' ? undefined : Number(formData.seniorityLevel),
      };

      if (instructor?.id) {
        await adminApi.instructors.update(instructor.id, payload);
      } else {
        await adminApi.instructors.create(payload);
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving instructor:', error);
      alert(error.response?.data?.error || error.message || 'Error al guardar el instructor');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'bio', label: 'Biografía' },
    { id: 'specialties', label: 'Especialidades' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
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

        {activeTab === 'general' && (
          <Card title="Información General">
            <div className="space-y-4">
              <Input
                label="Nombre *"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Apellido *"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
              <Input
                label="Nombre Artístico"
                value={formData.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <Input
                label="Rol"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Director, Profesor Adjunto, etc."
              />
              <div className="col-span-2">
                <Input
                  label="Tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Frase inspiradora personal"
                />
              </div>
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="nombre-apellido"
              />
              <Input
                label="Orden de visualización"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', e.target.value)}
              />
              <Input
                label="Nivel de senioridad"
                type="number"
                value={formData.seniorityLevel}
                onChange={(e) => handleChange('seniorityLevel', e.target.value)}
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
                    checked={formData.showInTeamPage}
                    onChange={(e) => handleChange('showInTeamPage', e.target.checked)}
                    className="rounded bg-admin-navy border-admin-border text-admin-accent focus:ring-admin-accent"
                  />
                  <span className="text-sm text-admin-white">Mostrar en página de equipo</span>
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

        {activeTab === 'bio' && (
          <Card title="Biografía">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-admin-white mb-2">
                  Resumen Biográfico
                </label>
                <textarea
                  value={formData.bioSummary}
                  onChange={(e) => handleChange('bioSummary', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent resize-none"
                  placeholder="Resumen breve para tarjetas..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-white mb-2">
                  Biografía Completa (HTML)
                </label>
                <RichTextEditor
                  value={formData.bioFull}
                  onChange={(html) => handleChange('bioFull', html)}
                  placeholder="Biografía detallada del instructor..."
                />
              </div>
              <Input
                label="URL Imagen de Perfil"
                value={formData.profileImageUrl}
                onChange={(e) => handleChange('profileImageUrl', e.target.value)}
                placeholder="https://..."
              />
              <Input
                label="URL Imagen Hero"
                value={formData.heroImageUrl}
                onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                placeholder="https://..."
              />
              <Input
                label="URL Video Presentación"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </Card>
        )}

        {activeTab === 'specialties' && (
          <Card title="Especialidades">
            <div className="text-admin-muted text-center py-8">
              <p>Funcionalidad de especialidades en desarrollo.</p>
              <p className="text-sm mt-2">
                Use la tabla instructor_specialties para asociar especialidades al instructor.
              </p>
            </div>
          </Card>
        )}

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
