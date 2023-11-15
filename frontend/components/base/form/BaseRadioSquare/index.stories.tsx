import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import RadioGroup from "@mui/material/RadioGroup"
import FormControl from "@mui/material/FormControl"
import { useState } from "react"

export default {
  title: "Base/Form/BaseRadioSquare",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseRadioSquare = () => {
  const [value, setValue] = useState<string>("")
  const handleChange = (value: string) => {
    setValue(value)
  }
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={value}
        onChange={(event) => handleChange(event.target.value)}
      >
        <div className='flex w-[445px] justify-between'>
          <Component label='male' value='male' selected={value === "male"} />
          <Component
            label='female'
            value='female'
            selected={value === "female"}
          />
        </div>
      </RadioGroup>
    </FormControl>
  )
}
