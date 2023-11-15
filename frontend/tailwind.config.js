const colors = require('./designTokens/color')
const basicColors = {
  transparent: 'transparent',
}
const totalColors = Object.assign(colors, basicColors)
const colorNames = [
  ...Object.keys(colors),
  ...Object.keys(colors.container),
  ...Object.keys(colors.theme),
]

module.exports = {
  important:true,
  corePlugins: {
    preflight: false,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // TODO: 後で色を変数に変更する
    "before:bg-[#F77823]",
    "before:bg-[#80C900]",
    "before:bg-[#39B7AA]",
    "before:bg-[#0AA1C9]",
    ...colorNames.map((color) => `bg-theme-${color}-10`),
    ...colorNames.map((color) => `bg-theme-${color}-20`),
    ...colorNames.map((color) => `bg-theme-${color}-40`),
    ...colorNames.map((color) => `bg-theme-${color}-50`),
    ...colorNames.map((color) => `!bg-theme-${color}-20`),
    ...colorNames.map((color) => `text-theme-${color}-60`),
    ...colorNames.map((color) => `text-theme-${color}-40`),
    ...colorNames.map((color) => `border-theme-${color}-20`),
    ...colorNames.map((color) => `border-theme-${color}-30`),
    ...colorNames.map((color) => `border-theme-${color}-40`),
    ...colorNames.map((color) => `fill-theme-${color}-10`),
    ...colorNames.map((color) => `fill-theme-${color}-40`),
    ...colorNames.map((color) => `fill-theme-${color}-60`),
    ...colorNames.map((color) => `hover:bg-theme-${color}-50`),
    ...colorNames.map((color) => `hover:bg-theme-${color}-40`),
    ...colorNames.map((color) => `hover:bg-theme-${color}-20`),
    ...colorNames.map((color) => `hover:!bg-theme-${color}-20`),
    ...colorNames.map((color) => `hover:bg-theme-${color}-10`),
    ...colorNames.map((color) => `hover:text-theme-${color}-40`),
  ],
  theme: {
    colors: totalColors,
    extend: {
      fontSize: {
        'xxs': '10px'
      },
      borderRadius: {
        5: "5px",
        20: "20px",
      },
      backgroundImage: {
        icons: "url('/bg-icons.png')",
      },
      boxShadow: {
        'lv1': '0px 3px 3px rgba(0, 0, 0, 0.1)',
        'lv2': '0px 0px 3px rgba(0, 0, 0, 0.2)',
        'lv3': '0px 0px 5px rgba(0, 0, 0, 0.5)',
        'inner-lv1': 'inset 0px 0px 2px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
