import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/ReviewParts",
  component: Component,
} as ComponentMeta<typeof Component>

export const ReviewPartsDeleteModal = () => {
  return (
    <Component
      id={1}
      name='評価パーツ4/1用'
      onClose={() => {}}
      onComplete={() => {}}
    />
  )
}
