import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import PartsForm from "@/components/page/import/parts/PartsForm"
import { Parts } from "@/types/page/import/parts"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import { useApiClient } from "@/hooks/useApiClient"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { IMAGES_DATA_FORMAT } from "@/config/dataFormat"

const ImportPartsNewPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [item, setItem] = useState<Parts>({
    name: "",
    documentSize: "",
    mediaTypes: [],
    category: "",
    columnCategory: "",
    detail: "",
    availability: false,
    remarks: "",
    thumbImage: undefined,
    inDesign: undefined,
  })

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

  const handleOnChange = (
    name: string,
    value: string | string[] | { file: File; name: string; path: string },
  ) => {
    setItem((state) => ({
      ...state,
      [name]: value,
    }))
  }

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
    let fileData: { fileName: string; base64: any } = null
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      fileData = {
        fileName: file.name,
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

  const handleOnClickSave = async () => {
    try {
      setApiLoading(true)
      const params = {
        documentPartsClass: String(item.category),
        documentPartsCategoryId: Number(item.columnCategory),
        documentSizeCode: item.documentSize,
        name: item.name,
        imageThumbnail: item.thumbImage.file,
        inDesignFile: item.inDesign.file,
        comment: item.detail,
        freeWord: item.remarks,
        canUse: item.availability,
        mediaTypes: item.mediaTypes,
        documentPartsCategories: [item.category],
        columnCategory: item.columnCategory,
      }
      await apiClient.documentPartsApi.documentPartsControllerCreateDocumentParts(
        params.documentPartsClass,
        params.documentPartsCategoryId,
        params.documentSizeCode,
        params.name,
        params.imageThumbnail,
        params.inDesignFile,
        params.comment,
        params.freeWord,
        params.canUse,
        params.mediaTypes,
        params.documentPartsCategories,
      )
      router.push("/import/parts")
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const isSaveDisabled = useMemo(() => {
    if (
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
    return false
  }, [item])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='my-6 w-full px-10'>
          <Link href='/import/parts'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                パーツリストに戻る
              </div>
            </MuiLink>
          </Link>
          <div className='mt-4'>
            <h1 className='mb-1 text-xl font-bold text-content-default-primary'>
              パーツ<span className='ml-4'>新規登録</span>
            </h1>
          </div>
        </div>

        <div className='relative flex-1 overflow-y-auto'>
          <div className='flex items-start bg-white-0 px-10 pb-14 pt-11'>
            <div className='sticky top-11 w-[470px]'>
              <div>
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
                {item.thumbImage && item.thumbImage.file && (
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
    </AuthLayout>
  )
}

export default ImportPartsNewPage
