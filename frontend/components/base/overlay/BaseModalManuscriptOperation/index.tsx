import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"

type Props = {
  children: any
  onClose?: Function
  onNext?: ({ selectedValue }: { selectedValue: string }) => void
}

const BaseModalManuscriptOperation = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState(null)

  const handleOnClose = () => {
    if (!props.onClose) return
    props.onClose()
  }
  const handleOnNext = () => {
    if (!props.onNext) return
    props.onNext({ selectedValue })
  }

  return (
    <>
      <BaseModal shown={true} onClickClose={handleOnClose}>
        <MuiFormControl>
          <MuiRadioGroup
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
          >
            <div className='relative h-[570px] w-[860px]'>
              <div className='pt-[56px]'>
                <p className='text-center text-lg font-bold text-content-default-primary'>
                  原稿操作
                </p>
                <div className='mt-11'>{props.children}</div>
              </div>
              <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  onClick={handleOnClose}
                >
                  キャンセル
                </MuiButton>
                <MuiButton
                  disabled={selectedValue === null}
                  variant='contained'
                  sx={{ width: 104 }}
                  onClick={handleOnNext}
                >
                  次へ
                </MuiButton>
              </div>
            </div>
          </MuiRadioGroup>
        </MuiFormControl>
      </BaseModal>
    </>
  )
}

export default BaseModalManuscriptOperation
