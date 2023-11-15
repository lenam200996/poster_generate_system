import React from "react"
import { styled } from "@mui/material/styles"
import MuiTextField, { TextFieldProps } from "@mui/material/TextField"

const StyledTextField = styled(MuiTextField)({
  "& .MuiInputBase-input": {
    fontSize: 14,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#C0C8CC",
  },
})

const BaseTextField = (props: TextFieldProps) => {
  return <StyledTextField {...props} />
}

export default BaseTextField
