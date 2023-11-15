import MuiButton from "@mui/material/Button"
import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

interface Props {
  link: string
}

const BaseButtonCopyLink = (props: Props) => {
  const [copied, setCopied] = useState<boolean>(false)
  const handleOnCopy = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }
  return (
    <CopyToClipboard text={props.link} onCopy={handleOnCopy}>
      <MuiButton
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          lineHeight: "1",
          display: "inline-block",
        }}
        color='primary'
        variant='outlined'
        disableRipple
        sx={{
          width: 338,
          height: 30,
          textAlign: "left",
          textTransform: "none",
          paddingLeft: "20px",
          paddingRight: "40px",
        }}
      >
        {props.link}
        <span className='material-symbols-outlined absolute top-0 right-[10px] text-lg'>
          {!copied ? "file_copy" : "check_circle"}
        </span>
      </MuiButton>
    </CopyToClipboard>
  )
}

export default BaseButtonCopyLink
