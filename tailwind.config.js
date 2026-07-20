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
        'game-panel': '#1c1510',
        'game-border': '#3c3228',
        'game-accent': '#d97706',
        'game-accent-light': '#fbbf24',
        'game-accent-dark': '#78350f',
        'game-red': '#ef4444',
        'game-card-bg': '#2d241d',
        'game-muted': '#8a7f72',
        'game-text': '#eae6df',
        'game-card-text': '#eae6df',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
