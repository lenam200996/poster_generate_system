import { useCallback } from "react"
import { blue } from "@mui/material/colors"
import MuiLink from "@mui/material/Link"
import MuiAvatar from "@mui/material/Avatar"
import { useDropzone } from "react-dropzone"
import MuiCircularProgress from "@mui/material/CircularProgress"

interface Props {
  text: string
  name?: string
  extension?: string[]
  error?: boolean
  errorText?: string
  upLoading?: boolean
  onChange?: ({ files, name }: { files: File[]; name: string }) => void
}

const BaseFileUploader = (props: Props) => {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) return
    props.onChange({ files: acceptedFiles, name: props.name })
  }, []) // eslint-disable-line
  const accept = {
    "application/octet-stream": [...props.extension],
  }

  const { fileRejections, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept,
    })
  const isFileRejection = fileRejections.length > 0
  return (
    <>
      {props.upLoading ? (
        <div className='relative flex h-full w-full flex-col items-center justify-center rounded border-[1px] border-dashed border-[#e0e0e0] bg-container-main-quaternary p-6'>
          {/* <MuiCircularProgress /> */}
          <span className='material-symbols-outlined animate-spin text-[32px] text-[#a91f28]'>
            onsen
          </span>
        </div>
      ) : (
        <div {...getRootProps()} className='h-full w-full'>
          <div
            className={`relative flex h-full w-full flex-col items-center justify-center rounded border-[1px] border-dashed border-[#e0e0e0] bg-container-main-quaternary p-6 hover:border-theme-yk-tertiary hover:bg-theme-yk-secondary ${
              isFileRejection || props.error ? "border-red-60 bg-red-10" : ""
            } ${
              isDragActive
                ? "!border-theme-yk-tertiary !bg-theme-yk-secondary"
                : ""
            } `}
          >
            <input
              {...getInputProps()}
              className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
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
          {isFileRejection ? (
            <p className='mt-1 text-[13px] text-content-error-primary'>
              {props.errorText}
            </p>
          ) : props.error ? (
            <p className='mt-1 text-[13px] text-content-error-primary'>
              {props.errorText}
            </p>
          ) : null}
        </div>
      )}
    </>
  )
}

export default BaseFileUploader
