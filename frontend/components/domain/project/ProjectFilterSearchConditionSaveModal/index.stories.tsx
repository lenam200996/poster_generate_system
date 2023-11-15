import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Project",
  component: Component,
} as ComponentMeta<typeof ProjectFilterSearchConditionSaveModal>

export const ProjectFilterSearchConditionSaveModal = () => {
  return <Component onSave={(name) => {}} />
}
