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
        'gray-light': '#d3d4d5',
        'gray-dark': '#94999b',
        silver: '#f5f5f5',
        'sliver-dark': '#4d5559',
        red: '#AD1F00',
      },
    },
  },
  plugins: [],
};
