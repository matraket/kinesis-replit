export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface PageSection {
  title: string;
  content: string;
  order: number;
}

export interface PageContent {
  id: string;
  pageKey: string;
  pageTitle: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown>;
  sections?: PageSection[];
  heroImageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  status: PublicationStatus;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  version: number;
  publishedVersion?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export function createPageContent(data: Partial<PageContent> & Pick<PageContent, 'id' | 'pageKey' | 'pageTitle'>): PageContent {
  return {
    status: 'draft',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}
