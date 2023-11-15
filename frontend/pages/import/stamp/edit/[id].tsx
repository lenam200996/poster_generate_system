import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import StampForm from "@/components/page/import/stamp/StampForm"
import StampDeleteModal from "@/components/page/import/stamp/StampDeleteModal"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { postConverts } from "@/api/imageConvert"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { EPS_DATA_FORMAT } from "@/config/dataFormat"

const StampEditPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [originalItem, setOriginalItem] = useState<{
    id: number
    code: number
    name: string
    media: string[]
    remarks: string
    imageConvert?: { file: File; path: string }
    imageEps?: { file?: File; path: string; name: string }
    category: string
  }>(undefined)
  const [item, setItem] = useState<{
    id: number
    code: number
    name: string
    media: string[]
    remarks: string
    imageConvert?: { file: File; path: string }
    imageEps?: { file?: File; path: string; name: string }
    category: string
  }>({
    id: 1,
    code: 1,
    name: "",
    media: [],
    category: "",
    remarks: "",
    imageEps: undefined,
    imageConvert: undefined,
  })
  const [shown, setShown] = useState(false)
  const [error, setError] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [upLoading, setUploading] = useState(false)

  const DATA_FORMAT = EPS_DATA_FORMAT
  const EXTENSIONS = DATA_FORMAT.map((ext) => `.${ext}`)

  const schema = z.object({
    formatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.EPS_FORMAT_ERROR,
      ),
  })

  useEffect(() => {
    ;(async () => {
      const params = {
        id,
      }
      try {
        if (!id) return
        const { data } =
          await apiClient.documentBoastStampsApi.documentBoastStampControllerGetDocumentBoastStamp(
            Number(params.id),
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
          category: data.attributeCode, // Please Change the API type from object to string
        }
        // @ts-ignore
        setItem(itemData)
        // @ts-ignore
        setOriginalItem(itemData)
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  const handleOnChange = (name: string, value: string | string[] | File) => {
    if (name === "image" && value) {
      const file = value as unknown as File
      setError(null)
      const result: SafeParseReturnType<{ formatError: string }, any> =
        schema.safeParse({ formatError: file.name })
      if (!result.success) {
        setError((result as SafeParseError<string>).error.flatten().fieldErrors)
        return
      }
      const formattedFile = new File([file], encodeURI(file.name), {
        type: file.type,
      })
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
          ["image"]: {
            file: formattedFile,
            path: fileData.base64,
            name: fileData.fileName,
          },
        }))
      }
    }
    setItem((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleOnClickSave = async () => {
    try {
      setApiLoading(true)
      const params = {
        id: item.id,
        image: item.imageEps.file,
        name: item.name,
        imageConvert: item.imageConvert.file,
        comment: item.remarks,
        attribute: item.category,
        mediaTypes: item.media,
      }
      await apiClient.documentBoastStampsApi.documentBoastStampControllerUpdateDocumentBoastStamp(
        params.id,
        params.image,
        params.imageConvert,
        params.name,
        params.comment,
        params.attribute,
        params.mediaTypes,
      )
      router.push(`/import/stamp/detail/${id}`)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const handleOnChangeFile = async ({
    files,
    name,
  }: {
    files: File[]
    name: string
  }) => {
    try {
      const file = files[0]
      const targetName = name
      setUploading(true)
      const image = await postConverts(file)
      setItem((state) => ({
        ...state,
        [targetName]: {
          file,
          path: image,
          name: file.name,
        },
      }))

      // base64をFileオブジェクトに変換する
      const bin = atob(image.replace(/^.*,/, ""))
      const buffer = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      const imageFile = new File([buffer.buffer], file.name.split(".")[0])
      setItem((state) => ({
        ...state,
        ["imageConvert"]: {
          file: imageFile,
          path: image,
        },
      }))
      setUploading(false)
    } catch (error) {}
  }

  const handleOnClickDeleteThumbnail = () => {
    setItem((state) => ({
      ...state,
      imageEps: undefined,
    }))
  }

  const isSaveDisabled = useMemo(() => {
    if (
      item === undefined ||
      item.name === "" ||
      item.media.length === 0 ||
      !item.imageEps
    ) {
      return true
    }

    if (
      Object.keys(item).find((key) =>
        key === "media"
          ? item[key].length !== originalItem[key].length ||
            item[key].find((value) => !originalItem[key].includes(value)) !==
              undefined
          : item[key] !== originalItem[key],
      ) === undefined
    ) {
      return true
    }

    return false
  }, [item, originalItem])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 overflow-y-auto px-10 pt-6 pb-10'>
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
            {originalItem && (
              <div className='mt-4 flex items-start justify-between'>
                <h1 className='text-xl font-bold text-content-default-primary'>
                  {originalItem.name}
                  <span className='ml-4'>編集</span>
                </h1>
                <div className='space-x-3'>
                  <BaseButtonIconText
                    icon='loupe'
                    text='詳細'
                    onClick={() =>
                      router.push({
                        pathname: "/import/stamp/detail/[id]",
                        query: { id },
                      })
                    }
                  />
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => setShown(true)}
                  />
                </div>
              </div>
            )}
          </div>
          {item && (
            <>
              <div className='mb-10 flex items-start bg-white-0 px-10 pt-8 pb-11'>
                <div className='sticky top-11 mt-3 w-[502px]'>
                  {item.imageEps ? (
                    <>
                      <div className='h-[341px] w-[461px]'>
                        <img
                          className='h-full w-full object-contain'
                          src={item.imageConvert.path}
                          alt={item.name}
                        />
                      </div>
                      <div className='mt-11 text-center'>
                        <BaseButtonIconText
                          icon='delete'
                          text='削除'
                          onClick={handleOnClickDeleteThumbnail}
                        />
                      </div>
                    </>
                  ) : (
                    <div className='h-[302px] w-[421px]'>
                      <BaseFileUploader
                        name='imageEps'
                        extension={EXTENSIONS}
                        upLoading={upLoading}
                        text='EPS画像を選択'
                        onChange={handleOnChangeFile}
                        error={!!error?.formatError}
                        errorText={errorMessage.EPS_FORMAT_ERROR}
                      />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <StampForm item={item} onChange={handleOnChange} />
                </div>
              </div>
              <div className='absolute bottom-0 left-0 right-0 flex h-16 items-center justify-end bg-white-0 px-10'>
                <MuiLoadingButton
                  variant='contained'
                  sx={{ width: 104 }}
                  disabled={isSaveDisabled}
                  loading={apiLoading}
                  onClick={handleOnClickSave}
                >
                  保存
                </MuiLoadingButton>
              </div>
            </>
          )}
        </div>
      </div>
      {shown && (
        <StampDeleteModal
          id={originalItem.id}
          name={originalItem.name}
          onClose={() => setShown(false)}
          onComplete={() => router.push("/import/stamp")}
        />
      )}
    </AuthLayout>
  )
}

export default StampEditPage
