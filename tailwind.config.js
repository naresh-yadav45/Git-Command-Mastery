/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        muted: '#475569',
        line: '#E2E8F0',
        soft: '#F8FAFC',
        brand: { DEFAULT: '#2563EB', dark: '#1D4ED8', tint: '#EFF6FF' },
        violet: { DEFAULT: '#7C3AED', tint: '#F5F3FF' },
        ok: '#059669',
        warn: '#D97706',
        bad: '#DC2626',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgba(15,23,42,.05), 0 1px 3px rgba(15,23,42,.06)' },
    },
  },
  plugins: [],
};
