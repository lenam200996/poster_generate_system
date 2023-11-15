import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiButton from "@mui/material/Button"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"

interface Props {
  // id: number
  planTitle: string
  onClose: () => void
}

const WorkspaceModalOutputCofirmPlan = (props: Props) => {
  const [values, setValues] = useState<string[]>(["jpg", "pdf"])
  const [complite, setComplete] = useState<boolean>(false)
  const handleOnClose = () => props.onClose()
  const handleOnChange = (value: string) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value))
    } else {
      setValues([...values, value])
    }
  }
  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>確認用書き出し確認</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.planTitle}
            <br />
            確認用ファイルを書き出しますか？
          </p>
        </div>
        <div className='mt-6 flex justify-center'>
          <MuiFormControlLabel
            control={
              <MuiCheckbox
                value='jpg'
                checked={values.includes("jpg")}
                onChange={(event) => handleOnChange(event.target.value)}
              />
            }
            label='JPG'
          />
          <div className='ml-12'>
            <MuiFormControlLabel
              control={
                <MuiCheckbox
                  value='pdf'
                  checked={values.includes("pdf")}
                  onChange={(event) => handleOnChange(event.target.value)}
                />
              }
              label='PDF'
            />
          </div>
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
            disabled={values.length === 0}
            onClick={() => {
              setComplete(true)
              downloadFileFromUrl("/assets/dummy/dummy-pdf.pdf", "dummy")
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
          <p className='text-center text-lg font-bold'>確認用書き出し完了</p>
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
            onClick={() => {
              setComplete(false), handleOnClose()
            }}
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

export default WorkspaceModalOutputCofirmPlan
