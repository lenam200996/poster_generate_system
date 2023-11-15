import { styled } from "@mui/material/styles"
import Radio from "@mui/material/Radio"
import FormControlLabel from "@mui/material/FormControlLabel"

interface Props {
  label: string
  value: string
  width?: string
  height?: string
  selected?: boolean
  disabled?: boolean
  onChange?: Function
}

const BaseRadioSquare = (props: Props) => {
  const StyledFormControlLabel = styled(FormControlLabel)(() => ({
    width: props.width,
    height: props.height,
    marginRight: 0,
    marginLeft: 0,
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: props.selected ? "#1976D2" : "#C0C8CC",
    "& .MuiRadio-root": {
      padding: "8px 9px",
    },
    "& .MuiFormControlLabel-label": {
      fontSize: 14,
      fontWeight: 500,
      color: "#001F29",
    },
  }))
  return (
    <StyledFormControlLabel
      value={props.value}
      control={<Radio size='small' disableRipple />}
      label={props.label}
      disabled={props.disabled}
    />
  )
}

BaseRadioSquare.defaultProps = {
  width: "200px",
  height: "36px",
}

export default BaseRadioSquare
