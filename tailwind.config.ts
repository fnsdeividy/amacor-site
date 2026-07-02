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
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0077ff',   // Blue Sparkle (base)
          600: '#0062d1',   // Darker for text-on-white (contrast-safe)
          700: '#004da3',
          800: '#003875',
          900: '#002347',
          950: '#001b48',   // Oxford Blue
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe4d4',
          200: '#ffc9a8',
          300: '#ffab77',
          400: '#fea734',   // Bee Cluster
          500: '#fe7235',   // Crayola Orange (base)
          600: '#e55a1f',
          700: '#bf4316',
          800: '#993614',
          900: '#7a2d13',
        },
        cyan: {
          50: '#edfdfb',
          100: '#d0f9f3',
          200: '#a4f3e8',
          300: '#72eadb',
          400: '#60efdd',   // Near Moon
          500: '#38d9c7',
          600: '#25b3a4',
          700: '#1e8f84',
          800: '#1b6f68',
          900: '#195b55',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d1d1d1',   // Ancestral Water
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
        'body': ['19px', { lineHeight: '1.7' }],
        'body-lg': ['21px', { lineHeight: '1.7' }],
        'heading-sm': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-md': ['30px', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-lg': ['38px', { lineHeight: '1.15', fontWeight: '800' }],
        'heading-xl': ['50px', { lineHeight: '1.08', fontWeight: '800' }],
        'nav': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
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
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0077ff 0%, #60efdd 100%)',
        'gradient-accent': 'linear-gradient(135deg, #fe7235 0%, #fea734 100%)',
        'gradient-brand-overlay': 'linear-gradient(to right, rgba(0,119,255,0.9), rgba(96,239,221,0.5))',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'fade-in-down': 'fade-in-down 0.5s ease-out both',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
