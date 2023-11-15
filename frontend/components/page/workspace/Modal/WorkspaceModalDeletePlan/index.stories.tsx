import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalDeletePlan>

export const WorkspaceModalDeletePlan = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        原稿削除
      </MuiButton>
      {shown && (
        <Component
          id={1}
          order={1}
          planTitle='ソラリア西鉄ホテル銀座の原稿'
          onClose={() => setShown(false)}
          onComplete={() => setShown(false)}
        />
      )}
    </div>
  )
}
