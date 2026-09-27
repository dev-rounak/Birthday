/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070b1a',
          800: '#0a1024',
          700: '#0e1530',
          600: '#131c3d',
        },
        neon: {
          blue: '#2563eb',
          sky: '#38bdf8',
          pink: '#f472b6',
        },
        soft: '#e2e8f0',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 4s linear infinite',
        'blink': 'blink 1s steps(1) infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 0.4s ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.85' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translate(2px, -1px)', filter: 'hue-rotate(180deg)' },
          '60%': { transform: 'translate(-1px, -1px)', filter: 'hue-rotate(270deg)' },
          '80%': { transform: 'translate(1px, 1px)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
