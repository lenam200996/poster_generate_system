import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { chartTitleTemplates } from "@/config/api/mock/workspace"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectDesignTemplateChartTitle>

export const WorkspaceModalSelectDesignTemplateChartTitle = () => {
  const handleOnPrev = () => {}
  const handleOnClose = () => {}
  const handleOnSelect = () => {}
  return (
    <Component
      shown={true}
      items={chartTitleTemplates}
      onPrev={handleOnPrev}
      onClose={handleOnClose}
      onSelect={handleOnSelect}
    />
  )
}
