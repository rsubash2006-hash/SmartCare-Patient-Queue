/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070E1A',
          900: '#0B1727',
          800: '#112240',
          700: '#1D2D50',
          600: '#2A4365',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        urgency: {
          immediate: {
            bg: '#FFF1F2',
            text: '#9F1239',
            border: '#FECDD3',
            badge: '#E11D48',
          },
          veryUrgent: {
            bg: '#FFF7ED',
            text: '#9A3412',
            border: '#FFEDD5',
            badge: '#EA580C',
          },
          urgent: {
            bg: '#FEFCE8',
            text: '#854D0E',
            border: '#FEF08A',
            badge: '#CA8A04',
          },
          standard: {
            bg: '#F0F9FF',
            text: '#075985',
            border: '#BAE6FD',
            badge: '#0284C7',
          },
          nonUrgent: {
            bg: '#F8FAFC',
            text: '#475569',
            border: '#E2E8F0',
            badge: '#64748B',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
