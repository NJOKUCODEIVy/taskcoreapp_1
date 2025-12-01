/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TaskCore Brand Colors
        primary: {
          navy: '#1E2A78',
          blue: '#2D3A8C',
          light: '#3B4BA0',
        },
        accent: {
          sky: '#5BBDF5',
          light: '#7FCEFF',
          dark: '#3AA5E3',
        },
        neutral: {
          gray: '#E6E8EC',
          dark: '#6B7280',
          darker: '#374151',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        priority: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(30, 42, 120, 0.08)',
        'card-hover': '0 4px 16px rgba(30, 42, 120, 0.12)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}

