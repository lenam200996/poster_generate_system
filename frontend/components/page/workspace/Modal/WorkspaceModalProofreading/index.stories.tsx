import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"
import { document } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalProofreading>

export const WorkspaceModalProofreading = () => {
  const [shown, setShown] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  return (
    <div>
      <MuiButton
        variant='contained'
        onClick={() => setShown(true)}
        disabled={disabled}
      >
        校正
      </MuiButton>
      {shown && (
        <Component
          document={document}
          onClose={() => setShown(false)}
          onComplete={() => {
            setShown(false)
            setDisabled(true)
          }}
        />
      )}
    </div>
  )
}
