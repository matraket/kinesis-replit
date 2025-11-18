import { FastifyReply, FastifyRequest } from 'fastify';
import { IBusinessModelRepository } from '../../../../application/ports/IBusinessModelRepository.js';
import {
  CreateBusinessModelUseCase,
  UpdateBusinessModelUseCase,
  DeleteBusinessModelUseCase,
  ListBusinessModelsForAdminUseCase,
  GetBusinessModelByIdUseCase,
} from '../../../../application/use-cases/business-models/index.js';
import {
  createBusinessModelSchema,
  updateBusinessModelSchema,
  listBusinessModelsQuerySchema,
} from '../schemas/index.js';

export class BusinessModelsController {
  constructor(private businessModelRepository: IBusinessModelRepository) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listBusinessModelsQuerySchema.parse(request.query);
      const useCase = new ListBusinessModelsForAdminUseCase(this.businessModelRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value.businessModels,
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
      const useCase = new GetBusinessModelByIdUseCase(this.businessModelRepository);
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
      const input = createBusinessModelSchema.parse(request.body);
      const useCase = new CreateBusinessModelUseCase(this.businessModelRepository);
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
      const input = updateBusinessModelSchema.parse(request.body);
      const useCase = new UpdateBusinessModelUseCase(this.businessModelRepository);
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
      const useCase = new DeleteBusinessModelUseCase(this.businessModelRepository);
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
