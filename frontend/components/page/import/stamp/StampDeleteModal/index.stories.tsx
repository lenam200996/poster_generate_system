import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/Stamp",
  component: Component,
} as ComponentMeta<typeof Component>

export const StampDeleteModal = () => {
  return (
    <Component
      id={1}
      name='75点＿お風呂評価アイコン'
      onClose={() => {}}
      onComplete={() => {}}
    />
  )
}
