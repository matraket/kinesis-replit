export interface LegalPage {
  id: string;
  pageType: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: Date;
  isCurrent: boolean;
  slug?: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface CreateLegalPageInput {
  pageType: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: Date;
  isCurrent?: boolean;
  slug?: string;
}

export interface UpdateLegalPageInput {
  title?: string;
  content?: string;
  version?: string;
  effectiveDate?: Date;
  isCurrent?: boolean;
  slug?: string;
}

export function createLegalPage(id: string, input: CreateLegalPageInput): LegalPage {
  return {
    id,
    pageType: input.pageType,
    title: input.title,
    content: input.content,
    version: input.version,
    effectiveDate: input.effectiveDate,
    isCurrent: input.isCurrent ?? false,
    slug: input.slug,
    createdAt: new Date(),
    approvedAt: undefined,
  };
}

export function updateLegalPage(existing: LegalPage, input: UpdateLegalPageInput): LegalPage {
  return {
    ...existing,
    title: input.title ?? existing.title,
    content: input.content ?? existing.content,
    version: input.version ?? existing.version,
    effectiveDate: input.effectiveDate ?? existing.effectiveDate,
    isCurrent: input.isCurrent ?? existing.isCurrent,
    slug: input.slug !== undefined ? input.slug : existing.slug,
  };
}
