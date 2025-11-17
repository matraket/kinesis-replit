import { FastifyRequest, FastifyReply } from 'fastify';
import { ListFAQsForPublicSite } from '../../../../application/use-cases/public/ListFAQsForPublicSite.js';
import { PostgresFAQRepository } from '../../../../infrastructure/db/PostgresFAQRepository.js';
import { FAQ } from '../../../../domain/faqs/index.js';
import { FAQResponse, FAQListResponse, FAQQuerySchema } from '../schemas/faq.schemas.js';

function toFAQResponse(faq: FAQ): FAQResponse {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    tags: faq.tags,
    displayOrder: faq.displayOrder,
    isFeatured: faq.isFeatured,
  };
}

export async function listFAQs(
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply
): Promise<void> {
  const queryValidation = FAQQuerySchema.safeParse(request.query);
  
  if (!queryValidation.success) {
    reply.code(400).send({
      error: 'Bad Request',
      message: 'Invalid query parameters',
      details: queryValidation.error.format(),
    });
    return;
  }
  
  const filters = queryValidation.data;
  
  const repository = new PostgresFAQRepository();
  const useCase = new ListFAQsForPublicSite(repository);
  
  const result = await useCase.execute(filters);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch FAQs',
    });
    return;
  }
  
  const { faqs, total, page, limit } = result.value;
  const pages = Math.ceil(total / limit);
  
  const response: FAQListResponse = {
    data: faqs.map(toFAQResponse),
    total,
    page,
    limit,
    pages,
  };
  
  reply.code(200).send(response);
}
