import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/ProjectManagement",
  component: Component,
} as ComponentMeta<typeof ProjectCSVOutputModal>

export const ProjectCSVOutputModal = () => {
  return (
    <Component
      projectId={1}
      media='ゆこゆこ本誌'
      year={2023}
      month={10}
      selectedPlates={[]}
    />
  )
}
