/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F0',
          100: '#FBF0DF',
          200: '#F6DCB8',
          300: '#EFC187',
          400: '#E6A055',
          500: '#D97706', // Primary amber/gold accent
          600: '#B45309',
          700: '#8A3B05',
          800: '#6C2E09',
          900: '#4D2109',
        },
        dark: {
          900: '#0B0F19', // Deep navy charcoal
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          500: '#4B5563',
        },
        ivory: {
          DEFAULT: '#FDFBF7',
          50: '#FFFFFF',
          100: '#FCF9F2',
          200: '#F7F2E7',
          300: '#EFE6D5',
        },
        coral: {
          500: '#EA580C',
          600: '#C2410C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 25px -5px rgba(217, 119, 6, 0.25)',
      }
    },
  },
  plugins: [],
}

