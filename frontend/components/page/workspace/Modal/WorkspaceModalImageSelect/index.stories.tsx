import { RecoilRoot } from "recoil"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"
import { mockImageItems } from "@/config/api/mock/workspace/image"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
} as ComponentMeta<typeof WorkspaceModalImageSelect>

export const WorkspaceModalImageSelect = () => {
  const [shown, setShown] = useState<boolean>(false)
  const [items, setItems] = useState(mockImageItems)
  return (
    <div>
      <MuiButton variant='contained' onClick={() => setShown(true)}>
        選択
      </MuiButton>
      {shown && (
        <Component
          items={items}
          useCodes={[1000]}
          onSelect={(id) => console.log("onSelect", id)}
          categoryOptions={null}
          typeOptions={null}
          onReload={() => {
            console.log("onReload")
            setItems((state) => [...state])
          }}
          onClose={() => setShown(false)}
        />
      )}
    </div>
  )
}
