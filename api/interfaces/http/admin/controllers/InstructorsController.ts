import { FastifyReply, FastifyRequest } from 'fastify';
import { IInstructorRepository } from '../../../../application/ports/IInstructorRepository.js';
import {
  CreateInstructorUseCase,
  UpdateInstructorUseCase,
  DeleteInstructorUseCase,
  ListInstructorsUseCase,
  GetInstructorByIdUseCase,
} from '../../../../application/use-cases/instructors/index.js';
import {
  createInstructorSchema,
  updateInstructorSchema,
  listInstructorsQuerySchema,
} from '../schemas/index.js';

export class InstructorsController {
  constructor(private instructorRepository: IInstructorRepository) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listInstructorsQuerySchema.parse(request.query);
      const useCase = new ListInstructorsUseCase(this.instructorRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');

      return reply.status(200).send({
        data: result.value.instructors,
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
      const useCase = new GetInstructorByIdUseCase(this.instructorRepository);
      const result = await useCase.execute(id);

      if (!result.ok) {
        return reply.status(404).send({ error: result.error.message });
      }

      reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      reply.header('Pragma', 'no-cache');
      reply.header('Expires', '0');

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
      const input = createInstructorSchema.parse(request.body);
      const useCase = new CreateInstructorUseCase(this.instructorRepository);
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
      const input = updateInstructorSchema.parse(request.body);
      const useCase = new UpdateInstructorUseCase(this.instructorRepository);
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
      const useCase = new DeleteInstructorUseCase(this.instructorRepository);
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
