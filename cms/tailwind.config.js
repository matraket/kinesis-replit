export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          navy: 'var(--admin-bg-app)',
          surface: 'var(--admin-bg-surface)',
          surfaceLight: 'var(--admin-bg-surface-light)',
          accent: 'var(--admin-accent)',
          border: 'var(--admin-border)',
          muted: 'var(--admin-text-muted)',
          white: 'var(--admin-text-main)',
          success: 'var(--admin-success)',
          warning: 'var(--admin-warning)',
          error: 'var(--admin-error)',
          info: 'var(--admin-info)',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-h1-mobile': '48px',
        'display-h1-desktop': '72px',
        'display-h2-mobile': '36px',
        'display-h2-desktop': '48px',
        'h3': '24px',
        'h3-desktop': '32px',
        'h4': '20px',
        'h4-desktop': '24px',
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px',
        '3xl': '96px',
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [],
};
