import { FastifyRequest, FastifyReply } from 'fastify';
import { PostgresLegalPageRepository } from '../../../../infrastructure/db/PostgresLegalPageRepository.js';
import { 
  createLegalPageSchema, 
  updateLegalPageSchema, 
  listLegalPagesQuerySchema,
  type CreateLegalPageDTO,
  type UpdateLegalPageDTO
} from '../schemas/legalPageSchemas.js';

export class LegalPagesController {
  private repository = new PostgresLegalPageRepository();

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = listLegalPagesQuerySchema.parse(request.query);
      const result = await this.repository.list(query.pageType);

      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value,
        count: result.value.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await this.repository.findById(id);

      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      if (!result.value) {
        return reply.status(404).send({ error: 'Legal page not found' });
      }

      return reply.status(200).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async getByType(request: FastifyRequest<{ Params: { pageType: string } }>, reply: FastifyReply) {
    try {
      const { pageType } = request.params;
      const result = await this.repository.findByType(pageType);

      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      if (!result.value) {
        return reply.status(404).send({ error: 'Legal page not found for this type' });
      }

      return reply.status(200).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async create(request: FastifyRequest<{ Body: CreateLegalPageDTO }>, reply: FastifyReply) {
    try {
      const input = createLegalPageSchema.parse(request.body);
      const result = await this.repository.create(input);

      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(201).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateLegalPageDTO }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const input = updateLegalPageSchema.parse(request.body);
      const result = await this.repository.update(id, input);

      if (result.isErr()) {
        if (result.error.message.includes('not found')) {
          return reply.status(404).send({ error: result.error.message });
        }
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const result = await this.repository.delete(id);

      if (result.isErr()) {
        if (result.error.message.includes('not found')) {
          return reply.status(404).send({ error: result.error.message });
        }
        if (result.error.message.includes('Cannot delete')) {
          return reply.status(403).send({ error: result.error.message });
        }
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }
}
