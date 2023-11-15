import { useState } from "react"
import MuiButton from "@mui/material/Button"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import { useSetRecoilState } from "recoil"
import { projectsState } from "@/atoms/projectlist"
import { useApiClient } from "@/hooks/useApiClient"

interface Props {
  id: number
  media: string
  year: number
  month: number
  plate: string
  onClose: Function
}

const ProjectDeleteBookletModal = (props: Props) => {
  const apiClient = useApiClient()
  const setProjects = useSetRecoilState(projectsState)
  const [complite, setComplete] = useState<boolean>(false)
  const handleOnClick = async () => {
    console.log("click")
    try {
      await apiClient.bookletApiFactory.bookletControllerDelete(props.id)
      const response =
        await apiClient.projectsApiFactory.projectControllerList()
      setProjects(response.data.data)
      setComplete(true)
    } catch (error) {
      console.error(error)
    }
  }
  const handleOnClickClose = () => {
    props.onClose()
  }
  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='pt-[56px] pb-8'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            冊子削除確認
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {props.media}　{props.year}年　{props.month}月号　{props.plate}
            版
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
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClick}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }
  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='p-8 pt-[56px]'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            冊子削除完了
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {props.media}　{props.year}年　{props.month}月号　{props.plate}
            版
            <br />
            を削除しました
          </p>
        </div>
        <div className='absolute left-0 bottom-0 flex h-[72px] w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClickClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default ProjectDeleteBookletModal
