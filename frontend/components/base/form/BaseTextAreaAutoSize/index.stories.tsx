import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseTextAreaAutoSize = () => {
  const [value, setValue] = useState("")
  const handleOnChange = (value) => {
    setValue(value)
  }
  return (
    <div className='w-[440px]'>
      <Component
        minRows={4}
        value={value}
        onChange={(event) => handleOnChange(event.target.value)}
      />
    </div>
  )
}
