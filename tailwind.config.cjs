/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5b13ec',
        'primary-dark': '#4510c9',
        'purple-400': '#8b5cf6',
        'background-light': '#f6f6f8',
        'background-dark': '#161022',
        'surface-dark': '#221933',
        'border-dark': '#2f2348',
        'input-border': '#443267',
        'text-secondary': '#a492c9',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
  safelist: [
    'bg-primary',
    'from-primary',
    'to-primary',
  ],
};
