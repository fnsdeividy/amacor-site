import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dbe4fe',
          200: '#bfcffc',
          300: '#93aef8',
          400: '#6085f2',
          500: '#3b5eeb',
          600: '#1e3a8a',
          700: '#1a3278',
          800: '#172b66',
          900: '#142354',
          950: '#0d1733',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
        confirmation: {
          DEFAULT: '#25D366',
          light: '#d1fae5',
        },
        background: {
          white: '#ffffff',
          light: '#fafaf9',
          gray: '#f5f5f4',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#fef2f2',
        },
      },
      fontSize: {
        'body': ['17px', { lineHeight: '1.7' }],
        'body-lg': ['19px', { lineHeight: '1.7' }],
        'heading-sm': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-md': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-lg': ['36px', { lineHeight: '1.15', fontWeight: '800' }],
        'heading-xl': ['48px', { lineHeight: '1.08', fontWeight: '800' }],
        'nav': ['15px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        'touch': '48px',
        'touch-lg': '56px',
        'section': '80px',
        'section-lg': '120px',
        'element-gap': '16px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      screens: {
        'tablet': '768px',
        'desktop': '1024px',
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'elevated': '0 24px 48px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
