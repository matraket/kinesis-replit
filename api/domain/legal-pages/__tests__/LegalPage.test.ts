import { describe, it, expect } from 'vitest';
import { createLegalPage, updateLegalPage, type CreateLegalPageInput, type UpdateLegalPageInput } from '../LegalPage.js';

describe('LegalPage Domain Entity', () => {
  describe('createLegalPage', () => {
    it('should create a legal page with all required fields', () => {
      const input: CreateLegalPageInput = {
        pageType: 'privacy',
        title: 'Privacy Policy',
        content: 'This is the privacy policy content',
        version: '1.0',
        effectiveDate: new Date('2025-01-01'),
      };

      const legalPage = createLegalPage('test-id-123', input);

      expect(legalPage.id).toBe('test-id-123');
      expect(legalPage.pageType).toBe('privacy');
      expect(legalPage.title).toBe('Privacy Policy');
      expect(legalPage.content).toBe('This is the privacy policy content');
      expect(legalPage.version).toBe('1.0');
      expect(legalPage.effectiveDate).toEqual(new Date('2025-01-01'));
      expect(legalPage.isCurrent).toBe(false);
      expect(legalPage.createdAt).toBeInstanceOf(Date);
      expect(legalPage.approvedAt).toBeUndefined();
    });

    it('should set isCurrent to true when explicitly provided', () => {
      const input: CreateLegalPageInput = {
        pageType: 'terms',
        title: 'Terms of Service',
        content: 'Terms content',
        version: '2.0',
        effectiveDate: new Date('2025-02-01'),
        isCurrent: true,
      };

      const legalPage = createLegalPage('test-id-456', input);

      expect(legalPage.isCurrent).toBe(true);
    });

    it('should accept optional slug', () => {
      const input: CreateLegalPageInput = {
        pageType: 'cookies',
        title: 'Cookie Policy',
        content: 'Cookie policy content',
        version: '1.5',
        effectiveDate: new Date('2025-03-01'),
        slug: 'cookie-policy-v1-5',
      };

      const legalPage = createLegalPage('test-id-789', input);

      expect(legalPage.slug).toBe('cookie-policy-v1-5');
    });
  });

  describe('updateLegalPage', () => {
    const existingLegalPage = createLegalPage('existing-id', {
      pageType: 'privacy',
      title: 'Original Privacy Policy',
      content: 'Original content',
      version: '1.0',
      effectiveDate: new Date('2025-01-01'),
      isCurrent: true,
      slug: 'privacy-policy',
    });

    it('should update title and content while preserving other fields', () => {
      const updateInput: UpdateLegalPageInput = {
        title: 'Updated Privacy Policy',
        content: 'Updated content with more details',
      };

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated.title).toBe('Updated Privacy Policy');
      expect(updated.content).toBe('Updated content with more details');
      expect(updated.version).toBe('1.0');
      expect(updated.pageType).toBe('privacy');
      expect(updated.isCurrent).toBe(true);
      expect(updated.slug).toBe('privacy-policy');
    });

    it('should update version and effective date', () => {
      const newDate = new Date('2025-06-01');
      const updateInput: UpdateLegalPageInput = {
        version: '2.0',
        effectiveDate: newDate,
      };

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated.version).toBe('2.0');
      expect(updated.effectiveDate).toEqual(newDate);
      expect(updated.title).toBe('Original Privacy Policy');
    });

    it('should toggle isCurrent flag', () => {
      const updateInput: UpdateLegalPageInput = {
        isCurrent: false,
      };

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated.isCurrent).toBe(false);
    });

    it('should update slug to undefined when explicitly set', () => {
      const updateInput: UpdateLegalPageInput = {
        slug: undefined,
      };

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated.slug).toBeUndefined();
    });

    it('should not modify fields when update input is empty', () => {
      const updateInput: UpdateLegalPageInput = {};

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated).toEqual(existingLegalPage);
    });

    it('should update multiple fields at once', () => {
      const newDate = new Date('2025-12-01');
      const updateInput: UpdateLegalPageInput = {
        title: 'Completely New Title',
        content: 'Completely new content',
        version: '3.0',
        effectiveDate: newDate,
        isCurrent: false,
        slug: 'new-privacy-policy-slug',
      };

      const updated = updateLegalPage(existingLegalPage, updateInput);

      expect(updated.title).toBe('Completely New Title');
      expect(updated.content).toBe('Completely new content');
      expect(updated.version).toBe('3.0');
      expect(updated.effectiveDate).toEqual(newDate);
      expect(updated.isCurrent).toBe(false);
      expect(updated.slug).toBe('new-privacy-policy-slug');
      expect(updated.id).toBe(existingLegalPage.id);
      expect(updated.pageType).toBe(existingLegalPage.pageType);
    });
  });
});
