import { useEffect, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import { useApiClient } from "@/hooks/useApiClient"
import { EditionType } from "../ProjectOutput"
import MuiLoadingButton from "@mui/lab/LoadingButton"

interface Props {
  projectId: number
  disabled?: boolean
  media: string
  year: number
  month: number
  selectedPlates: string[]
}
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
const downloadFunc = (url: string, name: string) => {
  return new Promise<void>((resolve) => {
    downloadFileFromUrl(url, name)
    return setTimeout(() => {
      resolve()
    }, 500)
  })
}
const ProjectCSVOutputModal = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const apiClient = useApiClient()
  useEffect(() => {
    if (!processing) return
    try {
      ;(async () => {
        const response = await Promise.all(
          props.selectedPlates.map(async (plate) => {
            const res =
              await apiClient.exportsApi.exportsControllerExportDocumentProgress(
                props.projectId,
                plate as EditionType,
              )
            const st = res.data.image.split("/")
            return [res.data.image, st[st.length - 1]]
          }),
        )
        await sleep(2000)
        for (const res of response) await downloadFunc(res[0], res[1])
        setProcessing(false)
        setShown(false)
      })()
    } catch (error: any) {
      console.log("error: ", error)
      setProcessing(false)
    }
  }, [processing])
  return (
    <div>
      <MuiButton
        variant='contained'
        disabled={props.disabled}
        sx={{ width: 104 }}
        onClick={() => setShown(true)}
      >
        書き出し
      </MuiButton>
      <BaseModal shown={shown} onClickClose={() => setShown(false)}>
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              進捗リスト書き出し
            </p>
            <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
              {props.media}　{props.year}年　{props.month}月号
              <br />
              進捗リストを出力します
            </p>
          </div>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={() => setShown(false)}
            >
              キャンセル
            </MuiButton>
            <MuiLoadingButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={() => {
                setProcessing(true)
              }}
              loading={processing}
            >
              確定
            </MuiLoadingButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default ProjectCSVOutputModal
