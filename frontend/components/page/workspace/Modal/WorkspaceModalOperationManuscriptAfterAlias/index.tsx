import { useState, useEffect } from "react"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import MuiDivider from "@mui/material/Divider"
import WorkspaceModalCancelAlias from "@/components/page/workspace/Modal/WorkspaceModalCancelAlias"
import BaseModalManuscriptOperation from "@/components/base/overlay/BaseModalManuscriptOperation"

type DisplayStatus =
  | "manuscriptMove"
  | "manuscriptDelete"
  | "cancelAlias"
  | "none"

type Props = {
  manuscriptId: string
  manuscriptName?: string
  onClose?: Function
}

const WorkspaceModalPlanOperation = (props: Props) => {
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")

  const handleOnNext = ({
    selectedValue,
  }: {
    selectedValue: DisplayStatus
  }) => {
    setDisplayStatus(selectedValue)
  }

  return (
    <>
      <BaseModalManuscriptOperation
        onNext={handleOnNext}
        onClose={() => props.onClose()}
      >
        <MuiDivider
          sx={{ width: 570, margin: "auto", color: "#1976D2" }}
          textAlign='center'
        >
          操作
        </MuiDivider>
        <div className='m-auto mb-11 mt-9 grid w-max grid-cols-2 gap-5'>
          <BaseRadioSquare label='移動' value='manuscriptMove' />
          <BaseRadioSquare label='削除' value='manuscriptDelete' />
        </div>
        <MuiDivider
          sx={{ width: 570, margin: "auto", color: "#1976D2" }}
          textAlign='center'
        >
          設定
        </MuiDivider>
        <div className='m-auto mb-11 mt-9 grid w-max grid-cols-1 gap-5'>
          <BaseRadioSquare label='相乗り解除' value='cancelAlias' />
        </div>
      </BaseModalManuscriptOperation>
      {displayStatus === "cancelAlias" && (
        <WorkspaceModalCancelAlias
          id={props.manuscriptId}
          onClose={() => setDisplayStatus("none")}
          onExact={() => setDisplayStatus("none")}
        />
      )}
    </>
  )
}

export default WorkspaceModalPlanOperation
