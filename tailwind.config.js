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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        accent: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
          emerald: '#10B981',
        }
      },
      fontSize: {
        'base': '1.0625rem',     // 17px - larger base for readability
        'lg': '1.1875rem',       // 19px
        'xl': '1.3125rem',       // 21px
        '2xl': '1.5rem',         // 24px
        '3xl': '1.875rem',       // 30px
        '4xl': '2.25rem',        // 36px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
