import { useEffect, useState } from "react"
import { LayoutPattern } from "@/config/api/mock/workspace/booklet"
import WorkspaceModalSelectPageType from "@/components/page/workspace/Modal/WorkspaceModalSelectPageType"
import WorkspaceModalSettingManuscript from "@/components/page/workspace/Modal/WorkspaceModalSettingManuscript"
import { currentRolesMock, RolesMock } from "@/config/api/mock/users"
import { BookletDetailResponseDto, PageForBookletDto } from "@/openapi"
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useRecoilState } from "recoil"
import { workspaceActivePageNumberState } from "@/atoms/workspace"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import WorkspaceModalUploadPageData from "@/components/page/workspace/Modal/WorkspaceModalUploadPageData"

//-------------------------------------------------------------------------
/**
 * ページ情報
 */
//-------------------------------------------------------------------------
interface Props {
  booklet: BookletDetailResponseDto
  pageNumber: number
  page?: PageForBookletDto
  addNew?: boolean
  onAddNewModal?: Function
}

type DisplayStatus =
  | "selectPageType"
  | "none"
  | "replaceChapterTitlePage"
  | "uploadPageData"

//-------------------------------------------------------------------------
/**
 * ワークスペースに表示する小さなページを表示
 *  1. これを呼び出すと１ページ作成される。
 *  2. 運用として複数並べるなら繰り返し処理にこの関数コンポーネントを呼び出す。
 *
 * @param props ページ情報
 * @returns ページの表示内容
 */
//-------------------------------------------------------------------------
const WorkspaceBookletSmall = (props: Props) => {
  const [activePageNumber, setActivePageNumber] = useRecoilState(
    workspaceActivePageNumberState,
  )
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const availableRoles = [RolesMock.admin, RolesMock.operator]

  const disabled = !availableRoles.some((role) =>
    currentRolesMock.includes(role),
  )

  const handleClick = (status: DisplayStatus) => {
    if (disabled) return
    setDisplayStatus(status)
  }

  useEffect(() => {
    if (displayStatus === "none") {
      setActivePageNumber(null)
    } else {
      setActivePageNumber(props.pageNumber)
    }
  }, [displayStatus, props.pageNumber, setActivePageNumber])
  const handleOnExactPageData = () => {
    setDisplayStatus("none")
  }
  return (
    <div className='group relative inline-flex bg-container-main-primary'>
      {/* hover style */}
      <div
        className={`absolute top-0 z-10 hidden border-r-container-active-primary bg-container-main-primary group-hover:block ${
          props.pageNumber === 3 ? "" : "border-r-[1px]"
        } ${props.pageNumber % 2 !== 0 ? "left-[14px]" : "left-0"} ${
          props.pageNumber === activePageNumber ? "!block" : "hidden"
        } ${props.addNew ? "!hidden" : ""}`}
      >
        <div
          className={`min-h-[173px] w-[96px] border-l-[1px] border-l-container-active-primary ${
            props.pageNumber % 2 !== 0 ? "w-[97px]" : ""
          }`}
        >
          <div className='flex h-5 border-b-[1px] border-b-container-active-primary'></div>
          <div className='relative flex h-[133px] w-full items-center justify-center bg-container-main-secondary bg-transparent px-3 text-divider-accent-primary'></div>
          <div className='flex h-5 border-t-[1px] border-t-container-active-primary'></div>
        </div>
      </div>
      {/* hover style */}

      {/* left side stick */}
      {props.pageNumber % 2 !== 0 && (
        <div className='min-h-[173px] w-[15px] border-x-[1px] border-x-divider-accent-primary'>
          <div className='h-5 border-b-[1px] border-divider-accent-primary border-b-divider-accent-primary'></div>
          <div className='h-[133px]'></div>
          <div className='h-5 border-t-[1px] border-t-divider-accent-primary'></div>
        </div>
      )}
      {/* left side stick */}
      <div
        className={`min-h-[173px] w-[96px] ${
          props.pageNumber % 2 === 0
            ? "border-l-[1px] border-l-divider-accent-primary"
            : ""
        }`}
      >
        <div className='flex h-5 border-b-[1px] border-b-divider-accent-primary'>
          {!props.addNew && (
            <div className='relative flex-1 pl-1'>
              {props.pageNumber === 0 || props.pageNumber % 2 === 0 ? (
                <span className='absolute bottom-0 right-1 z-20 text-xxs text-[#66587B]'>
                  {props.pageNumber}
                </span>
              ) : (
                <span className='absolute bottom-0 left-1 z-20 text-xxs text-[#66587B]'>
                  {props.pageNumber}
                </span>
              )}
            </div>
          )}
        </div>
        {/* start left */}
        {!props.addNew ? (
          <div className='relative z-20 flex h-[133px] w-full items-center justify-center bg-container-main-secondary bg-transparent px-3 text-divider-accent-primary'>
            {!props.page && (
              <button
                disabled={disabled}
                className='h-full w-full bg-transparent text-xxs'
                onClick={() => handleClick("selectPageType")}
              >
                新規
                <br />
                ページ設定
              </button>
            )}
            {props.page && props.page.pageTypeCode !== "HOTEL_MANUSCRIPT" && (
              <button
                className='h-full w-full bg-transparent after:absolute after:-top-[16px] after:left-[48px] after:h-[163px] after:w-[1px] after:rotate-[36deg] after:bg-divider-accent-primary after:content-[""]'
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
                size='small'
                bookletLocked={props.booklet.locked}
              />
            )}
          </div>
        ) : (
          <div className='relative flex h-[133px] w-full items-center justify-center bg-container-main-secondary bg-transparent px-3 text-divider-accent-primary'>
            <Fab
              color='primary'
              aria-label='add'
              sx={{ "z-index": "20" }}
              disabled={props.booklet.locked}
              onClick={() => {
                props.onAddNewModal()
              }}
            >
              <AddIcon />
            </Fab>
          </div>
        )}
        <div className='flex h-5 border-t-[1px] border-t-divider-accent-primary'></div>
      </div>
      <WorkspaceModalSelectPageType
        shown={displayStatus === "selectPageType"}
        pageNumber={props.pageNumber}
        booklet={props.booklet}
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
    </div>
  )
}

export default WorkspaceBookletSmall
