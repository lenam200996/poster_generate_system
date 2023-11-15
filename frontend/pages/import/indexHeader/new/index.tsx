import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import MuiDivider from "@mui/material/Divider"
import { ArrowBack } from "@mui/icons-material"
import ImportIndexHeaderForm from "@/components/page/import/indexHeader/ImportIndexHeaderForm"
import ImportIndexHeaderListItem from "@/components/page/import/indexHeader/ImportIndexHeaderListItem"
import { generateMockIndexHeaderEpsFileID } from "@/config/api/mock/import/indexHeader"
import { IndexHeader } from "@/types/page/import/indexHeader"
import filterCopies from "@/util/filterCopies"
import { useApiClient } from "@/hooks/useApiClient"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { postConverts } from "@/api/imageConvert"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { useSetRecoilState } from "recoil"
import { GlobalLoadingState } from "@/atoms/global"

const ImportIndexHeaderNewPage: NextPage = () => {
  const apiClient = useApiClient()
  const { showAlertMessage } = useShowAlertMessage()
  const router = useRouter()
  const [errors, setErrors] = useState(null)
  const setLoadingState = useSetRecoilState(GlobalLoadingState)

  const [item, setItem] = useState<
    Pick<IndexHeader, "id" | "name" | "media" | "plate">
  >({
    id: 1,
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
      const file = files[0] as File
      const result: SafeParseReturnType<{ formatError: string }, any> =
        schema.safeParse({ formatError: file.name })
      if (!result.success) {
        setErrors(
          (result as SafeParseError<string>).error.flatten().fieldErrors,
        )
        return
      }

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
                  id: -generateMockIndexHeaderEpsFileID(),
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
                code: value,
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
      setLoadingState(true)

      // データの整合性チェックを行う
      for (const edition of item.plate) {
        const codes: string[] = edition.files.flatMap((file) => file.code)

        const codePairs: { [key: string]: string[] } = codes.reduce(
          (acc: { [key: string]: string[] }, code: string) => {
            const prefix: string = code.substring(0, code.length - 2)
            if (!acc[prefix]) {
              acc[prefix] = []
            }
            acc[prefix].push(code)
            return acc
          },
          {},
        )

        for (const [, pair] of Object.entries(codePairs)) {
          const leftCount: number = pair.filter((code: string) =>
            code.endsWith("_L"),
          ).length
          const rightCount: number = pair.filter((code: string) =>
            code.endsWith("_R"),
          ).length

          if (leftCount !== rightCount) {
            showAlertMessage("error", errorMessage.THUMBNAIL_PAIR_REQUIRE)
            return
          }

          if (leftCount > 1 || rightCount > 1) {
            showAlertMessage("error", errorMessage.THUMBNAIL_CODE_UNIQUE)
            return
          }

          if (leftCount === 0 || rightCount === 0) {
            showAlertMessage("error", errorMessage.THUMBNAIL_CODE_FORMAT)
            return
          }
        }
      }

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
      const create = await apiClient.thumbIndexApi.thumbIndexControllerCreate(
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
          codes: edition.files.map((file) => file.code),
        }
        await apiClient.thumbIndexApi.thumbIndexControllerUpdateEditionByCode(
          params.editionCode,
          params.documentHeadLineId,
          params.imageIds,
          params.images,
          params.imageConverts,
          params.codes,
        )
      }
      router.push("/import/indexHeader")
    } catch (error) {
      showAlertMessage(
        "error",
        error.response ? error.response.data.message : error.message,
      )
    } finally {
      setLoadingState(false)
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
      item.plate.some((plate) => !plate.files.length) ||
      item.plate.some((plate) => plate.files.some((file) => !file.code))
    ) {
      return true
    }
    return false
  }, [item])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/indexHeader'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                ツメ見出しリストに戻る
              </div>
            </MuiLink>
          </Link>
          <h1 className='mt-4 text-xl font-bold text-content-default-primary'>
            ツメ見出し　新規登録
          </h1>
          <div className='mt-[76px]'>
            <ImportIndexHeaderForm item={item} onChange={handleOnChange} />
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
                        errorText={errorMessage.EPS_FORMAT_ERROR}
                        error={!!errors?.formatError}
                      />
                    </div>
                    <div className='mt-8 flex w-full overflow-x-auto'>
                      {plate.files.map((file, i) => (
                        <div key={file.id} className='mr-3 last:mr-0'>
                          <ImportIndexHeaderListItem
                            id={file.id}
                            name={file.code}
                            thumbImageUrl={file.eps.path}
                            onDelete={() => {
                              handleOnDeleteFile(plate.value, file.id)
                            }}
                            onChange={handleOnChangeFileCode}
                          />
                        </div>
                      ))}
                    </div>
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
            onClick={handleOnClickSave}
          >
            保存
          </MuiLoadingButton>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ImportIndexHeaderNewPage
