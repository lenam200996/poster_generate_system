import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Project",
  component: Component,
} as ComponentMeta<typeof ProjectDeleteModal>

export const ProjectDeleteModal = () => {
  return (
    <Component
      count={1}
      onClose={() => {}}
      onComplete={() => {}}
      selectedValues={[]}
    />
  )
}
