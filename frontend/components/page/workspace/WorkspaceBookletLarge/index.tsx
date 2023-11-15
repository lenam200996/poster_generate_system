import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { workspaceOutputsState } from "@/atoms/workspace"
import { LayoutPattern } from "@/config/api/mock/workspace/booklet"
import WorkspaceModalSelectPageType from "@/components/page/workspace/Modal/WorkspaceModalSelectPageType"
import WorkspaceModalSelectLayout from "@/components/page/workspace/Modal/WorkspaceModalSelectLayout"
import MuiCheckbox from "@mui/material/Checkbox"
import WorkspaceModalSettingManuscript from "@/components/page/workspace/Modal/WorkspaceModalSettingManuscript"
import WorkspaceModalPageSetting from "@/components/page/workspace/Modal/WorkspaceModalPageSetting"
import { BookletDetailResponseDto, PageForBookletDto } from "@/openapi"
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { workspaceActivePageNumberState } from "@/atoms/workspace"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import WorkspaceModalUploadPageData from "@/components/page/workspace/Modal/WorkspaceModalUploadPageData"

interface Props {
  booklet: BookletDetailResponseDto
  pageNumber: number
  page?: PageForBookletDto
  addNew?: boolean
  onAddNewModal?: Function
}

type DisplayStatus =
  | "selectPageType"
  | "selectLayout"
  | "uploadPageData"
  | "replaceChapterTitlePage"
  | "none"

