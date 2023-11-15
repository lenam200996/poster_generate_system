import { useState, useRef, useMemo, useEffect } from "react"
import { useRecoilValue } from "recoil"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import MuiTypography from "@mui/material/Typography"
import MuiBox from "@mui/material/Box"
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress"
import { workspaceBookletState } from "@/atoms/workspace"
import { MediaTypeEnum } from "@/config/enum"
import MuiCheckbox from "@mui/material/Checkbox"
import { FormControlLabel } from "@mui/material"
import { useApiClient } from "@/hooks/useApiClient"
interface Props {
  shown: boolean
  pages: number[]
  onExact?: Function
  onClose?: Function
  manuscriptExports: (selected: any, type) => void
}

type DisplayStatus = "confirm" | "output" | "complete"

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

const WorkspaceModalDraftConfirm: React.FC<Props> = (props: Props) => {
  const bookletState = useRecoilValue(workspaceBookletState)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("confirm")
  const [progress, setProgress] = useState(0)
  const [exportType, setExportType] = useState<Array<"jpg" | "pdf">>([])
  const apiClient = useApiClient()
  useEffect(() => {}, [props.pages])
  const initializeStatus = () => {
    setDisplayStatus("confirm")
  }

  const handleOnClickExact = () => {
    setDisplayStatus("complete")
  }

  const handleOnClickClose = () => {
    props.onClose()
  }

  const handleOnClickStartOutput = () => {
    setDisplayStatus("output")
    dummyProgressStart()
  }

  const handleOnClickFinishOutput = () => {
    initializeStatus()
    props.onClose()
  }

  // this is a dummy!!! Delete when linking api
  const incrementProgress1 = useRef(null)
  const dummyProgressStart = async () => {
    setProgress(0)
    const result = pageNumbers.map((p) => p)
    setDisplayStatus("output")
    const fetchResult = await Promise.all(
      result.map(async (rs) => {
        const items = await Promise.all(
          rs.documents.map(async (doc) => {
            const editId = `${rs.projectId}_${rs.bookletId}_${doc.id}`
            const loadIdml =
              await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
                editId,
                "template",
              )
            return loadIdml.data
          }),
        )

        return {
          items,
          documentSize: rs.layout,
        }
      }),
    )
    props.manuscriptExports && props.manuscriptExports(fetchResult, exportType)
    // fetchResult.forEach(selected => props.manuscriptExports && props.manuscriptExports(selected) )
    setDisplayStatus("complete")
  }

  const pageNumbers = useMemo(
    () =>
      bookletState
        ? bookletState.pages
            .filter((page) => props.pages.includes(page.id))
            .map((page) => ({
              index: page.pageNumber,
              documents: page.documents,
              ...page,
            }))
            .sort((a, b) => (a < b ? -1 : 1))
        : [],
    [bookletState, props.pages],
  )

  return (
    bookletState && (
      <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
        {displayStatus === "confirm" && (
          <div className='relative h-[320px] w-[600px] px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              入稿用書き出し確認
            </p>
            <p className='mt-4 text-center text-sm font-medium text-content-default-primary'>
              {`${MediaTypeEnum[bookletState.project.mediaTypeCode]}　${
                bookletState.project.issueYear
              }年　${bookletState.project.issueMonth}月号　${
                bookletState.masterEditionCode
                  ? `${bookletState.masterEditionCode.name}版`
                  : ""
              }　${pageNumbers.map((p) => p.index).join(",")}ページ`}
              <br />
              の入稿用ファイルを書き出しますか？
            </p>
            <div className='mt-[27px] flex w-full items-center justify-center gap-[40px]'>
              <FormControlLabel
                sx={{
                  fontSize: "14px",
                  marginRight: "8px",
                }}
                control={
                  <MuiCheckbox
                    disableRipple
                    size='small'
                    value={"jpg"}
                    checked={exportType.includes("jpg")}
                    onChange={(e) => {
                      if (exportType.includes("jpg"))
                        setExportType((prev) =>
                          prev.filter((type) => type != "jpg"),
                        )
                      else setExportType((prev) => [...prev, "jpg"])
                    }}
                  />
                }
                label='JPG'
              />
              <FormControlLabel
                sx={{
                  fontSize: "14px",
                  marginRight: "8px",
                }}
                control={
                  <MuiCheckbox
                    disableRipple
                    size='small'
                    value={"pdf"}
                    checked={exportType.includes("pdf")}
                    onChange={(e) => {
                      if (exportType.includes("pdf"))
                        setExportType((prev) =>
                          prev.filter((type) => type != "pdf"),
                        )
                      else setExportType((prev) => [...prev, "pdf"])
                    }}
                  />
                }
                label='PDF'
              />
            </div>
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
              <MuiButton
                variant='outlined'
                color='inherit'
                sx={{ width: 104 }}
                onClick={handleOnClickClose}
              >
                キャンセル
              </MuiButton>
              <MuiButton
                disabled={exportType.length == 0}
                variant='contained'
                sx={{ width: 104 }}
                onClick={handleOnClickStartOutput}
              >
                確定
              </MuiButton>
            </div>
          </div>
        )}
        {displayStatus === "output" && (
          <div className='relative h-[320px] w-[600px] px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              入稿用書き出し
            </p>
            <div className='mt-10 flex justify-center'>
              <MuiBox sx={{ width: 200 }}>
                <LinearProgressWithLabel value={progress} />
              </MuiBox>
            </div>
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
              <MuiButton
                variant='outlined'
                color='inherit'
                sx={{ width: 104 }}
                onClick={handleOnClickClose}
              >
                キャンセル
              </MuiButton>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                disabled={progress < 99}
                onClick={handleOnClickExact}
              >
                確定
              </MuiButton>
            </div>
          </div>
        )}
        {displayStatus === "complete" && (
          <div className='relative h-[320px] w-[600px] px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              入稿用書き出し完了
            </p>
            <p className='mt-4 text-center text-sm font-medium text-content-default-primary'>
              {`${MediaTypeEnum[bookletState.project.mediaTypeCode]}　${
                bookletState.project.issueYear
              }年　${bookletState.project.issueMonth}月号　${
                bookletState.masterEditionCode
                  ? `${bookletState.masterEditionCode.name}版`
                  : ""
              }　${pageNumbers.map((p) => p.index).join(",")}ページ`}
              <br />
              の入稿用ファイルを書き出しました
            </p>
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={handleOnClickFinishOutput}
              >
                OK
              </MuiButton>
            </div>
          </div>
        )}
      </BaseModal>
    )
  )
}

export default WorkspaceModalDraftConfirm
