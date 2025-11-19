import { FastifyRequest, FastifyReply } from 'fastify';
import { PostgresLeadsRepository } from '../../../../infrastructure/db/PostgresLeadsRepository.js';
import { 
  listLeadsQuerySchema,
  updateLeadStatusSchema,
  updateLeadNotesSchema,
  type UpdateLeadStatusDTO,
  type UpdateLeadNotesDTO
} from '../schemas/leadSchemas.js';

export class LeadsController {
  private repository = new PostgresLeadsRepository();

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listLeadsQuerySchema.parse(request.query);
      const result = await this.repository.listWithFilters(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      const { leads, total } = result.value;
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const pages = Math.ceil(total / limit);

      return reply.status(200).send({
        data: leads,
        total,
        page,
        limit,
        pages,
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
      const result = await this.repository.getLeadById(id);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      if (!result.value) {
        return reply.status(404).send({ error: 'Lead not found' });
      }

      return reply.status(200).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async updateStatus(request: FastifyRequest<{ Params: { id: string }; Body: UpdateLeadStatusDTO }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const input = updateLeadStatusSchema.parse(request.body);
      const result = await this.repository.updateStatus(id, input);

      if (!result.ok) {
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

  async updateNotes(request: FastifyRequest<{ Params: { id: string }; Body: UpdateLeadNotesDTO }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const input = updateLeadNotesSchema.parse(request.body);
      const result = await this.repository.updateNotes(id, input.notes);

      if (!result.ok) {
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
}
