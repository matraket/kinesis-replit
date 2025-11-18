import { FastifyRequest, FastifyReply } from 'fastify';
import { PostgresLeadsRepository } from '../../../../infrastructure/db/PostgresLeadsRepository.js';
import { 
  contactLeadSchema,
  preEnrollmentLeadSchema,
  eliteBookingLeadSchema,
  weddingLeadSchema,
  type ContactLeadDTO,
  type PreEnrollmentLeadDTO,
  type EliteBookingLeadDTO,
  type WeddingLeadDTO
} from '../schemas/leads.schemas.js';
import type { CreateLeadInput } from '../../../../domain/leads/index.js';

export class LeadsController {
  private repository = new PostgresLeadsRepository();

  private getClientInfo(request: FastifyRequest) {
    return {
      ipAddress: request.ip || undefined,
      userAgent: request.headers['user-agent'] || undefined,
    };
  }

  async submitContact(request: FastifyRequest<{ Body: ContactLeadDTO }>, reply: FastifyReply) {
    try {
      const input = contactLeadSchema.parse(request.body);
      const clientInfo = this.getClientInfo(request);

      const leadInput: CreateLeadInput = {
        ...input,
        ...clientInfo,
        leadType: 'contact',
        source: 'web',
      };

      const result = await this.repository.createLead(leadInput);

      if (result.isErr()) {
        return reply.status(500).send({ error: 'Error creating lead' });
      }

      return reply.status(201).send({
        message: 'Contact form submitted successfully',
        id: result.value.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async submitPreEnrollment(request: FastifyRequest<{ Body: PreEnrollmentLeadDTO }>, reply: FastifyReply) {
    try {
      const input = preEnrollmentLeadSchema.parse(request.body);
      const clientInfo = this.getClientInfo(request);

      const leadInput: CreateLeadInput = {
        ...input,
        ...clientInfo,
        leadType: 'pre_enrollment',
        source: 'web',
      };

      const result = await this.repository.createLead(leadInput);

      if (result.isErr()) {
        return reply.status(500).send({ error: 'Error creating lead' });
      }

      return reply.status(201).send({
        message: 'Pre-enrollment form submitted successfully',
        id: result.value.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async submitEliteBooking(request: FastifyRequest<{ Body: EliteBookingLeadDTO }>, reply: FastifyReply) {
    try {
      const input = eliteBookingLeadSchema.parse(request.body);
      const clientInfo = this.getClientInfo(request);

      const leadInput: CreateLeadInput = {
        ...input,
        ...clientInfo,
        leadType: 'elite_booking',
        source: 'web',
      };

      const result = await this.repository.createLead(leadInput);

      if (result.isErr()) {
        return reply.status(500).send({ error: 'Error creating lead' });
      }

      return reply.status(201).send({
        message: 'Elite booking request submitted successfully',
        id: result.value.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }

  async submitWedding(request: FastifyRequest<{ Body: WeddingLeadDTO }>, reply: FastifyReply) {
    try {
      const input = weddingLeadSchema.parse(request.body);
      const clientInfo = this.getClientInfo(request);

      const interestedInPrograms = input.interestedInPrograms || [];
      if (!interestedInPrograms.includes('wedding-choreography')) {
        interestedInPrograms.push('wedding-choreography');
      }

      const leadInput: CreateLeadInput = {
        ...input,
        ...clientInfo,
        interestedInPrograms,
        sessionType: 'couple',
        leadType: 'elite_booking',
        source: 'web',
      };

      const result = await this.repository.createLead(leadInput);

      if (result.isErr()) {
        return reply.status(500).send({ error: 'Error creating lead' });
      }

      return reply.status(201).send({
        message: 'Wedding choreography request submitted successfully',
        id: result.value.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Unknown error' });
    }
  }
}
