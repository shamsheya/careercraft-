/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        neon: {
          pink: '#ff2d95',
          blue: '#00d4ff',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        heading: ['Baloo 2', 'cursive'],
        display: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        playful: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out',
        'streak-glow': 'streakGlow 1.5s ease-in-out infinite alternate',
        'treasure-open': 'treasureOpen 0.8s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        streakGlow: {
          '0%': { textShadow: '0 0 5px rgba(251, 191, 36, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4)' },
        },
        treasureOpen: {
          '0%': { transform: 'scale(1) rotateY(0deg)' },
          '50%': { transform: 'scale(1.2) rotateY(180deg)' },
          '100%': { transform: 'scale(1) rotateY(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
