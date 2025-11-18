import { httpClient } from './httpClient';

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
    list: () => httpClient.get('/admin/leads'),
    getById: (id: string) => httpClient.get(`/admin/leads/${id}`),
    update: (id: string, data: unknown) => httpClient.put(`/admin/leads/${id}`, data),
  },

  settings: {
    get: () => httpClient.get('/admin/settings'),
    update: (data: unknown) => httpClient.put('/admin/settings', data),
  },
};
