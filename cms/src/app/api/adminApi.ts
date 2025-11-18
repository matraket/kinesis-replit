import { httpClient } from './httpClient';

export type LeadType = 'contact' | 'pre_enrollment' | 'elite_booking';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: number;
  lead_type: LeadType;
  lead_status: LeadStatus;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LeadsListResponse {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LeadsFilters {
  lead_type?: LeadType;
  lead_status?: LeadStatus;
  source?: string;
  created_after?: string;
  created_before?: string;
  page?: number;
  pageSize?: number;
}

export interface Settings {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: {
      web: string;
      cms: string;
    };
    favicon: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  };
  seo: {
    default_title: string;
    default_description: string;
    default_keywords: string;
  };
}

export interface SettingsResponse {
  settings: Settings;
}

export const adminApi = {
  validateSecret: async () => {
    try {
      await httpClient.get('/admin/settings');
      return true;
    } catch {
      return false;
    }
  },

  programs: {
    list: () => httpClient.get('/admin/programs'),
    getById: (id: string) => httpClient.get(`/admin/programs/${id}`),
    create: (data: unknown) => httpClient.post('/admin/programs', data),
    update: (id: string, data: unknown) => httpClient.put(`/admin/programs/${id}`, data),
    delete: (id: string) => httpClient.delete(`/admin/programs/${id}`),
  },

  instructors: {
    list: () => httpClient.get('/admin/instructors'),
    getById: (id: string) => httpClient.get(`/admin/instructors/${id}`),
    create: (data: unknown) => httpClient.post('/admin/instructors', data),
    update: (id: string, data: unknown) => httpClient.put(`/admin/instructors/${id}`, data),
    delete: (id: string) => httpClient.delete(`/admin/instructors/${id}`),
  },

  businessModels: {
    list: () => httpClient.get('/admin/business-models'),
    getById: (id: string) => httpClient.get(`/admin/business-models/${id}`),
    update: (id: string, data: unknown) => httpClient.put(`/admin/business-models/${id}`, data),
  },

  pages: {
    list: () => httpClient.get('/admin/pages'),
    getById: (id: string) => httpClient.get(`/admin/pages/${id}`),
    getByKey: (key: string) => httpClient.get(`/admin/pages/by-key/${key}`),
    create: (data: unknown) => httpClient.post('/admin/pages', data),
    update: (id: string, data: unknown) => httpClient.put(`/admin/pages/${id}`, data),
    delete: (id: string) => httpClient.delete(`/admin/pages/${id}`),
  },

  faqs: {
    list: () => httpClient.get('/admin/faqs'),
    getById: (id: string) => httpClient.get(`/admin/faqs/${id}`),
    create: (data: unknown) => httpClient.post('/admin/faqs', data),
    update: (id: string, data: unknown) => httpClient.put(`/admin/faqs/${id}`, data),
    delete: (id: string) => httpClient.delete(`/admin/faqs/${id}`),
  },

  leads: {
    list: (filters?: LeadsFilters): Promise<LeadsListResponse> => {
      const params: Record<string, string> = {};

      if (filters?.lead_type) params.lead_type = filters.lead_type;
      if (filters?.lead_status) params.lead_status = filters.lead_status;
      if (filters?.source) params.source = filters.source;
      if (filters?.created_after) params.created_after = filters.created_after;
      if (filters?.created_before) params.created_before = filters.created_before;
      if (filters?.page) params.page = filters.page.toString();
      if (filters?.pageSize) params.pageSize = filters.pageSize.toString();

      return httpClient.get<LeadsListResponse>('/admin/leads', { params });
    },
    getById: (id: string | number): Promise<Lead> => httpClient.get<Lead>(`/admin/leads/${id}`),
    update: (id: string | number, data: Partial<Lead>): Promise<Lead> => 
      httpClient.put<Lead>(`/admin/leads/${id}`, data),
  },

  settings: {
    get: (): Promise<SettingsResponse> => httpClient.get<SettingsResponse>('/admin/settings'),
    update: (data: Partial<Settings>): Promise<SettingsResponse> => 
      httpClient.put<SettingsResponse>('/admin/settings', { settings: data }),
  },

  pricingTiers: {
    list: (filters?: { programId?: string }) => {
      const params: Record<string, string> = {};
      if (filters?.programId) params.programId = filters.programId;
      return httpClient.get('/admin/pricing-tiers', { params });
    },
    getById: (id: string) => httpClient.get(`/admin/pricing-tiers/${id}`),
    create: (data: unknown) => httpClient.post('/admin/pricing-tiers', data),
    update: (id: string, data: unknown) => httpClient.put(`/admin/pricing-tiers/${id}`, data),
    delete: (id: string) => httpClient.delete(`/admin/pricing-tiers/${id}`),
  },

  media: {
    list: (filters?: { folder?: string; search?: string; page?: number; limit?: number }) => {
      const params: Record<string, string> = {};
      if (filters?.folder) params.folder = filters.folder;
      if (filters?.search) params.search = filters.search;
      if (filters?.page) params.page = filters.page.toString();
      if (filters?.limit) params.limit = filters.limit.toString();
      return httpClient.get('/admin/media', { params });
    },
    getById: (id: string) => httpClient.get(`/admin/media/${id}`),
    upload: (formData: FormData) => httpClient.post('/admin/media', formData),
    delete: (id: string) => httpClient.delete(`/admin/media/${id}`),
  },

  specialties: {
    list: () => httpClient.get('/admin/specialties'),
    getById: (id: string) => httpClient.get(`/admin/specialties/${id}`),
  },
};
