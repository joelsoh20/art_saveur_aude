/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: { 50: '#fff7f6', 100: '#fdeeed', 200: '#f8dcdc', 300: '#f1c3c4', 400: '#e5a3a7', 500: '#d4838b' },
        berry: { 400: '#e0526a', 500: '#cc3050', 600: '#a8203d' },
        cocoa: { 700: '#6b3a45', 800: '#4f2a33', 900: '#3a1e25' },
      },
      fontFamily: { script: ['"Great Vibes"', 'cursive'], serif: ['"Playfair Display"', 'serif'], sans: ['Montserrat', 'sans-serif'] },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(28px)' }, '100%': { opacity: 1, transform: 'none' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0) rotate(0)' }, '50%': { transform: 'translateY(-14px) rotate(2deg)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-9px)' }, '40%,80%': { transform: 'translateX(9px)' } },
        pop: { '0%': { transform: 'scale(.6)', opacity: 0 }, '70%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        slide: { '0%': { opacity: 0, transform: 'translateX(40px)' }, '100%': { opacity: 1, transform: 'none' } },
        pulseSoft: { '0%,100%': { boxShadow: '0 0 0 0 rgba(212,131,139,.5)' }, '50%': { boxShadow: '0 0 0 16px rgba(212,131,139,0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-up': 'fade-up .8s cubic-bezier(.2,.7,.2,1) both', 'fade-in': 'fade-in .8s ease both',
        float: 'float 6s ease-in-out infinite', shake: 'shake .5s ease', pop: 'pop .5s cubic-bezier(.2,.9,.3,1.3) both',
        slide: 'slide .45s ease both', 'pulse-soft': 'pulseSoft 2.2s infinite', shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
