/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02040a',
          900: '#050a18',
          850: '#0b132b',
          800: '#111e38',
          700: '#1c2d52',
        },
        vision: {
          cyan: '#00E5FF',
          violet: '#8A2BE2',
          pink: '#FF2A85',
          amber: '#FFB300',
          emerald: '#00E676',
          glass: 'rgba(255, 255, 255, 0.06)',
          glassHover: 'rgba(255, 255, 255, 0.12)',
          glassActive: 'rgba(255, 255, 255, 0.18)',
          border: 'rgba(255, 255, 255, 0.14)',
          borderHighlight: 'rgba(255, 255, 255, 0.35)',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'vision-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'vision-glass-lg': '0 20px 50px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
        'glow-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.55), 0 0 10px rgba(0, 229, 255, 0.35)',
        'glow-violet': '0 0 25px -4px rgba(138, 43, 226, 0.55), 0 0 10px rgba(138, 43, 226, 0.35)',
        'halo': '0 0 40px rgba(0, 229, 255, 0.18), inset 0 0 20px rgba(138, 43, 226, 0.15)',
      },
      backdropBlur: {
        'vision': '24px',
        'vision-deep': '36px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit-spin': 'spin 60s linear infinite',
        'glow-breathe': 'glowBreathe 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glowBreathe: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 18px rgba(138,43,226,0.8))' },
        }
      }
    },
  },
  plugins: [],
}
