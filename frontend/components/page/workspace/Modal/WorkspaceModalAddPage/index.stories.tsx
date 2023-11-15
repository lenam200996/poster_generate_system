import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalAddPage>

export const WorkspaceModalAddPage = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <Fab
        color='primary'
        aria-label='add'
        onClick={() => () => setShown(true)}
      >
        <AddIcon />
      </Fab>
      {shown && <Component onClose={() => setShown(false)} />}
    </div>
  )
}
