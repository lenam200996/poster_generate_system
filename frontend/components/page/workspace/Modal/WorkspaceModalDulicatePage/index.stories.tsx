import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalMovePage>

export const WorkspaceModalMovePage = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        入れ替え
      </MuiButton>
      {shown && <Component pageNumber={1} onClose={() => setShown(false)} />}
    </div>
  )
}
