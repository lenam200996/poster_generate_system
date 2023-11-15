import { useState, useEffect } from "react"
import TextField from "@mui/material/TextField"
import BaseFilterSelect from "@/components/base/form/BaseFilterSelect"
import { styled } from "@mui/material/styles"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"

interface Props {
  placeholder?: string
  value?: string
  onExact: Function
  maxLength?: number
}

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: 14,
    borderColor: "#C0C8CC",
    padding: "0px 8px",
    height: "32px",
  },
})

const schema = z.object({
  hotelCodeInvalidError: z
    .string()
    .regex(
      new RegExp("^[0-9]{4}$"),
      errorMessage.FOUR_DIGIT_NUMBER_LIMIT_ERROR,
    ),
})

const BaseFilterInputText = (props: Props) => {
  const [value, setValue] = useState(props.value)
  const [errors, setErrors] = useState(null)
  const handleExact = () => {
    setErrors(null)
    const result: SafeParseReturnType<
      { hotelCodeInvalidError: typeof value },
      any
    > = schema.safeParse({
      hotelCodeInvalidError: value,
    })
    if (props.placeholder === "宿コード" && !result.success) {
      setErrors(
        (result as SafeParseError<typeof value>).error.flatten().fieldErrors,
      )
      return
    }
    props.onExact(value)
  }
  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <BaseFilterSelect
      placeholder={props.placeholder}
      onExact={handleExact}
      validationError={errors?.hotelCodeInvalidError}
    >
      <div className='pt-3'>
        <StyledTextField
          inputProps={props?.maxLength && { maxLength: props.maxLength }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!errors?.hotelCodeInvalidError}
        />
      </div>
      {errors?.hotelCodeInvalidError && (
        <div className='pt-1'>
          <BaseErrorBody>{errors.hotelCodeInvalidError}</BaseErrorBody>
        </div>
      )}
    </BaseFilterSelect>
  )
}
export default BaseFilterInputText
