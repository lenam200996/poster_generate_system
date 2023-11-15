import { useEffect, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import { useApiClient } from "@/hooks/useApiClient"
import { userCognitoMock } from "@/config/api/mock/myStock"
import { DocumentResponseDto } from "@/openapi/api"
import dayjs from "dayjs"
import { useRouter } from "next/router"

type Alias = {
  id: number
  code: string
  edition: string
  updated: string
}

const theme = createTheme(tableRowTheme)

interface Props {
  document: DocumentResponseDto
  onClose?: () => void
  onExact?: () => void
}

const WorkspaceModalSelectAlias = (props: Props) => {
  const router = useRouter()
  const [aliases, setAliases] = useState<Array<Alias>>([])
  const [alias, setAlias] = useState<number>(undefined)
  const apiClient = useApiClient()
  const handleClickClose = () => {
    props.onClose()
  }
  const handleOnClickExact = async () => {
    if (!alias) return
    try {
      await apiClient.documentsApiFactory.documentControllerSetAlias(
        alias,
        props.document.id,
      )
      router.push({
        pathname: "/workspace/[id]",
        query: {
          id: props.document.bookletId,
          viewMode: "split",
          documentId: props.document.id,
        },
      })
    } catch (error) {
      console.error(error)
    }
    props.onExact()
  }
  useEffect(() => {
    const fetch = async () => {
      const res =
        await apiClient.documentsApiFactory.documentControllerSearchAlias(
          props.document.id,
          userCognitoMock,
        )
      const resArray = res.data
      const newArray: Alias[] = resArray.map((doc) => {
        return {
          id: doc.document.id,
          code: doc.document.documentCode,
          updated: doc.document.modifiedAt,
          edition: doc.booklet.masterEditionCode.name,
        } as Alias
      })
      setAliases(newArray)
    }
    fetch()
  }, []) // eslint-disable-line

  return (
    <div>
      <BaseModal shown={true} onClickClose={handleClickClose}>
        <div className='relative h-[597px] w-[867px] px-[50px] pt-[56px]'>
          <p className='text-center text-lg font-bold'>
            相乗り設定　マイストックリストから選択
          </p>
          <p className='mt-7 text-center text-sm font-medium'>
            相乗り元の原稿を下記から選択してください
          </p>
          {/** in content */}
          <div className='mx-auto mt-12 w-fit'>
            <RadioGroup
              defaultValue={""}
              name='category'
              onChange={(event) => setAlias(Number(event.target.value))}
            >
              <MuiTableContainer
                sx={{ maxHeight: 245 }}
                className='rounded border-[1px] border-solid border-divider-accent-primary'
              >
                <MuiTable stickyHeader>
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell
                        align='center'
                        padding='none'
                        sx={{ width: "50px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          選択
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{
                          backgroundColor: "#F2F5FF",
                        }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          原稿ID
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "80px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          版
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "140px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          最終更新日
                        </div>
                      </MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    <ThemeProvider theme={theme}>
                      {aliases.map((x) => (
                        <MuiTableRow key={x.id}>
                          <MuiTableCell
                            align='center'
                            padding='none'
                            height={48}
                          >
                            <FormControlLabel
                              value={x.id}
                              control={<Radio size='small' />}
                              label={""}
                              sx={{ margin: 0, fontSize: "12px" }}
                            />
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='text-xs font-medium'>{x.code}</div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {x.edition}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {dayjs(x.updated).format("YYYY/M/D  HH:mm")}
                            </div>
                          </MuiTableCell>
                        </MuiTableRow>
                      ))}
                    </ThemeProvider>
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
            </RadioGroup>
          </div>
          {aliases.length === 0 && (
            <div className='mt-10 text-center text-sm font-bold text-content-default-primary'>
              相乗り可能な原稿がありません
            </div>
          )}
          {/** end content */}
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!alias}
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

export default WorkspaceModalSelectAlias
