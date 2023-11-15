import { createTheme } from "@mui/material/styles"

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    standard?: Palette["primary"]
    neutral?: Palette["primary"]
    link?: Palette["primary"]
  }
  interface PaletteOptions {
    standard?: PaletteOptions["primary"]
    neutral?: PaletteOptions["primary"]
    link?: PaletteOptions["primary"]
  }
}

// Extend color prop on components
declare module "@mui/material/Button" {
  export interface ButtonPropsColorOverrides {
    standard: true
    neutral: true
    link: true
  }
}
