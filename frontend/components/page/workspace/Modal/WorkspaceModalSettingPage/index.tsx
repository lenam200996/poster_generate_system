import { useState, useEffect, useRef, useMemo } from "react"
import { pageTypes, daishi } from "@/config/api/mock/workspace"
import BaseProgressLabel from "@/components/base/form/BaseProgressLabel/index"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiIconButton from "@mui/material/IconButton"
import MuiTypography from "@mui/material/Typography"
import MuiBox from "@mui/material/Box"
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress"
import { BookletDetailResponseDto, PageForBookletDto } from "@/openapi"
import { PageType, page } from "@/config/api/mock/workspace/booklet"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { PDF_DATA_FORMAT } from "@/config/dataFormat"
import WorkspaceModalSelectLayout from "../WorkspaceModalSelectLayout"
import { useApiClient } from "@/hooks/useApiClient"
import { useRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"

type Props = {
  page?: PageForBookletDto
  pageNumber: number
  onClose?: Function
  onExact?: Function
  booklet: BookletDetailResponseDto
}

type ProgressStatus = "wait" | "work" | "done" | "error"
type DisplayStatus = "select" | "upload" | "selectLayout"

const PageTypesOptions = pageTypes.map((option) => (
  <MuiMenuItem key={option.value} value={option.value}>
    {option.label}
  </MuiMenuItem>
))
const DaishiOptions = daishi.map((option) => (
  <MuiMenuItem key={option.value} value={option.value}>
    {option.label}
  </MuiMenuItem>
))
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number | undefined },
) {
  return (
    <MuiBox sx={{ display: "flex", alignItems: "center" }}>
      <MuiBox sx={{ width: "100%", mr: 1 }}>
        <MuiLinearProgress variant='determinate' {...props} />
      </MuiBox>
      <MuiBox sx={{ minWidth: 35 }}>
        <MuiTypography variant='body2' color='text.secondary'>{`${Math.round(
          props.value,
        )}%`}</MuiTypography>
      </MuiBox>
    </MuiBox>
  )
}

