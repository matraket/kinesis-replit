import { FastifyRequest, FastifyReply } from 'fastify';
import { PostgresSettingsRepository } from '../../../../infrastructure/db/PostgresSettingsRepository.js';
import { 
  createSettingSchema, 
  updateSettingSchema, 
  listSettingsQuerySchema,
  type CreateSettingDTO,
  type UpdateSettingDTO
} from '../schemas/settingSchemas.js';

export class SettingsController {
  private repository = new PostgresSettingsRepository();

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = listSettingsQuerySchema.parse(request.query);
      const result = await this.repository.list(query.type);

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

  async getByKey(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const result = await this.repository.findByKey(key);

      if (result.isErr()) {
        return reply.status(500).send({ error: result.error.message });
      }

      if (!result.value) {
        return reply.status(404).send({ error: 'Setting not found' });
      }

      return reply.status(200).send(result.value);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async create(request: FastifyRequest<{ Body: CreateSettingDTO }>, reply: FastifyReply) {
    try {
      const input = createSettingSchema.parse(request.body);
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

  async updateByKey(request: FastifyRequest<{ Params: { key: string }; Body: UpdateSettingDTO }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const input = updateSettingSchema.parse(request.body);
      const result = await this.repository.updateByKey(key, input);

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
}
