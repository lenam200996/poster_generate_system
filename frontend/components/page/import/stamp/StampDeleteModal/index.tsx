import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import { useApiClient } from "@/hooks/useApiClient"

interface Props {
  id: number
  name: string
  onClose: Function
  onComplete?: Function
}

const StampDeleteModal = (props: Props) => {
  const apiClient = useApiClient()
  const [complete, setComplete] = useState<boolean>(false)

  const handleOnClickDelete = async () => {
    await apiClient.documentBoastStampsApi.documentBoastStampControllerDeleteDocumentBoastStamp(
      props.id,
    )
    setComplete(true)
  }

  const handleOnClickDeleted = () => {
    if (props.onComplete) {
      props.onComplete()
    }
    props.onClose()
  }

  const handleOnClickClose = () => {
    if (complete && props.onComplete) {
      props.onComplete()
    }
    props.onClose()
  }

  return (
    <BaseModal shown={true} onClickClose={handleOnClickClose}>
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            {complete ? "自慢スタンプ削除完了" : "自慢スタンプ削除確認"}
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {props.name}
            <br />
            {complete ? `を削除しました` : `を削除しますか？`}
          </p>
        </div>
        <div
          className={`absolute left-0 bottom-0 flex w-full items-center px-9 pb-9 ${
            complete ? "justify-center" : "justify-between"
          }`}
        >
          {complete ? (
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={handleOnClickDeleted}
            >
              OK
            </MuiButton>
          ) : (
            <>
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
                onClick={handleOnClickDelete}
              >
                確定
              </MuiButton>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  )
}

export default StampDeleteModal
