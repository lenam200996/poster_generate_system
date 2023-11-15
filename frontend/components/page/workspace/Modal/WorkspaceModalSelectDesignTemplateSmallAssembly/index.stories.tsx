import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { smallAssemblyTemplates } from "@/config/api/mock/workspace"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectDesignTemplateSmallAssembly>

export const WorkspaceModalSelectDesignTemplateSmallAssembly = () => {
  const handleOnPrev = () => {}
  const handleOnClose = () => {}
  const handleOnSelect = () => {}
  return (
    <Component
      shown={true}
      items={smallAssemblyTemplates}
      onPrev={handleOnPrev}
      onClose={handleOnClose}
      onSelect={handleOnSelect}
    />
  )
}
