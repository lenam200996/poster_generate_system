import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiButton from "@mui/material/Button"
import WorkspaceModalUploadPageData from "../WorkspaceModalUploadPageData"
import { booklet } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalSelectPageType>

export const WorkspaceModalSelectPageType = () => {
  const [shownSelectPageType, setShownSelectPageType] = useState<boolean>(false)
  const [shownUploadPageData, setShownUploadPageData] = useState<boolean>(false)

  const initialize = () => {
    setShownSelectPageType(false)
    setShownUploadPageData(false)
  }

  const handleOnNext = () => {
    setShownSelectPageType(false)
    setShownUploadPageData(true)
  }

  const handleOnClose = () => {
    initialize()
  }

  const handleOnExact = () => {
    initialize()
  }

  return (
    <div>
      <MuiButton
        variant='contained'
        onClick={() => setShownSelectPageType(true)}
      >
        ページ種別選択
      </MuiButton>
      <Component
        booklet={booklet}
        pageNumber={3}
        shown={shownSelectPageType}
        onClose={handleOnClose}
      />
      <WorkspaceModalUploadPageData
        shown={shownUploadPageData}
        pageType='HOTEL_MANUSCRIPT'
        pageNumber={3}
        booklet={booklet}
        onClose={handleOnClose}
        onExact={handleOnExact}
      />
    </div>
  )
}
