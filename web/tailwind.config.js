export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../shared/ui/**/*.{js,ts,jsx,tsx}',
    '../shared/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
        },
        border: 'var(--border)',
        muted: 'var(--text-muted)',
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