const WorkspaceModalSettingPage = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState<PageType | "">(
    props.page?.pageTypeCode ?? "",
  )
  const [selectedDaishiValue, setSelectedDaishiValue] = useState("")
  const [selectedFileValue, setSelectedFileValue] = useState<File>(null)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("select")
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("wait")
  const [progress, setProgress] = useState(0)
  const [disabled, setDisabled] = useState(true)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)

  const apiClient = useApiClient()
  const DATA_EXTENSIONS = PDF_DATA_FORMAT.map((ext) => `.${ext}`)

  const handleOnClickClose = () => {
    setSelectedValue("")
    props.onClose()
  }

  const handleChangePageType = (value: string) => {
    setSelectedValue(value as typeof selectedValue)
  }
  const handleChangeSelectDaishiType = (value: string) => {
    setSelectedDaishiValue(value)
  }

  const handleOnChangeFiles = ({ files }: { files: File[] }) => {
    if (files && files.length) {
      const file = files[0] as File
      setSelectedFileValue(file)

      // this is a dummy!!!
      dummyProgressStart()
      setDisplayStatus("upload")
    }
  }

  const initializeStatus = () => {
    setSelectedValue(null)
    setSelectedValue("")
    setSelectedDaishiValue("none")
    setSelectedFileValue(null)
    setDisplayStatus("select")
    setProgressStatus("wait")
  }

  const handleOnClickStopUploading = () => {
    initializeStatus()
  }

  const handleOnClickExact = () => {
    if (selectedValue === "HOTEL_MANUSCRIPT") {
      return setDisplayStatus("selectLayout")
    }
    initializeStatus()
    props.onExact()
  }

  const showSelectedValue = useMemo(() => {
    return (pageTypes.find((p) => p.value == selectedValue) || { label: "" })
      .label
  }, [selectedValue])

  // this is a dummy!!! Delete when linking api
  const incrementProgress1 = useRef(null)
  const dummyProgressStart = () => {
    setProgress(0)
    setProgressStatus("work")
    setTimeout(() => {
      incrementProgress1.current = setInterval(() => {
        setProgress((timer) => {
          if (timer < 100) {
            return timer + 1
          } else {
            setProgressStatus("done")
            clearInterval(incrementProgress1.current)
            return timer
          }
        })
      }, 100)
    }, 1000)
  }

  const handleOnExactSelectLayout = async ({
    layout,
    indexHeader,
  }: {
    layout: string
    indexHeader: string
  }) => {
    try {
      const response = await apiClient.pagesApiFactory.pageControllerCreate({
        projectId: props.booklet.projectId,
        bookletId: props.booklet.id,
        mountId: 1,
        layoutAlphabet: layout.toUpperCase(),
        pageNumber: props.pageNumber,
        pageTypeCode: "HOTEL_MANUSCRIPT",
        thumbIndexImageGroupId: indexHeader,
        pageId: props.page?.id,
      })

      let pages = bookletState.pages
      if (props.page) {
        const page =
          await apiClient.pagesApiFactory.pageControllerPageWithDocuments(
            props.page.id,
          )
        pages = bookletState.pages.map((pg) => {
          if (pg.id === props.page.id) return page.data
          return pg
        })
      } else {
        pages = [...pages, { ...response.data, documents: [] }]
      }

      const formattedBooklet = {
        ...bookletState,
        pages: pages,
      }

      setBookletState(formattedBooklet)
      setDisplayStatus("select")
      props.onExact()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (selectedValue) {
      if (selectedValue == "CHAPTER_TITLE_PAGE") {
        if (selectedFileValue && progress === 100) setDisabled(false)
        else setDisabled(true)
      } else {
        setDisabled(false)
      }
    } else {
      setDisabled(true)
    }
  }, [selectedValue, selectedFileValue, progress])

  useEffect(() => {
    if (props.page) {
      setSelectedValue(props.page.pageTypeCode)
    } else {
      setSelectedValue("")
    }
  }, [props.page])

  useEffect(() => {
    if (progressStatus === "done") {
      ;(async () => {
        const response =
          await apiClient.pagesApiFactory.pageControllerCreateImage(
            props.booklet.projectId,
            props.booklet.id,
            props.pageNumber,
            selectedValue,
            selectedFileValue,
            props.page?.id,
          )
        setBookletState((state) => ({
          ...state,
          pages: [...state.pages, { ...response.data, documents: [] }],
        }))
      })()
    }
  }, [
    apiClient.pagesApiFactory,
    progressStatus,
    props.pageNumber,
    props.booklet.projectId,
    props.booklet.id,
    selectedFileValue,
    selectedValue,
    setBookletState,
  ])

  return (
    <>
      <BaseModal shown={true} onClickClose={handleOnClickClose}>
        <div
          className={`relative min-w-[600px] px-9 pt-[56px] ${
            selectedValue === "CHAPTER_TITLE_PAGE"
              ? "min-h-[612px]"
              : "min-h-[320px]"
          }`}
        >
          <p className='text-center text-lg font-bold'>ページ設定</p>
          <div className='mt-7 flex items-center justify-center'>
            <span className='w-[90px] text-sm font-medium'>ページ種別</span>

            <MuiFormControl size='small' sx={{ minWidth: 122 }}>
              {props.page && props.page.documents.length > 0 ? (
                <span>{showSelectedValue}</span>
              ) : (
                <MuiSelect
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue={selectedValue}
                  disabled={props.page && props.page.documents.length > 0}
                  MenuProps={MenuProps}
                  onChange={(event) => handleChangePageType(event.target.value)}
                >
                  <MuiMenuItem value=''>選択</MuiMenuItem>
                  {PageTypesOptions}
                </MuiSelect>
              )}
            </MuiFormControl>
          </div>
          <>
            {/* {selectedValue === "HOTEL_MANUSCRIPT" && (
              <div className='mt-5 flex items-center justify-center'>
                <span className='w-[90px] text-sm font-medium'>台紙</span>
                <MuiFormControl size='small' sx={{ minWidth: 122 }}>
                  <MuiSelect
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    defaultValue=''
                    MenuProps={MenuProps}
                    onChange={(event) =>
                      handleChangeSelectDaishiType(event.target.value)
                    }
                  >
                    <MuiMenuItem value=''>選択</MuiMenuItem>
                    {DaishiOptions}
                  </MuiSelect>
                </MuiFormControl>
              </div>
            )} */}
            {selectedValue === "CHAPTER_TITLE_PAGE" && (
              <div>
                {/* <p className='mt-7 text-center text-sm font-medium'>
                  ※ダミーテキスト　ダミーテキスト
                  <br />
                  PDF入稿に必要な注意書きが入ります
                </p> */}
                <p className='mt-7 text-center text-sm font-medium'>
                  PDFデータをアップロードしてください
                </p>
                {displayStatus === "select" ? (
                  <div className='mx-auto mt-2 w-[421px] pb-4'>
                    <BaseFileUploader
                      text='ファイルを選択'
                      extension={DATA_EXTENSIONS}
                      onChange={handleOnChangeFiles}
                    />
                  </div>
                ) : (
                  <div className='mt-7 flex justify-center'>
                    <div>
                      <div className='flex items-center justify-center'>
                        <p className='mr-2 text-sm font-bold'>
                          {selectedFileValue.name}
                        </p>
                        <MuiIconButton onClick={handleOnClickStopUploading}>
                          <span className='material-symbols-outlined text-xl leading-none'>
                            close
                          </span>
                        </MuiIconButton>
                      </div>
                      <div className='mt-4 flex items-center'>
                        <MuiBox sx={{ width: 200 }}>
                          <LinearProgressWithLabel value={progress} />
                        </MuiBox>
                        <div className='ml-5'>
                          <BaseProgressLabel status={progressStatus} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
          {props.page && props.page.documents.length > 0 ? (
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={handleOnClickClose}
              >
                OK
              </MuiButton>
            </div>
          ) : (
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
              <MuiButton
                color='inherit'
                variant='outlined'
                sx={{ width: 104 }}
                onClick={handleOnClickClose}
              >
                キャンセル
              </MuiButton>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                disabled={disabled}
                onClick={handleOnClickExact}
              >
                確定
              </MuiButton>
            </div>
          )}
        </div>
      </BaseModal>
      <WorkspaceModalSelectLayout
        shown={displayStatus === "selectLayout"}
        pageNumber={props.pageNumber}
        onClose={handleOnClickClose}
        onExact={handleOnExactSelectLayout}
      />
    </>
  )
}

export default WorkspaceModalSettingPage
