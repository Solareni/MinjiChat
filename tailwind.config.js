/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        primary: {
          DEFAULT: '#3794ff',
          hover: '#4fa3ff',
        },
        border: '#3c3c3c',
        input: '#252526',
        ring: '#3794ff',
        muted: {
          DEFAULT: '#858585',
          foreground: '#d4d4d4',
        },
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
