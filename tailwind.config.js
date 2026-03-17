/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5b8bf7',
          dark: '#4a7de4',
          light: '#7ba3f9',
        },
        background: '#f0f4f8',
        surface: '#e8edf2',
        textPrimary: '#2d3748',
        textSecondary: '#718096',
        shadowLight: '#ffffff',
        shadowDark: '#d1d9e6',
      },
      borderRadius: {
        'sm': '12px',
        'lg': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'neu': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-hover': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neu-button': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
        'neu-button-hover': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-input': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neu-input-focus': 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff, 0 0 0 2px #5b8bf7',
        'neu-primary': '6px 6px 12px rgba(91, 139, 247, 0.3), -6px -6px 12px #ffffff',
      },
      transitionTimingFunction: {
        'neu': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}