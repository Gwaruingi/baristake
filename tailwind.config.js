/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'reed-red': '#d71921',
        'reed-red-dark': '#b5141b',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
