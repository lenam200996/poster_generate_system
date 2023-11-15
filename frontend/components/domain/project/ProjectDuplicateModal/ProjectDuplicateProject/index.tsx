import { useEffect, useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import { yearOptions, monthOptions } from "@/config/options"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiButton from "@mui/material/Button"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { projectsState } from "@/atoms/projectlist"
import { useApiClient } from "@/hooks/useApiClient"
import MuiLoadingButton from "@mui/lab/LoadingButton"
const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP",
  },
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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

interface Props {
  media: string
  year: number
  month: number
  onClickNext: (year: string, month: string, projectId: number) => void
  onClose: Function
  loading: boolean
}

const ProjectDuplicateProject = (props: Props) => {
  const projects = useRecoilValue(projectsState)
  const [year, setYear] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [issueYearMonths, setIssueYearMonths] = useState([])
  const [projectDestinationId, setProjectDestinationId] = useState(null)
  const apiClient = useApiClient()
  useEffect(() => {
    getIssueProject()
  }, [])

  const getIssueProject = async () => {
    const { data } =
      await apiClient.projectsApiFactory.projectControllerGetIssueProject()
    if (data) {
      setIssueYearMonths(
        data.map((iss) => ({
          ...iss,
          text: `${iss.issueYear}年　${iss.issueMonth}月`,
        })),
      )
    }
  }

  const handleOnClickNext = () => {
    props.onClickNext(year, month, projectDestinationId)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px] pb-9'>
          <p className='text-center text-lg font-bold text-content-default-primary'>
            プロジェクト複製確認
          </p>
          <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
            {`${props.media}　${props.year}年　${props.month}月号`}
            を複製しますか？
            <br />
            ※プロジェクト単位で原稿のみ全て複製します。
          </p>
        </div>
        <div className='flex justify-center'>
          <div className='mr-8 flex items-center'>
            <div className='mr-3'>
              <MuiFormControl size='small' sx={{ width: 200 }}>
                <MuiSelect
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  value={projectDestinationId}
                  MenuProps={MenuProps}
                  onChange={(event) => {
                    setProjectDestinationId(event.target.value)
                    const findProject = issueYearMonths.find(
                      (proj) => proj.id == event.target.value,
                    )
                    if (findProject) {
                      setMonth(findProject.issueMonth)
                      setYear(findProject.issueYear)
                    }
                  }}
                >
                  <MuiMenuItem value={null}>
                    <div className='text-xs leading-6 text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {issueYearMonths.map(
                    (iss: {
                      id: number
                      issueYear: number
                      issueMonth: number
                      text: string
                    }) => (
                      <MuiMenuItem key={iss.id} value={iss.id}>
                        <div className='text-xs leading-6 text-content-default-primary'>
                          {iss.text}
                        </div>
                      </MuiMenuItem>
                    ),
                  )}
                </MuiSelect>
              </MuiFormControl>
            </div>
            <span className='text-[13px] leading-5 text-content-default-primary'>
              年
            </span>
          </div>
        </div>
        <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={() => props.onClose()}
          >
            キャンセル
          </MuiButton>
          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={!projectDestinationId}
            onClick={handleOnClickNext}
            loading={props.loading}
          >
            次へ
          </MuiLoadingButton>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ProjectDuplicateProject
