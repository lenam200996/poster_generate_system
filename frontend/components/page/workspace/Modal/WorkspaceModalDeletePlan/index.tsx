import { useMemo, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { Order } from "@/config/api/mock/workspace/booklet"
import {
  workspaceBookletState,
  workspaceManuscriptState,
} from "@/atoms/workspace"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { useApiClient } from "@/hooks/useApiClient"
import MuiLoadingButton from "@mui/lab/LoadingButton"

interface Props {
  id: number
  order: Order
  planTitle: string
  onClose: () => void
  onComplete: () => void
}

const WorkspaceModalDeletePlan = (props: Props) => {
  const apiClient = useApiClient()
  const [complite, setComplete] = useState(false)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)
  const [apiLoading, setApiLoading] = useState(false)

  const manuscript = useMemo(() => {
    const page = bookletState.pages.find((page) => page.id === props.id)
    return page && page.documents.find((item) => item.order === props.order)
  }, [bookletState.pages, props.id, props.order])

  const handleOnClose = () => {
    if (complite) {
      props.onComplete()
    }

    props.onClose()
  }
  const handleOnClickComplete = () => props.onComplete()
  const handleOnClick = async () => {
    try {
      setApiLoading(true)
      if (manuscript) {
        await apiClient.documentsApiFactory.documentControllerDeleteDocument(
          manuscript.id,
        )
        const pages = [...bookletState.pages].map((page) => {
          if (page.id === props.id) {
            return {
              ...page,
              documents: page.documents.filter((e) => e.order !== props.order),
            }
          } else {
            return page
          }
        })

        setManuscriptState(null)
        setBookletState({
          ...bookletState,
          pages,
        })
        setComplete(true)
      }
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>原稿の削除確認</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.planTitle}
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
          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClick}
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
          <p className='text-center text-lg font-bold'>原稿の削除完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.planTitle}
            <br />
            を削除しました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
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
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalDeletePlan
