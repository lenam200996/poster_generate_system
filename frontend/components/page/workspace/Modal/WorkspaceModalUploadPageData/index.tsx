import { useState, useEffect, useRef } from "react"
import { useSetRecoilState } from "recoil"
import { pageTypes } from "@/config/api/mock/workspace"
import { PageType } from "@/config/api/mock/workspace/booklet"
import BaseProgressLabel from "@/components/base/form/BaseProgressLabel/index"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import MuiIconButton from "@mui/material/IconButton"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiTypography from "@mui/material/Typography"
import MuiBox from "@mui/material/Box"
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress"
import { workspaceBookletState } from "@/atoms/workspace"
import { useApiClient } from "@/hooks/useApiClient"
import { BookletDetailResponseDto } from "@/openapi"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import { PDF_DATA_FORMAT } from "@/config/dataFormat"

interface Props {
  shown: boolean
  booklet: BookletDetailResponseDto
  pageNumber: number
  pageType: PageType
  onExact?: Function
  onClose?: Function
  pageId?: number
}

type ProgressStatus = "wait" | "work" | "done" | "error"
type DisplayStatus = "select" | "upload"

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

const PageTypesOptions = pageTypes.map((option) => (
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

const WorkspaceModalUploadPageData = (props: Props) => {
  const apiClient = useApiClient()
  const [selectedValue, setSelectedValue] = useState<File>(null)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("select")
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("wait")
  const [progress, setProgress] = useState(0)
  const setBookletState = useSetRecoilState(workspaceBookletState)
  const [errors, setErrors] = useState(null)
  const DATA_EXTENSIONS = PDF_DATA_FORMAT.map((ext) => `.${ext}`)

  const DATA_FORMAT = ["pdf"]
  const schema = z.object({
    formatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.ENTRYSHEET_FORMAT_ERROR,
      ),
  })

  const handleOnChangeFiles = ({ files }: { files: File[] }) => {
    if (files && files.length) {
      const file = files[0] as File
      const result: SafeParseReturnType<{ formatError: string }, any> =
        schema.safeParse({ formatError: file.name })
      if (!result.success) {
        setErrors(
          (result as SafeParseError<string>).error.flatten().fieldErrors,
        )
        return
      }

      setSelectedValue(file)

      // this is a dummy!!!
      dummyProgressStart()
      setDisplayStatus("upload")
    }
  }

  const initializeStatus = () => {
    setSelectedValue(null)
    setDisplayStatus("select")
    setProgressStatus("wait")
  }

  const handleOnClickStopUploading = () => {
    initializeStatus()
  }

  const handleOnClickBackToPage = () => {
    setDisplayStatus("select")
    setProgressStatus("wait")
  }

  const handleOnClickExact = () => {
    initializeStatus()
    props.onExact()
  }

  const handleOnClickClose = () => {
    props.onClose()
  }

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

  useEffect(() => {
    if (progressStatus === "done") {
      ;(async () => {
        const response =
          await apiClient.pagesApiFactory.pageControllerCreateImage(
            props.booklet.projectId,
            props.booklet.id,
            props.pageNumber,
            props.pageType,
            selectedValue,
            props.pageId,
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
    props.pageType,
    selectedValue,
    setBookletState,
  ])

  return (
    <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
      <div className='relative h-[500px] w-[900px] px-9 pt-[56px]'>
        <p className='text-center text-lg font-bold'>
          ページデータのアップロード
        </p>
        <p className='mt-11 text-center text-sm font-medium'>
          PDFデータをアップロードしてください
        </p>
        {/* <p className='mt-7 text-center text-sm font-medium'>
          ※ダミーテキスト　ダミーテキスト
          <br />
          PDF入稿に必要な注意書きが入ります
        </p> */}
        {displayStatus === "select" ? (
          <div className='mx-auto mt-8 w-[421px]'>
            <BaseFileUploader
              text='ファイルを選択'
              extension={DATA_EXTENSIONS}
              onChange={handleOnChangeFiles}
              errorText={errorMessage.PDF_FORMAT_ERROR}
              error={!!errors?.formatError}
            />
          </div>
        ) : (
          <div className='mt-[70px] flex justify-center'>
            <div>
              <div className='flex items-center justify-center'>
                <p className='mr-2 text-sm font-bold'>{selectedValue.name}</p>
                <MuiIconButton onClick={handleOnClickStopUploading}>
                  <span className='material-symbols-outlined text-xl leading-none'>
                    close
                  </span>
                </MuiIconButton>
              </div>
              <div className='mt-10 flex items-center'>
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
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          {displayStatus === "upload" ? (
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickBackToPage}
            >
              戻る
            </MuiButton>
          ) : (
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickClose}
            >
              キャンセル
            </MuiButton>
          )}
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={progressStatus !== "done"}
            onClick={handleOnClickExact}
          >
            確定
          </MuiButton>
        </div>
      </div>
    </BaseModal>
  )
}

export default WorkspaceModalUploadPageData
