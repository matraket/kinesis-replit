import { FastifyInstance } from 'fastify';
import { getPageContentBySlug } from '../controllers/pages.controller.js';

export async function pagesRoutes(server: FastifyInstance): Promise<void> {
  server.get('/:slug', getPageContentBySlug);
}
