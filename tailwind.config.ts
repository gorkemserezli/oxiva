import type { Config } from "tailwindcss";

  const config: Config = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e8f2f9',
            100: '#d1e5f3',
            200: '#a3cbe7',
            300: '#75b1db',
            400: '#4797cf',
            500: '#2C4E70', // Ana logo rengi
            600: '#23405a',
            700: '#1a3043',
            800: '#12202d',
            900: '#091016',
          },
          accent: {
            50: '#e6f4fb',
            100: '#cce9f7',
            200: '#99d3ef',
            300: '#66bde7',
            400: '#33a7df',
            500: '#5BA4D3', // Açık mavi ton
            600: '#4990bf',
            700: '#376c8f',
            800: '#254860',
            900: '#122430',
          },
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-up': 'fadeUp 0.5s ease-out',
          'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeUp: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          pulseGentle: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.8' },
          },
        },
      },
    },
    plugins: [],
  };
  export default config;
