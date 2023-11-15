import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { page } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectCopyType>

export const WorkspaceModalSelectCopyType = () => {
  return (
    <>
      <Component page={page} documentSize='ONE_ONE' order={1} />
    </>
  )
}
