import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalDraftConfirm>

export const WorkspaceModalDraftConfirm = () => {
  const [shown, setShown] = useState<boolean>(false)
  const handleOnExact = () => {
    setShown(false)
  }
  return (
    <div>
      <MuiButton variant='outlined' onClick={() => setShown(true)}>
        モーダルを表示する
      </MuiButton>
      <Component
        manuscriptExports={() => {}}
        shown={shown}
        pages={[1, 2]}
        onExact={handleOnExact}
        onClose={() => setShown(false)}
      />
    </div>
  )
}
