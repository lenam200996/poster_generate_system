import { useEffect, useState } from "react"
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
import RadioGroup from "@mui/material/RadioGroup"
import MuiLoadingButton from "@mui/lab/LoadingButton"

import { useApiClient } from "@/hooks/useApiClient"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { EntryPlanReponseDto } from "@/openapi"
import { FormControlLabel, Radio } from "@mui/material"
import { GlobalLoadingState } from "@/atoms/global"

interface Props {
  onClose: () => void
  onClick: (result: { planName: string; priceText: string }) => void
}

const WorkspaceModalPartsPlan = (props: Props) => {
  const [keyword, setKeyword] = useState("")
  const manuscript = useRecoilValue(workspaceManuscriptState)
  const apiClient = useApiClient()
  const [loading, setLoading] = useState(false)

  const [dataList, setDataList] = useState<EntryPlanReponseDto[]>([])
  const [selectedData, setSelectedData] = useState<EntryPlanReponseDto>(null)

  const handleOnSelected = (value: string) => {
    const findPlan = dataList.find(
      (x) =>
        x.entry_plan_id === value || x.travel_plans.travel_plan_code == value,
    )
    setSelectedData(findPlan)
  }

  const handleOnSave = async () => {
    const { data } =
      await apiClient.priceTableApiFactory.priceTableControllerGetMinFeeMainPlan(
        selectedData.travel_plans.travel_plan_code,
        manuscript.document.hotelCode,
        manuscript.document.project.id,
      )
    props.onClick({
      planName: selectedData.plan_name.replace(/(^\d{4})*\：/, ""),
      priceText: data.toLocaleString(),
    })
  }

  const handleOnClose = () => {
    props.onClose()
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } =
        await apiClient.priceTableApiFactory.priceTableControllerGetEntryTravels(
          manuscript.document.hotelCode,
          `${manuscript.document.project.issueYear}${String(
            manuscript.document.project.issueMonth,
          ).padStart(2, "0")}`,
          true,
        )
      setDataList(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <BaseModal shown={true} onClickClose={handleOnClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='flex items-center justify-between'>
            <div className='flex-grow text-center'>
              <p className='text-lg font-bold'>プラン選択</p>
            </div>
            <div>
              <MuiLoadingButton
                variant='contained'
                size='small'
                className='px-5'
                loading={loading}
                onClick={fetchData}
              >
                再読込み
              </MuiLoadingButton>
            </div>
          </div>
          <div className='mt-6 flex items-center'>
            <div>
              <BaseTextField
                sx={{ width: 440 }}
                size='small'
                placeholder='プラン名'
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className='ml-8 space-x-11'>
              <BaseButtonText
                disabled={keyword === ""}
                onClick={() => setKeyword("")}
              >
                <span className='text-[15px] leading-6'>クリア</span>
              </BaseButtonText>
            </div>
          </div>
          {/** in content */}
          <div className='mt-6'>
            <RadioGroup
              defaultValue={""}
              name='category'
              onClick={(event: any) => handleOnSelected(event.target.value)}
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
                    {dataList.map((x) => (
                      <MuiTableRow key={x.entry_plan_id}>
                        <MuiTableCell align='center' padding='none'>
                          <FormControlLabel
                            checked={
                              selectedData?.entry_plan_id == x.entry_plan_id
                            }
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
                            {(x.plan_name || "").replace(/(^\d{4})*\：/, "")} ({" "}
                            {x.room_name} )
                          </div>
                        </MuiTableCell>
                      </MuiTableRow>
                    ))}
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
            </RadioGroup>
          </div>

          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!selectedData}
              onClick={handleOnSave}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalPartsPlan
