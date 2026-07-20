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
        // Background: #111827
        'game-bg': '#111827',
        // Panel: #1f2937
        'game-panel': '#1f2937',
        // Border: #374151
        'game-border': '#374151',
        // Accent: #60a5fa
        'game-accent': '#60a5fa',
        // Accent focus ring: #93c5fd
        'game-accent-light': '#93c5fd',
        // Red suit color: #f87171
        'game-red': '#f87171',
        // Muted text: #9ca3af
        'game-muted': '#9ca3af',
        // Light text: #f9fafb
        'game-text': '#f9fafb',
        // Card text: #f8fafc
        'game-card-text': '#f8fafc',
      },
    },
  },
  plugins: [],
};
