import { createTheme, ThemeProvider } from "@mui/material/styles"
import MuiButton, { ButtonProps } from "@mui/material/Button"

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP",
  },
  palette: {
    neutral: {
      main: "#1A1C1E",
    },
    link: {
      main: "#006496",
    },
  },
})

interface Props {
  children: any
  color?: ButtonProps["color"]
  disabled?: ButtonProps["disabled"]
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  sx?: ButtonProps["sx"]
  onClick?: Function
}

const BaseTextButton = (props: Props) => {
  const handleClick = () => {
    if (!props.onClick) return
    props.onClick()
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiButton
        size={props.size}
        color={props.color}
        disabled={props.disabled}
        variant={props.variant}
        sx={props.sx}
        onClick={handleClick}
      >
        {props.children}
      </MuiButton>
    </ThemeProvider>
  )
}

BaseTextButton.defaultProps = {
  color: "neutral",
  size: "medium",
  variant: "text",
}

export default BaseTextButton
