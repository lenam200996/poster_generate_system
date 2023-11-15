import { useState } from "react"
import { useRecoilValue } from "recoil"
import { yearOptions, monthOptions } from "@/config/options"
import MuiRadio from "@mui/material/Radio"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiButton from "@mui/material/Button"
import { styled } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { projectsState } from "@/atoms/projectlist"

interface Props {
  onNext: Function
  onClose: Function
}

type MediaType = "MAGAZINE" | "TEST"

export const MediaTypeNames = {
  MAGAZINE: "ゆこゆこ本誌",
  TEST: "テスト",
}

const StyledFormControlLabel = styled(MuiFormControlLabel)({
  "& .MuiFormControlLabel-label": {
    fontSize: 14,
    color: "#001F29",
  },
})

const theme = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          display: "flex",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: "32px",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: "8px 0",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: "5px 9px",
        },
      },
    },
  },
})

const ProjectNewSettingSelectMedia = (props: Props) => {
  const projects = useRecoilValue(projectsState)
  const [mediaType, setMediaType] = useState<MediaType | "">("")
  const [yearMagazine, setYearMagazine] = useState<string>("")
  const [monthMagazine, setMonthMagazine] = useState<string>("")
  const [yearTest, setYearTest] = useState<string>("")
  const [monthTest, setMonthTest] = useState<string>("")

  const handleOnChange = (value: MediaType) => setMediaType(value)
  const handleOnChangeYearMagazine = (value: string) => {
    setYearMagazine(value)
    if (monthMagazine !== null) {
      const media = MediaTypeNames["yukoyuko"]
      const project = projects.find(
        (project) =>
          project.mediaTypeCode === media &&
          project.issueYear === Number(value) &&
          project.issueMonth === Number(monthMagazine),
      )
      if (project) {
        setMonthMagazine(null)
      }
    }
  }
  const handleOnChangeYearTest = (value: string) => {
    setYearTest(value)
    if (monthTest !== null) {
      const media = MediaTypeNames["tirashi"]
      const project = projects.find(
        (project) =>
          project.mediaTypeCode === media &&
          project.issueYear === Number(value) &&
          project.issueMonth === Number(monthTest),
      )
      if (project) {
        setMonthTest(null)
      }
    }
  }
  const handleOnChangeMonthMagazine = (value: string) => setMonthMagazine(value)
  const handleOnChangeMonthTest = (value: string) => setMonthTest(value)
  const handleOnClickNext = () => {
    if (mediaType === "MAGAZINE") {
      props.onNext({
        mediaType,
        year: Number(yearMagazine),
        month: Number(monthMagazine),
      })
    } else if (mediaType === "TEST") {
      props.onNext({
        mediaType,
        year: Number(yearTest),
        month: Number(monthTest),
      })
    }
  }
  const handleOnClose = () => props.onClose()

  const createYearOptions = (mediaType: MediaType) => {
    return yearOptions
      .filter((option) =>
        projects.filter(
          (project) =>
            project.mediaTypeCode === mediaType &&
            project.issueYear === Number(option.value),
        ),
      )
      .map((option) => (
        <MuiMenuItem key={option.value} value={option.value}>
          <div className='text-sm leading-6 text-content-default-primary'>
            {option.label}
          </div>
        </MuiMenuItem>
      ))
  }
  const createMonthOptions = (mediaType: MediaType) => {
    const year =
      mediaType === "MAGAZINE"
        ? yearMagazine
        : mediaType === "TEST"
        ? yearTest
        : ""
    const months = projects
      .filter(
        (project) =>
          project.mediaTypeCode === mediaType &&
          project.issueYear === Number(year),
      )
      .map((project) => project.issueMonth)
    return monthOptions
      .filter((option) => year === "" || !months.includes(Number(option.value)))
      .map((option) => (
        <MuiMenuItem key={option.value} value={option.value}>
          <div className='text-sm leading-6 text-content-default-primary'>
            {option.label}
          </div>
        </MuiMenuItem>
      ))
  }
  const magazineYearOptions = createYearOptions("MAGAZINE")
  const magazineMonthOptions = createMonthOptions("MAGAZINE")
  const testYearOptions = createYearOptions("TEST")
  const testMonthOptions = createMonthOptions("TEST")

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 180,
      },
    },
  }

  const isNextDisabled = !(
    (mediaType === "MAGAZINE" && yearMagazine !== "" && monthMagazine !== "") ||
    (mediaType === "TEST" && yearTest !== "" && monthTest !== "")
  )

  return (
    <div className='relative min-h-[500px] w-[900px]'>
      <div className='mb-7 pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規プロジェクト設定
        </p>
        <p className='mt-11 text-center text-sm font-medium text-content-default-primary'>
          媒体を選択してください
        </p>
      </div>

      <ThemeProvider theme={theme}>
        <MuiRadioGroup
          onChange={(event) => handleOnChange(event.target.value as MediaType)}
          value={mediaType}
        >
          <div className='flex justify-center'>
            <div className='flex items-center'>
              <div className='w-[200px]'>
                <StyledFormControlLabel
                  value='MAGAZINE'
                  control={
                    <MuiRadio size='small' sx={{ padding: "8px 9px" }} />
                  }
                  label='ゆこゆこ本誌'
                />
              </div>
              <div className='flex items-center space-x-3'>
                <MuiSelect
                  size='small'
                  sx={{ minWidth: 122 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  value={yearMagazine}
                  MenuProps={MenuProps}
                  onChange={(event) =>
                    handleOnChangeYearMagazine(event.target.value as string)
                  }
                >
                  <MuiMenuItem value=''>
                    <div className='text-sm leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {magazineYearOptions}
                </MuiSelect>
                <span className='text-sm text-content-default-primary'>年</span>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ minWidth: 99 }}
                  inputProps={{ "aria-label": "Without label" }}
                  value={monthMagazine}
                  onChange={(event) =>
                    handleOnChangeMonthMagazine(event.target.value as string)
                  }
                >
                  <MuiMenuItem value=''>
                    <div className='text-sm leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {magazineMonthOptions}
                </MuiSelect>
                <span className='text-sm text-content-default-primary'>
                  月号
                </span>
              </div>
            </div>
          </div>
          <div className='mt-5 flex justify-center'>
            <div className='flex items-center'>
              <div className='w-[200px]'>
                <StyledFormControlLabel
                  value='TEST'
                  control={
                    <MuiRadio size='small' sx={{ padding: "8px 9px" }} />
                  }
                  label='テスト'
                />
              </div>
              <div className='flex items-center space-x-3'>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ minWidth: 122 }}
                  inputProps={{ "aria-label": "Without label" }}
                  value={yearTest}
                  MenuProps={MenuProps}
                  onChange={(event) =>
                    handleOnChangeYearTest(event.target.value as string)
                  }
                >
                  <MuiMenuItem value=''>
                    <div className='text-sm leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {testYearOptions}
                </MuiSelect>
                <span className='text-sm text-content-default-primary'>年</span>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ minWidth: 99 }}
                  inputProps={{ "aria-label": "Without label" }}
                  value={monthTest}
                  onChange={(event) =>
                    handleOnChangeMonthTest(event.target.value as string)
                  }
                >
                  <MuiMenuItem value=''>
                    <div className='text-sm leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {testMonthOptions}
                </MuiSelect>
                <span className='text-sm text-content-default-primary'>
                  月号
                </span>
              </div>
            </div>
          </div>
        </MuiRadioGroup>
      </ThemeProvider>
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
          disabled={isNextDisabled}
          onClick={handleOnClickNext}
        >
          次へ
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectNewSettingSelectMedia
