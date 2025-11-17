import { FastifyRequest, FastifyReply } from 'fastify';
import { ListBusinessModelsForPublicSite } from '../../../../application/use-cases/public/ListBusinessModelsForPublicSite.js';
import { GetBusinessModelBySlug } from '../../../../application/use-cases/public/GetBusinessModelBySlug.js';
import { PostgresBusinessModelRepository } from '../../../../infrastructure/db/PostgresBusinessModelRepository.js';
import { BusinessModel } from '../../../../domain/business-models/index.js';
import { BusinessModelResponse, BusinessModelListResponse } from '../schemas/business-model.schemas.js';

function toBusinessModelResponse(model: BusinessModel): BusinessModelResponse {
  return {
    id: model.id,
    internalCode: model.internalCode,
    name: model.name,
    subtitle: model.subtitle,
    description: model.description,
    scheduleInfo: model.scheduleInfo,
    targetAudience: model.targetAudience,
    format: model.format,
    featureTitle: model.featureTitle,
    featureContent: model.featureContent,
    advantageTitle: model.advantageTitle,
    advantageContent: model.advantageContent,
    benefitTitle: model.benefitTitle,
    benefitContent: model.benefitContent,
    displayOrder: model.displayOrder,
    metaTitle: model.metaTitle,
    metaDescription: model.metaDescription,
    slug: model.slug,
  };
}

export async function listBusinessModels(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const repository = new PostgresBusinessModelRepository();
  const useCase = new ListBusinessModelsForPublicSite(repository);
  
  const result = await useCase.execute();
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch business models',
    });
    return;
  }
  
  const models = result.value;
  const response: BusinessModelListResponse = {
    data: models.map(toBusinessModelResponse),
    count: models.length,
  };
  
  reply.code(200).send(response);
}

export async function getBusinessModelBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { slug } = request.params;
  
  const repository = new PostgresBusinessModelRepository();
  const useCase = new GetBusinessModelBySlug(repository);
  
  const result = await useCase.execute(slug);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch business model',
    });
    return;
  }
  
  const model = result.value;
  
  if (!model) {
    reply.code(404).send({
      error: 'Not Found',
      message: `Business model with slug '${slug}' not found`,
    });
    return;
  }
  
  reply.code(200).send(toBusinessModelResponse(model));
}
