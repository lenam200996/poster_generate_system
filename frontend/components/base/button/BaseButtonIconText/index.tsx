import { createTheme, ThemeProvider } from "@mui/material/styles"
import MuiButton, { ButtonProps } from "@mui/material/Button"
import SVGReplyIcon from "@/src/assets/svg/reply-icon.svg"
import SVGReplyIconDisabled from "@/src/assets/svg/reply-icon-disabled.svg"

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP",
  },
  palette: {
    standard: {
      main: "#FCFCFE",
      contrastText: "#001F29",
    },
  },
})

interface Props {
  icon: string
  text: string
  color?: ButtonProps["color"]
  size?: ButtonProps["size"]
  disabled?: ButtonProps["disabled"]
  onClick?: Function
}

const BaseButtonIconText = (props: Props) => {
  const handleClick = () => {
    if (!props.onClick) return
    props.onClick()
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiButton
        variant='contained'
        color='standard'
        size={props.size}
        disabled={props.disabled}
        sx={{ height: 28, padding: "4px 8px" }}
        onClick={handleClick}
      >
        {props.icon === "reply" ? (
          <span className='mr-1'>
            {props.disabled ? <SVGReplyIconDisabled /> : <SVGReplyIcon />}
          </span>
        ) : (
          <span className={`material-symbols-outlined mr-1 text-base`}>
            {props.icon}
          </span>
        )}
        <span className='text-sm'>{props.text}</span>
      </MuiButton>
    </ThemeProvider>
  )
}

BaseButtonIconText.defaultProps = {
  color: "neutral",
}

export default BaseButtonIconText
