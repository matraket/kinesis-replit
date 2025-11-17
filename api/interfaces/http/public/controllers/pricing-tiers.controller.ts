import { FastifyRequest, FastifyReply } from 'fastify';
import { ListPricingTiersForPublicSite } from '../../../../application/use-cases/public/ListPricingTiersForPublicSite.js';
import { PostgresPricingTierRepository } from '../../../../infrastructure/db/PostgresPricingTierRepository.js';
import { PricingTier } from '../../../../domain/pricing-tiers/index.js';
import { PricingTierResponse, PricingTierListResponse, PricingTierQuerySchema } from '../schemas/pricing-tier.schemas.js';

function toPricingTierResponse(tier: PricingTier): PricingTierResponse {
  return {
    id: tier.id,
    programId: tier.programId,
    name: tier.name,
    description: tier.description,
    price: tier.price,
    originalPrice: tier.originalPrice,
    sessionsIncluded: tier.sessionsIncluded,
    validityDays: tier.validityDays,
    maxStudents: tier.maxStudents,
    conditions: tier.conditions,
    displayOrder: tier.displayOrder,
    isFeatured: tier.isFeatured,
  };
}

export async function listPricingTiers(
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply
): Promise<void> {
  const queryValidation = PricingTierQuerySchema.safeParse(request.query);
  
  if (!queryValidation.success) {
    reply.code(400).send({
      error: 'Bad Request',
      message: 'Invalid query parameters',
      details: queryValidation.error.format(),
    });
    return;
  }
  
  const filters = queryValidation.data;
  
  const repository = new PostgresPricingTierRepository();
  const useCase = new ListPricingTiersForPublicSite(repository);
  
  const result = await useCase.execute(filters);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch pricing tiers',
    });
    return;
  }
  
  const tiers = result.value;
  const response: PricingTierListResponse = {
    data: tiers.map(toPricingTierResponse),
    count: tiers.length,
  };
  
  reply.code(200).send(response);
}
