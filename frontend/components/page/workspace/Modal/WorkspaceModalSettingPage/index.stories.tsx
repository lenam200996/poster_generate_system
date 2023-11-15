import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSettingPage>

export const WorkspaceModalSettingPage = () => {
  const [shown, setShown] = useState<boolean>(false)

  const initialize = () => {
    setShown(false)
  }

  const handleOnExact = () => {
    setShown(false)
  }

  const handleOnClose = () => {
    initialize()
  }

  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        ページ種別選択
      </MuiButton>
      {shown && (
        <Component
          booklet={null}
          pageNumber={1}
          onClose={handleOnClose}
          onExact={handleOnExact}
        />
      )}
    </div>
  )
}
