import { useState, useEffect, useRef } from "react"
import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Menu, { MenuProps } from "@mui/material/Menu"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { ZodError } from "zod"

interface Props {
  placeholder?: string
  children: any
  onExact?: Function
  validationError?: ZodError
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(() => ({
  "& .MuiPaper-root": {
    borderRadius: 4,
    marginTop: 0,
    minWidth: 170,
  },
}))

const BaseFilterSelect = (props: Props) => {
  const divRef = useRef(null)
  const [open, setOpen] = useState<boolean>(false)
  const handleClick = () => {
    setOpen(!open)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleExact = () => {
    if (!props.onExact) return
    setOpen(false)
    props.onExact()
  }

  const StyledButton = styled(Button)({
    fontSize: 12,
    borderColor: `${open ? "#1976D2" : "#c0c8cc"}`,
    color: "#001F29",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#ffffff",
      borderColor: "#C0C8CC",
      boxShadow: "none",
    },
    "&:focus": {
      borderColor: "#1976D2",
    },
  })
  useEffect(() => {
    if (props.validationError) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [props.validationError])

  return (
    <div ref={divRef}>
      <StyledButton
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        variant='outlined'
        disableRipple
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
        {props.placeholder}
      </StyledButton>
      <StyledMenu open={open} onClose={handleClose} anchorEl={divRef.current}>
        <div className='px-4 pb-2'>
          {props.children}
          <div className='mt-4 flex justify-end'>
            <Button variant='contained' size='small' onClick={handleExact}>
              OK
            </Button>
          </div>
        </div>
      </StyledMenu>
    </div>
  )
}
export default BaseFilterSelect
