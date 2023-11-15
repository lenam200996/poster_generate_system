import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { document } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectAlias>

export const WorkspaceModalSelectAlias = () => {
  return <Component document={document} />
}
