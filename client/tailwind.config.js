/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: '#1E293B',
        success:   '#16A34A',
        warning:   '#F59E0B',
        danger:    '#DC2626',
        dark:      '#0F172A',
        surface:   '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'gradient-hero':    'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #162032 100%)',
        'gradient-card':    'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)',
      },
      boxShadow: {
        glass:       '0 8px 32px 0 rgba(31,38,135,0.12)',
        glow:        '0 0 30px rgba(37,99,235,0.35)',
        card:        '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover':'0 10px 40px rgba(0,0,0,0.14)',
        'inner-glow':'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        float:      'float 6s ease-in-out infinite',
        shimmer:    'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.45s ease-out',
        'fade-in':  'fadeIn 0.35s ease-out',
        'bounce-in':'bounceIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)',
        'ping-slow':'ping 2.5s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        bounceIn: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
