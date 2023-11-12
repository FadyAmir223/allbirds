/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1380px',
    },
    fontFamily: {
      geograph: ['Geograph', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: '#212A2F',
      },
    },
  },
  plugins: [],
};
