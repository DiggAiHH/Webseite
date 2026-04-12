/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Blue Theme - Klinisch-Minimal
        'medical-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'medical-accent': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // EU AI Standard - Trust Colors
        'eu-trust': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Clinical Surface Colors
        'clinical': {
          bg: '#fafbfc',
          surface: '#ffffff',
          border: '#e5e7eb',
          muted: '#9ca3af',
        },
        'neon-cyan': {
          100: '#cffafe',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        'dark': {
          bg: '#0a0e27',
          surface: '#111638',
          card: '#1a1f4e',
          border: '#2c3367',
          muted: '#9aa4d6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-clinical': 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
        'gradient-trust': 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
        'gradient-dark-hero': 'linear-gradient(125deg, #0a0e27 0%, #111638 40%, #1a1f4e 100%)',
        'gradient-neon-accent': 'linear-gradient(135deg, #22d3ee 0%, #34d399 100%)',
      },
      boxShadow: {
        'clinical': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'clinical-md': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'clinical-lg': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'glow-blue': '0 0 20px rgba(2, 132, 199, 0.15)',
        'glow-accent': '0 0 20px rgba(5, 150, 105, 0.15)',
        'glow-neon': '0 0 24px rgba(34, 211, 238, 0.28)',
        'glow-neon-lg': '0 0 36px rgba(34, 211, 238, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'scan-line': 'scanLine 3.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(34, 211, 238, 0.1)' },
          '50%': { boxShadow: '0 0 28px rgba(34, 211, 238, 0.45)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-105%)' },
          '100%': { transform: 'translateY(205%)' },
        },
      },
    },
  },
  plugins: [],
}
