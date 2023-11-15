import { useState, useEffect, useMemo } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import PartsForm from "@/components/page/import/parts/PartsForm"
import { Parts } from "@/types/page/import/parts"
import PartsDeleteModal from "@/components/page/import/parts/PartsDeleteModal"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import ImportPreviewModal from "@/components/page/import/ImportPreviewModal"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { IMAGES_DATA_FORMAT } from "@/config/dataFormat"

const ImportPartsEditPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<Parts>(undefined)
  const [originalItem, setOriginalItem] = useState(undefined)
  const [shownPreview, setShownPreview] = useState(false)
  const [shownDelete, setShownDelete] = useState(false)
  const [error, setError] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)

  const DATA_FORMAT = IMAGES_DATA_FORMAT
  const EXTENSIONS = DATA_FORMAT.map((ext) => `.${ext}`)

  const schema = z.object({
    formatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.THUMBNAIL_FORMAT_ERROR,
      ),
  })

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
        setOriginalItem(itemData)
      } catch (error: any) {
        console.error("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  const handleOnClickDeleteThumbnail = () => {
    setItem((state) => ({
      ...state,
      thumbImage: undefined,
    }))
  }
  const handleOnChangeThumbnail = (file: File) => {
    setError(null)
    const result: SafeParseReturnType<{ formatError: string }, any> =
      schema.safeParse({ formatError: file.name })
    if (!result.success) {
      setError((result as SafeParseError<string>).error.flatten().fieldErrors)
      return
    }
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
        thumbImage: {
          file,
          name: fileData.fileName,
          path: fileData.base64,
        },
      }))
    }
  }

  const handleOnChange = (
    name: string,
    value: string | string[] | { file: File; name: string; path: string },
  ) => {
    setItem((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleOnClickSave = async () => {
    try {
      setApiLoading(true)
      const params = {
        documentPartsClass: item.category,
        documentPartsCategoryId: Number(item.columnCategory),
        documentSizeCode: item.documentSize,
        id: item.id,
        imageThumbnail: item.thumbImage.file,
        inDesignFile: item.inDesign.file,
        comment: item.detail,
        freeWord: item.remarks,
        canUse: item.availability,
        mediaTypes: item.mediaTypes,
        documentPartsCategories: [item.category],
        name: item.name,
      }
      await apiClient.documentPartsApi.documentPartsControllerUpdateDocumentParts(
        params.documentPartsClass,
        params.documentPartsCategoryId,
        params.documentSizeCode,
        params.id,
        params.imageThumbnail,
        params.inDesignFile,
        params.comment,
        params.freeWord,
        params.canUse,
        params.mediaTypes,
        params.name,
      )
      router.push(`/import/parts/detail/${id}`)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const isSaveDisabled = useMemo(() => {
    if (
      item === undefined ||
      item.name === "" ||
      item.documentSize === "" ||
      !item.mediaTypes.length ||
      !item.category ||
      !item.columnCategory ||
      item.detail === "" ||
      !item.inDesign ||
      !item.thumbImage
    ) {
      return true
    }

    return JSON.stringify(item) === JSON.stringify(originalItem)
  }, [item, originalItem])

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary pb-[120px]'>
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
                {originalItem.name}
                <span className='ml-4'>編集</span>
              </h1>
              <div className='flex items-center'>
                <BaseButtonIconText
                  icon='loupe'
                  text='詳細'
                  onClick={() =>
                    router.push({
                      pathname: "/import/parts/detail/[id]",
                      query: { id: item.id },
                    })
                  }
                />
                <div className='ml-3'>
                  <BaseButtonIconText
                    icon='edit_note'
                    text='削除'
                    onClick={() => setShownDelete(true)}
                  />
                </div>
              </div>
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
                      <BaseFileUploader
                        text='サムネイル画像を選択'
                        extension={EXTENSIONS}
                        onChange={(event) =>
                          handleOnChangeThumbnail(event.files[0])
                        }
                        error={!!error?.formatError}
                        errorText={errorMessage.THUMBNAIL_FORMAT_ERROR}
                      />
                    </div>
                  )}
                  {item.thumbImage && (
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
                <PartsForm item={item} onChange={handleOnChange} />
              </div>
            </div>
          </div>
        )}
        <div className='absolute bottom-0 left-0 right-0 flex h-16 items-center justify-end bg-white-0 px-10'>
          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClickSave}
            disabled={isSaveDisabled}
            loading={apiLoading}
          >
            保存
          </MuiLoadingButton>
        </div>
      </div>
      {shownPreview && (
        <ImportPreviewModal
          width='1280px'
          height='700px'
          url={item.thumbImage.path}
          onClose={() => setShownPreview(false)}
        />
      )}
      {shownDelete && (
        <PartsDeleteModal
          id={originalItem.id}
          name={originalItem.name}
          onClose={() => {
            setShownDelete(false), router.push("/import/parts")
          }}
        />
      )}
    </AuthLayout>
  )
}

export default ImportPartsEditPage
