import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import MuiDivider from "@mui/material/Divider"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ImportFooterListItem from "@/components/page/import/footer/ImportFooterListItem"
import ImportFooterForm from "@/components/page/import/footer/ImportFooterForm"
import { useApiClient } from "@/hooks/useApiClient"
import { EditionUpperCaseEnum } from "@/config/enum"

const ImportFooterDetailPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<{
    id: number
    name: string
    media: string[]
    plate: Array<{
      value: string
      files: Array<{ id: number; code: number; thumbImageUrl: string }>
    }>
  }>({
    id: 0,
    name: "",
    media: [],
    plate: [],
  })

  useEffect(() => {
    ;(async () => {
      const params = {
        id,
      }
      try {
        if (!id) return
        const { data } =
          await apiClient.marginBottomApi.pageMountControllerGetPageMountById(
            Number(params.id),
          )
        const plates = data.pageMountByEditionCodes.map(
          (pageMountByEditionCode) => ({
            value: pageMountByEditionCode.editionCode,
            files: pageMountByEditionCode.pageMountImages.map((image) => ({
              id: image.id,
              code: image.code,
              thumbImageUrl: image.imageConvert,
            })),
          }),
        )
        setItem({
          id: data.id,
          name: data.name,
          media: data.pageMountMediaTypes.map(
            (pageMountMediaType) => pageMountMediaType.mediaTypeCode,
          ),
          plate: plates,
        })
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/footer'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                欄外下画像リストに戻る
              </div>
            </MuiLink>
          </Link>
          {item && (
            <>
              <div className='mt-4 flex items-start justify-between'>
                <h1 className='text-xl font-bold text-content-default-primary'>
                  欄外下画像　詳細
                </h1>
                <BaseButtonIconText
                  icon='edit_note'
                  text='編集'
                  onClick={() =>
                    router.push({
                      pathname: "/import/footer/edit/[id]",
                      query: { id },
                    })
                  }
                />
              </div>
              <div className='mt-[72px]'>
                <ImportFooterForm item={item} />
              </div>
              {item.plate.length > 0 && (
                <>
                  <h2 className='mt-20 text-xl font-bold text-content-default-primary'>
                    版
                  </h2>
                  <div className='mt-8 space-y-11'>
                    {item.plate.map((plate) => (
                      <div key={plate.value} className='mx-[35px]'>
                        <MuiDivider textAlign='left'>
                          <div className='text-sm'>
                            {EditionUpperCaseEnum[plate.value]}
                          </div>
                        </MuiDivider>
                        <div className='mt-8'>
                          {plate.files.map((file, i) => (
                            <div key={file.id} className='mr-3 last:mr-0'>
                              <ImportFooterListItem
                                id={file.id}
                                name={file.code.toString()}
                                thumbImageUrl={file.thumbImageUrl}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default ImportFooterDetailPage
