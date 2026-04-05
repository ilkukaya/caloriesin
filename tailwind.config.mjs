/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D8C3C',
          dark: '#1E6B2B',
          light: '#E8F5E9',
        },
        accent: {
          DEFAULT: '#FF6B35',
          light: '#FFF3E0',
        },
        'bg-alt': '#F8FAF8',
        'text-main': '#1A1A1A',
        'text-muted': '#666666',
        'border-main': '#E0E0E0',
        warning: '#F44336',
        success: '#4CAF50',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
