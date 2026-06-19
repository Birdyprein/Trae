/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        gold: {
          400: '#F0A050',
          500: '#D4A853',
          600: '#B8923A',
        },
        surface: {
          DEFAULT: '#0A0E17',
          card: '#111827',
          border: '#1E293B',
          hover: '#1A2332',
        },
        gain: '#22C55E',
        loss: '#EF4444',
        muted: '#64748B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 168, 83, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 168, 83, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
