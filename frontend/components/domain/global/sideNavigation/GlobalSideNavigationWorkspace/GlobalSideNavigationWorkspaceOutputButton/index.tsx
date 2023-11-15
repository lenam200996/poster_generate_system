import { useState, useEffect } from "react"
import { useRecoilValue, useRecoilState } from "recoil"
import { workspaceOutputsState } from "@/atoms/workspace"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"

import WorkspaceModalDraftConfirm from "@/components/page/workspace/Modal/WorkspaceModalDraftConfirm"
type Props = {
  manuscriptExports: (selected: any, type) => void
}
const GlobalSideNavigationWorkspaceOutputButton = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const outputsRecoilState = useRecoilValue(workspaceOutputsState)
  const [navigationVisible, setNavigationVisible] = useRecoilState(
    GlobalNavigationVisibleState,
  )
  useEffect(() => {
    if (!shown) {
      setNavigationVisible(false)
    }
  }, [shown]) // eslint-disable-line

  const handleOnClick = () => {
    if (outputsRecoilState.length > 0) {
      setShown(true)
    }
  }

  const handleOnClose = () => {
    setShown(false)
  }

  const handleOnExact = () => {
    setShown(false)
  }
  const handleAddManuscriptExport = (selected: any, type) => {
    props.manuscriptExports && props.manuscriptExports(selected, type)
  }

  return (
    <div>
      <BaseSideNavigationButton icon='output' onClick={handleOnClick}>
        書き出し
      </BaseSideNavigationButton>
      <WorkspaceModalDraftConfirm
        manuscriptExports={handleAddManuscriptExport}
        shown={shown}
        pages={outputsRecoilState}
        onClose={handleOnClose}
      />
    </div>
  )
}

export default GlobalSideNavigationWorkspaceOutputButton
