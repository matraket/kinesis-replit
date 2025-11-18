export interface MediaLibrary {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  folder?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  updatedAt: Date;
}

export interface CreateMediaInput {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  folder?: string;
  uploadedBy?: string;
}

export interface MediaFilters {
  folder?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export function createMedia(id: string, input: CreateMediaInput): MediaLibrary {
  return {
    id,
    filename: input.filename,
    originalName: input.originalName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    url: input.url,
    thumbnailUrl: input.thumbnailUrl,
    altText: input.altText,
    caption: input.caption,
    tags: input.tags,
    folder: input.folder,
    uploadedAt: new Date(),
    uploadedBy: input.uploadedBy,
    updatedAt: new Date(),
  };
}
