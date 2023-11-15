import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import StampForm from "@/components/page/import/stamp/StampForm"
import { useApiClient } from "@/hooks/useApiClient"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { postConverts } from "@/api/imageConvert"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { EPS_DATA_FORMAT } from "@/config/dataFormat"

const StampNewPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [upLoading, setUploading] = useState(false)
  const [item, setItem] = useState<{
    code: number
    name: string
    media: string[]
    remarks: string
    imageEps?: { file: File; path: string; name: string }
    imageConvert?: File
    category: string
  }>({
    code: 1,
    name: "",
    media: [],
    category: "",
    remarks: "",
    imageEps: undefined,
    imageConvert: undefined,
  })

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
            name: fileData.fileName,
            path: fileData.base64,
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
        name: item.name,
        image: item.imageEps.file,
        imageConvert: item.imageConvert,
        comment: item.remarks,
        attributeCode: item.category,
        mediaTypes: item.media,
      }
      await apiClient.documentBoastStampsApi.documentBoastStampControllerCreateDocumentBoastStamp(
        params.name,
        params.image,
        params.imageConvert,
        params.comment,
        params.attributeCode,
        params.mediaTypes,
      )
      router.push("/import/stamp")
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
        ["imageConvert"]: imageFile,
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
      item.name === "" ||
      item.media.length === 0 ||
      !item.imageEps ||
      !item.category
    ) {
      return true
    }
    return false
  }, [item])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/stamp'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                自慢スタンプリストに戻る
              </div>
            </MuiLink>
          </Link>
          <h1 className='mt-4 text-xl font-bold text-content-default-primary'>
            自慢スタンプ　新規登録
          </h1>

          <div className='flex items-start bg-white-0 px-10 pt-8 pb-11'>
            <div className='sticky top-11 mt-3 w-[502px]'>
              {item.imageEps ? (
                <div className='h-[341px] w-[461px]'>
                  <img
                    className='h-full w-full object-contain'
                    src={item.imageEps.path}
                    alt=''
                  />
                  <div className='mt-11 text-center'>
                    <BaseButtonIconText
                      icon='delete'
                      text='削除'
                      onClick={handleOnClickDeleteThumbnail}
                    />
                  </div>
                </div>
              ) : (
                <div className='h-[302px] w-[421px]'>
                  <BaseFileUploader
                    text='EPS画像を選択'
                    extension={EXTENSIONS}
                    upLoading={upLoading}
                    name='imageEps'
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
      </div>
    </AuthLayout>
  )
}

export default StampNewPage
