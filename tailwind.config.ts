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
          50: '#fdf4f5',
          100: '#fce7eb',
          200: '#fad1d9',
          300: '#f7a8b8',
          400: '#f27a93',
          500: '#ea4c6d',
          600: '#d6315c',
          700: '#b4224b',
          800: '#961f44',
          900: '#7f1d3f',
        },
        secondary: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3dcd4',
          300: '#e9c2b5',
          400: '#dda18e',
          500: '#cf8167',
          600: '#be6a51',
          700: '#9f5543',
          800: '#83473a',
          900: '#6c3d33',
        },
        accent: {
          50: '#fef6ee',
          100: '#fdead6',
          200: '#fad1ad',
          300: '#f7b079',
          400: '#f38443',
          500: '#f06320',
          600: '#e14916',
          700: '#ba3514',
          800: '#942b18',
          900: '#772616',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
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
