import { useRef, useState } from "react"
import { Chip as MuiChip, Menu, MenuItem } from "@mui/material"

interface FontSelectButtonProps {
  options: Array<{
    label: string
    value: string
  }>
  onClick?: (value: string) => void
}

const FontSelectButton = (props: FontSelectButtonProps) => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  return (
    <>
      <MuiChip
        ref={ref}
        label='フォント'
        size='small'
        color={open ? "primary" : "default"}
        onClick={() => setOpen(true)}
      />
      <Menu
        open={open}
        anchorEl={ref.current}
        onClose={() => setOpen(false)}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ marginTop: "8px" }}
      >
        {props.options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              if (props.onClick) {
                props.onClick(option.value)
              }
              setOpen(false)
            }}
          >
            {option.value}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default FontSelectButton
