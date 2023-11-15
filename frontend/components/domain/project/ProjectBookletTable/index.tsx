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
import { copiesMock } from "@/config/api/mock/projects"

import { ProjectListResponseDto } from "@/openapi/api"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"

interface ProjectBookletTableProps {
  project: ProjectListResponseDto
}

const ProjectBookletTable = (props: ProjectBookletTableProps) => {
  const router = useRouter()
  const [deleteBooklet, setDeleteBooklet] = useState<{
    id: number
    media: string
    year: number
    month: number
    plate: string
  }>(undefined)
  const rows = [...props.project.booklets].sort((a, b) => {
    const indexA = copiesMock.findIndex(
      (item) => item.value === a.masterEditionCode.name,
    )
    const indexB = copiesMock.findIndex(
      (item) => item.value === b.masterEditionCode.name,
    )
    return indexA >= 0 && indexB >= 0 ? indexA - indexB : 0
  })
  return (
    <div>
      <MuiTableContainer component={MuiPaper}>
        <MuiTable>
          <MuiTableHead sx={{ backgroundColor: "#CCE5FF" }}>
            <MuiTableRow>
              <MuiTableCell align='center' sx={{ minWidth: 279 }}>
                版名
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ minWidth: 279 }}>
                媒体
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ minWidth: 279 }}>
                操作
              </MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {rows.map((row) => (
              <MuiTableRow key={row.id}>
                <MuiTableCell align='center'>
                  <div className='font-medium'>
                    {row.masterEditionCode.name}
                  </div>
                </MuiTableCell>
                <MuiTableCell align='center'>
                  <div className='font-medium'>
                    {props.project.mediaType.name}
                  </div>
                </MuiTableCell>
                <MuiTableCell>
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
                    <RenderWithRoles
                      roles={[RolesMock.admin, RolesMock.operator]}
                    >
                      <div className='mx-[10px]'>
                        <BaseButtonIconText
                          icon='delete'
                          text='削除'
                          size='small'
                          onClick={() =>
                            setDeleteBooklet({
                              id: row.id,
                              media: props.project.mediaType.name,
                              year: props.project.issueYear,
                              month: props.project.issueMonth,
                              plate: row.masterEditionCode.name,
                            })
                          }
                        />
                      </div>
                    </RenderWithRoles>
                  </div>
                </MuiTableCell>
              </MuiTableRow>
            ))}
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
          onClose={() => setDeleteBooklet(undefined)}
        />
      )}
    </div>
  )
}

export default ProjectBookletTable
