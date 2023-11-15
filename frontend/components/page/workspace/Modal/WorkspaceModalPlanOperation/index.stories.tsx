import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { page } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalPlanOperation>

export const WorkspaceModalPlanOperation = () => {
  return (
    <>
      <Component
        documentSize={"ONE_ONE"}
        page={page}
        order={1}
        bookletLocked={false}
      />
    </>
  )
}
