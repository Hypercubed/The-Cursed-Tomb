/** @type {import('tailwindcss').Config} */
export default {
  // 2.2 Content paths — scan all React component files
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // 2.3 Custom colors matching the current dark theme
      colors: {
        'game-bg': '#0d0a07',
        'game-panel': '#241e17',
        'game-border': '#44382c',
        'game-accent': '#d97706',
        'game-accent-light': '#fbbf24',
        'game-accent-dark': '#78350f',
        'game-red': '#dc2626',
        'game-card-bg': '#f5f0e6',
        'game-muted': '#a39686',
        'game-text': '#eae6df',
        'game-card-text': '#1c1710',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
