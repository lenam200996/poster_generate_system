import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalPartsSelect>

export const WorkspaceModalPartsSelect = () => {
  const [shown, setShown] = useState<boolean>(false)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        パーツ選択
      </MuiButton>
      {shown && (
        <Component
          items={[]}
          onSelect={(id) => console.log("onSelect", id)}
          onClose={() => setShown(false)}
          partsCategoryList={[]}
        />
      )}
    </div>
  )
}
