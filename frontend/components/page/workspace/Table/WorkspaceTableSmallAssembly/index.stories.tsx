import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { smallAssemblies } from "@/config/api/mock/workspace/index"

export default {
  title: "Page/Workspace/Table",
  component: Component,
} as ComponentMeta<typeof WorkspaceTableSmallAssembly>

export const WorkspaceTableSmallAssembly = () => {
  return <Component smallAssemblies={smallAssemblies} />
}
