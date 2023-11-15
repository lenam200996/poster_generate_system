import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalOutputCofirmPlan>

export const WorkspaceModalOutputCofirmPlan = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        原稿書き出し確認
      </MuiButton>
      {shown && (
        <Component
          planTitle='ソラリア西鉄ホテル銀座の原稿'
          onClose={() => setShown(false)}
        />
      )}
    </div>
  )
}
