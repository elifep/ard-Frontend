/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React projeleri için
  ],
  theme: {

    extend: {
      colors: {
        bordo: "#800000",
        "dark-bordo": "#5a0000",
      },
    },
  },
  plugins: [],
};