module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: 'var(--maroon-50)',
          100: 'var(--maroon-100)',
          200: 'var(--maroon-200)',
          300: 'var(--maroon-300)',
          400: 'var(--maroon-400)',
          500: 'var(--maroon-500)',
          600: 'var(--maroon-600)',
          700: 'var(--maroon-700)',
          800: 'var(--maroon-800)',
          900: 'var(--maroon-900)',
        },
      },
    },
  },
  plugins: [],
}