import { FastifyInstance } from 'fastify';
import { listPrograms, getProgramBySlug } from '../controllers/programs.controller.js';

export async function programsRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listPrograms);
  server.get('/:slug', getProgramBySlug);
}
