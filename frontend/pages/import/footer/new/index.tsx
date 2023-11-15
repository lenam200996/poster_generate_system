import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import MuiDivider from "@mui/material/Divider"
import { ArrowBack } from "@mui/icons-material"
import ImportFooterForm from "@/components/page/import/footer/ImportFooterForm"
import ImportFooterListItem from "@/components/page/import/footer/ImportFooterListItem"
import { generateMockFooterEpsFileID } from "@/config/api/mock/import/footer"
import { Footer } from "@/types/page/import/footer"
import filterCopies from "@/util/filterCopies"
import { useApiClient } from "@/hooks/useApiClient"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { postConverts } from "@/api/imageConvert"
import errorMessage from "@/config/errorMessage"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import MuiLoadingButton from "@mui/lab/LoadingButton"

const ImportFooterNewPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [item, setItem] = useState<
    Pick<Footer, "id" | "name" | "media" | "plate">
  >({
    id: 0,
    name: "",
    media: [],
    plate: [],
  })

  const DATA_FORMAT = ["eps", "EPS"]
  const EXTENSIONS = DATA_FORMAT.map((ext) => `.${ext}`)
  const schema = z.object({
    formatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.EPS_FORMAT_ERROR,
      ),
  })

  const handleOnChange = (name: string, value: string | string[]) => {
    setItem((state) => ({
      ...state,
      [name]: value,
    }))
  }

  const handleOnChangeFile = async ({
    files,
    value,
  }: {
    files: File[]
    value: string
  }) => {
    try {
      setItem((state) => ({
        ...state,
        plate: state.plate.map((plate) => {
          if (plate.value === value) {
            return {
              ...plate,
              upLoading: true,
              files: [...plate.files],
            }
          }
          return plate
        }),
      }))
      const file = files[0]
      setError(null)
      const result: SafeParseReturnType<{ formatError: string }, any> =
        schema.safeParse({ formatError: file.name })
      if (!result.success) {
        setError((result as SafeParseError<string>).error.flatten().fieldErrors)
        return
      }
      const image = await postConverts(file)
      // base64をFileオブジェクトに変換する
      const bin = atob(image.replace(/^.*,/, ""))
      const buffer = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      const imageFile = new File([buffer.buffer], file.name.split(".")[0])

      setItem((state) => ({
        ...state,
        plate: state.plate.map((plate) => {
          if (plate.value === value) {
            return {
              ...plate,
              upLoading: false,
              files: [
                ...plate.files,
                {
                  id: generateMockFooterEpsFileID(),
                  eps: {
                    file,
                    path: image,
                  },
                  convertImage: imageFile,
                },
              ],
            }
          }
          return plate
        }),
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnDeleteFile = (value: string, id: number) => {
    setItem((state) => ({
      ...state,
      plate: state.plate.map((plate) => {
        if (plate.value === value) {
          return {
            ...plate,
            files: plate.files.filter((file) => file.id !== id),
          }
        }
        return plate
      }),
    }))
  }

  const handleOnChangeFileCode = ({
    id,
    value,
  }: {
    id: number
    value: string
  }) => {
    setItem((state) => ({
      ...state,
      plate: state.plate.map((plate) => {
        return {
          ...plate,
          files: plate.files.map((file) => {
            if (file.id === id) {
              return {
                ...file,
                // code: value,
              }
            } else {
              return file
            }
          }),
        }
      }),
    }))
  }

  const handleOnClickSave = async () => {
    try {
      setApiLoading(true)
      const params = {
        name: item.name,
        pageMountMediaTypes: item.media,
        pageMountByEditionCodes: item.plate.flatMap((plate) => plate.value),
        imagePageMounts: item.plate.flatMap((plate) =>
          plate.files.flatMap((file) => file.eps.file),
        ),
        imageConverts: item.plate.flatMap((plate) =>
          plate.files.flatMap((file) => file.convertImage),
        ),
        codes: item.plate.flatMap((plate) =>
          plate.files.flatMap((file) => file.code),
        ),
      }
      const create = await apiClient.marginBottomApi.pageMountControllerCreate(
        params.name,
        params.pageMountMediaTypes,
      )
      for (const edition of item.plate) {
        const params = {
          editionCode: edition.value,
          documentHeadLineId: create.data.id,
          imageIds: edition.files.map(() => null),
          images: edition.files.map((file) => file.eps.file),
          imageConverts: edition.files.map((file) => file.convertImage),
          codes: [],
        }
        await apiClient.marginBottomApi.pageMountControllerUpdateEditionByCode(
          params.editionCode,
          params.documentHeadLineId,
          params.imageIds,
          params.images,
          params.imageConverts,
          params.codes,
        )
      }
      router.push("/import/footer")
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const plates = useMemo(
    () =>
      filterCopies(item.plate.map(({ value }) => value)).map((copies) => {
        const plate = item.plate.find((plate) => plate.value === copies.value)
        return {
          ...plate,
          label: copies.label,
        }
      }),
    [item],
  )

  const isSaveDisabled = useMemo(() => {
    if (
      item.name === "" ||
      !item.media.length ||
      !item.plate.length ||
      item.plate.some((plate) => !plate.files.length)
    ) {
      return true
    }
    return false
  }, [item])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/footer'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                欄外下画像リストに戻る
              </div>
            </MuiLink>
          </Link>
          <h1 className='mt-4 text-xl font-bold text-content-default-primary'>
            欄外下画像　新規登録
          </h1>
          <div className='mt-[76px]'>
            <ImportFooterForm item={item} onChange={handleOnChange} />
          </div>
          {plates.length > 0 && (
            <>
              <h2 className='mt-10 text-xl font-bold text-content-default-primary'>
                EPSファイルのアップロード
              </h2>
              <div className='mt-8 space-y-11'>
                {plates.map((plate) => (
                  <div key={plate.value} className='mx-[35px]'>
                    <MuiDivider textAlign='left'>
                      <div className='text-sm'>{plate.label}</div>
                    </MuiDivider>
                    {/* 今は１つしか登録できない。後で複数登録できる仕様に変わる予定 */}
                    {!plate.files.length && (
                      <div className='mt-5 h-[95px]'>
                        <BaseFileUploader
                          text='ファイルを選択'
                          extension={EXTENSIONS}
                          upLoading={plate.upLoading}
                          onChange={(event) =>
                            handleOnChangeFile({
                              files: event.files,
                              value: plate.value,
                            })
                          }
                          error={!!error?.formatError}
                          errorText={errorMessage.EPS_FORMAT_ERROR}
                        />
                      </div>
                    )}
                    {plate.files.map((file, i) => (
                      <div key={file.id} className='mr-3 last:mr-0'>
                        <ImportFooterListItem
                          id={file.id}
                          name={file.code?.toString()}
                          thumbImageUrl={file.eps.path}
                          onDelete={() => {
                            handleOnDeleteFile(plate.value, file.id)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
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

export default ImportFooterNewPage
