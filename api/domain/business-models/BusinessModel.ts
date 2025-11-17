export interface BusinessModel {
  id: string;
  internalCode: string;
  name: string;
  subtitle?: string;
  description: string;
  scheduleInfo?: string;
  targetAudience?: string;
  format?: string;
  
  // Contenido enriquecido
  featureTitle?: string;
  featureContent?: string;
  advantageTitle?: string;
  advantageContent?: string;
  benefitTitle?: string;
  benefitContent?: string;
  
  // Orden y visibilidad
  displayOrder: number;
  isActive: boolean;
  showOnWeb: boolean;
  
  // Metadatos
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
}

export function createBusinessModel(data: {
  id: string;
  internalCode: string;
  name: string;
  subtitle?: string;
  description: string;
  scheduleInfo?: string;
  targetAudience?: string;
  format?: string;
  featureTitle?: string;
  featureContent?: string;
  advantageTitle?: string;
  advantageContent?: string;
  benefitTitle?: string;
  benefitContent?: string;
  displayOrder?: number;
  isActive?: boolean;
  showOnWeb?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): BusinessModel {
  return {
    id: data.id,
    internalCode: data.internalCode,
    name: data.name,
    subtitle: data.subtitle,
    description: data.description,
    scheduleInfo: data.scheduleInfo,
    targetAudience: data.targetAudience,
    format: data.format,
    featureTitle: data.featureTitle,
    featureContent: data.featureContent,
    advantageTitle: data.advantageTitle,
    advantageContent: data.advantageContent,
    benefitTitle: data.benefitTitle,
    benefitContent: data.benefitContent,
    displayOrder: data.displayOrder ?? 0,
    isActive: data.isActive ?? true,
    showOnWeb: data.showOnWeb ?? true,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    slug: data.slug,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}
