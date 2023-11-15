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
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import ImportIndexHeaderDeleteModal from "@/components/page/import/indexHeader/ImportIndexHeaderDeleteModal"
import { mockImportOrders } from "@/config/api/mock/import"
import ImportSearchForm from "@/components/page/import/ImportSearchForm"
import dayjs from "@/util/dayjs"
import { useApiClient } from "@/hooks/useApiClient"
import { ThumbIndexWithCountResponse } from "@/openapi/api"
import MuiCircularProgress from "@mui/material/CircularProgress"

const theme = createTheme(tableRowTheme)

const PaperPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [items, setItems] = useState<ThumbIndexWithCountResponse["data"]>([])
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

  const getDocumentList = async () => {
    try {
      setApiLoading(true)
      const params = {
        take: undefined,
        skip: undefined,
        name: keyword,
      }
      const response = await apiClient.thumbIndexApi.thumbIndexControllerList(
        params.take,
        params.skip,
        params.name,
      )
      setItems(response.data.data)
    } catch (error: any) {
      console.log("error: ", error)
    } finally {
      setApiLoading(false)
    }
  }

  const handleOnCloseDeleteModal = () => {
    setItems((state) => [...state.filter((x) => x.id !== deleteItem.id)])
    setDeleteItem(undefined)
  }

  useEffect(() => {
    if (!router.isReady) return
    getDocumentList()
  }, [keyword]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-5 mt-4 px-10'>
          <div className='flex items-end justify-between'>
            <h1 className='mb-1 text-xl font-bold text-content-default-primary'>
              ツメ見出しリスト
            </h1>
            <div className='mb-2'>
              <MuiButton
                variant='contained'
                onClick={() => router.push("/import/indexHeader/new")}
              >
                新規ツメ見出し登録
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
          <div className='flex-1 overflow-y-auto px-10 pb-10 pt-6'>
            <MuiTableContainer component={MuiPaper}>
              <MuiTable>
                <MuiTableHead sx={{ backgroundColor: "#F2F5FF" }}>
                  <MuiTableRow>
                    <MuiTableCell align='center' width='50%'>
                      <div className='text-xs font-normal text-content-default-quaternary'>
                        ツメ見出し名称
                      </div>
                    </MuiTableCell>
                    <MuiTableCell align='center' width='50%'>
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
                            {item.name}
                          </div>
                        </MuiTableCell>
                        <MuiTableCell align='center' padding='none'>
                          <div className='space-x-5 px-4 py-2'>
                            <BaseButtonIconText
                              icon='loupe'
                              text='詳細'
                              onClick={() =>
                                router.push({
                                  pathname: "/import/indexHeader/detail/[id]",
                                  query: { id: item.id },
                                })
                              }
                            />
                            <BaseButtonIconText
                              icon='edit_note'
                              text='編集'
                              onClick={() =>
                                router.push({
                                  pathname: "/import/indexHeader/edit/[id]",
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
        )}
      </div>
      {deleteItem && (
        <ImportIndexHeaderDeleteModal
          id={deleteItem.id}
          name={deleteItem.name}
          onClose={handleOnCloseDeleteModal}
        />
      )}
    </AuthLayout>
  )
}

export default PaperPage
