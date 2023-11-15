import { useState, useEffect } from "react"
import BaseFilterSelect from "@/components/base/form/BaseFilterSelect"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"

interface Props {
  placeholder: string
  options: { label: string; value: string }[]
  selectedValues: string[] | []
  onExact: Function
}

const BaseFilterSelectCheckbox = (props: Props) => {
  const [values, setValues] = useState<string[]>([])
  const handleChange = (value: any) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value))
    } else {
      setValues([...values, value])
    }
  }
  useEffect(() => {
    setValues(props.selectedValues)
  }, [props.selectedValues])

  const handleExact = () => {
    props.onExact(values)
  }

  return (
    <BaseFilterSelect placeholder={props.placeholder} onExact={handleExact}>
      <div className='max-h-[228px] overflow-y-auto'>
        <FormGroup>
          {props.options.map((option) => (
            <FormControlLabel
              key={option.label}
              control={
                <Checkbox
                  key={option.value}
                  disableRipple
                  value={option.value}
                  size='small'
                  checked={values.includes(option.value)}
                  onChange={(event) => handleChange(event.target.value)}
                />
              }
              label={
                <div className='pl-1 text-sm text-content-default-primary'>
                  {option.label}
                </div>
              }
            />
          ))}
        </FormGroup>
      </div>
    </BaseFilterSelect>
  )
}
export default BaseFilterSelectCheckbox
