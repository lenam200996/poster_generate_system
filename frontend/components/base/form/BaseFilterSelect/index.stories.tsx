import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFilterSelect = () => {
  return <Component placeholder='版'>コンテンツが入ります</Component>
}
