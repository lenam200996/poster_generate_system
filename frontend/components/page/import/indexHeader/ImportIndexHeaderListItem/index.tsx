import { useState } from "react"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ImportPreviewModal from "@/components/page/import/ImportPreviewModal"
import MuiTExtField from "@mui/material/TextField"

interface Props {
  id: number
  name: string
  thumbImageUrl: string
  onDelete?: Function
  onChange?: Function
}

const ImportIndexHeaderListItem = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const handleOnChange = (value: string) => {
    if (!props.onChange) return
    props.onChange({ id: props.id, value })
  }
  return (
    <div className='flex w-[139px] flex-col rounded bg-container-main-secondary'>
      <button
        className='mx-1 mt-2 mb-[10px] h-[179px] bg-transparent'
        onClick={() => setShown(true)}
      >
        <img
          className='h-full w-full object-contain'
          src={props.thumbImageUrl}
          alt={props.name}
        />
      </button>
      <div className='mx-3 mb-2 space-y-4 pb-2'>
        {!props.onChange && (
          <p className='mt-4 text-center text-sm text-content-default-primary'>
            {props.name}
          </p>
        )}
        {props.onChange && (
          <div className='mt-2 mb-4 flex justify-center'>
            <MuiTExtField
              value={props.name}
              size='small'
              sx={{ width: 100 }}
              onChange={(event) => handleOnChange(event.target.value)}
            />
          </div>
        )}
        {props.onDelete && (
          <div className='flex justify-center'>
            <BaseButtonIconText
              icon='delete'
              text='削除'
              onClick={props.onDelete}
            />
          </div>
        )}
      </div>
      {shown && (
        <ImportPreviewModal
          name={props.name}
          url={props.thumbImageUrl}
          onClose={() => setShown(false)}
        />
      )}
    </div>
  )
}

export default ImportIndexHeaderListItem
