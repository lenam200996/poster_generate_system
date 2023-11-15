import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModaSelectLayout>

export const WorkspaceModaSelectLayout = () => {
  const [shown, setShown] = useState<boolean>(true)
  const handleOnExact = () => {
    setShown(false)
  }
  return (
    <div>
      <MuiButton variant='outlined' onClick={() => setShown(true)}>
        モーダルを表示する
      </MuiButton>
      <Component
        shown={shown}
        pageNumber={1}
        onExact={handleOnExact}
        onClose={() => setShown(false)}
      />
    </div>
  )
}
