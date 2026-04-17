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
        cream:     '#fdf6ee',
        darkSlate: '#2a3a3c',
        orange:    '#d56119',
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
