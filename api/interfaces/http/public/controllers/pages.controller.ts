import { FastifyRequest, FastifyReply } from 'fastify';
import { GetPageContentBySlug } from '../../../../application/use-cases/public/GetPageContentBySlug.js';
import { PostgresContentRepository } from '../../../../infrastructure/db/PostgresContentRepository.js';
import { PageContent } from '../../../../domain/content/index.js';
import { PageContentResponse } from '../schemas/page-content.schemas.js';

function toPageContentResponse(page: PageContent): PageContentResponse {
  return {
    id: page.id,
    pageKey: page.pageKey,
    pageTitle: page.pageTitle,
    contentHtml: page.contentHtml,
    contentJson: page.contentJson,
    sections: page.sections,
    heroImageUrl: page.heroImageUrl,
    galleryImages: page.galleryImages,
    videoUrl: page.videoUrl,
    slug: page.slug,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImageUrl: page.ogImageUrl,
  };
}

export async function getPageContentBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { slug } = request.params;
  
  const repository = new PostgresContentRepository();
  const useCase = new GetPageContentBySlug(repository);
  
  const result = await useCase.execute(slug);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch page content',
    });
    return;
  }
  
  const page = result.value;
  
  if (!page) {
    reply.code(404).send({
      error: 'Not Found',
      message: `Page with slug '${slug}' not found`,
    });
    return;
  }
  
  reply.code(200).send(toPageContentResponse(page));
}
