/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#5a189a',
        fg: '#9d4edd'
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px'
      }
    }
  },
  plugins: [],
}

