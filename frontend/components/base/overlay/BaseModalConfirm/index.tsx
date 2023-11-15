import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"

type Props = {
  children: any
  onClose?: Function
  header: string
  onNext?: () => void
}

const BaseModalConfirm = (props: Props) => {
  const handleOnClose = () => {
    if (!props.onClose) return
    props.onClose()
  }
  const handleOnNext = () => {
    if (!props.onNext) return
    props.onNext()
  }

  return (
    <>
      <BaseModal shown={true} onClickClose={handleOnClose}>
        <div className='relative h-[250px] w-[500px] pt-[56px]'>
          <p className='text-center text-lg font-bold'>{props.header}</p>
          <p className='mt-[16px] text-center text-sm font-bold'>
            {props.children}
          </p>
          <div className='absolute left-0 bottom-0 flex w-full justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClose}
            >
              閉じる
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={handleOnNext}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </>
  )
}

export default BaseModalConfirm
