import { useMemo, useState } from "react"
import { copiesMock } from "@/config/api/mock/projects/index"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import selectBoxTheme from "@/config/mui/theme/selectBox"

interface Props {
  destinationPlates: string[]
  onNext?: Function
  onClose: Function
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const theme = createTheme(selectBoxTheme)

const StyledTextField = styled(MuiTextField)({
  "& .MuiInputBase-root": {
    height: 32,
  },
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "0 8px",
    borderRadius: "4px",
  },
})

const ProjectNewBookletSetting = (props: Props) => {
  const [plateName, setPlateName] = useState<string>("")
  const [pageCounts, setPageCounts] = useState<string>("")

  const setDisabled = (): boolean => {
    return (
      plateName === "" ||
      pageCounts === "" ||
      !props.destinationPlates.includes(plateName)
    )
  }
  const handleChangeCopy = (value: string) => {
    setPlateName(value)
  }
  const handleOnChangePageCounts = (value: string) => {
    setPageCounts(value)
  }
  const handleOnClickNext = () => {
    props.onNext({
      plateName,
      pageCounts,
    })
  }
  const handleOnClose = () => props.onClose()

  const CopyOptions = useMemo(() => {
    return copiesMock
      .filter((option) => props.destinationPlates.includes(option.value))
      .map((option) => (
        <MuiMenuItem key={option.value} value={option.value}>
          <div className='text-sm leading-6 text-content-default-primary'>
            {option.label}
          </div>
        </MuiMenuItem>
      ))
  }, []) // eslint-disable-line

  return (
    <div className='relative min-h-[356px] min-w-[600px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規冊子設定
        </p>
        <p className='mt-11 text-center text-sm font-medium text-content-default-primary'>
          新規冊子の設定をしてください
        </p>
      </div>

      <div className='mt-11 flex justify-center'>
        <div>
          <ThemeProvider theme={theme}>
            <div className='flex items-center justify-between'>
              <div className='flex w-[177px] items-center'>
                <span className='mr-5 text-sm font-medium text-content-default-primary'>
                  版名
                </span>
                <MuiFormControl size='small' sx={{ minWidth: 74 }}>
                  <MuiSelect
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    defaultValue=''
                    MenuProps={MenuProps}
                    value={plateName}
                    onChange={(event) => handleChangeCopy(event.target.value)}
                  >
                    <MuiMenuItem value=''>
                      <div className='text-sm leading-6 text-content-default-primary'>
                        版
                      </div>
                    </MuiMenuItem>
                    {CopyOptions}
                  </MuiSelect>
                </MuiFormControl>
              </div>
              <div className='flex items-center'>
                <span className='mr-5 text-sm font-medium text-content-default-primary'>
                  ページ数
                </span>
                <StyledTextField
                  size='small'
                  sx={{ width: 60 }}
                  value={pageCounts}
                  onChange={(event) => {
                    if (!isNaN(Number(event.target.value))) {
                      handleOnChangePageCounts(event.target.value)
                    }
                  }}
                />
              </div>
            </div>
          </ThemeProvider>
        </div>
      </div>
      <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
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
          disabled={setDisabled()}
          onClick={handleOnClickNext}
        >
          確定
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectNewBookletSetting
