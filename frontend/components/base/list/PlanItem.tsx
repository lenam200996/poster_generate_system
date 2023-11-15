import { ChangeEvent, useEffect, useState } from "react"

import MuiTableRow from "@mui/material/TableRow"
import MuiTableCell from "@mui/material/TableCell"
import MuiCheckbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import BaseTextField from "@/components/base/form/BaseTextField"
import { EntryPlanReponseDto } from "@/openapi"
import { countBytes } from "@/util/strings"

export const PlanItem: React.FC<{
  data: EntryPlanReponseDto & {
    customName: string
    customNameFlag: boolean
    selected: boolean
    numberGuest: number[]
  }
  setHiddenName: (value: string) => void
  pattern: string
  handleOnChangePlan: (event: any, id: string) => void
  handleOnChangeHiddenName: ({
    planId,
    hiddenName,
  }: {
    planId: string
    hiddenName: string
  }) => void
  onHandleOnChangeManualFlag: ({
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
  data,
  setHiddenName,
  handleOnChangePlan,
  onHandleOnChangeManualFlag,
  handleOnChangeRoomIds,
  pattern,
}) => {
  const [name, setName] = useState(
    data.customName || data.room_name.replace(/(^\d{4})*\：/, "").slice(0, 80),
  )
  const onChangeName = (value: string) => {
    setName(value)
  }
  useEffect(() => {
    setHiddenName(name)
  }, [name])

  const GuestCheckBox: React.FC<{
    option: string | number
    checked: boolean
    id: string
    disabled: boolean
  }> = ({ option, checked, id, disabled }) => {
    return (
      <FormControlLabel
        key={option}
        sx={{
          fontSize: "14px",
          marginRight: "8px",
        }}
        control={
          <MuiCheckbox
            disabled={disabled}
            key={option}
            disableRipple
            size='small'
            value={option}
            checked={checked}
            onChange={(e) =>
              handleOnChangeRoomIds({
                id: id,
                option,
                checked: e.target.checked,
              })
            }
          />
        }
        label={`${option}名`}
      />
    )
  }
  return (
    <MuiTableRow key={data.entry_plan_id} aria-label={data.entry_plan_id}>
      <MuiTableCell align='center' padding='none' sx={{ paddingY: "8px" }}>
        {data.selected ? (
          <MuiCheckbox
            disableRipple
            size='small'
            checked={true}
            onClick={(event) => {
              handleOnChangePlan(
                {
                  target: {
                    checked: false,
                  },
                } as ChangeEvent<HTMLInputElement>,
                data.entry_plan_id,
              )
            }}
          />
        ) : (
          <MuiCheckbox
            disableRipple
            size='small'
            checked={false}
            onClick={(event) => {
              handleOnChangePlan(
                {
                  target: {
                    checked: true,
                  },
                } as ChangeEvent<HTMLInputElement>,
                data.entry_plan_id,
              )
            }}
          />
        )}
        {/* <MuiCheckbox
          disableRipple
          size='small'
          // checked={data.selected}
          value={data.selected}
          onChange={(event) => {
            console.log({ data: data.entry_plan_id })
            handleOnChangePlan(event, data.entry_plan_id)
          }}
        /> */}
      </MuiTableCell>
      <MuiTableCell padding='none'>
        <div className='flex items-center'>
          <div className='px-4 py-2 font-medium'>
            {!data.plan_name || data.plan_name == "："
              ? `${data.travel_plans.travel_plan_code}: ${data.travel_plans.travel_plan_name}`
              : data.plan_name}
          </div>
          {data.selected && data.customNameFlag && (
            <BaseTextField
              key={data.entry_plan_id}
              size='small'
              sx={{ width: 180 }}
              value={name}
              onChange={(event) => {
                const value = event.target.value
                if (countBytes(value) <= 160) {
                  onChangeName(event.target.value)
                }
              }}
            />
          )}
        </div>
      </MuiTableCell>
      <MuiTableCell align='center' padding='none'>
        <div className='px-4 py-2 text-left font-medium'>{data.room_name}</div>
      </MuiTableCell>
      <MuiTableCell align='center' padding='none'>
        {data.selected && (
          <MuiCheckbox
            disableRipple
            size='small'
            checked={data.customNameFlag}
            onChange={(event) =>
              onHandleOnChangeManualFlag({
                id: data.entry_plan_id,
                checked: event.target.checked,
              })
            }
          />
        )}
      </MuiTableCell>
      <MuiTableCell align='center' padding='none'>
        {data.selected &&
          !["D", "E"].includes(pattern) &&
          // data.numberOfGuestByRooms
          [1, 2, 3, 4, 5].map((option) => (
            <GuestCheckBox
              disabled={["D", "E"].includes(pattern)}
              key={option}
              option={option}
              id={`${option}`}
              checked={data.numberGuest.includes(option)}
            />
          ))}
      </MuiTableCell>
    </MuiTableRow>
  )
}
