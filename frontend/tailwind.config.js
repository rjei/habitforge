/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-slate': '#0B0E14',      // Deep dark slate background
        'card-slate': '#131822',      // Dark navy-slate container
        'accent-blue': '#8BABFF',     // Light/Lavender blue for main buttons, highlights, glowing bars
        'accent-gold': '#FBBF24',     // Gold for level/streaks
        'accent-orange': '#F97316',   // Orange for medium fatigue/burnout
        'accent-red': '#EF4444',      // Red for high fatigue/burnout or failed quests
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'blue-glow': '0 0 15px rgba(139, 171, 255, 0.25)',
        'blue-glow-hover': '0 0 25px rgba(139, 171, 255, 0.45)',
        'gold-glow': '0 0 15px rgba(251, 191, 36, 0.2)',
        'red-glow': '0 0 15px rgba(239, 68, 68, 0.2)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [],
}
