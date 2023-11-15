import { ChangeEventHandler } from "react"
import { blue } from "@mui/material/colors"
import MuiLink from "@mui/material/Link"
import MuiAvatar from "@mui/material/Avatar"

interface Props {
  text: string
  name?: string
  extension?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const ImportFileUpload = (props: Props) => {
  const handleOnChange = (event) => {
    props.onChange(event)
    event.target.value = ""
  }
  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center rounded border-[1px] border-dashed border-[#e0e0e0] bg-container-main-quaternary p-6'>
      <input
        className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
        multiple
        type='file'
        name={props.name}
        accept={props.extension ?? ""}
        onChange={handleOnChange}
      />
      <MuiAvatar sx={{ bgcolor: blue[50] }}>
        <span className='material-symbols-outlined leading-none text-[#1976D2]'>
          upload_file
        </span>
      </MuiAvatar>
      <div className='mt-2'>
        <MuiLink>{props.text}</MuiLink>
      </div>
    </div>
  )
}

export default ImportFileUpload
