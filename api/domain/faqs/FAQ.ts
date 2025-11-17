export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  programId?: string;
  businessModelId?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export function createFAQ(data: {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  programId?: string;
  businessModelId?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  viewCount?: number;
  helpfulCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): FAQ {
  return {
    id: data.id,
    question: data.question,
    answer: data.answer,
    category: data.category,
    tags: data.tags,
    programId: data.programId,
    businessModelId: data.businessModelId,
    displayOrder: data.displayOrder ?? 0,
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    viewCount: data.viewCount ?? 0,
    helpfulCount: data.helpfulCount ?? 0,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}
