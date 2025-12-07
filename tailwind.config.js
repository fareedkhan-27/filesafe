/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // iOS-inspired blue primary (default blue scale is perfect)
        primary: {
          50: '#EFF6FF',    // blue-50
          100: '#DBEAFE',   // blue-100
          200: '#BFDBFE',   // blue-200
          300: '#93C5FD',   // blue-300
          400: '#60A5FA',   // blue-400
          500: '#3B82F6',   // blue-500 - Primary CTA
          600: '#2563EB',   // blue-600 - Hover
          700: '#1D4ED8',   // blue-700 - Active
          800: '#1E40AF',   // blue-800
          900: '#1E3A8A',   // blue-900
          950: '#172554',   // blue-950
        },
        // Legacy accent colors (keeping for backwards compatibility)
        accent: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
          emerald: '#10B981',
        }
      },
      fontSize: {
        'xs': '0.8125rem',     // 13px - captions
        'sm': '0.9375rem',     // 15px - small labels
        'base': '1.0625rem',   // 17px - iOS standard body text
        'lg': '1.125rem',      // 18px - large body
        'xl': '1.25rem',       // 20px - large emphasis
        '2xl': '1.5rem',       // 24px - H3
        '3xl': '1.75rem',      // 28px - H2
        '4xl': '2rem',         // 32px - H1 page titles
      },
      spacing: {
        '13': '3.25rem',   // 52px - min button height
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
      },
      borderRadius: {
        'sm': '0.5rem',    // 8px - small elements
        'md': '0.75rem',   // 12px - inputs, buttons
        'lg': '1rem',      // 16px - cards
        'xl': '1.25rem',   // 20px - modals, large cards
        '2xl': '1.5rem',   // 24px - extra large
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        'lg': '0 4px 16px 0 rgb(0 0 0 / 0.10)',
        'xl': '0 8px 24px 0 rgb(0 0 0 / 0.12)',
        'focus': '0 0 0 4px rgba(59, 130, 246, 0.15)',
        'focus-error': '0 0 0 4px rgba(239, 68, 68, 0.15)',
      },
      minHeight: {
        'touch': '2.75rem',  // 44px - minimum touch target
        'button': '3.25rem', // 52px - comfortable button height
      },
      minWidth: {
        'touch': '2.75rem',  // 44px - minimum touch target
      }
    },
  },
  plugins: [],
}
