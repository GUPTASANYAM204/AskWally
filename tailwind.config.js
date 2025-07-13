/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        walmart: {
          blue: '#0071CE',
          'blue-dark': '#004C87',
          'blue-light': '#338EF7',
          yellow: '#FFC220',
          'yellow-dark': '#E6AE1F',
          'yellow-light': '#FFD666',
        },
        accent: {
          success: '#17C964',
          warning: '#F5A524',
          error: '#F31260',
          purple: '#7C3AED',
          pink: '#EC4899',
        },
        // Additional Walmart brand colors
        'walmart-blue': '#0071ce',
        'walmart-blue-dark': '#004f9a',
        'walmart-yellow': '#ffc220',
        'walmart-yellow-dark': '#f2a900',
        
        // Additional accent colors
        'accent-purple': '#6e45e2',
        'accent-pink': '#ff52a1',
        'accent-success': '#38b2ac',
        'accent-warning': '#ed8936',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};