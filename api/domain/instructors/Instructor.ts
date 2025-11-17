export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tagline?: string;
  bioSummary?: string;
  bioFull?: string;
  achievements?: string[];
  education?: string[];
  profileImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  showOnWeb: boolean;
  showInTeamPage: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  seniorityLevel: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createInstructor(data: {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tagline?: string;
  bioSummary?: string;
  bioFull?: string;
  achievements?: string[];
  education?: string[];
  profileImageUrl?: string;
  heroImageUrl?: string;
  videoUrl?: string;
  showOnWeb?: boolean;
  showInTeamPage?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  seniorityLevel?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): Instructor {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName,
    email: data.email,
    phone: data.phone,
    role: data.role,
    tagline: data.tagline,
    bioSummary: data.bioSummary,
    bioFull: data.bioFull,
    achievements: data.achievements,
    education: data.education,
    profileImageUrl: data.profileImageUrl,
    heroImageUrl: data.heroImageUrl,
    videoUrl: data.videoUrl,
    showOnWeb: data.showOnWeb ?? true,
    showInTeamPage: data.showInTeamPage ?? true,
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    seniorityLevel: data.seniorityLevel ?? 0,
    slug: data.slug,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}
