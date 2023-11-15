import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"
import { page } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalDeletePage>

export const WorkspaceModalDeletePage = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        ページの削除確認
      </MuiButton>
      {shown && (
        <Component
          page={page}
          pageNumber={36}
          onClose={() => setShown(false)}
        />
      )}
    </div>
  )
}
