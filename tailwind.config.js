/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter sebagai font utama seluruh dashboard
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // Token warna dari DESIGN.md Section 5 & 27
        app: '#F4F7FB',
        surface: '#FFFFFF',
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(15, 23, 42, 0.06)',
        card: '0 1px 4px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};