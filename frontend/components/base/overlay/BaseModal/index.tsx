import React, { useState, useEffect } from "react"
import MuiModal from "@mui/material/Modal"
import MuiIconButton from "@mui/material/IconButton"

interface Props {
  children: any
  shown: boolean
  onClickClose?: Function
  disableClosing?: boolean
}

const BaseModal = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => {
    if (!props.onClickClose) return
    props.onClickClose()
  }

  useEffect(() => {
    setOpen(props.shown)
  }, [props.shown])

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }

  return (
    <MuiModal
      open={open}
      onClose={props.disableClosing ? undefined : handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus={true}
    >
      <div className='rounded-[12px] bg-white-0' style={style}>
        <div className='absolute top-3 right-3'>
          <MuiIconButton
            color='primary'
            onClick={props.disableClosing ? undefined : handleClose}
          >
            <span className='material-symbols-outlined z-10 text-xl leading-none text-container-active-primary'>
              close
            </span>
          </MuiIconButton>
        </div>
        <div>{props.children}</div>
      </div>
    </MuiModal>
  )
}

export default BaseModal
