import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/SmallAssembly",
  component: Component,
} as ComponentMeta<typeof Component>

export const SmallAssemblyDeleteModal = () => {
  return (
    <Component
      id={1}
      name='あて原稿1003'
      onClose={() => {}}
      onComplete={() => {}}
    />
  )
}
