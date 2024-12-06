import type { Config } from "tailwindcss";
import {nextui} from '@nextui-org/react'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        Karla:['Karla', 'sans-serif']
      },
      colors:{
        'coffee':{
          50:'#e8d6d0',
          200:'#c89f94',
          400:'#a25f4b',
          600:'#744838'
        },
        'ctBlue':{
          'header':'#152440',
          'logo':'#11A3A3',
          'logo_hover':'#3ad6ca'
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary:"#11A3A3"
        },
      },
      dark: {
        colors: {
          primary:"#11A3A3"
        },
      },
    },
  })],
};
export default config;
