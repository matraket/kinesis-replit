import { FastifyRequest, FastifyReply } from 'fastify';
import { ListLegalPagesForPublicSite } from '../../../../application/use-cases/public/ListLegalPagesForPublicSite.js';
import { GetLegalPageBySlug } from '../../../../application/use-cases/public/GetLegalPageBySlug.js';
import { PostgresLegalPageRepository } from '../../../../infrastructure/db/PostgresLegalPageRepository.js';
import { LegalPage } from '../../../../domain/legal-pages/index.js';
import { LegalPageResponse, LegalPageListResponse } from '../schemas/legal-page.schemas.js';

function toLegalPageResponse(page: LegalPage): LegalPageResponse {
  return {
    id: page.id,
    pageType: page.pageType,
    title: page.title,
    content: page.content,
    version: page.version,
    effectiveDate: page.effectiveDate.toISOString(),
    slug: page.slug,
  };
}

export async function listLegalPages(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const repository = new PostgresLegalPageRepository();
  const useCase = new ListLegalPagesForPublicSite(repository);
  
  const result = await useCase.execute();
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch legal pages',
    });
    return;
  }
  
  const pages = result.value;
  const response: LegalPageListResponse = {
    data: pages.map(toLegalPageResponse),
    count: pages.length,
  };
  
  reply.code(200).send(response);
}

export async function getLegalPageBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { slug } = request.params;
  
  const repository = new PostgresLegalPageRepository();
  const useCase = new GetLegalPageBySlug(repository);
  
  const result = await useCase.execute(slug);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch legal page',
    });
    return;
  }
  
  const page = result.value;
  
  if (!page) {
    reply.code(404).send({
      error: 'Not Found',
      message: `Legal page with slug '${slug}' not found`,
    });
    return;
  }
  
  reply.code(200).send(toLegalPageResponse(page));
}
