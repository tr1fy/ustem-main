import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],

  fontFamily: {
    sans: ['var(--font-roboto)'],
    mono: ['var(--font-martian-mono)']
  },

  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#FFFFFF',
        black: '#000000',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        primary: {
          50: '#0085FF',
          100: '#121212'
        }
      },
      textColor: {
        white: '#FFFFFF'
      }
    }
  },

  darkMode: 'class',
  // The NextUI theme plugin was removed: no public page uses NextUI and it
  // added ~200 KB of unused CSS variables to every page.
  plugins: []
}
