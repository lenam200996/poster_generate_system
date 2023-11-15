import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { document } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectDiversion>

export const WorkspaceModalSelectDiversion = () => {
  return <Component document={document} />
}
