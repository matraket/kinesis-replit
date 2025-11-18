export interface Specialty {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export function createSpecialty(data: {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): Specialty {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    category: data.category,
    icon: data.icon,
    color: data.color,
    imageUrl: data.imageUrl,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}
