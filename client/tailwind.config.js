import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0a0a10',
        glow: '#8a39ff',
        accent: '#22ffb4',
        accent2: '#4aa8ff',
      },
      boxShadow: {
        glow: '0 0 40px rgba(138,57,255,0.15)',
        panel: '0 20px 80px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-lines': 'radial-gradient(circle at top left, rgba(138,57,255,0.18), transparent 20%), radial-gradient(circle at bottom right, rgba(34,255,180,0.12), transparent 18%)',
      },
    },
  },
  plugins: [forms],
};
