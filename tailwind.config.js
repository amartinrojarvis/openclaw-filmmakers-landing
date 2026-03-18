/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07111f',
        cyan: '#52e5ff',
        violet: '#8b5cf6',
        slateGlow: '#0d1728',
      },
      boxShadow: {
        glow: '0 0 80px rgba(82,229,255,0.18)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
