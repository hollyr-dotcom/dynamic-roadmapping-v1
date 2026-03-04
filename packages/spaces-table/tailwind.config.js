/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Roobert PRO"', 'sans-serif'],
        body: ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
