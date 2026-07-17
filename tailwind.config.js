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
        'float-slow': 'float 5s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'drift': 'drift 6s ease-in-out infinite alternate',
        'drift-slow': 'drift 10s ease-in-out infinite alternate',
        'confetti': 'confetti 1s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
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
        drift: {
          '0%': { transform: 'translateX(0px) translateY(0px)' },
          '100%': { transform: 'translateX(30px) translateY(-20px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%': { opacity: '0.3', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1.2)' },
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
  safelist: [
    'from-purple-500',
    'to-purple-600',
    'from-blue-500',
    'to-blue-600',
    'from-teal-500',
    'to-teal-600',
    'from-orange-500',
    'to-orange-600',
    'from-purple-500',
    'to-pink-500',
    'from-blue-500',
    'to-cyan-500',
    'from-teal-500',
    'to-emerald-500',
    'from-orange-500',
    'to-red-500',
    'stroke-green-500',
    'stroke-yellow-500',
    'stroke-red-500',
  ],
  plugins: [],
}
