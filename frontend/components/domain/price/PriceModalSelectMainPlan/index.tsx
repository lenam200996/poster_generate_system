import { useState, ChangeEventHandler, useEffect, useMemo } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseButtonText from "@/components/base/button/BaseButtonText"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"

import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import { useApiClient } from "@/hooks/useApiClient"
import { useRecoilValue } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { EntryPlanReponseDto } from "@/openapi"
const theme = createTheme(tableRowTheme)

interface Props {
  onPrev?: () => void
  onClose?: () => void
  onReload?: () => void
  onClick?: ({
    entry_plan_id,
    travel_plan_code,
    travel_plan_name,
    hotel_code,
    room_name,
    room_code,
  }: {
    entry_plan_id: string
    travel_plan_code: string
    travel_plan_name: string
    hotel_code: string
    room_name: string
    room_code: string
  }) => void
  planList: any[]
  currentPlan?: string
}
const initPlanState = {
  applicable_room_type_id: "",
  entry_id: "",
  entry_name: "",
  entry_plan_id: "",
  entry_plan_number: "",
  is_deleted: false,
  media_yearmonth: "",
  plan_name: "",
  room_name: "",
  travel_plan_id: "",
  travel_plans: {
    delete_flag: false,
    hotel_id: "",
    number_of_adult: 0,
    reservation_stop_days: 0,
    reservation_stop_hour: "",
    travel_plan_code: "",
    travel_plan_id: "",
    travel_plan_kana_name: "",
    travel_plan_name: "",
  },
} as EntryPlanReponseDto

const PriceModalSelectMainPlan = (props: Props) => {
  const [keyword, setKeyword] = useState("")
  const manuscript = useRecoilValue(workspaceManuscriptState)

  const [plan, setPlan] = useState<EntryPlanReponseDto>(initPlanState)
  const apiClient = useApiClient()
  const handleOnChange = (value: string) => {
    const findPlan = props.planList.find(
      (x) =>
        x.entry_plan_id === value || x.travel_plans.travel_plan_code == value,
    )
    if (plan.entry_plan_id == value) setPlan(initPlanState)
    else if (findPlan) setPlan(findPlan)
  }

  const planListShow = useMemo(() => {
    return props.planList.filter(
      (x) =>
        x.travel_plans.travel_plan_code.includes(keyword) ||
        x.travel_plans.travel_plan_name.includes(keyword),
    )
  }, [props.planList, keyword])
  useEffect(() => {
    props.currentPlan && handleOnChange(props.currentPlan)
  }, []) // eslint-disable-line
  const handleClickClose = () => {
    props.onClose()
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }
  const handleOnClick = () => {
    props.onClick({
      entry_plan_id: plan.entry_plan_id,
      travel_plan_name: plan.travel_plans.travel_plan_name, //.replace(/(^\d{4})*\：/, ""),
      room_name: plan.room_name.replace(/(^\d{4})*\：/, ""),
      travel_plan_code: plan.travel_plans.travel_plan_code,
      hotel_code: manuscript.document.hotelCode,
      room_code: plan.applicable_room_type?.stock_control_room_type_code,
    })
  }

  // 再読込みボタン押下処理
  const handleOnClickReload = () => {
    // 料金表編集画面のメインプランをリロード
    // それど連動してこの画面で保持しているメインプランのデータが更新される
    props.onReload()
  }

  return (
    <div>
      <BaseModal shown={true} onClickClose={handleClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <p className='text-center text-lg font-bold'>メインプラン選択</p>
          <div className='mt-6 flex items-center'>
            <div>
              <BaseTextField
                sx={{ width: 440 }}
                size='small'
                placeholder='プランコード・プラン名'
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className='ml-8 space-x-11'>
              {/* <MuiButton variant='contained' sx={{ width: 104 }}>
                検索
              </MuiButton> */}
              <BaseButtonText
                disabled={keyword === ""}
                onClick={() => setKeyword("")}
              >
                <span className='text-[15px] leading-6'>クリア</span>
              </BaseButtonText>
            </div>
            <div className='!absolute top-[10px] right-[50px]'>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={() => handleOnClickReload()}
              >
                再読込み
              </MuiButton>
            </div>
          </div>
          {/** in content */}
          <div className='mt-6'>
            <RadioGroup
              defaultValue={""}
              name='category'
              // onChange={(event) => handleOnChange(event.target.value)}
              onClick={(event: any) => handleOnChange(event.target.value)}
              unselectable='on'
            >
              <MuiTableContainer
                sx={{ maxHeight: 340 }}
                className='rounded border-[1px] border-solid border-divider-accent-primary'
              >
                <MuiTable stickyHeader>
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell
                        align='center'
                        padding='none'
                        sx={{ minWidth: "50px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          選択
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ minWidth: "120px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          プランコード
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "100%", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          プラン名
                        </div>
                      </MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    <ThemeProvider theme={theme}>
                      {planListShow.map((x) => (
                        <MuiTableRow key={x.entry_plan_id}>
                          <MuiTableCell align='center' padding='none'>
                            <FormControlLabel
                              checked={plan.entry_plan_id == x.entry_plan_id}
                              key={x.entry_plan_id}
                              value={x.entry_plan_id}
                              control={<Radio />}
                              label={""}
                              sx={{ margin: 0 }}
                            />
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='px-4 py-2 font-medium'>
                              {x.travel_plans.travel_plan_code}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none'>
                            <div className='px-4 py-2 font-medium'>
                              {(x.plan_name || "").replace(/(^\d{4})*\：/, "")}{" "}
                              ( {x.room_name} )
                            </div>
                          </MuiTableCell>
                        </MuiTableRow>
                      ))}
                    </ThemeProvider>
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
            </RadioGroup>
          </div>

          {/** end content */}
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickPrev}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!plan}
              onClick={handleOnClick}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default PriceModalSelectMainPlan
