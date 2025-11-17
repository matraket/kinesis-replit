import { FastifyRequest, FastifyReply } from 'fastify';
import { ListInstructorsForPublicSite } from '../../../../application/use-cases/public/ListInstructorsForPublicSite.js';
import { GetInstructorBySlug } from '../../../../application/use-cases/public/GetInstructorBySlug.js';
import { PostgresInstructorRepository } from '../../../../infrastructure/db/PostgresInstructorRepository.js';
import { Instructor } from '../../../../domain/instructors/index.js';
import { InstructorResponse, InstructorListResponse, InstructorQuerySchema } from '../schemas/instructor.schemas.js';

function toInstructorResponse(instructor: Instructor): InstructorResponse {
  return {
    id: instructor.id,
    firstName: instructor.firstName,
    lastName: instructor.lastName,
    displayName: instructor.displayName,
    role: instructor.role,
    tagline: instructor.tagline,
    bioSummary: instructor.bioSummary,
    bioFull: instructor.bioFull,
    achievements: instructor.achievements,
    education: instructor.education,
    profileImageUrl: instructor.profileImageUrl,
    heroImageUrl: instructor.heroImageUrl,
    videoUrl: instructor.videoUrl,
    seniorityLevel: instructor.seniorityLevel,
    slug: instructor.slug,
    metaTitle: instructor.metaTitle,
    metaDescription: instructor.metaDescription,
  };
}

export async function listInstructors(
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply
): Promise<void> {
  const queryValidation = InstructorQuerySchema.safeParse(request.query);
  
  if (!queryValidation.success) {
    reply.code(400).send({
      error: 'Bad Request',
      message: 'Invalid query parameters',
      details: queryValidation.error.format(),
    });
    return;
  }
  
  const filters = queryValidation.data;
  
  const repository = new PostgresInstructorRepository();
  const useCase = new ListInstructorsForPublicSite(repository);
  
  const result = await useCase.execute(filters);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch instructors',
    });
    return;
  }
  
  const { instructors, total, page, limit } = result.value;
  const pages = Math.ceil(total / limit);
  
  const response: InstructorListResponse = {
    data: instructors.map(toInstructorResponse),
    total,
    page,
    limit,
    pages,
  };
  
  reply.code(200).send(response);
}

export async function getInstructorBySlug(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { slug } = request.params;
  
  const repository = new PostgresInstructorRepository();
  const useCase = new GetInstructorBySlug(repository);
  
  const result = await useCase.execute(slug);
  
  if (!result.ok) {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Failed to fetch instructor',
    });
    return;
  }
  
  const instructor = result.value;
  
  if (!instructor) {
    reply.code(404).send({
      error: 'Not Found',
      message: `Instructor with slug '${slug}' not found`,
    });
    return;
  }
  
  reply.code(200).send(toInstructorResponse(instructor));
}
