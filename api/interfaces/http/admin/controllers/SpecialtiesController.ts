import { FastifyReply, FastifyRequest } from 'fastify';
import { ISpecialtyRepository } from '../../../../application/ports/ISpecialtyRepository.js';
import {
  CreateSpecialtyUseCase,
  UpdateSpecialtyUseCase,
  DeleteSpecialtyUseCase,
  ListSpecialtiesUseCase,
  GetSpecialtyByIdUseCase,
} from '../../../../application/use-cases/specialties/index.js';
import {
  createSpecialtySchema,
  updateSpecialtySchema,
  listSpecialtiesQuerySchema,
} from '../schemas/index.js';

export class SpecialtiesController {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listSpecialtiesQuerySchema.parse(request.query);
      const useCase = new ListSpecialtiesUseCase(this.specialtyRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value.specialties,
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
      const useCase = new GetSpecialtyByIdUseCase(this.specialtyRepository);
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
      const input = createSpecialtySchema.parse(request.body);
      const useCase = new CreateSpecialtyUseCase(this.specialtyRepository);
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
      const input = updateSpecialtySchema.parse(request.body);
      const useCase = new UpdateSpecialtyUseCase(this.specialtyRepository);
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
      const useCase = new DeleteSpecialtyUseCase(this.specialtyRepository);
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
