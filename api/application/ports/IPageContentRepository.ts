import { PageContent, PageSection, PublicationStatus } from '../../domain/content/index.js';
import { Result } from '../../../shared/types/Result.js';

export interface PageContentFilters {
  status?: PublicationStatus;
  pageKey?: string;
  page?: number;
  limit?: number;
}

export interface CreatePageContentInput {
  pageKey: string;
  pageTitle: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown>;
  sections?: PageSection[];
  heroImageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  status?: PublicationStatus;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

export interface UpdatePageContentInput {
  pageKey?: string;
  pageTitle?: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown>;
  sections?: PageSection[];
  heroImageUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  status?: PublicationStatus;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

export interface IPageContentRepository {
  findBySlug(slug: string): Promise<Result<PageContent | null, Error>>;
  listAll(filters: PageContentFilters): Promise<Result<{ pages: PageContent[]; total: number }, Error>>;
  findById(id: string): Promise<Result<PageContent | null, Error>>;
  findByPageKey(pageKey: string): Promise<Result<PageContent | null, Error>>;
  create(input: CreatePageContentInput): Promise<Result<PageContent, Error>>;
  update(id: string, input: UpdatePageContentInput): Promise<Result<PageContent, Error>>;
  delete(id: string): Promise<Result<void, Error>>;
}
