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
          dark: '#003C7A',
          DEFAULT: '#005BB5',
          light: '#66A7FF',
          accent: '#0091EA',
          accentHover: '#007ACC',
          bg: '#E9F3FF',
          gray: '#CBD7E6',
          text: '#0F172A',
        },
        primary: {
          50: '#EBF4FF',
          100: '#D7E8FF',
          500: '#005BB5',
          600: '#004A96',
          900: '#002E5F',
        },
      },
    },
  },
  plugins: [],
};
export default config;
