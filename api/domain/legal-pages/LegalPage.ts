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

export function createLegalPage(data: {
  id: string;
  pageType: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: Date;
  isCurrent?: boolean;
  slug?: string;
  createdAt?: Date;
  approvedAt?: Date;
}): LegalPage {
  return {
    id: data.id,
    pageType: data.pageType,
    title: data.title,
    content: data.content,
    version: data.version,
    effectiveDate: data.effectiveDate,
    isCurrent: data.isCurrent ?? false,
    slug: data.slug,
    createdAt: data.createdAt ?? new Date(),
    approvedAt: data.approvedAt,
  };
}
