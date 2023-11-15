import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Typography",
  component: Component,
} as ComponentMeta<typeof BaseErrorBody>

export const BaseErrorBody = () => {
  return <Component>エラー文</Component>
}
