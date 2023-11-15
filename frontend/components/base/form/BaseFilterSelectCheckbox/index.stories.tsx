import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import { copiesMock } from "@/config/api/mock/projects"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFilterSelectCheckbox = () => {
  const [values, setValues] = useState<string[]>([])
  const handleExact = (values: string[]) => {
    console.log(values)
    setValues(values)
  }
  return (
    <Component
      placeholder='版'
      options={copiesMock}
      onExact={handleExact}
      selectedValues={values}
    />
  )
}
