import { FastifyRequest, FastifyReply } from 'fastify';
import { PostgresMediaLibraryRepository } from '../../../../infrastructure/db/PostgresMediaLibraryRepository.js';
import { ListMediaUseCase } from '../../../../application/media/ListMediaUseCase.js';
import { GetMediaByIdUseCase } from '../../../../application/media/GetMediaByIdUseCase.js';
import { UploadMediaUseCase } from '../../../../application/media/UploadMediaUseCase.js';
import { DeleteMediaUseCase } from '../../../../application/media/DeleteMediaUseCase.js';
import { listMediaQuerySchema, uploadMediaSchema } from '../schemas/mediaSchemas.js';

export class MediaController {
  private mediaRepository: PostgresMediaLibraryRepository;

  constructor() {
    this.mediaRepository = new PostgresMediaLibraryRepository();
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = listMediaQuerySchema.parse(request.query);
      const useCase = new ListMediaUseCase(this.mediaRepository);
      const result = await useCase.execute(filters);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      return reply.status(200).send({
        data: result.value.media,
        total: result.value.total,
        page: filters.page ?? 1,
        limit: filters.limit ?? 50,
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
      const useCase = new GetMediaByIdUseCase(this.mediaRepository);
      const result = await useCase.execute(id);

      if (!result.ok) {
        return reply.status(500).send({ error: result.error.message });
      }

      if (!result.value) {
        return reply.status(404).send({ error: 'Media not found' });
      }

      return reply.status(200).send({ data: result.value });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  async upload(request: FastifyRequest, reply: FastifyReply) {
    try {
      // TODO: Implement multipart file upload with @fastify/multipart
      // This would require:
      // 1. Install @fastify/multipart package
      // 2. Configure multipart in server.ts
      // 3. Handle file upload to Replit App Storage
      // 4. Get public URL from App Storage
      
      // For now, return a placeholder implementation
      // The frontend can still be built and tested with mock data
      
      return reply.status(501).send({ 
        error: 'File upload endpoint not yet implemented',
        message: 'TODO: Integrate with Replit App Storage for file uploads'
      });
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
      const useCase = new DeleteMediaUseCase(this.mediaRepository);
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
