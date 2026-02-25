/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ── Rupkala Brand Colours ──────────────────────────
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',   // Primary orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        ink: {
          DEFAULT: '#1a1a2e',   // Deep navy for headings
          light:   '#4a4a6a',
          muted:   '#8a8aaa',
        },
        cream: {
          DEFAULT: '#fef9f0',   // Warm off-white background
          dark:    '#f5ece0',
        },
      },

      // ── Typography ─────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],   // Headings
        body:    ['"Inter"', 'system-ui', 'sans-serif'],        // Body text
        accent:  ['"Space Grotesk"', 'monospace'],              // Tags, labels
      },

      // ── Spacing tokens ─────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },

      // ── Animation ──────────────────────────────────────
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
