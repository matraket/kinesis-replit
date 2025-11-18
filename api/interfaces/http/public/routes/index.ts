import { FastifyInstance } from 'fastify';
import { businessModelsRoutes } from './business-models.routes.js';
import { programsRoutes } from './programs.routes.js';
import { instructorsRoutes } from './instructors.routes.js';
import { pricingTiersRoutes } from './pricing-tiers.routes.js';
import { pagesRoutes } from './pages.routes.js';
import { faqsRoutes } from './faqs.routes.js';
import { legalPagesRoutes } from './legal-pages.routes.js';
import { leadsRoutes } from './leads.routes.js';

export async function publicRoutes(server: FastifyInstance): Promise<void> {
  server.register(businessModelsRoutes, { prefix: '/business-models' });
  server.register(programsRoutes, { prefix: '/programs' });
  server.register(instructorsRoutes, { prefix: '/instructors' });
  server.register(pricingTiersRoutes, { prefix: '/pricing-tiers' });
  server.register(pagesRoutes, { prefix: '/pages' });
  server.register(faqsRoutes, { prefix: '/faqs' });
  server.register(legalPagesRoutes, { prefix: '/legal-pages' });
  server.register(leadsRoutes, { prefix: '/leads' });
}
