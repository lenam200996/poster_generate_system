import { useState, useEffect } from "react"
import BaseFilterSelect from "@/components/base/form/BaseFilterSelect"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import { styled } from "@mui/material/styles"

interface Props {
  placeholder: string
  options: { label: string; value: string }[]
  value?: string
  onExact: Function
}

const StyledFormControlLabel = styled(FormControlLabel)({
  "& .MuiFormControlLabel-label": {
    fontSize: 14,
    color: "#001F29",
  },
})

const BaseFilterSelectRadio = (props: Props) => {
  const [value, setValue] = useState<string>("")
  const handleChange = (value: any) => {
    setValue(value)
  }
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  const handleExact = () => {
    props.onExact(value)
  }
  return (
    <BaseFilterSelect placeholder={props.placeholder} onExact={handleExact}>
      <div className='max-h-[228px] overflow-y-auto'>
        <FormGroup>
          {props.options.map((option) => (
            <StyledFormControlLabel
              key={option.label}
              value={option.value}
              label={option.label}
              control={
                <Radio
                  disableRipple
                  size='small'
                  checked={option.value === value}
                  onChange={(event) => handleChange(event.target.value)}
                />
              }
            />
          ))}
        </FormGroup>
      </div>
    </BaseFilterSelect>
  )
}
export default BaseFilterSelectRadio
