import { FastifyRequest, FastifyReply } from 'fastify';
import { ListProgramsForPublicSite } from '../../../../application/use-cases/public/ListProgramsForPublicSite.js';
import { GetProgramBySlug } from '../../../../application/use-cases/public/GetProgramBySlug.js';
import { PostgresProgramsRepository } from '../../../../infrastructure/db/PostgresProgramsRepository.js';
import { Program } from '../../../../domain/programs/index.js';
import { ProgramResponse, ProgramListResponse, ProgramQuerySchema } from '../schemas/program.schemas.js';

function toProgramResponse(program: Program): ProgramResponse {
  return {
    id: program.id,
    code: program.code,
    name: program.name,
    subtitle: program.subtitle,
    descriptionShort: program.descriptionShort,
    descriptionFull: program.descriptionFull,
    businessModelId: program.businessModelId,
    specialtyId: program.specialtyId,
    durationMinutes: program.durationMinutes,
    sessionsPerWeek: program.sessionsPerWeek,
    minStudents: program.minStudents,
    maxStudents: program.maxStudents,
    minAge: program.minAge,
    maxAge: program.maxAge,
    difficultyLevel: program.difficultyLevel,
    pricePerSession: program.pricePerSession,
    priceMonthly: program.priceMonthly,
    priceQuarterly: program.priceQuarterly,
    scheduleDescription: program.scheduleDescription,
    featuredImageUrl: program.featuredImageUrl,
    displayOrder: program.displayOrder,
    slug: program.slug,
    metaTitle: program.metaTitle,
    metaDescription: program.metaDescription,
  };
}

export async function listPrograms(
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply
): Promise<void> {
  const queryValidation = ProgramQuerySchema.safeParse(request.query);
  
  if (!queryValidation.success) {
    reply.code(400).send({
      error: 'Bad Request',
      message: 'Invalid query parameters',
      details: queryValidation.error.format(),
    });
    return;
  }
  
  const filters = queryValidation.data;
  
  const repository = new PostgresProgramsRepository();
  const useCase = new ListProgramsForPublicSite(repository);
  
  const result = await useCase.execute(filters);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch programs',
    });
    return;
  }
  
  const { programs, total, page, limit } = result.value;
  const pages = Math.ceil(total / limit);
  
  const response: ProgramListResponse = {
    data: programs.map(toProgramResponse),
    total,
    page,
    limit,
    pages,
  };
  
  reply.code(200).send(response);
}

export async function getProgramBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { slug } = request.params;
  
  const repository = new PostgresProgramsRepository();
  const useCase = new GetProgramBySlug(repository);
  
  const result = await useCase.execute(slug);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch program',
    });
    return;
  }
  
  const program = result.value;
  
  if (!program) {
    reply.code(404).send({
      error: 'Not Found',
      message: `Program with slug '${slug}' not found`,
    });
    return;
  }
  
  reply.code(200).send(toProgramResponse(program));
}
