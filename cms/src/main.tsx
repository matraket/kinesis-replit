import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/auth/AuthProvider';
import { AdminRouter } from './app/routes/AdminRouter';
import { httpClient } from './app/api/httpClient';
import { ThemeProvider } from './app/theme/ThemeProvider';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

httpClient.setUnauthorizedHandler(() => {
  localStorage.removeItem('KINESIS_ADMIN_SECRET');
  window.location.href = '/admin/login';
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AdminRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
