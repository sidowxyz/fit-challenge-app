/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        volt: {
          50: '#f9ffe5',
          100: '#f2ffc7',
          200: '#e5fe92',
          300: '#d7fe53',
          400: '#e5fe40',
          500: '#ccff00', // Athletic Volt Lime (Nike / Gymshark flagship accent)
          600: '#a8d400',
          700: '#7fa300',
          850: '#526900',
          900: '#324000',
        },
        brand: {
          50: '#f9ffe5',
          100: '#f2ffc7',
          200: '#e5fe92',
          300: '#d7fe53',
          400: '#e5fe40',
          500: '#ccff00', // Athletic Volt Lime
          600: '#a8d400',
          700: '#7fa300',
          800: '#587300',
          900: '#384a00',
          950: '#1e2800',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          750: '#2e2e34',
          800: '#27272a',
          850: '#1c1c20',
          900: '#121215',
          950: '#09090b',
        }
      },
      fontFamily: {
        athletic: [
          'Barlow Condensed',
          'Inter',
          'sans-serif',
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
