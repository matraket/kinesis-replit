import { describe, it, expect } from 'vitest';
import { createLead, type CreateLeadInput } from '../Lead.js';

describe('Lead Domain Entity', () => {
  describe('createLead', () => {
    it('should create a contact lead with required fields', () => {
      const input: CreateLeadInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        leadType: 'contact',
        message: 'I want to learn salsa',
      };

      const lead = createLead('lead-123', input);

      expect(lead.id).toBe('lead-123');
      expect(lead.firstName).toBe('John');
      expect(lead.lastName).toBe('Doe');
      expect(lead.email).toBe('john.doe@example.com');
      expect(lead.leadType).toBe('contact');
      expect(lead.leadStatus).toBe('new');
      expect(lead.message).toBe('I want to learn salsa');
      expect(lead.acceptsMarketing).toBe(false);
      expect(lead.acceptsTerms).toBe(true);
      expect(lead.createdAt).toBeInstanceOf(Date);
      expect(lead.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a pre-enrollment lead with student information', () => {
      const input: CreateLeadInput = {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@example.com',
        phone: '+1234567890',
        leadType: 'pre_enrollment',
        studentName: 'Sofia Garcia',
        studentAge: 8,
        previousExperience: 'None, complete beginner',
        interestedInPrograms: ['ballet', 'contemporary'],
        preferredSchedule: 'Weekday afternoons',
        acceptsMarketing: true,
      };

      const lead = createLead('lead-456', input);

      expect(lead.leadType).toBe('pre_enrollment');
      expect(lead.studentName).toBe('Sofia Garcia');
      expect(lead.studentAge).toBe(8);
      expect(lead.previousExperience).toBe('None, complete beginner');
      expect(lead.interestedInPrograms).toEqual(['ballet', 'contemporary']);
      expect(lead.preferredSchedule).toBe('Weekday afternoons');
      expect(lead.phone).toBe('+1234567890');
      expect(lead.acceptsMarketing).toBe(true);
    });

    it('should create an elite booking lead with date and time', () => {
      const bookingDate = new Date('2025-12-01');
      const input: CreateLeadInput = {
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        email: 'carlos@example.com',
        leadType: 'elite_booking',
        preferredDate: bookingDate,
        preferredTime: '18:00',
        sessionType: 'individual',
        message: 'I want private lessons for competition preparation',
      };

      const lead = createLead('lead-789', input);

      expect(lead.leadType).toBe('elite_booking');
      expect(lead.preferredDate).toEqual(bookingDate);
      expect(lead.preferredTime).toBe('18:00');
      expect(lead.sessionType).toBe('individual');
      expect(lead.message).toBe('I want private lessons for competition preparation');
    });

    it('should capture UTM tracking parameters', () => {
      const input: CreateLeadInput = {
        firstName: 'Ana',
        lastName: 'Martinez',
        email: 'ana@example.com',
        leadType: 'newsletter',
        utmSource: 'facebook',
        utmMedium: 'social',
        utmCampaign: 'summer_2025',
        utmTerm: 'dance_classes',
        utmContent: 'ad_variation_a',
      };

      const lead = createLead('lead-utm', input);

      expect(lead.utmSource).toBe('facebook');
      expect(lead.utmMedium).toBe('social');
      expect(lead.utmCampaign).toBe('summer_2025');
      expect(lead.utmTerm).toBe('dance_classes');
      expect(lead.utmContent).toBe('ad_variation_a');
    });

    it('should capture source, campaign, and technical data', () => {
      const input: CreateLeadInput = {
        firstName: 'Luis',
        lastName: 'Fernandez',
        email: 'luis@example.com',
        leadType: 'contact',
        source: 'web',
        campaign: 'holiday_promo',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      };

      const lead = createLead('lead-tech', input);

      expect(lead.source).toBe('web');
      expect(lead.campaign).toBe('holiday_promo');
      expect(lead.ipAddress).toBe('192.168.1.100');
      expect(lead.userAgent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    });

    it('should handle all lead types correctly', () => {
      const types: Array<'contact' | 'pre_enrollment' | 'elite_booking' | 'newsletter'> = 
        ['contact', 'pre_enrollment', 'elite_booking', 'newsletter'];

      types.forEach((type) => {
        const input: CreateLeadInput = {
          firstName: 'Test',
          lastName: 'User',
          email: `test.${type}@example.com`,
          leadType: type,
        };

        const lead = createLead(`lead-${type}`, input);
        expect(lead.leadType).toBe(type);
        expect(lead.leadStatus).toBe('new');
      });
    });

    it('should set acceptsTerms to true by default', () => {
      const input: CreateLeadInput = {
        firstName: 'Default',
        lastName: 'Terms',
        email: 'terms@example.com',
        leadType: 'contact',
      };

      const lead = createLead('lead-terms-default', input);

      expect(lead.acceptsTerms).toBe(true);
    });

    it('should set acceptsMarketing to false by default', () => {
      const input: CreateLeadInput = {
        firstName: 'Default',
        lastName: 'Marketing',
        email: 'marketing@example.com',
        leadType: 'contact',
      };

      const lead = createLead('lead-marketing-default', input);

      expect(lead.acceptsMarketing).toBe(false);
    });

    it('should respect explicit acceptsMarketing and acceptsTerms values', () => {
      const input: CreateLeadInput = {
        firstName: 'Explicit',
        lastName: 'Consent',
        email: 'consent@example.com',
        leadType: 'contact',
        acceptsMarketing: true,
        acceptsTerms: false,
      };

      const lead = createLead('lead-explicit', input);

      expect(lead.acceptsMarketing).toBe(true);
      expect(lead.acceptsTerms).toBe(false);
    });

    it('should initialize contact-related fields as undefined', () => {
      const input: CreateLeadInput = {
        firstName: 'New',
        lastName: 'Lead',
        email: 'new@example.com',
        leadType: 'contact',
      };

      const lead = createLead('lead-new', input);

      expect(lead.contactedAt).toBeUndefined();
      expect(lead.contactedBy).toBeUndefined();
      expect(lead.conversionDate).toBeUndefined();
      expect(lead.notes).toBeUndefined();
    });
  });
});
