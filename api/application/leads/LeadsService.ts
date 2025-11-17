import type { Lead, CreateLeadInput } from '../../domain/leads/index.js';
import type { LeadsRepository } from '../ports/index.js';
import type { Result } from '../../../shared/types/index.js';

export class LeadsService {
  constructor(private readonly leadsRepo: LeadsRepository) {}

  async createLead(input: CreateLeadInput): Promise<Result<Lead, Error>> {
    if (!input.firstName || input.firstName.trim() === '') {
      return {
        ok: false,
        error: new Error('First name is required'),
      };
    }
    if (!input.lastName || input.lastName.trim() === '') {
      return {
        ok: false,
        error: new Error('Last name is required'),
      };
    }
    if (!input.email || input.email.trim() === '') {
      return {
        ok: false,
        error: new Error('Email is required'),
      };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      return {
        ok: false,
        error: new Error('Invalid email format'),
      };
    }

    return this.leadsRepo.createLead(input);
  }

  async listRecentLeads(limit: number = 50): Promise<Result<Lead[], Error>> {
    if (limit < 1 || limit > 1000) {
      return {
        ok: false,
        error: new Error('Limit must be between 1 and 1000'),
      };
    }
    return this.leadsRepo.listRecentLeads(limit);
  }

  async getLeadsByEmail(email: string): Promise<Result<Lead[], Error>> {
    if (!email || email.trim() === '') {
      return {
        ok: false,
        error: new Error('Email is required'),
      };
    }
    return this.leadsRepo.getLeadsByEmail(email);
  }
}
