import { useState } from "react"
import { useSetRecoilState } from "recoil"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { useApiClient } from "@/hooks/useApiClient"
import { PageForBookletDto } from "@/openapi"
import { workspaceBookletState } from "@/atoms/workspace"

interface Props {
  page?: PageForBookletDto
  pageNumber: number
  onClose: () => void
}

const WorkspaceModalDeletePage = (props: Props) => {
  const apiClient = useApiClient()
  const [complite, setComplete] = useState<boolean>(false)
  const [apiLoading, setApiLoading] = useState(false)
  const setBookletState = useSetRecoilState(workspaceBookletState)
  const handleOnClickDelete = async () => {
    try {
      setApiLoading(true)
      const response = await apiClient.pagesApiFactory.pageControllerDelete(
        props.page.id,
        false,
      )
      setBookletState((state) => ({
        ...state,
        numberOfPages: state.numberOfPages - 1,
        pages: state.pages
          .map((page) => {
            if (page.id === props.page.id) return null
            if (page.pageNumber > props.page.pageNumber)
              return { ...page, pageNumber: page.pageNumber - 1 }
            return page
          })
          .filter((page) => page),
      }))
      setComplete(true)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }
  const handleOnClose = () => props.onClose()
  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページの削除確認</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.pageNumber}ページ
            <br />
            を削除しますか？
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={apiLoading}
            onClick={handleOnClickDelete}
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
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページの削除完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.pageNumber}ページ
            <br />
            を削除しました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalDeletePage
