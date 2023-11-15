import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Project",
  component: Component,
} as ComponentMeta<typeof ProjectDeleteModal>

export const ProjectDeleteModal = () => {
  return (
    <Component
      id={1}
      year={2023}
      month={10}
      media='本誌'
      onClose={() => {}}
      onComplete={() => {}}
    />
  )
}
