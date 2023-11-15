import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectIndexHeader>

export const WorkspaceModalSelectIndexHeader = () => {
  return (
    <Component
      shown={true}
      pageNumber={1}
      onClose={() => {}}
      onExact={() => {}}
      onPrev={() => {}}
    />
  )
}
