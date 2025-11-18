import { FastifyRequest, FastifyReply } from 'fastify';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-in-production';

export async function adminAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers['x-admin-secret'];

  if (!authHeader || authHeader !== ADMIN_SECRET) {
    return reply.status(401).send({ 
      error: 'Unauthorized - Invalid or missing X-Admin-Secret header' 
    });
  }
}
