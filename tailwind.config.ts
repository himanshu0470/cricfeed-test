// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'clg': {
          primary: '#352B54',    // Dark purple like Cricket Line Guru
          secondary: '#4A3F6B',  // Lighter purple for hover states
          accent: '#FF4B4B',     // Red accent for live indicators
          light: '#F5F5F7',      // Light background
          dark: '#1A1A2E',       // Dark background
          text: {
            light: '#F8F9FA',    // Light text
            dark: '#2D2D2D',     // Dark text
            muted: '#6B7280',    // Muted text
          }
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        blink: 'blink 3s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;