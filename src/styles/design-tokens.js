// src/styles/design-tokens.js
export const designTokens = {
  colors: {
    primary: '#5b8bf7',
    background: '#f0f4f8',
    surface: '#e8edf2',
    textPrimary: '#2d3748',
    textSecondary: '#718096',
    shadowLight: '#ffffff',
    shadowDark: '#d1d9e6',
    error: '#e53e3e',
    success: '#38a169',
    warning: '#d69e2e',
  },
  borderRadius: {
    small: '12px',
    large: '20px',
    full: '9999px',
  },
  shadows: {
    neumorphicLight: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
    neumorphicPressed: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    neumorphicButton: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
    neumorphicButtonActive: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    neumorphicInput: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
    neumorphicInputFocus: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff, 0 0 0 2px #5b8bf7',
  },
  transitions: {
    default: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
};

// Tailwind config extension
export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: '#5b8bf7',
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
        'neu-pressed': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        'neu-button': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
        'neu-input': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
      },
      transitionTimingFunction: {
        'neu': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
};