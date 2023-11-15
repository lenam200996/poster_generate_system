import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Table",
  component: Component,
} as ComponentMeta<typeof WorkspaceTableChapterTitle>

export const WorkspaceTableChapterTitle = () => {
  return <Component chartTitles={[]} />
}
