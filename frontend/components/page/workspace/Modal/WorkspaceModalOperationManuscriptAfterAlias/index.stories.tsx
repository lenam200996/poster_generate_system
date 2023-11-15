import { RecoilRoot } from "recoil"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
} as ComponentMeta<typeof WorkspaceModalOperationManuscriptAfterAlias>

export const WorkspaceModalOperationManuscriptAfterAlias = () => {
  return (
    <>
      <Component manuscriptId='1' />
    </>
  )
}
