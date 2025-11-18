import { FastifyInstance } from 'fastify';
import { LeadsController } from '../controllers/leads.controller.js';

export async function leadsRoutes(server: FastifyInstance): Promise<void> {
  const controller = new LeadsController();

  server.post('/contact', {
    handler: controller.submitContact.bind(controller),
  });

  server.post('/pre-enrollment', {
    handler: controller.submitPreEnrollment.bind(controller),
  });

  server.post('/elite-booking', {
    handler: controller.submitEliteBooking.bind(controller),
  });

  server.post('/wedding', {
    handler: controller.submitWedding.bind(controller),
  });
}
