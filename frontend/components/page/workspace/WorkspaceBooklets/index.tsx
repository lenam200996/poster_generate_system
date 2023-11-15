import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { workspaceShownsState } from "@/atoms/workspace"
import WorkspaceCopyTable from "@/components/page/workspace/WorkspaceCopyTable"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiIconButton from "@mui/material/IconButton"
import WorkspaceTableSmallAccembly from "@/components/page/workspace/Table/WorkspaceTableSmallAssembly"
import WorkspaceTableChapterTitle from "@/components/page/workspace/Table/WorkspaceTableChapterTitle"
import { PageForBookletDto } from "@/openapi"

interface Props {
  pageNumber: number
  page?: PageForBookletDto
  checked?: boolean
  onChange?: Function
  onOpen?: Function
}

const WorkspaceBooklets = (props: Props) => {
  const [showns, setShowns] = useRecoilState(workspaceShownsState)
  const [shown, setShown] = useState<boolean>(false)

  const [plans, setPlans] = useState([])
  const [smallAssemblies, setSmallAssemblies] = useState([])
  const [chartTitles, setChapterTitles] = useState([])

  const onClickToggle = () => {
    if (showns.includes(props.pageNumber)) {
      setShowns(showns.filter((v) => v !== props.pageNumber))
    } else {
      setShowns([...showns, props.pageNumber])
    }
  }
  const handleOnChange = (value: number) => {
    props.onChange(value)
  }
  const handleOnClick = (value: number) => {
    props.onOpen(value)
  }

  const displayName = () => {
    if (props.page) {
      if (
        props.page.pageTypeCode === "HOTEL_MANUSCRIPT" &&
        !props.page.documents.length
      ) {
        return "未設定"
      } else if (props.page.pageTypeCode === "HOTEL_MANUSCRIPT") {
        return ""
      } else if (props.page.pageTypeCode === "ADVERTISEMENT") {
        return "広告"
      } else if (props.page.pageTypeCode === "CHAPTER_TITLE_PAGE") {
        return "中扉"
      } else if (props.page.pageTypeCode === "INFORMATION") {
        return "情報"
      }
    } else {
      return "未設定"
    }
  }

  const enaableExpextPlanPage = () =>
    props.page &&
    (props.page.pageTypeCode === "ADVERTISEMENT" ||
      props.page.pageTypeCode === "CHAPTER_TITLE_PAGE" ||
      props.page.pageTypeCode === "INFORMATION")
  const enablePlanPage = () =>
    props.page &&
    props.page.pageTypeCode === "HOTEL_MANUSCRIPT" &&
    props.page.documents.length > 0

  const disableCheckbox = () =>
    !props.page ||
    (props.page.pageTypeCode === "HOTEL_MANUSCRIPT" &&
      !props.page.documents.length)

  useEffect(() => {
    setShown(showns.includes(props.pageNumber))
  }, [props.pageNumber, showns])

  useEffect(() => {
    const plans = props.page
      ? props.page.documents.filter(
          (e) => e.documentTypeCode === "HOTEL_MANUSCRIPT",
        )
      : []
    const smallAssemblies = props.page
      ? props.page.documents.filter((e) => e.documentTypeCode === "FILLER")
      : []
    const chartTitles = props.page
      ? props.page.documents.filter((e) => e.documentTypeCode === "HEAD_LINE")
      : []
    setPlans(plans)
    setSmallAssemblies(smallAssemblies)
    setChapterTitles(chartTitles)
  }, [props.page])

  return (
    <div
      className={`${
        enablePlanPage() || enaableExpextPlanPage()
          ? "bg-container-main-secondary"
          : "bg-container-main-septenary"
      }`}
    >
      <div className='flex h-[56px] items-center justify-between border-b-[1px] border-divider-accent-primary pl-5 pr-8'>
        <div className='flex items-center'>
          <MuiCheckbox
            size='small'
            value={props.page?.id}
            checked={props.checked}
            disabled={disableCheckbox()}
            onChange={(event) => handleOnChange(Number(event.target.value))}
          />
          <MuiIconButton onClick={(event) => handleOnClick(props.pageNumber)}>
            <span
              className={`material-symbols-outlined leading-none text-content-default-tertiary ${
                shown ? "rotate-180" : ""
              }`}
            >
              keyboard_double_arrow_down
            </span>
          </MuiIconButton>
          <h2
            className={`flex-1 pl-2 text-sm font-bold ${
              enablePlanPage() || enaableExpextPlanPage()
                ? "text-content-default-primary"
                : "text-content-sleep-primary"
            }`}
          >
            {props.pageNumber}
            <span className='ml-3'>{displayName()}</span>
          </h2>
        </div>
        <div className='flex items-center'>
          {props.page &&
          props.page.pageTypeCode === "HOTEL_MANUSCRIPT" &&
          props.page.documents.length > 0 ? (
            <div className='ml-6'>
              <MuiIconButton onClick={onClickToggle}>
                <span
                  className={`material-symbols-outlined leading-none text-content-default-tertiary ${
                    shown ? "rotate-180" : ""
                  }`}
                >
                  keyboard_double_arrow_down
                </span>
              </MuiIconButton>
            </div>
          ) : (
            <div className='ml-6 w-10'></div>
          )}
        </div>
      </div>
      {props.page &&
        props.page.pageTypeCode === "HOTEL_MANUSCRIPT" &&
        props.page.documents.length > 0 &&
        shown && (
          <>
            <div className='bg-[#F1F5F9] p-3'>
              {plans.length > 0 && (
                <div className='overflow-x-auto py-3'>
                  <WorkspaceCopyTable copies={plans} />
                </div>
              )}
              {smallAssemblies.length > 0 && (
                <div className='py-3'>
                  <WorkspaceTableSmallAccembly
                    smallAssemblies={smallAssemblies}
                  />
                </div>
              )}
              {chartTitles.length > 0 && (
                <div className='py-3'>
                  <WorkspaceTableChapterTitle chartTitles={chartTitles} />
                </div>
              )}
            </div>
          </>
        )}
    </div>
  )
}

export default WorkspaceBooklets
