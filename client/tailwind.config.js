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
        gray: '#212a2f',
        'gray-light': '#d3d4d5',
        'gray-dark': '#94999b',
        'gray-medium': '#767676',
        'blue-light': '#5a6266',
        'blue-dark': '#1a2226',
        'gray-2': '#dedfe0',
        silver: '#f5f5f5',
        'silver-2': '#f9f9f9',
        'silver-dark': '#4d5559',
        red: '#ad1f00',
        'red-dark': '#b65151',
        brown: '#f8f7f5',
        tBodyEven: '#f1f6f8',
        tBodyOdd: '#eeebe5',
        'grayish-brown': '#9c9487',
        'dark-form': '#f1ebe7',
      },
    },
  },
  plugins: [],
}
