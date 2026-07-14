import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{vue,ts,js,jsx,tsx}',
    './components/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}'
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fbf3f5',
          100: '#f4e4e7',
          200: '#e9c7cf',
          300: '#d99aa6',
          400: '#b86b7f',
          500: '#800020',
          600: '#6e001a',
          700: '#66001a',
          800: '#4b0013',
          900: '#2f000b'
        },
        gold: {
          50: '#fffaf0',
          100: '#fff4e0',
          200: '#fbe5b8',
          300: '#f2d078',
          400: '#e6bb45',
          500: '#D4AF37',
          600: '#c79f2f',
          700: '#b89224',
          800: '#907018',
          900: '#664f0e'
        }
      }
    }
  }
}

export default config
