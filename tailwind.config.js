/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#050508',
          card: 'rgba(15, 15, 30, 0.6)',
          data: 'rgba(20, 20, 35, 0.85)',
          hover: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
          divider: 'rgba(255, 255, 255, 0.03)',
        },
        gold: {
          300: '#E5C068',
          400: '#D4A853',
          500: '#C4983A',
          600: '#A67C2A',
        },
        gain: '#EF4444',
        loss: '#22C55E',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float-slow': 'floatSlow 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
