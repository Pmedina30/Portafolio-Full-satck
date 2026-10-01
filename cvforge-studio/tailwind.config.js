/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: {
          white: '#ffffff',
          canvas: '#fafafa',
          mist: '#f5f5f7',
          hairline: '#d6d6d6',
          ink: '#1d1d1f',
          subtext: '#86868b',
          blue: '#0071e3',
          blueHover: '#0077ed',
          borderLight: '#e5e5e7',
        },
        aurora: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          iris: '#9281f7',
          dark: '#0d0f12',
          card: 'rgba(255, 255, 255, 0.75)',
        }
      },
      borderRadius: {
        'gallery': '28px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ],
        serif: [
          '"New York"',
          'Georgia',
          'Cambria',
          'serif'
        ]
      },
      animation: {
        'aurora-slow': 'auroraFlow 18s ease-in-out infinite alternate',
        'aurora-spin': 'auroraSpin 25s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        auroraFlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(25px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 15px) scale(0.96)' },
        },
        auroraSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
