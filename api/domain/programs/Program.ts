export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface Program {
  id: string;
  code: string;
  name: string;
  subtitle?: string;
  descriptionShort?: string;
  descriptionFull?: string;
  businessModelId?: string;
  specialtyId?: string;
  durationMinutes?: number;
  sessionsPerWeek?: number;
  minStudents: number;
  maxStudents: number;
  minAge?: number;
  maxAge?: number;
  difficultyLevel?: DifficultyLevel;
  pricePerSession?: number;
  priceMonthly?: number;
  priceQuarterly?: number;
  scheduleDescription?: string;
  featuredImageUrl?: string;
  isActive: boolean;
  showOnWeb: boolean;
  isFeatured: boolean;
  allowOnlineEnrollment: boolean;
  displayOrder: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export function createProgram(data: Partial<Program> & Pick<Program, 'id' | 'code' | 'name'>): Program {
  return {
    minStudents: 1,
    maxStudents: 20,
    isActive: true,
    showOnWeb: true,
    isFeatured: false,
    allowOnlineEnrollment: true,
    displayOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}
