import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import { salesManagerMock } from "@/config/api/mock/projects"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFilterSelectCheckboxWithTextFilter = () => {
  const [values, setValues] = useState<string[]>([])
  const handleExact = (values: string[]) => {
    setValues(values)
  }
  return (
    <Component
      placeholder='営業担当'
      options={salesManagerMock}
      onExact={handleExact}
      selectedValues={values}
    />
  )
}
