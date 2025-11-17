export type LeadType = 'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  leadType: LeadType;
  leadStatus: LeadStatus;
  source?: string;
  campaign?: string;
  message?: string;
  interestedInPrograms?: string[];
  preferredSchedule?: string;
  studentName?: string;
  studentAge?: number;
  previousExperience?: string;
  preferredDate?: Date;
  preferredTime?: string;
  sessionType?: string;
  acceptsMarketing: boolean;
  acceptsTerms: boolean;
  contactedAt?: Date;
  contactedBy?: string;
  conversionDate?: Date;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  leadType: LeadType;
  message?: string;
  interestedInPrograms?: string[];
  preferredSchedule?: string;
  studentName?: string;
  studentAge?: number;
  previousExperience?: string;
  preferredDate?: Date;
  preferredTime?: string;
  sessionType?: string;
  acceptsMarketing?: boolean;
  acceptsTerms?: boolean;
  source?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function createLead(id: string, input: CreateLeadInput): Lead {
  return {
    id,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    leadType: input.leadType,
    leadStatus: 'new',
    source: input.source,
    campaign: input.campaign,
    message: input.message,
    interestedInPrograms: input.interestedInPrograms,
    preferredSchedule: input.preferredSchedule,
    studentName: input.studentName,
    studentAge: input.studentAge,
    previousExperience: input.previousExperience,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    sessionType: input.sessionType,
    acceptsMarketing: input.acceptsMarketing ?? false,
    acceptsTerms: input.acceptsTerms ?? true,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmTerm: input.utmTerm,
    utmContent: input.utmContent,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
