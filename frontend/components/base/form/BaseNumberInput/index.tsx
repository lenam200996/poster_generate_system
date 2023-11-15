import { Button, InputAdornment, TextField, styled } from "@mui/material"
import { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

type Props = {
  label: string
  value: number
  onIncrease: () => void
  onDecrease: () => void
  onChange: (value: number) => void
  placeholder?: string
  maxNum?: number
  minNum?: number
  unit?: string
  error?: boolean
  disabled?: boolean
  plusDisabled?: boolean
  minusDisabled?: boolean
}
const StyledButton = styled(Button)({
  width: "30px",
  height: "30px",
  minWidth: 0,
  padding: 0,
})

const numberRegex = /^\d+$/

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {},
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "6px",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
  },
  "& .MuiInputBase-input[value='']": {
    backgroundColor: "#FBFBFB",
  },
})

const BaseNumberInput = (props: Props) => {
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log(e.target.value)
    if (numberRegex.test(e.target.value)) {
      const clamped = clampInputNumber(Number(e.target.value))
      props.onChange(clamped)
    } else if (e.target.value === "") {
      props.onChange(0)
    } else {
      e.preventDefault()
    }
  }
  const handleOnIncrease = () => {
    const num = props.value + 1
    const clamped = clampInputNumber(num)
    if (clamped === num) {
      props.onIncrease()
    }
  }
  const handleOnDecrease = () => {
    const num = props.value - 1
    const clamped = clampInputNumber(num)
    if (clamped === num) {
      props.onDecrease()
    }
  }
  const clampInputNumber = (input: number) => {
    if (input > props.maxNum) {
      input = props.maxNum
    } else if (input < props.minNum) {
      input = props.minNum
    }
    return input
  }
  return (
    <div className='flex items-center gap-3'>
      <div className={`w-[40px] text-sm`}>{props.label}</div>
      <div className='h-[34px] w-[80px]'>
        <StyledTextField
          disabled={props.disabled}
          error={props.error}
          placeholder={props.placeholder}
          onChange={(e) => {
            handleOnChange(e)
          }}
          InputProps={
            props.unit
              ? {
                  endAdornment: (
                    <InputAdornment position='start'>
                      {props.unit}
                    </InputAdornment>
                  ),
                }
              : {}
          }
          value={props.value}
        />
      </div>
      <StyledButton
        disabled={props.disabled || props.plusDisabled}
        onClick={() => {
          handleOnIncrease()
        }}
        variant='outlined'
      >
        <AddIcon />
      </StyledButton>
      <StyledButton
        disabled={props.disabled || props.minusDisabled}
        onClick={() => {
          handleOnDecrease()
        }}
        variant='outlined'
      >
        <RemoveIcon />
      </StyledButton>
    </div>
  )
}
export default BaseNumberInput
