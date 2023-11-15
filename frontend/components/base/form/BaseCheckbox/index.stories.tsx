import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseCheckbox = () => {
  const [values, setValues] = useState(["text1", "text2"])
  const handleOnChange = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value))
    } else {
      setValues([...values, value])
    }
  }
  return (
    <form className='flex items-center'>
      <Component
        label='テキスト1'
        name='text'
        value='text1'
        checked={values.includes("text1")}
        onChange={handleOnChange}
      />
      <div className='ml-[68px]'>
        <Component
          label='テキスト2'
          name='text'
          value='text2'
          checked={values.includes("text2")}
          onChange={handleOnChange}
        />
      </div>
    </form>
  )
}
