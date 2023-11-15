import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { useApiClient } from "@/hooks/useApiClient"
import MuiLoadingButton from "@mui/lab/LoadingButton"

interface Props {
  id: number
  year: number
  month: number
  media: string
  onClose: Function
  onComplete?: Function
}

const ProjectDeleteModal = (props: Props) => {
  const apiClient = useApiClient()
  const [complete, setComplete] = useState<boolean>(false)
  const [apiLoading, setApiLoading] = useState<boolean>(false)

  const handleOnClickClose = () => {
    if (complete && props.onComplete) {
      props.onComplete()
    } else {
      props.onClose()
    }
  }

  const handleOnClickDeleteProject = async () => {
    try {
      setApiLoading(true)
      await apiClient.projectsApiFactory.projectControllerDelete(props.id)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
    setComplete(true)
  }

  const handleOnClickComplete = () => {
    if (props.onComplete) {
      props.onComplete()
    }
  }

  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            プロジェクト削除確認
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {props.media}　{props.year}年　{props.month}月号
            <br />
            を削除しますか？
          </p>
        </div>
        <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClickClose}
          >
            キャンセル
          </MuiButton>
          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickDeleteProject}
            loading={apiLoading}
          >
            確定
          </MuiLoadingButton>
        </div>
      </div>
    )
  }
  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            プロジェクト削除完了
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {props.media}　{props.year}年　{props.month}月号
            <br />
            を削除しました
          </p>
        </div>
        <div className='absolute left-0 bottom-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickComplete}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClickClose}>
      {complete ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default ProjectDeleteModal
