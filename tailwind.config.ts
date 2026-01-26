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
          50: '#faf7f5',
          100: '#f5f0eb',
          200: '#e8ddd3',
          300: '#d4bfae',
          400: '#bc9b84',
          500: '#a67c5d',
          600: '#8b6648',
          700: '#72533c',
          800: '#5f4634',
          900: '#513c2e',
        },
        secondary: {
          50: '#f9f8f7',
          100: '#f3f1ef',
          200: '#e5e1dd',
          300: '#d1cbc4',
          400: '#b5aca3',
          500: '#9a8f84',
          600: '#7d7369',
          700: '#655d56',
          800: '#534e48',
          900: '#46423e',
        },
        accent: {
          50: '#fef6f3',
          100: '#fdeae4',
          200: '#fad1c4',
          300: '#f7b09a',
          400: '#f2846e',
          500: '#ea5f48',
          600: '#d84230',
          700: '#b53427',
          800: '#952d25',
          900: '#7b2924',
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
