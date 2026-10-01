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
          mist: '#f5f5f7',
          hairline: '#d6d6d6',
          ink: '#1d1d1f',
          subtext: '#86868b',
          blue: '#0071e3',
          blueHover: '#0077ed',
          borderLight: '#e5e5e7',
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
      boxShadow: {
        'none': 'none',
      }
    },
  },
  plugins: [],
}
