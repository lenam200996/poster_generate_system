import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import BaseButtonText from "@/components/base/button/BaseButtonText"
import MuiButton from "@mui/material/Button"
import MuiTextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"

interface Props {
  disabled?: boolean
  onSave: (name: string) => void
}

const StyledTextField = styled(MuiTextField)({
  "& .MuiInputBase-root": {
    width: 280,
    height: 32,
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 8px",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
  },
  "& .MuiInputBase-input[value='']": {
    backgroundColor: "#FBFBFB",
  },
})

const ProjectFilterSearchConditionsModal = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")
  const handleOnClick = () => setShown(true)
  const handleOnClickClose = () => {
    setShown(false)
    setValue("")
  }
  const handleOnClickExact = () => {
    props.onSave(value)
    setShown(false)
    setValue("")
  }
  const handleOnChange = (value: string) => {
    setValue(value)
  }
  return (
    <div>
      <BaseButtonText
        color='link'
        disabled={props.disabled}
        onClick={handleOnClick}
        sx={{ height: "33px" }}
      >
        <span className='text-[15px] leading-6'>検索条件を保存</span>
      </BaseButtonText>
      <BaseModal shown={shown} onClickClose={handleOnClickClose}>
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              検索条件を保存
            </p>
            <div className='m-auto mt-14 flex w-max items-center'>
              <span className='text-sm font-medium text-content-default-primary'>
                名前
              </span>
              <div className='ml-3'>
                <StyledTextField
                  placeholder='テキストがここに入ります'
                  variant='outlined'
                  value={value}
                  size='small'
                  onChange={(event) => handleOnChange(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={value === ""}
              onClick={handleOnClickExact}
            >
              確定
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default ProjectFilterSearchConditionsModal
