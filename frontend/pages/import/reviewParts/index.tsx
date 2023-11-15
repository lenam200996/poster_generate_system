import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import MuiButton from "@mui/material/Button"
import AuthLayout from "@/components/layout/Auth"
import BaseSortSelectbox from "@/components/base/form/BaseSortSelectbox"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ImportSearchForm from "@/components/page/import/ImportSearchForm"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import { mockImportOrders } from "@/config/api/mock/import"
import ReviewPartsDeleteModal from "@/components/page/import/reviewParts/ReviewPartsDeleteModal"
import dayjs from "@/util/dayjs"
import { useApiClient } from "@/hooks/useApiClient"
import { DocumentEvaluationWithCountDto } from "@/openapi/api"
import { MediaTypeEnum } from "@/config/enum"
import MuiCircularProgress from "@mui/material/CircularProgress"

const theme = createTheme(tableRowTheme)

const PartsPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [items, setItems] = useState<DocumentEvaluationWithCountDto["data"]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [sort, setSort] = useState("")
  const [deleteItem, setDeleteItem] = useState<
    | {
        id: number
        name: string
      }
    | undefined
  >(undefined)

  const keyword = useMemo(
    () => String(router.query.keyword ?? ""),
    [router.query.keyword],
  )

  const handleOnCloseDeleteModal = async () => {
    setItems((state) => [...state.filter((x) => x.id !== deleteItem.id)])
    setDeleteItem(undefined)
  }

  useEffect(() => {
    let array = []
    if (sort !== "") {
      if (sort === "created") {
        array = [...items].sort((a, b) => {
          const createdA = dayjs(a.createdAt)
          const createdB = dayjs(b.createdAt)
          return createdA < createdB ? 1 : createdA > createdB ? -1 : 0
        })
      } else if (sort === "updated") {
        array = [...items].sort((a, b) => {
          const updatedA = dayjs(a.modifiedAt)
          const updatedB = dayjs(b.modifiedAt)
          return updatedA < updatedB ? 1 : updatedA > updatedB ? -1 : 0
        })
      }
    }

    setItems(array)
  }, [sort]) // eslint-disable-line

  const handleOnSearch = (keyword: string) => {
    router.replace({ query: { keyword } })
  }

  const handleOnClear = () => {
    router.replace(router.pathname)
  }

  const getDocumentEvaluationList = async () => {
    try {
      setApiLoading(true)
      const params = {
        take: undefined,
        skip: undefined,
        keyword,
      }
      const response =
        await apiClient.documentEvaluationsApi.documentEvaluationControllerList(
          params.take,
          params.skip,
          params.keyword,
        )
      setItems(response.data.data)
    } catch (error: any) {
      console.log("error: ", error)
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    getDocumentEvaluationList()
  }, [keyword]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-5 mt-4 w-full px-10'>
          <div className='flex items-end justify-between'>
            <h1 className='mb-1 text-xl font-bold text-content-default-primary'>
              評価パーツ
            </h1>
            <div className='mb-2'>
              <MuiButton
                variant='contained'
                onClick={() => router.push("/import/reviewParts/new")}
              >
                新規評価パーツ登録
              </MuiButton>
            </div>
          </div>
          <hr className='h-[1px] border-0 bg-divider-accent-secondary' />
          <div className='mt-4'>
            <ImportSearchForm
              keyword={keyword}
              placeholder='あて原稿0000'
              onSearch={handleOnSearch}
              onClear={handleOnClear}
            />
          </div>
          {!apiLoading && items.length > 0 && (
            <div className='mt-8'>
              <BaseSortSelectbox
                defaultValue='並び替え'
                options={mockImportOrders}
                selectedValue={sort}
                onChange={(value) => setSort(value)}
              />
            </div>
          )}
        </div>

        {!apiLoading && !items.length && keyword && (
          <div className='mt-10 text-center text-sm font-bold text-content-default-primary'>
            検索結果がありません
          </div>
        )}

        {apiLoading && (
          <div className='flex h-full items-center justify-center'>
            <MuiCircularProgress />
          </div>
        )}

        {!apiLoading && items.length > 0 && (
          <div className='flex-1 overflow-y-auto px-10 pb-10 pt-4'>
            <div className='flex flex-wrap items-start justify-center'>
              <MuiTableContainer component={MuiPaper}>
                <MuiTable>
                  <MuiTableHead sx={{ backgroundColor: "#F2F5FF" }}>
                    <MuiTableRow>
                      <MuiTableCell align='center'>
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          評価パーツコード
                        </div>
                      </MuiTableCell>
                      <MuiTableCell align='center'>
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          評価パーツ名称
                        </div>
                      </MuiTableCell>
                      <MuiTableCell align='center'>
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          媒体
                        </div>
                      </MuiTableCell>
                      <MuiTableCell align='center'>
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          操作
                        </div>
                      </MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    <ThemeProvider theme={theme}>
                      {items.map((item) => (
                        <MuiTableRow key={item.id}>
                          <MuiTableCell align='center' padding='none'>
                            <div className='px-4 py-2 font-medium'>
                              {item.code}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='px-4 py-2 font-medium'>
                              {item.name}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='px-4 py-2 font-medium'>
                              {item.mediaTypes
                                .map(
                                  (mediaType) =>
                                    MediaTypeEnum[mediaType.mediaTypeCode],
                                )
                                .join("、")}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='space-x-5 px-4 py-2'>
                              <BaseButtonIconText
                                icon='loupe'
                                text='詳細'
                                onClick={() =>
                                  router.push({
                                    pathname: "/import/reviewParts/detail/[id]",
                                    query: { id: item.id },
                                  })
                                }
                              />
                              <BaseButtonIconText
                                icon='edit_note'
                                text='編集'
                                onClick={() =>
                                  router.push({
                                    pathname: "/import/reviewParts/edit/[id]",
                                    query: { id: item.id },
                                  })
                                }
                              />
                              <BaseButtonIconText
                                icon='delete'
                                text='削除'
                                onClick={() =>
                                  setDeleteItem({
                                    id: item.id,
                                    name: item.name,
                                  })
                                }
                              />
                            </div>
                          </MuiTableCell>
                        </MuiTableRow>
                      ))}
                    </ThemeProvider>
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
            </div>
          </div>
        )}
      </div>
      {deleteItem && (
        <ReviewPartsDeleteModal
          id={deleteItem.id}
          name={deleteItem.name}
          onClose={handleOnCloseDeleteModal}
        />
      )}
    </AuthLayout>
  )
}

export default PartsPage
