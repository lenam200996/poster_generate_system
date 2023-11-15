import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import MuiButton from "@mui/material/Button"
import { document } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalCreateLink>

export const WorkspaceModalCreateLink = () => {
  const [shown, setShown] = useState<boolean>(true)

  return (
    <>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        リンク取得
      </MuiButton>
      {shown && (
        <Component manuscript={document} onClose={() => setShown(false)} />
      )}
    </>
  )
}
