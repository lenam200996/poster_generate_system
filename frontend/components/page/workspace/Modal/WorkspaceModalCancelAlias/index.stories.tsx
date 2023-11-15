import { RecoilRoot } from "recoil"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
} as ComponentMeta<typeof WorkspaceModalCancelAlias>

export const WorkspaceModalCancelAlias = () => {
  return (
    <>
      <Component id={"1"} onClose={() => {}} onExact={() => {}} />
    </>
  )
}
