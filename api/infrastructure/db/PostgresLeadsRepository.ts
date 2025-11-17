import type { Lead, CreateLeadInput, LeadType, LeadStatus } from '../../domain/leads/index.js';
import type { LeadsRepository } from '../../application/ports/index.js';
import type { Result } from '../../../shared/types/index.js';
import { Ok, Err } from '../../../shared/types/index.js';
import { createLead } from '../../domain/leads/index.js';
import { getDbPool } from './client.js';
import { randomUUID } from 'crypto';

export class PostgresLeadsRepository implements LeadsRepository {
  async createLead(input: CreateLeadInput): Promise<Result<Lead, Error>> {
    try {
      const pool = getDbPool();
      const id = randomUUID();
      const lead = createLead(id, input);

      await pool.query(
        `INSERT INTO leads (
          id, first_name, last_name, email, phone,
          lead_type, lead_status, source, campaign,
          message, interested_in_programs, preferred_schedule,
          student_name, student_age, previous_experience,
          preferred_date, preferred_time, session_type,
          accepts_marketing, accepts_terms,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          ip_address, user_agent,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18,
          $19, $20,
          $21, $22, $23, $24, $25,
          $26, $27,
          $28, $29
        )`,
        [
          lead.id, lead.firstName, lead.lastName, lead.email, lead.phone,
          lead.leadType, lead.leadStatus, lead.source, lead.campaign,
          lead.message, lead.interestedInPrograms, lead.preferredSchedule,
          lead.studentName, lead.studentAge, lead.previousExperience,
          lead.preferredDate, lead.preferredTime, lead.sessionType,
          lead.acceptsMarketing, lead.acceptsTerms,
          lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm, lead.utmContent,
          lead.ipAddress, lead.userAgent,
          lead.createdAt, lead.updatedAt
        ]
      );

      return Ok(lead);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error creating lead'));
    }
  }

  async listRecentLeads(limit: number = 50): Promise<Result<Lead[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, first_name as "firstName", last_name as "lastName",
          email, phone, lead_type as "leadType", lead_status as "leadStatus",
          source, campaign, message,
          interested_in_programs as "interestedInPrograms",
          preferred_schedule as "preferredSchedule",
          student_name as "studentName", student_age as "studentAge",
          previous_experience as "previousExperience",
          preferred_date as "preferredDate", preferred_time as "preferredTime",
          session_type as "sessionType",
          accepts_marketing as "acceptsMarketing",
          accepts_terms as "acceptsTerms",
          contacted_at as "contactedAt", contacted_by as "contactedBy",
          conversion_date as "conversionDate", notes,
          utm_source as "utmSource", utm_medium as "utmMedium",
          utm_campaign as "utmCampaign", utm_term as "utmTerm",
          utm_content as "utmContent",
          ip_address as "ipAddress", user_agent as "userAgent",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM leads
        ORDER BY created_at DESC
        LIMIT $1`,
        [limit]
      );

      const leads: Lead[] = result.rows.map((row) => ({
        ...row,
        leadType: row.leadType as LeadType,
        leadStatus: row.leadStatus as LeadStatus,
        preferredDate: row.preferredDate ? new Date(row.preferredDate) : undefined,
        contactedAt: row.contactedAt ? new Date(row.contactedAt) : undefined,
        conversionDate: row.conversionDate ? new Date(row.conversionDate) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));

      return Ok(leads);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error listing recent leads'));
    }
  }

  async getLeadById(id: string): Promise<Result<Lead | null, Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, first_name as "firstName", last_name as "lastName",
          email, phone, lead_type as "leadType", lead_status as "leadStatus",
          source, campaign, message,
          interested_in_programs as "interestedInPrograms",
          preferred_schedule as "preferredSchedule",
          student_name as "studentName", student_age as "studentAge",
          previous_experience as "previousExperience",
          preferred_date as "preferredDate", preferred_time as "preferredTime",
          session_type as "sessionType",
          accepts_marketing as "acceptsMarketing",
          accepts_terms as "acceptsTerms",
          contacted_at as "contactedAt", contacted_by as "contactedBy",
          conversion_date as "conversionDate", notes,
          utm_source as "utmSource", utm_medium as "utmMedium",
          utm_campaign as "utmCampaign", utm_term as "utmTerm",
          utm_content as "utmContent",
          ip_address as "ipAddress", user_agent as "userAgent",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM leads
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return Ok(null);
      }

      const row = result.rows[0];
      const lead: Lead = {
        ...row,
        leadType: row.leadType as LeadType,
        leadStatus: row.leadStatus as LeadStatus,
        preferredDate: row.preferredDate ? new Date(row.preferredDate) : undefined,
        contactedAt: row.contactedAt ? new Date(row.contactedAt) : undefined,
        conversionDate: row.conversionDate ? new Date(row.conversionDate) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      return Ok(lead);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting lead by ID'));
    }
  }

  async getLeadsByEmail(email: string): Promise<Result<Lead[], Error>> {
    try {
      const pool = getDbPool();
      const result = await pool.query(
        `SELECT 
          id, first_name as "firstName", last_name as "lastName",
          email, phone, lead_type as "leadType", lead_status as "leadStatus",
          source, campaign, message,
          interested_in_programs as "interestedInPrograms",
          preferred_schedule as "preferredSchedule",
          student_name as "studentName", student_age as "studentAge",
          previous_experience as "previousExperience",
          preferred_date as "preferredDate", preferred_time as "preferredTime",
          session_type as "sessionType",
          accepts_marketing as "acceptsMarketing",
          accepts_terms as "acceptsTerms",
          contacted_at as "contactedAt", contacted_by as "contactedBy",
          conversion_date as "conversionDate", notes,
          utm_source as "utmSource", utm_medium as "utmMedium",
          utm_campaign as "utmCampaign", utm_term as "utmTerm",
          utm_content as "utmContent",
          ip_address as "ipAddress", user_agent as "userAgent",
          created_at as "createdAt", updated_at as "updatedAt"
        FROM leads
        WHERE LOWER(email) = LOWER($1)
        ORDER BY created_at DESC`,
        [email]
      );

      const leads: Lead[] = result.rows.map((row) => ({
        ...row,
        leadType: row.leadType as LeadType,
        leadStatus: row.leadStatus as LeadStatus,
        preferredDate: row.preferredDate ? new Date(row.preferredDate) : undefined,
        contactedAt: row.contactedAt ? new Date(row.contactedAt) : undefined,
        conversionDate: row.conversionDate ? new Date(row.conversionDate) : undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }));

      return Ok(leads);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Unknown error getting leads by email'));
    }
  }
}
