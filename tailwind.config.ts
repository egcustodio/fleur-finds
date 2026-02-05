import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf7f7',
          100: '#f5eeee',
          200: '#e8dede',
          300: '#d5c4c4',
          400: '#bfa1a1',
          500: '#a67f7f',
          600: '#8d6767',
          700: '#755454',
          800: '#624848',
          900: '#533f3f',
        },
        secondary: {
          50: '#f9f7f6',
          100: '#f2efed',
          200: '#e5ddd9',
          300: '#d1c3bc',
          400: '#b8a499',
          500: '#9f8679',
          600: '#897165',
          700: '#725e54',
          800: '#5f4e47',
          900: '#51423d',
        },
        accent: {
          50: '#faf6f5',
          100: '#f5edeb',
          200: '#ead8d4',
          300: '#dbbdb5',
          400: '#c99a8e',
          500: '#b67b6b',
          600: '#a36355',
          700: '#875246',
          800: '#70463d',
          900: '#5d3d36',
        },
        rose: {
          50: '#faf6f6',
          100: '#f4eeee',
          200: '#e9dddd',
          300: '#d8c4c4',
          400: '#c2a4a4',
          500: '#a98282',
          600: '#8e6565',
          700: '#755353',
          800: '#624646',
          900: '#543e3e',
        },
        blush: {
          50: '#faf8f7',
          100: '#f3f0ef',
          200: '#e7e0dd',
          300: '#d4c8c3',
          400: '#bba9a1',
          500: '#a08b81',
          600: '#8a7469',
          700: '#726058',
          800: '#5f514a',
          900: '#50443f',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Playfair Display', 'serif'],
        display: ['var(--font-cormorant)', 'Playfair Display', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '300' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
