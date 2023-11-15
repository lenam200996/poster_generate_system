import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import MuiButton from "@mui/material/Button"
import AuthLayout from "@/components/layout/Auth"
import BaseSortSelectbox from "@/components/base/form/BaseSortSelectbox"
import SmallAssemblyListItem from "@/components/page/import/smallAssembly/SmallAssemblyListItem"
import SmallAssemblyDeleteModal from "@/components/page/import/smallAssembly/SmallAssemblyDeleteModal"
import { mockImportOrders } from "@/config/api/mock/import"
import ImportSearchForm from "@/components/page/import/ImportSearchForm"
import dayjs from "@/util/dayjs"
import { useApiClient } from "@/hooks/useApiClient"
import { DocumentFillerWithCountDto } from "@/openapi/api"
import MuiCircularProgress from "@mui/material/CircularProgress"

const SmallAssemblyPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [items, setItems] = useState<DocumentFillerWithCountDto["data"]>([])
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

  const getDocumentFillerList = async () => {
    try {
      setApiLoading(true)
      const params = {
        take: undefined,
        skip: undefined,
        keyword,
      }
      const response =
        await apiClient.documentFillersApi.documentFillerControllerList(
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

  const handleOnCloseDeleteModal = () => {
    setItems((state) => [...state.filter((x) => x.id !== deleteItem.id)])
    setDeleteItem(undefined)
  }

  useEffect(() => {
    if (!router.isReady) return
    getDocumentFillerList()
  }, [keyword]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-5 mt-4 w-full px-10'>
          <div className='flex items-end justify-between'>
            <h1 className='mb-1 text-xl font-bold text-content-default-primary'>
              うめ草リスト
            </h1>
            <div className='mb-2'>
              <MuiButton
                variant='contained'
                onClick={() => router.push("/import/small-assembly/new")}
              >
                新規うめ草登録
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
          <div className='flex-1 overflow-y-auto px-10 pb-10 pt-8'>
            <div className='flex flex-wrap'>
              {items.map((item) => (
                <div key={item.id} className='mr-4 mb-5'>
                  <SmallAssemblyListItem
                    id={item.id}
                    name={item.name}
                    thumbImageUrl={item.imageConvert}
                    onDelete={() =>
                      setDeleteItem({ id: item.id, name: item.name })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {deleteItem && (
        <SmallAssemblyDeleteModal
          id={deleteItem.id}
          name={deleteItem.name}
          onClose={handleOnCloseDeleteModal}
        />
      )}
    </AuthLayout>
  )
}

export default SmallAssemblyPage
