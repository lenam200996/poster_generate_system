import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import StampForm from "@/components/page/import/stamp/StampForm"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"

const StampDetailPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<{
    id?: number
    code: number
    name: string
    media: string[]
    remarks: string
    imageEps?: { file?: File; path: string; name: string }
    imageConvert?: { file: File; path: string }
    category: string
  }>({
    id: 1,
    code: 1,
    name: "",
    media: [],
    remarks: "",
    imageEps: undefined,
    imageConvert: undefined,
    category: "PRIDE",
  })

  useEffect(() => {
    ;(async () => {
      try {
        if (!id) return
        const params = {
          id: Number(id),
        }
        const { data } =
          await apiClient.documentBoastStampsApi.documentBoastStampControllerGetDocumentBoastStamp(
            params.id,
          )
        const itemData = {
          id: data.id,
          code: data.code,
          name: data.name,
          media: data.mediaTypes.map((mediaType) => mediaType.mediaTypeCode),
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
          category: data.attribute.code,
        }
        setItem(itemData)
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  const [shownPreview, setShownPreview] = useState(false)

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='overflow-y-auto px-10 pt-6 pb-10'>
          <div className='my-6 w-full px-10'>
            <Link href='/import/stamp'>
              <MuiLink component='span' underline='none'>
                <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                  <ArrowBack
                    sx={{ width: 18, height: 18, marginLeft: "-3px" }}
                  />
                  自慢スタンプリストに戻る
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
                      pathname: "/import/stamp/edit/[id]",
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
                    onClick={() => setShownPreview(true)}
                  />
                  <div className='mt-8 h-[341px] w-[461px]'>
                    <img
                      className='h-full w-full object-contain'
                      src={item.imageConvert && item.imageConvert.path}
                      alt={item.name}
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <StampForm item={item} />
                </div>
              </div>
              <BaseModalPreview
                shown={shownPreview}
                imageUrl={item.imageConvert && item.imageConvert.path}
                onClose={() => setShownPreview(false)}
              />
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default StampDetailPage
