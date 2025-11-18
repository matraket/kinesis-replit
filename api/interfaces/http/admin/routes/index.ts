import { FastifyInstance } from 'fastify';
import { PostgresSpecialtyRepository } from '../../../../infrastructure/db/PostgresSpecialtyRepository.js';
import { PostgresInstructorRepository } from '../../../../infrastructure/db/PostgresInstructorRepository.js';
import { PostgresProgramsRepository } from '../../../../infrastructure/db/PostgresProgramsRepository.js';
import { PostgresPricingTierRepository } from '../../../../infrastructure/db/PostgresPricingTierRepository.js';
import {
  SpecialtiesController,
  InstructorsController,
  ProgramsController,
  PricingTiersController,
} from '../controllers/index.js';
import { registerSpecialtiesRoutes } from './specialtiesRoutes.js';
import { registerInstructorsRoutes } from './instructorsRoutes.js';
import { registerProgramsRoutes } from './programsRoutes.js';
import { registerPricingTiersRoutes } from './pricingTiersRoutes.js';

export async function registerAdminRoutes(fastify: FastifyInstance) {
  const specialtyRepository = new PostgresSpecialtyRepository();
  const instructorRepository = new PostgresInstructorRepository();
  const programsRepository = new PostgresProgramsRepository();
  const pricingTierRepository = new PostgresPricingTierRepository();

  const specialtiesController = new SpecialtiesController(specialtyRepository);
  const instructorsController = new InstructorsController(instructorRepository);
  const programsController = new ProgramsController(programsRepository);
  const pricingTiersController = new PricingTiersController(pricingTierRepository);

  await registerSpecialtiesRoutes(fastify, specialtiesController);
  await registerInstructorsRoutes(fastify, instructorsController);
  await registerProgramsRoutes(fastify, programsController);
  await registerPricingTiersRoutes(fastify, pricingTiersController);
}
