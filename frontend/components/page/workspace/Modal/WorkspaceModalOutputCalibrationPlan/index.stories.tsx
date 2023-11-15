import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalOutputCalibrationPlan>

export const WorkspaceModalOutputCalibrationPlan = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        校正依頼用書き出し確認
      </MuiButton>
      <Component
        shown={shown}
        planTitle='ソラリア西鉄ホテル銀座の原稿'
        onClose={() => setShown(false)}
      />
    </div>
  )
}
