export interface PricingTier {
  id: string;
  programId?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  sessionsIncluded?: number;
  validityDays?: number;
  maxStudents?: number;
  conditions?: string[];
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createPricingTier(data: {
  id: string;
  programId?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  sessionsIncluded?: number;
  validityDays?: number;
  maxStudents?: number;
  conditions?: string[];
  displayOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}): PricingTier {
  return {
    id: data.id,
    programId: data.programId,
    name: data.name,
    description: data.description,
    price: data.price,
    originalPrice: data.originalPrice,
    sessionsIncluded: data.sessionsIncluded,
    validityDays: data.validityDays,
    maxStudents: data.maxStudents,
    conditions: data.conditions,
    displayOrder: data.displayOrder ?? 0,
    isActive: data.isActive ?? true,
    isFeatured: data.isFeatured ?? false,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}