const WorkspaceBookletLarge = (props: Props) => {
  const [activePageNumber, setActivePageNumber] = useRecoilState(
    workspaceActivePageNumberState,
  )
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const [outputsRecoilState, setOutputsRecoilState] = useRecoilState(
    workspaceOutputsState,
  )
  const handleOnChange = (value: string) => {
    const id = Number(value)
    if (outputsRecoilState.includes(id)) {
      setOutputsRecoilState(
        outputsRecoilState.filter((v) => v !== id).sort((a, b) => a - b),
      )
    } else {
      setOutputsRecoilState([...outputsRecoilState, id].sort((a, b) => a - b))
    }
  }

  useEffect(() => {
    if (displayStatus === "none") {
      setActivePageNumber(null)
    } else {
      setActivePageNumber(props.pageNumber)
    }
  }, [displayStatus]) // eslint-disable-line
  const handleOnExactPageData = () => {
    setDisplayStatus("none")
  }
  return (
    <div className='group relative inline-flex bg-container-main-primary'>
      {/* left side stick */}
      {props.pageNumber % 2 !== 0 && (
        <div className='flex h-full min-h-[634px] w-[19px] flex-col border-x-[1px] border-x-divider-accent-primary'>
          <div className='min-h-[100px] flex-1 border-b-[1px] border-divider-accent-primary border-b-divider-accent-primary'></div>
          <div className='h-[430px]'></div>
          <div className='min-h-[100px] flex-1 border-t-[1px] border-t-divider-accent-primary'></div>
        </div>
      )}
      {/* left side stick */}
      <div
        className={`flex h-full min-h-[634px] w-[300px] flex-col ${
          props.pageNumber % 2 === 0
            ? "border-l-[1px] border-l-divider-accent-primary"
            : ""
        }`}
      >
        <div className='flex min-h-[100px] flex-1 border-b-[1px] border-b-divider-accent-primary'>
          {!props.addNew && (
            <div className='relative flex-1'>
              {props.pageNumber === 0 || props.pageNumber % 2 === 0 ? (
                <div className='absolute bottom-0 right-[8px] z-20 flex items-center'>
                  <MuiCheckbox
                    value={props.page?.id}
                    checked={outputsRecoilState.includes(props.page?.id)}
                    disabled={
                      !props.page ||
                      !props.page.documents.every(
                        (doc) => doc.statusCode == "PROOFREADING",
                      )
                    }
                    onChange={(event) => handleOnChange(event.target.value)}
                  />
                  <span className='text-xxs text-[#66587B]'>
                    {props.pageNumber}
                  </span>
                </div>
              ) : (
                <div className='absolute bottom-0 left-0 z-20 flex items-center'>
                  <MuiCheckbox
                    value={props.page?.id}
                    checked={outputsRecoilState.includes(props.page?.id)}
                    disabled={
                      !props.page ||
                      !props.page.documents.every(
                        (doc) => doc.statusCode == "PROOFREADING",
                      )
                    }
                    onChange={(event) => handleOnChange(event.target.value)}
                  />
                  <span className='text-xxs text-[#66587B]'>
                    {props.pageNumber}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {props.addNew ? (
          <div className='relative flex h-[430px] w-full items-center justify-center bg-transparent bg-white-0 px-3 text-divider-accent-primary'>
            <Fab
              color='primary'
              aria-label='add'
              sx={{ "z-index": "20" }}
              disabled={props.booklet.locked}
              onClick={() => props.onAddNewModal()}
            >
              <AddIcon />
            </Fab>
          </div>
        ) : (
          <div className='relative z-20 flex h-[430px] w-full items-center justify-center bg-transparent bg-white-0 px-3 text-divider-accent-primary'>
            {!props.page && (
              <button
                className='h-full w-full bg-transparent text-lg'
                onClick={() => setDisplayStatus("selectPageType")}
                disabled={props.booklet.locked}
              >
                新規
                <br />
                ページ設定
              </button>
            )}
            {props.page && props.page.pageTypeCode !== "HOTEL_MANUSCRIPT" && (
              <button
                className='h-full w-full bg-transparent text-2xl after:absolute after:-top-[48px] after:left-[150px] after:h-[526px] after:w-[1px] after:rotate-[35deg] after:bg-divider-accent-primary after:content-[""]'
                onClick={() => {
                  ;[
                    "CHAPTER_TITLE_PAGE",
                    "ADVERTISEMENT",
                    "INFORMATION",
                  ].includes(props.page.pageTypeCode)
                    ? setDisplayStatus("replaceChapterTitlePage")
                    : setDisplayStatus("selectPageType")
                }}
              >
                {props.page.pageTypeCode === "CHAPTER_TITLE_PAGE" && "中扉"}
                {props.page.pageTypeCode === "ADVERTISEMENT" && "広告"}
                {props.page.pageTypeCode === "INFORMATION" && "情報"}
              </button>
            )}
            {props.page && props.page.pageTypeCode === "HOTEL_MANUSCRIPT" && (
              <WorkspaceModalSettingManuscript
                layout={props.page.layoutAlphabet as LayoutPattern}
                page={props.page}
                size='large'
                bookletLocked={props.booklet.locked}
              />
            )}
          </div>
        )}
        <div className='flex min-h-[100px] flex-1 items-center justify-center border-t-[1px] border-t-divider-accent-primary'>
          <div className='relative z-20'>
            {!props.addNew && (
              <WorkspaceModalPageSetting
                page={props.page}
                booklet={props.booklet}
                pageNumber={props.pageNumber}
              />
            )}
          </div>
        </div>
      </div>
      <WorkspaceModalSelectPageType
        shown={displayStatus === "selectPageType"}
        pageNumber={props.pageNumber}
        booklet={props.booklet}
        onClose={() => setDisplayStatus("none")}
        onExact={() => setDisplayStatus("none")}
      />
      <WorkspaceModalSelectLayout
        shown={displayStatus === "selectLayout"}
        pageNumber={activePageNumber}
        onClose={() => setDisplayStatus("none")}
        onExact={() => setDisplayStatus("none")}
      />
      <WorkspaceModalUploadPageData
        shown={displayStatus === "uploadPageData"}
        pageType={"CHAPTER_TITLE_PAGE"}
        pageNumber={props.pageNumber}
        booklet={props.booklet}
        onClose={() => setDisplayStatus("none")}
        onExact={handleOnExactPageData}
        pageId={props.page?.id}
      />

      <BaseModal
        shown={displayStatus === "replaceChapterTitlePage"}
        onClickClose={() => setDisplayStatus("none")}
      >
        <div className='relative min-h-[300px] min-w-[600px] px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>PDFデータの変更確認</p>
          <div className='mt-5 text-center'>
            設定済みのデータを削除して
            <br />
            新しいPDFデータをアップロードしますか？
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={() => setDisplayStatus("none")}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={() => setDisplayStatus("uploadPageData")}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>

      <div
        className={`absolute top-0 z-10 hidden h-full border-x-container-active-primary bg-container-main-primary group-hover:block ${
          props.pageNumber === 3 ? "border-l-[1px]" : "border-x-[1px]"
        } ${props.pageNumber % 2 !== 0 ? "left-[18px]" : "left-0"} ${
          props.pageNumber === activePageNumber ? "!block" : "hidden"
        } ${props.addNew ? "!hidden" : ""}`}
      >
        <div className='flex h-full min-h-[634px] w-[300px] flex-col'>
          <div className='flex min-h-[100px] flex-1 border-b-[1px] border-b-container-active-primary'></div>
          <div className='relative flex h-[430px] w-full items-center justify-center bg-transparent bg-white-0 px-3 text-container-active-primary'></div>
          <div className='relative flex min-h-[100px] flex-1 items-center justify-center border-t-[1px] border-t-container-active-primary'></div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceBookletLarge
