/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C28',
          900: '#0B1340', // Arajet primary brand navy
          800: '#141E5A',
          700: '#1F2E80',
          600: '#2F44B0',
        },
        corporate: {
          purple: '#6B21A8', // Secondary accent purple
          cyan: '#00C3DE',   // Highlight cyan
          emerald: '#10B981', // OTP on-time positive
          amber: '#F59E0B',   // Moderate delay
          rose: '#F43F5E',    // Critical cancellation/delay
          slatebg: '#F8FAFC', // Off-white clean canvas
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}

