import { FastifyInstance } from 'fastify';
import { listFAQs } from '../controllers/faqs.controller.js';

export async function faqsRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listFAQs);
}
