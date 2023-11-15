import React, { useEffect } from "react"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import MuiTableBody from "@mui/material/TableBody"
import { PlanItem } from "./PlanItem"
import { EntryPlanReponseDto } from "@/openapi"
const InfiniteScroll: React.FC<{
  items: Array<
    EntryPlanReponseDto & {
      customName: string
      customNameFlag: boolean
      selected: boolean
      numberGuest: number[]
    }
  >
  pattern: string
  handleOnChangePlan: (event: any, id: string) => void
  handleOnChangeHiddenName: ({
    planId,
    hiddenName,
  }: {
    planId: string
    hiddenName: string
  }) => void
  handleOnChangeManualFlag: ({
    id,
    checked,
  }: {
    id: string
    checked: boolean
  }) => void
  handleOnChangeRoomIds: ({
    id,
    option,
    checked,
  }: {
    id: string
    option: string | number
    checked: boolean
  }) => void
}> = ({
  items,
  handleOnChangePlan,
  handleOnChangeHiddenName,
  handleOnChangeManualFlag,
  handleOnChangeRoomIds,
  pattern,
}: {
  items: Array<
    EntryPlanReponseDto & {
      customName: string
      customNameFlag: boolean
      selected: boolean
      numberGuest: number[]
    }
  >
  pattern: string
  handleOnChangePlan: (event: any, id: string) => void
  handleOnChangeHiddenName: ({
    planId,
    hiddenName,
  }: {
    planId: string
    hiddenName: string
  }) => void
  handleOnChangeManualFlag: ({
    id,
    checked,
  }: {
    id: string
    checked: boolean
  }) => void
  handleOnChangeRoomIds: ({
    id,
    option,
    checked,
  }: {
    id: string
    option: string | number
    checked: boolean
  }) => void
}) => {
  const theme = createTheme(tableRowTheme)
  return (
    <MuiTableBody>
      <ThemeProvider theme={theme}>
        {items.map((data, index) => (
          <PlanItem
            handleOnChangeHiddenName={handleOnChangeHiddenName}
            handleOnChangePlan={handleOnChangePlan}
            handleOnChangeRoomIds={handleOnChangeRoomIds}
            onHandleOnChangeManualFlag={handleOnChangeManualFlag}
            pattern={pattern}
            data={data}
            key={data.entry_plan_id}
            setHiddenName={(value) =>
              handleOnChangeHiddenName({
                planId: data.entry_plan_id,
                hiddenName: value,
              })
            }
          />
        ))}
      </ThemeProvider>
    </MuiTableBody>
  )
}

export default InfiniteScroll
