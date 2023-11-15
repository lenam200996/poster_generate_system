import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFilterInputText = () => {
  const handleExact = (value: string) => {
    //
  }
  return <Component placeholder='版' onExact={handleExact} />
}
