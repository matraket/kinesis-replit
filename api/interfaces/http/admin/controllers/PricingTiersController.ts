import { FastifyReply, FastifyRequest } from 'fastify';
import { IPricingTierRepository } from '../../../../application/ports/IPricingTierRepository.js';
import {
  CreatePricingTierUseCase,
  UpdatePricingTierUseCase,
  DeletePricingTierUseCase,
  ListPricingTiersUseCase,
  GetPricingTierByIdUseCase,
} from '../../../../application/use-cases/pricing-tiers/index.js';
import {
  createPricingTierSchema,
  updatePricingTierSchema,
  listPricingTiersQuerySchema,
} from '../schemas/index.js';

export class PricingTiersController {
  constructor(private pricingTierRepository: IPricingTierRepository) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listPricingTiersQuerySchema.parse(request.query);
      const useCase = new ListPricingTiersUseCase(this.pricingTierRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value.pricingTiers,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const useCase = new GetPricingTierByIdUseCase(this.pricingTierRepository);
      const result = await useCase.execute(id);

      if (!result.ok) {
        return reply.status(404).send({ error: result.error.message });
      }

      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const input = createPricingTierSchema.parse(request.body);
      const useCase = new CreatePricingTierUseCase(this.pricingTierRepository);
      const result = await useCase.execute(input);

      if (!result.ok) {
        return reply.status(400).send({ error: result.error.message });
      }

      return reply.status(201).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const input = updatePricingTierSchema.parse(request.body);
      const useCase = new UpdatePricingTierUseCase(this.pricingTierRepository);
      const result = await useCase.execute(id, input);

      if (!result.ok) {
        return reply.status(400).send({ error: result.error.message });
      }

      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const useCase = new DeletePricingTierUseCase(this.pricingTierRepository);
      const result = await useCase.execute(id);

      if (!result.ok) {
        return reply.status(400).send({ error: result.error.message });
      }

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}
