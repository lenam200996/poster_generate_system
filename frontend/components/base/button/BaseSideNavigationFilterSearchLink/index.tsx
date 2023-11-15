import { useState } from "react"
import Link from "next/link"
import { styled } from "@mui/material/styles"
import MuiIconButton from "@mui/material/IconButton"
import MuiTextField from "@mui/material/TextField"

export interface BaseSideNavigationFilterSearchLinkProps {
  id: string
  label: string
  value: string
  onChange: (newName: string) => void
  onDelete: Function
}

const StyledTextField = styled(MuiTextField)({
  "& .MuiInputBase-input": {
    fontSize: 12,
    borderColor: "#C0C8CC",
    backgroundColor: "#FBFBFB",
    padding: "7px",
  },
})

const BaseSideNavigationFilterSearchLink = (
  props: BaseSideNavigationFilterSearchLinkProps,
) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(props.label)
  const handleOnClickEdit = () => {
    setValue(props.label)
    setIsEditing(true)
  }
  const handleOnSaveName = () => {
    if (value !== "") {
      props.onChange(value)
      setIsEditing(false)
    }
  }
  const handleOnCancelEdit = () => {
    setValue(props.label)
    setIsEditing(false)
  }
  return (
    <div className='flex min-h-[48px] w-full items-center justify-between border-b border-divider-accent-secondary py-2'>
      {isEditing ? (
        <div className='ml-3 mr-1 w-full'>
          <StyledTextField
            value={value}
            size='small'
            fullWidth
            placeholder='北海道、夏の別冊チラシ'
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      ) : (
        <Link href={props.value}>
          <span className='mx-4 w-full cursor-pointer truncate rounded p-1 text-xs text-content-default-primary hover:bg-theme-yk-primary'>
            {props.label}
          </span>
        </Link>
      )}
      {isEditing ? (
        <div className='flex items-center justify-end'>
          <MuiIconButton
            color='primary'
            size='small'
            onClick={handleOnSaveName}
          >
            <span className='material-symbols-outlined z-10 text-base leading-none text-gray-80'>
              check_circle
            </span>
          </MuiIconButton>
          <MuiIconButton
            color='primary'
            size='small'
            onClick={handleOnCancelEdit}
          >
            <span className='material-symbols-outlined z-10 text-base leading-none text-gray-80'>
              close
            </span>
          </MuiIconButton>
        </div>
      ) : (
        <div className='flex items-center justify-end pr-3'>
          <MuiIconButton
            color='primary'
            size='small'
            onClick={handleOnClickEdit}
          >
            <span className='material-symbols-outlined z-10 text-base leading-none text-gray-80'>
              edit_note
            </span>
          </MuiIconButton>
          <MuiIconButton
            color='primary'
            size='small'
            onClick={() => props.onDelete()}
          >
            <span className='material-symbols-outlined z-10 text-base leading-none text-gray-80'>
              delete
            </span>
          </MuiIconButton>
        </div>
      )}
    </div>
  )
}

export default BaseSideNavigationFilterSearchLink
