import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkRed:   '#9e3816',
        darkGreen: '#3b5633',
        midGreen:  '#758d69',
        lightBg:   '#f4c293',
        lightBg2:  '#fde8d0',
        cream:     '#fcebdc',
        darkSlate: '#2a3a3c',
        orange:    '#d56119',
        blauw:     '#1a4a7a',
      },
      screens: {
        xs: '360px',
      },
      fontFamily: {
        salmon: ['Salmon', 'Georgia', 'serif'],
        brogi:  ['Brogi', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
