import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import { DocumentResponseDto } from "@/openapi"
import WorkspaceModalRemoveAlias from "@/components/page/workspace/Modal/WorkspaceModalRemoveAlias"
import { useState } from "react"

type Props = {
  alias: DocumentResponseDto[]
  onDelete: () => void
}

const MyStockTableAlias = (props: Props) => {
  const [document, setDocument] = useState<DocumentResponseDto>(undefined)
  if (props.alias.length === 0) return <></>
  return (
    <>
      <MuiTableContainer component={MuiPaper} sx={{ width: 320 }}>
        <MuiTable>
          <MuiTableHead sx={{ backgroundColor: "#F2F5FF" }}>
            <MuiTableRow>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 80 }}>
                原稿ID
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 80 }}>
                版
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 140 }}>
                操作
              </MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {props.alias.map((e, index) => (
              <MuiTableRow
                key={e.id}
                sx={{ backgroundColor: index % 2 ? "#fbfbfb" : "#fff" }}
              >
                <MuiTableCell
                  align='center'
                  size='small'
                  sx={{
                    paddingX: "8px",
                    wordBreak: "break-word",
                    fontSize: 12,
                  }}
                >
                  <p className='text-blue-50 underline'>{e.documentCode}</p>
                </MuiTableCell>
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500, paddingX: 0 }}
                >
                  {e.booklet.masterEditionCode.name}版
                </MuiTableCell>
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  <BaseButtonIconText
                    icon='share'
                    text='相乗り解除'
                    onClick={() => {
                      setDocument(e)
                    }}
                  />
                </MuiTableCell>
              </MuiTableRow>
            ))}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
      {document && (
        <WorkspaceModalRemoveAlias
          document={document}
          onClose={() => {
            setDocument(null)
          }}
          onExact={props.onDelete}
        />
      )}
    </>
  )
}

export default MyStockTableAlias
