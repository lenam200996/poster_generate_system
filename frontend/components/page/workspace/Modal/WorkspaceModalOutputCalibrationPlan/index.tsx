import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"

import MuiButton from "@mui/material/Button"

interface Props {
  // id: number
  shown?: boolean
  planTitle: string
  onClose: () => void
}

const WorkspaceModalOutputCalibrationPlan = (props: Props) => {
  const [complite, setComplete] = useState<boolean>(false)
  const handleOnClose = () => props.onClose()
  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>
            校正依頼用書き出し確認
          </p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.planTitle}
            <br />
            校正用ファイルを書き出しますか？
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
            onClick={() => {
              setComplete(true)
            }}
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
          <p className='text-center text-lg font-bold'>
            校正依頼用書き出し完了
          </p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.planTitle}
            <br />
            確認用ファイルを書き出しました
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
    <BaseModal shown={props.shown} onClickClose={handleOnClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalOutputCalibrationPlan
