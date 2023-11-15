import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseSortSelectbox = () => {
  const [value, setValue] = useState("")
  const handleOnChange = (value: string) => {
    setValue(value)
  }
  const list = [
    { label: "作成順", value: "作成順" },
    { label: "年月号順", value: "年月号順" },
  ]
  return (
    <Component
      options={list}
      selectedValue='年月号順'
      onChange={handleOnChange}
    />
  )
}
