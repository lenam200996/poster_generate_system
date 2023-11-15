import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import PartsForm from "@/components/page/import/parts/PartsForm"
import { Parts } from "@/types/page/import/parts"
import ImportFileUpload from "@/components/page/import/ImportFileUpload"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import ImportPreviewModal from "@/components/page/import/ImportPreviewModal"

const ImportPartsDetailPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<Parts>(undefined)
  const [shownPreview, setShownPreview] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        if (!id) return
        const params = {
          id: Number(id),
        }
        const { data } =
          await apiClient.documentPartsApi.documentPartsControllerGetDocumentParts(
            params.id,
          )
        const itemData: Parts = {
          id: data.id,
          name: data.name,
          documentSize: data.documentSize["code"],
          mediaTypes: data.mediaTypes.map(
            (mediaType) => mediaType.mediaTypeCode,
          ),
          category: data.documentPartsClass,
          columnCategory: String(data.documentPartsCategoryId),
          remarks: data.freeWord,
          detail: data.comment,
          thumbImage: {
            file: undefined,
            name: generateFileNameFromPath(data.imageThumbnail),
            path: data.imageThumbnail,
          },
          inDesign: {
            file: undefined,
            name: generateFileNameFromPath(data.inDesignFile),
            path: data.inDesignFile,
          },
          availability: data.canUse,
        }
        setItem(itemData)
      } catch (error: any) {
        console.error("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  const handleOnClickDeleteThumbnail = () => {
    setItem((state) => ({
      ...state,
      thumbImageUrl: undefined,
    }))
  }
  const handleOnChangeThumbnail = (file: File) => {
    let fileData: { file: File; fileName: string; type: any; base64: any } =
      null
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      fileData = {
        file: file,
        fileName: file.name,
        type: file.type,
        base64: event.target.result,
      }
      setItem((state) => ({
        ...state,
        thumbImageUrl: fileData.base64,
      }))
    }
  }

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='my-6 w-full px-10'>
          <Link href='/import/parts'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                パーツリストに戻る
              </div>
            </MuiLink>
          </Link>
          {item && (
            <div className='mt-4 mr-1 flex items-center justify-between'>
              <h1 className='mb-1 text-xl font-bold text-content-default-primary'>
                {item.name}
                <span className='ml-4'>詳細</span>
              </h1>
              <BaseButtonIconText
                icon='edit_note'
                text='編集'
                onClick={() =>
                  router.push({
                    pathname: "/import/parts/edit/[id]",
                    query: { id: item.id },
                  })
                }
              />
            </div>
          )}
        </div>

        {item && (
          <div className='relative flex-1 overflow-y-auto'>
            <div className='flex items-start bg-white-0 px-10 pb-14 pt-11'>
              <div className='sticky top-11 w-[470px]'>
                <div>
                  {item.thumbImage && (
                    <BaseButtonIconText
                      icon='loupe'
                      text='ズーム'
                      onClick={() => setShownPreview(true)}
                    />
                  )}
                  {item.thumbImage ? (
                    <div className='flex h-[405px] w-full items-center justify-center px-5 py-10'>
                      <img
                        className='h-full w-full object-contain'
                        src={item.thumbImage.path}
                        alt=''
                      />
                    </div>
                  ) : (
                    <div className='h-[302px] w-[421px]'>
                      <ImportFileUpload
                        onChange={(event) =>
                          handleOnChangeThumbnail(event.target.files[0])
                        }
                        text='サムネイル画像を選択'
                      />
                    </div>
                  )}
                  {item.thumbImage.file && (
                    <div className='flex justify-center'>
                      <BaseButtonIconText
                        icon='delete'
                        text='削除'
                        onClick={handleOnClickDeleteThumbnail}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='ml-[42px] flex-1'>
                <PartsForm item={item} />
              </div>
            </div>
          </div>
        )}
      </div>
      {shownPreview && (
        <ImportPreviewModal
          width='1280px'
          height='700px'
          url={item.thumbImage.path}
          onClose={() => setShownPreview(false)}
        />
      )}
    </AuthLayout>
  )
}

export default ImportPartsDetailPage
