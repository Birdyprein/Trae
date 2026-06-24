/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'serif'],
      },
      colors: {
        rose: {
          50: '#fff1f3',
          100: '#ffe0e6',
          200: '#ffc7d1',
          300: '#ff9db0',
          400: '#ff6b8a',
          500: '#f93d66',
          600: '#e71d4d',
          700: '#c1123d',
          800: '#a11238',
          900: '#8a1336',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'candle-flicker': 'candleFlicker 0.5s ease-in-out infinite alternate',
        'confetti-fall': 'confettiFall 3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounceSlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 182, 193, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 182, 193, 0.8)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        candleFlicker: {
          '0%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
          '100%': { transform: 'scale(1.1) rotate(2deg)', opacity: '0.8' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
