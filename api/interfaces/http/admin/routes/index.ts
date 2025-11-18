import { FastifyInstance } from 'fastify';
import { PostgresSpecialtyRepository } from '../../../../infrastructure/db/PostgresSpecialtyRepository.js';
import { PostgresInstructorRepository } from '../../../../infrastructure/db/PostgresInstructorRepository.js';
import { PostgresProgramsRepository } from '../../../../infrastructure/db/PostgresProgramsRepository.js';
import { PostgresPricingTierRepository } from '../../../../infrastructure/db/PostgresPricingTierRepository.js';
import { PostgresBusinessModelRepository } from '../../../../infrastructure/db/PostgresBusinessModelRepository.js';
import { PostgresContentRepository } from '../../../../infrastructure/db/PostgresContentRepository.js';
import { PostgresFAQRepository } from '../../../../infrastructure/db/PostgresFAQRepository.js';
import {
  SpecialtiesController,
  InstructorsController,
  ProgramsController,
  PricingTiersController,
  BusinessModelsController,
  PageContentController,
  FaqsController,
} from '../controllers/index.js';
import { registerSpecialtiesRoutes } from './specialtiesRoutes.js';
import { registerInstructorsRoutes } from './instructorsRoutes.js';
import { registerProgramsRoutes } from './programsRoutes.js';
import { registerPricingTiersRoutes } from './pricingTiersRoutes.js';
import { registerBusinessModelsRoutes } from './businessModelsRoutes.js';
import { registerPageContentRoutes } from './pageContentRoutes.js';
import { registerFaqsRoutes } from './faqsRoutes.js';

export async function registerAdminRoutes(fastify: FastifyInstance) {
  const specialtyRepository = new PostgresSpecialtyRepository();
  const instructorRepository = new PostgresInstructorRepository();
  const programsRepository = new PostgresProgramsRepository();
  const pricingTierRepository = new PostgresPricingTierRepository();
  const businessModelRepository = new PostgresBusinessModelRepository();
  const pageContentRepository = new PostgresContentRepository();
  const faqRepository = new PostgresFAQRepository();

  const specialtiesController = new SpecialtiesController(specialtyRepository);
  const instructorsController = new InstructorsController(instructorRepository);
  const programsController = new ProgramsController(programsRepository);
  const pricingTiersController = new PricingTiersController(pricingTierRepository);
  const businessModelsController = new BusinessModelsController(businessModelRepository);
  const pageContentController = new PageContentController(pageContentRepository);
  const faqsController = new FaqsController(faqRepository);

  await registerSpecialtiesRoutes(fastify, specialtiesController);
  await registerInstructorsRoutes(fastify, instructorsController);
  await registerProgramsRoutes(fastify, programsController);
  await registerPricingTiersRoutes(fastify, pricingTiersController);
  await registerBusinessModelsRoutes(fastify, businessModelsController);
  await registerPageContentRoutes(fastify, pageContentController);
  await registerFaqsRoutes(fastify, faqsController);
}
