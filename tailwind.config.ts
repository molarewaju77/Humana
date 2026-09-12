import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F8F24',
          dark: '#356A18',
          light: '#6aad35',
          50: '#f2f9ec',
          100: '#e0f2d0',
          200: '#c3e5a3',
          300: '#9dd16d',
          400: '#78bc3e',
          500: '#4F8F24',
          600: '#3d7019',
          700: '#356A18',
          800: '#2a5212',
          900: '#1e3c0d',
        },
        brand: {
          green: '#4F8F24',
          darkgreen: '#356A18',
          deeptext: '#172017',
          secondarytext: '#5F6B61',
          background: '#FFFFFF',
          softbg: '#F6F8F4',
          border: '#E2E7E1',
          success: '#2E7D32',
          warning: '#B7791F',
          error: '#C62828',
        },
        surface: '#FFFFFF',
        muted: {
          DEFAULT: '#F6F8F4',
          foreground: '#5F6B61',
        },
        border: '#E2E7E1',
        ring: '#4F8F24',
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(23,32,23,0.06), 0 1px 2px -1px rgba(23,32,23,0.04)',
        'card-md': '0 4px 12px 0 rgba(23,32,23,0.08), 0 2px 4px -2px rgba(23,32,23,0.04)',
        'card-lg': '0 8px 24px 0 rgba(23,32,23,0.10), 0 4px 8px -4px rgba(23,32,23,0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(100%) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(100%) scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        'slide-in-left': 'slide-in-left 0.3s ease-out both',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'toast-out': 'toast-out 0.25s ease-in both',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'progress-fill': 'progress-fill 0.5s ease-out both',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
