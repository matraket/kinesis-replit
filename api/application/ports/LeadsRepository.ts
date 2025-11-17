import type { Lead, CreateLeadInput } from '../../domain/leads/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface LeadsRepository {
  createLead(input: CreateLeadInput): Promise<Result<Lead, Error>>;
  
  listRecentLeads(limit?: number): Promise<Result<Lead[], Error>>;
  
  getLeadById(id: string): Promise<Result<Lead | null, Error>>;
  
  getLeadsByEmail(email: string): Promise<Result<Lead[], Error>>;
}
