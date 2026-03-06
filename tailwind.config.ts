import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f5ff',
        'neon-pink': '#ff6b9d',
        'neon-purple': '#b829dd',
        'dark-bg': '#0a0a0f',
        'card-bg': 'rgba(20,20,35,0.8)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        'noto-sans': ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'cat-glow': 'catGlow 3s ease-in-out infinite',
      },
      keyframes: {
        catGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(0,245,255,0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(0,245,255,0.7)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
