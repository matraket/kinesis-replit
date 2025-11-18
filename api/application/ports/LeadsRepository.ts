import type { Lead, CreateLeadInput, LeadType, LeadStatus } from '../../domain/leads/index.js';
import type { Result } from '../../../shared/types/index.js';

export interface LeadFilters {
  leadType?: LeadType;
  status?: LeadStatus;
  from?: Date;
  to?: Date;
  source?: string;
  campaign?: string;
  page?: number;
  limit?: number;
}

export interface UpdateLeadStatusInput {
  leadStatus: LeadStatus;
  notes?: string;
  contactedBy?: string;
}

export interface LeadsRepository {
  createLead(input: CreateLeadInput): Promise<Result<Lead, Error>>;
  
  listRecentLeads(limit?: number): Promise<Result<Lead[], Error>>;
  
  getLeadById(id: string): Promise<Result<Lead | null, Error>>;
  
  getLeadsByEmail(email: string): Promise<Result<Lead[], Error>>;
  
  listWithFilters(filters: LeadFilters): Promise<Result<{ leads: Lead[]; total: number }, Error>>;
  
  updateStatus(id: string, input: UpdateLeadStatusInput): Promise<Result<Lead, Error>>;
  
  updateNotes(id: string, notes: string): Promise<Result<Lead, Error>>;
}
