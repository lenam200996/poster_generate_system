import { useState } from "react"
import { useRouter } from "next/router"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"
import { Manuscript, Project } from "@/config/api/mock/myStock"
import dayjs from "@/util/dayjs"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"
import { SearchDocumentMyStockDto } from "@/openapi"
import Link from "next/link"
import MyStock from "@/pages/myStock"

//-------------------------------------------------------------------------
/**
 * マイストックの一覧に表示している原稿情報
 */
//-------------------------------------------------------------------------
type Props = {
  project: SearchDocumentMyStockDto
}

//-------------------------------------------------------------------------
/**
 * マイストックの一覧の表示
 *
 * @param props 原稿情報
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const MyStorkListTableProject = (props: Props) => {
  const router = useRouter()
  const [shownPreview, setShownPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(null)
  const handleOnClickPreview = (imagePath: string) => {
    setPreviewUrl(imagePath)
    setShownPreview(true)
  }

  //-------------------------------------------------------------------------
  /**
   * 詳細ボタン押下時の処理
   * @param id
   */
  //-------------------------------------------------------------------------
  const handleOnClickDetail = (id: number) => {
    router.push(`/myStock/detail/${id}`)
  }

  //-------------------------------------------------------------------------
  /**
   * 編集ボタン押下時の処理
   *
   * @param documentId ドキュメントID
   * @param bookletId 原稿ID
   * @param pageId ページID
   */
  //-------------------------------------------------------------------------
  const handleOnClickEdit = (
    documentId: number,
    bookletId: number,
    pageId?: number,
  ) => {
    router.push({
      pathname: "/workspace/[id]",
      query: {
        id: bookletId,
        viewMode: pageId ? "split" : "splitTwo",
        documentId: documentId,
      },
    })
  }

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <>
      {/*
      -------------------------
                一覧
      -------------------------
      */}
      <MuiTableContainer component={MuiPaper}>
        <MuiTable sx={{ width: "100%" }}>
          {/*
          -------------------------
                一覧のヘッダー
          -------------------------
          */}
          <MuiTableHead sx={{ backgroundColor: "#F6F9FF" }}>
            <MuiTableRow>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 80 }}>
                原稿ID
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 120 }}>
                版
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 80 }}>
                宿コード
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, minWidth: 280 }}>
                宿名
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 80 }}>
                原稿サイズ
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 104 }}>
                プレビュー
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 194 }}>
                操作
              </MuiTableCell>
              <MuiTableCell align='center' sx={{ paddingX: 0, width: 140 }}>
                最終更新日
              </MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          {/*
          -------------------------
                一覧の本体
          -------------------------
          */}
          <MuiTableBody>
            {props.project.documentMyStocks.map((myStock, index) => (
              <MuiTableRow
                key={myStock.document.id}
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
                  <Link
                    href={{
                      pathname: `/workspace/${myStock.booklet.id}`,
                      //query: { viewMode: "split", documentId: myStock.id },
                      query: {
                        viewMode: "split",
                        documentId: myStock.document.id,
                      },
                    }}
                  >
                    <a className='break-all text-container-active-primary underline'>
                      {myStock.document.documentCode}
                    </a>
                  </Link>
                </MuiTableCell>
                {/*--- 版 ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {myStock.booklet.masterEditionCode.name}版
                </MuiTableCell>
                {/*--- 宿コード ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {String(myStock.document.hotelCode).padStart(4, "0")}
                </MuiTableCell>
                {/*--- 宿名 ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {myStock.document.documentContent.hotelNameLarge}
                </MuiTableCell>
                {/*--- 原稿サイズ ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {myStock.document.documentSize.name}
                </MuiTableCell>
                {/*--- プレビュー ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  <BaseButtonIconText
                    disabled={false}
                    icon='plagiarism'
                    text='表示'
                    /*onClick={() => handleOnClickPreview(myStock.document.id)}*/
                  />
                </MuiTableCell>
                {/*--- 操作 ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  <div className='flex justify-center'>
                    <RenderWithRoles
                      roles={[
                        RolesMock.admin,
                        RolesMock.operator,
                        RolesMock.manuscriptUpdator,
                        RolesMock.manuscriptOperator,
                        RolesMock.outsourcingManager,
                      ]}
                    >
                      {/*--- 操作：詳細ボタン ---*/}
                      <div className='mx-[10px]'>
                        <BaseButtonIconText
                          icon='loupe'
                          text='詳細'
                          onClick={() => handleOnClickDetail(myStock.id)}
                        />
                      </div>
                    </RenderWithRoles>
                    {/*--- 操作：編集ボタン ---*/}
                    <div className='mx-[10px]'>
                      <BaseButtonIconText
                        icon='edit_note'
                        text='編集'
                        onClick={() =>
                          handleOnClickEdit(
                            myStock.document.id,
                            myStock.booklet.id,
                            myStock.document.pageId,
                          )
                        }
                      />
                    </div>
                  </div>
                </MuiTableCell>
                {/*--- 最終更新日 ---*/}
                <MuiTableCell
                  size='small'
                  align='center'
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  {dayjs(myStock.document.modifiedAt).format(
                    "YYYY/MM/DD HH:MM",
                  )}
                </MuiTableCell>
              </MuiTableRow>
            ))}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
      {shownPreview && (
        <BaseModalPreview
          imageUrl={previewUrl}
          shown={shownPreview}
          onClose={() => setShownPreview(false)}
        />
      )}
    </>
  )
}

export default MyStorkListTableProject
