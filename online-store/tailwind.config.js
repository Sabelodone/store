module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html", // Include any other paths to ensure full coverage
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
          1000: '#000c1a', // Optional: additional deep shade
        },
        secondary: {
          50: '#f5e6ff',
          100: '#e0b3ff',
          200: '#cc80ff',
          300: '#b34dff',
          400: '#9900ff',
          500: '#8000cc',
          600: '#660099',
          700: '#4d0066',
          800: '#330033',
          900: '#1a001a',
        },
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
        108: '27rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#0066ff',
              '&:hover': {
                color: '#0052cc',
              },
            },
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
