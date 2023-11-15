import { useState, useEffect, useMemo } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import MuiTable from "@mui/material/Table"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import { createTheme } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import { appearancePatternMock } from "@/config/api/mock/workspace/priceTable"

import PriceModalAddSeason from "@/components/domain/price/PriceModalAddSeason"
import { useApiClient } from "@/hooks/useApiClient"
import dayjs from "dayjs"
import MuiCircularProgress from "@mui/material/CircularProgress"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  workspaceBookletState,
  workspaceManuscriptState,
} from "@/atoms/workspace"
import InfiniteScroll from "@/components/base/list/InfiniteScroll"
import TablePagination from "@mui/material/TablePagination"
import MuiTextField from "@mui/material/TextField"
import { EntryPlanReponseDto } from "@/openapi"
import { MediaTypeEnum } from "@/config/enum"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
const theme = createTheme(tableRowTheme)
interface Props {
  onPrev?: () => void
  onClose?: () => void
  onClick?: (price: any, excludeFlag: boolean) => void
  hotelCode: string
  planName: string
  isForMain: boolean
  planCode: string
  entryPlanId: string
  startDate?: Date | undefined
  endDate?: Date | undefined
  idEdit: string
  documentId: number
  mainEditRoomName: string
  willEditPriceTable: any
  hotelName: string
  roomCode: string
}
const PriceModalSelectPlan: React.FC<Props> = (props: Props) => {
  const bookletState = useRecoilValue(workspaceBookletState)
  const [limitPlan, setLimitPlan] = useState(50)
  const [searchPlan, setSearchPlan] = useState("")
  const [searchRoomType, setSearchRoomType] = useState("")
  const apiClient = useApiClient()
  const manuscript = useRecoilValue(workspaceManuscriptState)
  const [loading, setLoading] = useState(false)
  const [priceCreating, setPriceCreating] = useState(false)

  const [seasonFlag, setSeasonFlag] = useState(true)
  const [excludeFlag, setExcludeFlag] = useState(false)
  const [shownAddSeasonModal, setShownAddSeasonModal] = useState(false)
  const [planWithRooms, setPlanWithRooms] = useState<
    Array<
      EntryPlanReponseDto & {
        customName: string
        customNameFlag: boolean
        selected: boolean
        numberGuest: number[]
      }
    >
  >([])
  // const [hiddenName]
  const [page, setPage] = useState(0)
  const [planWithRoomsAll, setPlanWithRoomsAll] = useState<
    Array<
      EntryPlanReponseDto & {
        customName: string
        customNameFlag: boolean
        selected: boolean
        numberGuest: number[]
      }
    >
  >([])
  const [pattern, setPattern] = useState("A")
  const [periods, setPeriods] = useState<
    Array<{ ranges: Array<{ startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }> }>
  >([])

  const planWithRoomFilted = useMemo(() => {
    return planWithRooms.filter((rr) => {
      return (
        rr.plan_name.includes(searchPlan) &&
        rr.room_name.includes(searchRoomType)
      )
    })
  }, [planWithRooms, searchPlan, searchRoomType])
  const planRoomShow = useMemo(() => {
    const indexOfLastTodo = (page + 1) * limitPlan
    const indexOfFirstTodo = indexOfLastTodo - limitPlan
    return planWithRoomFilted.slice(indexOfFirstTodo, indexOfLastTodo)
  }, [planWithRoomFilted, page, limitPlan])

  useEffect(() => {
    // E - except main plan
    // A,B,C,D
    if (pattern === "E") {
      const findSelected = planWithRooms.filter((plan) => plan.selected)
      setPlanWithRooms(
        (
          prev, // pr.plan.number_of_adult == 2 &&
        ) =>
          planWithRoomsAll
            .filter(
              (pr) =>
                pr.travel_plans.travel_plan_code != props.planCode ||
                pr.applicable_room_type?.stock_control_room_type_code !=
                  props.roomCode,
            )
            .map((dr) => {
              const selected = findSelected.find(
                (plan) => plan.entry_plan_id == dr.entry_plan_id,
              )
              if (selected)
                return {
                  ...selected,
                  numberGuest: [],
                }
              else
                return {
                  ...dr,
                  numberGuest: [],
                }
            }),
      )
    } else {
      const firstPlan = planWithRooms.find((plan) => plan.selected)
      setPlanWithRooms((prev) =>
        planWithRoomsAll.map((dr) => {
          return {
            ...dr,
            selected: firstPlan && firstPlan.entry_plan_id == dr.entry_plan_id,
            numberGuest:
              (pattern === "A" && firstPlan && firstPlan.numberGuest) || [],
            customNameFlag: (firstPlan && firstPlan.customNameFlag) || false,
            customName:
              (firstPlan && firstPlan.customName) ||
              dr.room_name.replace(/(^\d{4})*\：/, "").slice(0, 80),
          }
        }),
      )
    }
    // A - 1
    // B > 1
    // C > 1
    // > 1
  }, [pattern])

  const getPlanLoadMore = async (skip: number = 0) => {
    const { data } =
      await apiClient.priceTableApiFactory.priceTableControllerGetEntryTravels(
        manuscript.document.hotelCode,
        `${manuscript.document.project.issueYear}${
          manuscript.document.project.issueMonth < 10
            ? `0${manuscript.document.project.issueMonth}`
            : manuscript.document.project.issueMonth
        }`,
        false,
        // skip
      )
    let sorted = data
      .sort(
        (a, b) =>
          Number(a.travel_plans.travel_plan_code) -
          Number(b.travel_plans.travel_plan_code),
      )
      .map((d) => {
        const numberGuest = editPriceTableJSON.numberOfGuestsByRoom
          ? editPriceTableJSON.numberOfGuestsByRoom
          : []
        let jsonCustomNameJson =
          editPriceTableJSON && editPriceTableJSON.customNames
            ? editPriceTableJSON.customNames
            : []

        jsonCustomNameJson = jsonCustomNameJson.map((json) => JSON.parse(json))
        const findCustomJSON = jsonCustomNameJson.find(
          (json) => json[d.entry_plan_id],
        )
        const customName = findCustomJSON
          ? findCustomJSON[d.entry_plan_id].customName
          : ""
        const customNameFlag = findCustomJSON
          ? findCustomJSON[d.entry_plan_id].flag
          : false
        return {
          ...d,
          customName: customName,
          customNameFlag: customNameFlag,
          selected:
            editPriceTableJSON.entry_plan_ids &&
            editPriceTableJSON.entry_plan_ids.indexOf(d.entry_plan_id) !== -1,
          numberGuest: numberGuest,
        }
      })
    const exceptMainPlan = sorted.filter(
      (pln) =>
        pln.travel_plans.travel_plan_code != props.planCode ||
        pln.applicable_room_type?.stock_control_room_type_code !=
          props.roomCode,
    )
    if (pattern === "E") {
      setPlanWithRooms(exceptMainPlan)
    } else {
      setPlanWithRooms(sorted)
    }
    setPlanWithRoomsAll(JSON.parse(JSON.stringify(sorted)))
  }

  const getPlan = async () => {
    setLoading(true)
    await getPlanLoadMore(0)
    setLoading(false)
  }
  useEffect(() => {
    if (props.willEditPriceTable) {
      setSeasonFlag(
        !editPriceTableJSON.sessions || editPriceTableJSON.sessions.length == 0,
      )
      setPattern(props.willEditPriceTable.pattern)
      if (editPriceTableJSON && editPriceTableJSON.sessions)
        setPeriods(
          editPriceTableJSON.sessions.map((ss) => {
            return {
              ranges: ss.ranges.map((ssr) => ({
                startDate: dayjs.tz(ssr.startDate, "UTC"),
                endDate: dayjs.tz(ssr.endDate, "UTC"),
              })),
            }
          }),
        )
      if (
        editPriceTableJSON &&
        editPriceTableJSON.hasOwnProperty("exclusionDate")
      ) {
        setExcludeFlag(!editPriceTableJSON.exclusionDate)
      }
    }

    getPlan()
  }, [])

  const editPriceTableJSON = useMemo(() => {
    if (!props.willEditPriceTable || !props.willEditPriceTable.settings)
      return {}
    return JSON.parse(props.willEditPriceTable.settings) //JSON.parse('{"mediaYearMonth":"202306","idEdit":"57_74_385","numberOfGuestsByRoom":[3],"entry_plan_ids":["a1C6F00000ejbZHUAY"],"mainEntryPlanName":"1515プラン（和室）","travelPlanName":["【新湯吉】テスト用（全日同料金）abc"],"customNames":["{\\"a1C6F00000ejbZHUAY\\":{\\"flag\\":true,\\"customName\\":\\"abc\\"}}"],"pattern":"A","fromDate":"2023/06/01","toDate":"2023/09/30","sessions":[{"ranges":[{"startDate":"2023-05-31T17:00:00.000Z","endDate":"2023-06-07T17:00:00.000Z"}]}],"isMain":false,"exclusionDate":false}')
  }, [props.willEditPriceTable])

  const onSelect = () => {
    setPriceCreating(true)
    // return;
    let activePlanWithRooms = planWithRooms.filter((plan) => plan.selected)
    if (
      ["A", "B", "C"].includes(pattern) &&
      activePlanWithRooms[0].numberGuest.length == 0
    ) {
      alert("一室人数を選択してください。")
      setPriceCreating(false)
      return
    }
    if (activePlanWithRooms.length > 0) {
      apiClient.priceTableApiFactory
        .priceTableControllerRegisterDraft({
          mediaYearMonth: `${manuscript.document.project.issueYear}${
            manuscript.document.project.issueMonth < 10
              ? `0${manuscript.document.project.issueMonth}`
              : manuscript.document.project.issueMonth
          }`,
          idEdit: props.idEdit,
          needEdit: props.willEditPriceTable
            ? props.willEditPriceTable.id
            : null,
          mainEntryPlanId: pattern === "D" ? props.entryPlanId : undefined,
          numberOfGuestsByRoom: ["E", "D"].includes(pattern)
            ? [2]
            : activePlanWithRooms[0].numberGuest,
          entry_plan_ids: activePlanWithRooms.map((p) => p.entry_plan_id),
          mainEntryPlanName: props.planName + `${props.mainEditRoomName}`,
          travelPlanName: activePlanWithRooms.map((p) => {
            const roomName = p.customNameFlag
              ? p.customName.replace(/(^\d{4})*\：/, "")
              : `（${p.room_name.replace(/(^\d{4})*\：/, "")}）`
            let travelNameRoom = p.travel_plans.travel_plan_name + `${roomName}`
            // if (pattern === "D") {
            //   travelNameRoom = props.mainEditRoomName
            //     ? props.mainEditRoomName
            //     : props.planName
            // }
            return travelNameRoom
          }),
          customNames: activePlanWithRooms.map((p) =>
            JSON.stringify({
              [p.entry_plan_id]: {
                flag: p.customNameFlag,
                customName: p.customName,
              },
            }),
          ),
          pattern: pattern,
          fromDate: props.startDate
            ? dayjs.tz(props.startDate, "UTC").format("YYYY/MM/DD")
            : undefined,
          toDate: props.endDate
            ? dayjs.tz(props.endDate, "UTC").format("YYYY/MM/DD")
            : undefined,
          sessions: !seasonFlag ? periods : [],
          isMain: props.isForMain,
          exclusionDate: !excludeFlag,
        })
        .then((r) => {
          if (typeof r.data === "object") {
            props.onClick(r.data, excludeFlag)
          } else alert(r.data)
          setPriceCreating(false)
        })
    }
  }
  const handleClickClose = () => {
    if (priceCreating) return
    props.onClose()
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }
  const handleOnChangePlan = (event, id: string) => {
    const { value, checked } = event.target

    let selectedPlan = planWithRooms.find((plan) => plan.selected)
    setPlanWithRooms((pev) =>
      pev.map((plan) => {
        if (plan.entry_plan_id == id) {
          plan.selected = checked
          if (checked && selectedPlan) {
            plan.numberGuest = [...selectedPlan.numberGuest]
          } else {
            plan.numberGuest = []
          }
        } else if (checked && ["A", "D"].includes(pattern)) {
          plan.selected = false
          plan.numberGuest = []
        }
        return plan
      }),
    )
  }

  const handleOnChangeManualFlag = ({
    id,
    checked,
  }: {
    id: string
    checked: boolean
  }) => {
    setPlanWithRooms((prev) =>
      prev.map((plan) => {
        if (plan.entry_plan_id === id)
          return {
            ...plan,
            customNameFlag: checked,
          }
        return plan
      }),
    )
  }

  const handleOnChangeRoomIds = ({
    id,
    option,
    checked,
  }: {
    id: string
    option: string | number
    checked: boolean
  }) => {
    // let outGuestRoom = planWithRooms.some((plan) => {
    //   if (plan.selected && plan.plan.number_of_adult < option) return true
    //   return false
    // })
    // if (outGuestRoom) return alert("The number of people does not match")
    setPlanWithRooms((prev) =>
      prev.map((plan) => {
        if (plan.selected) {
          if (checked) {
            if (plan.numberGuest.length === 4) {
              alert("選択可能な一室人数は最大4件です。")
              return plan
            } else plan.numberGuest.push(Number(option))
          } else
            plan.numberGuest.splice(plan.numberGuest.indexOf(Number(option)), 1)
        }
        return plan
      }),
    )
  }

  const handleOnChangeHiddenName = ({
    planId,
    hiddenName,
  }: {
    planId: string
    hiddenName: string
  }) => {
    setPlanWithRooms((prev) =>
      prev.map((plan) => {
        if (plan.entry_plan_id === planId)
          return {
            ...plan,
            customName: hiddenName,
          }
        return plan
      }),
    )
  }

  return (
    <div className='pt-9'>
      <BaseModal
        disableClosing={priceCreating}
        shown={true}
        onClickClose={handleClickClose}
      >
        <div className='relative h-[auto] max-h-[650px] w-[1200px] max-w-[100%]  pt-[40px] '>
          {loading && (
            <div
              style={{ backgroundColor: "rgb(0 0 0 / 9%)" }}
              className='absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center'
            >
              <MuiCircularProgress />
            </div>
          )}
          <MuiButton
            className='!absolute top-[10px] right-[50px]'
            variant='contained'
            sx={{ minWidth: 104 }}
            onClick={getPlan}
          >
            再読込み
          </MuiButton>
          <p className='px-[50px] text-left text-lg font-bold'>料金表</p>
          <div className='h-[100%] max-h-[580px]  overflow-y-auto overflow-x-hidden px-[50px]'>
            <div className='mt-5 flex items-center justify-between'>
              <div className='space-x-11'>
                <div className=''>
                  <MuiSelect
                    size='small'
                    sx={{ minWidth: 250, height: 32 }}
                    displayEmpty
                    defaultValue={"A"}
                    inputProps={{ "aria-label": "Without label" }}
                    name='thumbIndexId'
                    value={pattern}
                    onChange={(event) => {
                      console.log("Pattern Selected: ", pattern)
                      setPattern(event.target.value)
                    }}
                  >
                    {appearancePatternMock.map((item) => (
                      <MuiMenuItem
                        key={item.id}
                        value={item.value}
                        disabled={
                          props.isForMain && ["D", "E"].includes(item.value)
                        }
                      >
                        {item.name}
                      </MuiMenuItem>
                    ))}
                  </MuiSelect>
                </div>
              </div>
              <div className='flex justify-end space-x-11'>
                <MuiTextField
                  name='changedPlanName'
                  size='small'
                  sx={{ maxWidth: 440, width: "100%" }}
                  value={searchPlan}
                  onChange={(event) => setSearchPlan(event.target.value)}
                  label='プランコード・プラン名'
                />
                <MuiTextField
                  name='changedPlanName'
                  size='small'
                  sx={{ maxWidth: 440, width: "100%" }}
                  value={searchRoomType}
                  onChange={(event) => setSearchRoomType(event.target.value)}
                  label='部屋コード・部屋名'
                />
              </div>
            </div>
            {/** in content */}
            <div className='mt-6 overflow-x-scroll'>
              <MuiTableContainer
                sx={{ minWidth: "1080px", maxHeight: 340 }}
                className='rounded border-[1px] border-solid border-divider-accent-primary'
              >
                <MuiTable stickyHeader>
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell
                        align='center'
                        padding='none'
                        sx={{
                          minWidth: "50px",
                          backgroundColor: "#CEECF4",
                        }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          選択
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ minWidth: "540px", backgroundColor: "#CEECF4" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          プラン名
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ minWidth: "340px", backgroundColor: "#CEECF4" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          部屋タイプ
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ minWidth: "120px", backgroundColor: "#CEECF4" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          手動変更許可
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ minWidth: "328px", backgroundColor: "#CEECF4" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          一室人数
                        </div>
                      </MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  {
                    <InfiniteScroll
                      handleOnChangeHiddenName={handleOnChangeHiddenName}
                      handleOnChangeManualFlag={handleOnChangeManualFlag}
                      handleOnChangePlan={handleOnChangePlan}
                      handleOnChangeRoomIds={handleOnChangeRoomIds}
                      pattern={pattern}
                      items={planRoomShow}
                    />
                  }
                </MuiTable>
              </MuiTableContainer>
              <TablePagination
                count={planWithRoomFilted.length}
                page={page}
                onPageChange={(event, page) => setPage(page)}
                rowsPerPage={limitPlan}
                rowsPerPageOptions={[50, 100, 200, 300]}
                className='plan-table-paging'
                onRowsPerPageChange={(event) =>
                  setLimitPlan(Number(event.target.value))
                }
              />
            </div>

            <div className='mt-8 flex items-center'>
              <div className='flex flex-1 items-center'>
                <p className='w-[100px] text-sm font-medium'>シーズン</p>
                <FormControlLabel
                  sx={{ fontSize: "14px", marginRight: "8px" }}
                  control={
                    <MuiCheckbox
                      disabled={["D", "E"].includes(pattern)}
                      disableRipple
                      size='small'
                      checked={seasonFlag}
                      onChange={(event) => setSeasonFlag(event.target.checked)}
                    />
                  }
                  label='シーズン設定を反映しない'
                />
              </div>
              <MuiButton
                size='small'
                variant='contained'
                disabled={seasonFlag}
                onClick={() => setShownAddSeasonModal(true)}
              >
                シーズン設定
              </MuiButton>
            </div>
            <div className='mt-3  items-center '>
              {periods.map((season, i) => (
                <div
                  key={i}
                  className='mt-1 flex w-[400px] items-center first-of-type:mt-6'
                >
                  <p className='text-sm font-medium'>{i + 1}</p>
                  <div className='ml-9 flex-1'>
                    {season.ranges.map((item, i) => (
                      <p key={i} className='text-sm'>
                        {item.startDate.isSame(item.endDate)
                          ? item.startDate.format("YYYY/MM/DD")
                          : `${item.startDate.format(
                              "YYYY/MM/DD",
                            )}~${item.endDate.format("YYYY/MM/DD")}`}
                      </p>
                    ))}
                  </div>
                  <MuiButton
                    variant='contained'
                    size='small'
                    sx={{ width: 104 }}
                    onClick={() =>
                      setPeriods((prev) =>
                        prev.filter((_, index) => index != i),
                      )
                    }
                  >
                    削除
                  </MuiButton>
                </div>
              ))}
            </div>
            <div className='mt-3 flex items-center'>
              <p className='w-[100px] text-sm font-medium'>除外フラグ</p>
              <FormControlLabel
                sx={{ fontSize: "14px", marginRight: "8px" }}
                control={
                  <MuiCheckbox
                    disableRipple
                    size='small'
                    checked={excludeFlag}
                    onChange={(event) => setExcludeFlag(event.target.checked)}
                  />
                }
                label='料金表内に除外日を「設定なし」表示する'
              />
            </div>
          </div>

          {/** end content */}
        </div>
        <div className='left-0 bottom-0 flex w-full items-center justify-between px-9 pb-5 pt-5'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClickPrev}
          >
            キャンセル
          </MuiButton>

          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={!planWithRooms.some((plan) => plan.selected)}
            onClick={onSelect}
            loading={priceCreating}
          >
            確定
          </MuiLoadingButton>
        </div>
      </BaseModal>
      {shownAddSeasonModal && (
        <PriceModalAddSeason
          manuscriptName={
            bookletState &&
            `${MediaTypeEnum[bookletState.project.mediaTypeCode]}　${
              bookletState.project.issueYear
            }年 ${bookletState.project.issueMonth}月号　${
              bookletState.masterEditionCode
                ? `${bookletState.masterEditionCode.name}版`
                : ""
            }　${props.hotelName}`
          }
          onClose={() => setShownAddSeasonModal(false)}
          onChange={(e) => setPeriods(e)}
          periods={periods}
          startDate={
            props.startDate &&
            dayjs
              .tz(props.startDate, "UTC")
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
          }
          endDate={
            props.endDate &&
            dayjs
              .tz(props.endDate, "UTC")
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
          }
        />
      )}
    </div>
  )
}

export default PriceModalSelectPlan
