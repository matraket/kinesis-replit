import { z } from 'zod';

export const uploadMediaSchema = z.object({
  altText: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folder: z.string().optional(),
});

export const listMediaQuerySchema = z.object({
  folder: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().transform(val => val ? val.split(',') : undefined).optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
});

export type UploadMediaDTO = z.infer<typeof uploadMediaSchema>;
export type ListMediaQueryDTO = z.infer<typeof listMediaQuerySchema>;
