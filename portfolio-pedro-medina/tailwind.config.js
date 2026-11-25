/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0A09',
          surface: '#111110',
          elevated: '#171715',
          border: '#242421'
        },
        alabaster: {
          DEFAULT: '#F6F5F0',
          surface: '#FFFFFF',
          elevated: '#EEECE5',
          border: '#DFDDD4'
        },
        signal: {
          DEFAULT: '#FF4F18',
          hover: '#E03E0B',
          muted: 'rgba(255, 79, 24, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'marquee': 'marquee 38s linear infinite',
        'marquee-reverse': 'marquee-reverse 38s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      }
    },
  },
  plugins: [],
}

