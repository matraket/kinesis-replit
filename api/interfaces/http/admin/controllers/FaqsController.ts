import { FastifyReply, FastifyRequest } from 'fastify';
import { IFAQRepository } from '../../../../application/ports/IFAQRepository.js';
import {
  CreateFaqUseCase,
  UpdateFaqUseCase,
  DeleteFaqUseCase,
  ListFaqsForAdminUseCase,
  GetFaqByIdUseCase,
} from '../../../../application/use-cases/faqs/index.js';
import {
  createFaqSchema,
  updateFaqSchema,
  listFaqsQuerySchema,
} from '../schemas/index.js';

export class FaqsController {
  constructor(private faqRepository: IFAQRepository) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listFaqsQuerySchema.parse(request.query);
      const useCase = new ListFaqsForAdminUseCase(this.faqRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value.faqs,
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
      const useCase = new GetFaqByIdUseCase(this.faqRepository);
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
      const input = createFaqSchema.parse(request.body);
      const useCase = new CreateFaqUseCase(this.faqRepository);
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
      const input = updateFaqSchema.parse(request.body);
      const useCase = new UpdateFaqUseCase(this.faqRepository);
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
      const useCase = new DeleteFaqUseCase(this.faqRepository);
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
