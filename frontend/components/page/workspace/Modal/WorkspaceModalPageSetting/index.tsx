import { useState, useEffect } from "react"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"
import WorkspaceModalDeletePage from "@/components/page/workspace/Modal/WorkspaceModalDeletePage"
import WorkspaceModalMovePage from "@/components/page/workspace/Modal/WorkspaceModalMovePage"
import WorkspaceModalSettingPage from "@/components/page/workspace/Modal/WorkspaceModalSettingPage"
import {
  BookletDetailResponseDto,
  PageForBookletDto,
  PageForBookletDtoPageTypeCodeEnum,
} from "@/openapi"
import WorkspaceModalDulicatePage from "../WorkspaceModalDulicatePage"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  workspaceActivePageNumberState,
  workspaceManuscriptState,
} from "@/atoms/workspace"

type Props = {
  page?: PageForBookletDto
  pageNumber: number
  booklet: BookletDetailResponseDto
}

type DisplayStatus = "setting" | "move" | "duplicate" | "delete" | "none"

const WorkspaceModalPageSetting = (props: Props) => {
  const setActivePageNumber = useSetRecoilState(workspaceActivePageNumberState)
  const [value, setValue] = useState<DisplayStatus>(null)
  const [shown, setShown] = useState<boolean>(false)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const handleOnChange = (value: DisplayStatus) => {
    setValue(value)
  }
  useEffect(() => {}, [])

  useEffect(() => {
    if (!shown) {
      setValue(null)
      setDisplayStatus("none")
      setActivePageNumber(null)
    } else {
      setActivePageNumber(props.pageNumber)
    }
  }, [shown]) // eslint-disable-line

  useEffect(() => {
    if (props.page === undefined && value === "delete") {
      setValue(null)
    }
  }, [props.page, value])

  return (
    <div>
      <BaseButtonIconText
        icon='document_scanner'
        text='ページ設定'
        disabled={props.booklet.locked}
        onClick={() => setShown(true)}
      />
      <BaseModal shown={shown} onClickClose={() => setShown(false)}>
        <MuiFormControl>
          <MuiRadioGroup
            value={value}
            onChange={(event) =>
              handleOnChange(event.target.value as DisplayStatus)
            }
          >
            <div className='relative h-[320px] w-[600px]'>
              <div className='pt-[56px]'>
                <p className='text-content-primary-dark90 text-center text-lg font-bold'>
                  ページ操作
                </p>
                <div className='m-auto mt-10 grid w-[445px] grid-cols-2 gap-6'>
                  <BaseRadioSquare
                    disabled={
                      props.page &&
                      [
                        "CHAPTER_TITLE_PAGE",
                        "ADVERTISEMENT",
                        "INFORMATION",
                      ].includes(props.page.pageTypeCode)
                    }
                    label='ページ設定'
                    value='setting'
                  />
                  <BaseRadioSquare label='入れ替え' value='move' />
                  <BaseRadioSquare
                    label='複製'
                    value='duplicate'
                    disabled={
                      props.page === undefined ||
                      props.page.pageTypeCode ===
                        PageForBookletDtoPageTypeCodeEnum.HotelManuscript
                    }
                  />
                  <BaseRadioSquare
                    label='削除'
                    value='delete'
                    disabled={props.page === undefined}
                  />
                </div>
              </div>
              <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  onClick={() => setShown(false)}
                >
                  キャンセル
                </MuiButton>
                <MuiButton
                  disabled={value === null}
                  variant='contained'
                  sx={{ width: 104 }}
                  onClick={() => {
                    setDisplayStatus(value)
                  }}
                >
                  確定
                </MuiButton>
              </div>
            </div>
          </MuiRadioGroup>
        </MuiFormControl>
      </BaseModal>
      {displayStatus === "delete" && (
        <WorkspaceModalDeletePage
          page={props.page}
          pageNumber={props.pageNumber}
          onClose={() => setDisplayStatus("none")}
        />
      )}
      {displayStatus === "move" && (
        <WorkspaceModalMovePage
          pageNumber={props.pageNumber}
          page={props.page}
          onClose={() => setDisplayStatus("none")}
        />
      )}
      {displayStatus === "setting" && (
        <WorkspaceModalSettingPage
          page={props.page}
          pageNumber={props.pageNumber}
          booklet={props.booklet}
          onClose={() => setDisplayStatus("none")}
          onExact={() => {
            setDisplayStatus("none")
            setShown(false)
          }}
        />
      )}
      {displayStatus === "duplicate" && (
        <WorkspaceModalDulicatePage
          pageNumber={props.pageNumber}
          onClose={() => setDisplayStatus("none")}
        />
      )}
    </div>
  )
}

WorkspaceModalPageSetting.defaultProps = {
  size: "small",
}

export default WorkspaceModalPageSetting
