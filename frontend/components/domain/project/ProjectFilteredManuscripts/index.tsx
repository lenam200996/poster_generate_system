import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import dayjs from "@/util/dayjs"
import ProjectManuscriptPreviewModal from "../ProjectManuscriptPreviewModal"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import { DocumentSearchWithCountDto } from "@/openapi/api"
import Link from "next/link"

const theme = createTheme(tableRowTheme)

//-------------------------------------------------------------------------
/**
 * フィルタ検索結果による複数の原稿情報
 */
//-------------------------------------------------------------------------
interface Props {
  manuscripts: DocumentSearchWithCountDto["data"]
}

//-------------------------------------------------------------------------
/**
 * プロジェクトリストのフィルタ検索による一覧表示
 * @param props
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const ProjectFilteredManuscripts = (props: Props) => {
  return (
    <MuiTableContainer component={MuiPaper}>
      <MuiTable>
        {/*----------------------
              一覧のヘッダー
         -----------------------*/}
        <MuiTableHead sx={{ backgroundColor: "#F2F5FF" }}>
          <MuiTableRow>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 80 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                原稿ID
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 80 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                宿コード
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 236 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                宿名
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 110 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                媒体種別
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 120 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                版名
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 120 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                号
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 80 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                原稿サイズ
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 80 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                ステータス
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 140 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                営業担当
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 140 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                最終更新日
              </div>
            </MuiTableCell>
            <MuiTableCell align='center' padding='none' sx={{ minWidth: 140 }}>
              <div className='py-4 px-1 text-xs font-normal text-gray-100'>
                プレビュー
              </div>
            </MuiTableCell>
          </MuiTableRow>
        </MuiTableHead>
        {/*--------------------
              一覧の本体
         ---------------------*/}
        <MuiTableBody>
          <ThemeProvider theme={theme}>
            {/* フィルタ検索結果の原稿データだけ繰り返す */}
            {props.manuscripts.map((row) => (
              <MuiTableRow key={row.id}>
                {/* 原稿ID */}
                <MuiTableCell align='center' size='small' padding='none'>
                  <div className='px-2 py-1 text-xs font-medium'>
                    <Link
                      href={{
                        pathname: `/workspace/${row.booklet.id}`,
                        query: { viewMode: "split", documentId: row.id },
                      }}
                    >
                      <a className='break-all text-container-active-primary underline'>
                        {row.documentCode}
                      </a>
                    </Link>
                  </div>
                </MuiTableCell>
                {/* 宿コード */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-sm font-medium'>
                    {String(row.hotelCode).padStart(4, "0")}
                  </div>
                </MuiTableCell>
                {/* 宿名 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {row.documentContent?.hotelNameLarge}
                  </div>
                </MuiTableCell>
                {/* 媒体種別 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {row.project.mediaType.name}
                  </div>
                </MuiTableCell>
                {/* 版名 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {row.booklet.masterEditionCode.name}
                  </div>
                </MuiTableCell>
                {/* 号 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {dayjs(
                      `${row.project.issueYear}-${row.project.issueMonth}`,
                    ).format("YYYY年M月号")}
                  </div>
                </MuiTableCell>
                {/* 原稿サイズ */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {row.documentSize.name}
                  </div>
                </MuiTableCell>
                {/* ステータス */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>{row.status.name}</div>
                </MuiTableCell>
                {/* 営業担当 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {row.salesPerson && row.salesPerson.personName}
                  </div>
                </MuiTableCell>
                {/* 最終更新日 */}
                <MuiTableCell align='center' size='small'>
                  <div className='text-xs font-medium'>
                    {dayjs(row.modifiedAt).format("YYYY/M/D")}
                  </div>
                </MuiTableCell>
                {/* プレビュー */}
                <MuiTableCell align='center' size='small'>
                  <ProjectManuscriptPreviewModal href={undefined} />
                </MuiTableCell>
              </MuiTableRow>
            ))}
          </ThemeProvider>
        </MuiTableBody>
      </MuiTable>
    </MuiTableContainer>
  )
}

export default ProjectFilteredManuscripts
