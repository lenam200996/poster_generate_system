import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import { useRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"
import { useApiClient } from "@/hooks/useApiClient"
import MuiButton from "@mui/material/Button"

interface Props {
  pageNumber: number
  onClose: () => void
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const WorkspaceModalDulicatePage = (props: Props) => {
  const apiClient = useApiClient()
  const [complite, setComplete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)

  const handleOnClose = () => props.onClose()

  const handleDuplicate = async () => {
    if (loading) return
    setLoading(true)
    let prevPage = bookletState.pages.find(
      (page) => page.pageNumber === props.pageNumber,
    )
    let newPageNumber = bookletState.numberOfPages + 3

    // @ts-ignore Please fix
    let pageDuplicated = await apiClient.pagesApiFactory.pageControllerPageCopy(
      {
        bookletId: prevPage.bookletId,
        pageNumber: newPageNumber,
        id: prevPage.id,
        pageTypeCode: prevPage.pageTypeCode,
        projectId: prevPage.projectId,
      },
    )
    if (!pageDuplicated.data || !pageDuplicated.data.id) return //  show message error

    // let mockMaxId = Math.max(...bookletState.pages.map((page) => page.id))
    setBookletState((state) => {
      return {
        ...state,
        numberOfPages: state.numberOfPages + 1,
        pages: [...state.pages, pageDuplicated.data],
      }
    })
    setLoading(false)
    setComplete(true)
  }

  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページ複製確認</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.pageNumber}ページ <br></br>
            を複製しますか？
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
            onClick={handleDuplicate}
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
          <p className='text-center text-lg font-bold'>ページ複製確認完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.pageNumber}ページ
            <br />
            を複製しました
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

export default WorkspaceModalDulicatePage
