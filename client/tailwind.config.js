/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '450px',
      md: '750px',
      lg: '1050px',
      xl: '1280px',
    },
    fontFamily: {
      geograph: ['Geograph', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: '#212A2F',
        'light-gray': '#d3d4d5',
        silver: '#f5f5f5',
        red: '#AD1F00',
      },
    },
  },
  plugins: [],
};
