import { useState, useEffect } from "react"
import BaseFilterSelect from "@/components/base/form/BaseFilterSelect"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"

interface Props {
  placeholder: string
  options: { label: string; value: string }[]
  selectedValues: string[] | []
  onExact: Function
}

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: 14,
    borderColor: "#C0C8CC",
    padding: "0px 8px",
    height: "40px",
  },
})

const BaseFilterSelectCheckboxWithTextFilter = (props: Props) => {
  const [filterText, setFilterText] = useState("")
  const [values, setValues] = useState<string[]>(props.selectedValues)
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
    setFilterText("")
  }
  return (
    <BaseFilterSelect placeholder={props.placeholder} onExact={handleExact}>
      <div className='pt-2 pb-4'>
        <StyledTextField
          value={filterText}
          size='small'
          placeholder='例) 山田 太郎'
          fullWidth
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <div className='h-[200px] w-[calc(224px_-_1rem)] overflow-y-auto'>
        <FormGroup>
          {props.options
            .filter((option) => option.label.indexOf(filterText) > -1)
            .map((option) => (
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
export default BaseFilterSelectCheckboxWithTextFilter
