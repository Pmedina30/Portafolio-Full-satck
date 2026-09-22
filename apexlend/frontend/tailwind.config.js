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
          slate: '#707070',
          steel: '#86868b',
          pricingBlue: '#0071e3',
          appleBlue: '#0066cc',
          green: '#28cd41',
          red: '#ff3b30',
        },
      },
      borderRadius: {
        '28px': '28px',
        '980px': '980px',
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
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      letterSpacing: {
        'tight-apple': '-1.2px',
        'sub-apple': '-0.374px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
