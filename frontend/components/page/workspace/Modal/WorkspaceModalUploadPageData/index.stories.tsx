import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import MuiButton from "@mui/material/Button"
import { booklet } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalUploadPageData>

export const WorkspaceModalUploadPageData = () => {
  const [shown, setShown] = useState<boolean>(false)
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
        pageType='HOTEL_MANUSCRIPT'
        pageNumber={3}
        booklet={booklet}
        onExact={handleOnExact}
        onClose={() => setShown(false)}
      />
    </div>
  )
}
