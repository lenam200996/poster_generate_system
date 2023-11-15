import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import { manuscriptSizesMock } from "@/config/api/mock/projects"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

const mockData = [...manuscriptSizesMock]

export const BaseFilterSelectRadio = () => {
  const [value, setValue] = useState<string>("")
  const handleExact = (value: string) => {
    console.log(value)
    setValue(value)
  }
  return (
    <Component
      placeholder='原稿サイズ'
      options={mockData}
      onExact={handleExact}
      value={value}
    />
  )
}
