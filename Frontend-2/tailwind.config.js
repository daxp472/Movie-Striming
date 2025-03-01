// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            500: '#8B5CF6',  // Purple
            600: '#7C3AED',
            700: '#6D28D9',
          },
          secondary: {
            500: '#6366F1',  // Indigo
            600: '#4F46E5',
          },
          accent: {
            500: '#EC4899',  // Fuchsia
            600: '#DB2777',
          },
        },
      },
    },
    plugins: [],
  }