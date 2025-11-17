import { FastifyInstance } from 'fastify';
import { listInstructors, getInstructorBySlug } from '../controllers/instructors.controller.js';

export async function instructorsRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', listInstructors);
  server.get('/:slug', getInstructorBySlug);
}
