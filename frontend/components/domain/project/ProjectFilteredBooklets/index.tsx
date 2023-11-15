import { useState } from "react"
import { useRouter } from "next/router"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import ProjectDeleteBookletModal from "@/components/domain/project/ProjectDeleteBookletModal/index"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import dayjs from "@/util/dayjs"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import { BookletSearchWithCountDto } from "@/openapi/api"

const theme = createTheme(tableRowTheme)

interface Props {
  booklets: BookletSearchWithCountDto["data"]
}

const ProjectFilteredBooklets = (props: Props) => {
  const router = useRouter()
  const [deleteBooklet, setDeleteBooklet] = useState<{
    id: number
    media: string
    year: number
    month: number
    plate: string
  }>(undefined)
  return (
    <div>
      <MuiTableContainer component={MuiPaper}>
        <MuiTable>
          <MuiTableHead sx={{ backgroundColor: "#F2F5FF" }}>
            <MuiTableRow>
              <MuiTableCell
                align='center'
                padding='none'
                sx={{ minWidth: 110 }}
              >
                <div className='py-4 px-2 text-xs font-normal text-gray-100'>
                  媒体
                </div>
              </MuiTableCell>
              <MuiTableCell
                align='center'
                padding='none'
                sx={{ minWidth: 120 }}
              >
                <div className='py-4 px-2 text-xs font-normal text-gray-100'>
                  版
                </div>
              </MuiTableCell>
              <MuiTableCell
                align='center'
                padding='none'
                sx={{ minWidth: 120 }}
              >
                <div className='py-4 px-2 text-xs font-normal text-gray-100'>
                  号
                </div>
              </MuiTableCell>
              <MuiTableCell
                align='center'
                padding='none'
                sx={{ minWidth: 120 }}
              >
                <div className='py-4 px-2 text-xs font-normal text-gray-100'>
                  最終更新日
                </div>
              </MuiTableCell>
              <MuiTableCell
                align='center'
                padding='none'
                sx={{ minWidth: 275 }}
              >
                <div className='py-4 px-2 text-xs font-normal text-gray-100'>
                  操作
                </div>
              </MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            <ThemeProvider theme={theme}>
              {props.booklets.map((row) => (
                <MuiTableRow key={row.id}>
                  <MuiTableCell align='center' size='small'>
                    <div className='text-xs font-medium'>
                      {row.project.mediaType.name}
                    </div>
                  </MuiTableCell>
                  <MuiTableCell align='center' size='small'>
                    <div className='text-xs font-medium'>
                      {row.masterEditionCode.name}
                    </div>
                  </MuiTableCell>
                  <MuiTableCell align='center' size='small'>
                    <div className='text-xs font-medium'>
                      {row.project.issueYear}年{row.project.issueMonth}月号
                    </div>
                  </MuiTableCell>
                  <MuiTableCell align='center' size='small'>
                    <div className='text-xs font-medium'>
                      {dayjs(row.modifiedAt).format("YYYY/M/D")}
                    </div>
                  </MuiTableCell>
                  <MuiTableCell size='small'>
                    <div className='flex justify-center'>
                      <div className='mx-[10px]'>
                        <BaseButtonIconText
                          icon='edit_note'
                          text='編集'
                          size='small'
                          onClick={() =>
                            router.push({
                              pathname: "/workspace/[id]",
                              query: {
                                id: row.id,
                                viewMode: "split",
                              },
                            })
                          }
                        />
                      </div>
                      <div className='mx-[10px]'>
                        <BaseButtonIconText
                          icon='delete'
                          text='削除'
                          size='small'
                          onClick={() =>
                            setDeleteBooklet({
                              id: row.id,
                              media: row.project.mediaType.name,
                              year: row.project.issueYear,
                              month: row.project.issueMonth,
                              plate: row.masterEditionCode.name,
                            })
                          }
                        />
                      </div>
                    </div>
                  </MuiTableCell>
                </MuiTableRow>
              ))}
            </ThemeProvider>
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
      {deleteBooklet && (
        <ProjectDeleteBookletModal
          id={deleteBooklet.id}
          media={deleteBooklet.media}
          year={deleteBooklet.year}
          month={deleteBooklet.month}
          plate={deleteBooklet.plate}
          onClose={() => undefined}
        />
      )}
    </div>
  )
}

export default ProjectFilteredBooklets
