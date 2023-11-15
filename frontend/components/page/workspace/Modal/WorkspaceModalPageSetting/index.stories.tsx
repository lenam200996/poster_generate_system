import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalPageSetting>

export const WorkspaceModalPageSetting = () => {
  return (
    <>
      <Component pageNumber={1} booklet={null} />
    </>
  )
}
