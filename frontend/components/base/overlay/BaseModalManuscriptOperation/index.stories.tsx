import { RecoilRoot } from "recoil"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"
import MuiDivider from "@mui/material/Divider"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import WorkspaceModalDeletePlan from "@/components/page/workspace/Modal/WorkspaceModalDeletePlan"

export default {
  title: "Base/Overlay",
  component: Component,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
} as ComponentMeta<typeof BaseModalManuscriptOperation>

type DisplayStatus = "edit" | "move" | "deletePlan" | "none"

export const BaseModalManuscriptOperation = () => {
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
      <Component onNext={handleOnNext}>
        <MuiDivider
          sx={{ width: 570, margin: "auto", color: "#1976D2" }}
          textAlign='center'
        >
          操作
        </MuiDivider>
        <div className='m-auto mt-9 mb-11 grid w-max grid-cols-3 gap-5'>
          <BaseRadioSquare label='編集' value='edit' />
          <BaseRadioSquare label='移動' value='move' />
          <BaseRadioSquare label='削除' value='deletePlan' />
        </div>
        {displayStatus === "deletePlan" && (
          <WorkspaceModalDeletePlan
            id={1}
            order={1}
            planTitle={"ダミーテキスト"}
            onClose={() => setDisplayStatus("none")}
            onComplete={() => setDisplayStatus("none")}
          />
        )}
      </Component>
    </>
  )
}
