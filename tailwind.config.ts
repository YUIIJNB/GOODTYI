import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F4C3A',
          DEFAULT: '#059669',
          light: '#34D399',
          accent: '#F97316',
          accentHover: '#EA580C',
          bg: '#F0FDF4',
          gray: '#E5E7EB',
          text: '#1F2937',
        },
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#059669',
          600: '#047857',
          900: '#064E3B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
