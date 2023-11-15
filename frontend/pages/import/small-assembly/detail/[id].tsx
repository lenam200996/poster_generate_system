import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import SmallAssemblyForm from "@/components/page/import/smallAssembly/SmallAssemblyForm"
import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"
import { useApiClient } from "@/hooks/useApiClient"
import { SmallAssembly } from "@/types/page/import/smallAssembly"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"

const SmallAssemblyDetailPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [shown, setShown] = useState(false)
  const { id } = router.query
  const [item, setItem] = useState<SmallAssembly>(undefined)

  useEffect(() => {
    ;(async () => {
      try {
        if (!id) return
        const params = {
          id: Number(id),
        }
        const { data } =
          await apiClient.documentFillersApi.documentFillerControllerDetail(
            params.id,
          )
        const itemData: SmallAssembly = {
          id: data.id,
          name: data.name,
          code: data.code,
          manuscriptSize: data.documentSize["code"],
          media: data.mediaTypes.map((mediaType) => mediaType.mediaTypeCode),
          contents: data.freeWord,
          remarks: data.comment,
          imageEps: {
            file: undefined,
            name: generateFileNameFromPath(data.image),
            path: data.image,
          },
          imageConvert: {
            file: undefined,
            path: data.imageConvert,
          },
        }
        setItem(itemData)
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='overflow-y-auto'>
          <div className='my-6 w-full px-10'>
            <Link href='/import/small-assembly'>
              <MuiLink component='span' underline='none'>
                <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                  <ArrowBack
                    sx={{ width: 18, height: 18, marginLeft: "-3px" }}
                  />
                  うめ草リストに戻る
                </div>
              </MuiLink>
            </Link>
            {item && (
              <div className='mt-4 flex items-start justify-between'>
                <h1 className='text-xl font-bold text-content-default-primary'>
                  {item.name}
                  <span className='ml-4'>詳細</span>
                </h1>
                <BaseButtonIconText
                  icon='edit_note'
                  text='編集'
                  onClick={() =>
                    router.push({
                      pathname: "/import/small-assembly/edit/[id]",
                      query: { id },
                    })
                  }
                />
              </div>
            )}
          </div>
          {item && (
            <>
              <div className='mb-10 flex items-start bg-white-0 px-10 py-11'>
                <div className='sticky top-11 w-[502px]'>
                  <BaseButtonIconText
                    icon='loupe'
                    text='ズーム'
                    onClick={() => setShown(true)}
                  />
                  <div className='mt-8 h-[341px] w-[461px]'>
                    <img
                      className='h-full w-full object-contain'
                      src={item.imageConvert.path}
                      alt={item.name}
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <SmallAssemblyForm item={item} />
                </div>
              </div>
              <BaseModalPreview
                shown={shown}
                imageUrl={item.imageConvert.path}
                onClose={() => setShown(false)}
              />
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default SmallAssemblyDetailPage
