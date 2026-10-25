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
        forest: {
          950: '#06130b',
          900: '#0a1e12',
          850: '#0f2c1b',
          800: '#163b25',
          700: '#1e4e32',
          600: '#2b6e47',
          500: '#388e5d',
          400: '#4eb37a',
          300: '#6dc493',
          200: '#99dbae',
          100: '#cff2dc',
        },
        dark: {
          950: '#070f0a',
          900: '#0c1811',
          850: '#112218',
          800: '#172c20',
          700: '#223d2e',
          600: '#30533f',
        },
        accent: {
          forest: '#2d7a58',
          emerald: '#10b981',
          sage: '#52b788',
          moss: '#40916c',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
