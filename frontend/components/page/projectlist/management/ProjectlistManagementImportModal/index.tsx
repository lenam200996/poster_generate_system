import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { EXEL_DATA_FORMAT, PDF_DATA_FORMAT } from "@/config/dataFormat"
import errorMessage from "@/config/errorMessage"
import { SafeParseError, SafeParseReturnType, z } from "zod"

interface Props {
  type: "entry" | "flatplain"
  onChange: (file: File) => void
}

const ProjectlistManagementImportModal = (props: Props) => {
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})
  const [shown, setShown] = useState<boolean>(false)
  const DATA_EXTENSIONS = EXEL_DATA_FORMAT.map((ext) => `.${ext}`)
  const DATA_FORMAT = EXEL_DATA_FORMAT
  const excelFileSchema = z.object({
    fileFormatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.EXCEL_FORMAT_ERROR,
      ),
  })

  const handleOnChangeFiles = ({
    files,
    name,
  }: {
    files: File[]
    name: string
  }) => {
    if (files.length === 0) return
    const file = files[0]
    const result = excelFileSchema.safeParse({ fileFormatError: file.name })
    if (!result.success) {
      const errorResult = result as SafeParseError<{
        fileFormatError: string
      }>
      const fieldErrors = errorResult.error.flatten().fieldErrors
      if (fieldErrors.fileFormatError) {
        setFileErrors((prev) => ({
          ...prev,
          [name]: fieldErrors.fileFormatError[0],
        }))
      } else {
        setFileErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
      return
    } else {
      setShown(false)
      props.onChange(files[0])
    }
  }

  return (
    <div>
      <MuiButton
        variant='contained'
        size='small'
        sx={{ minWidth: 104 }}
        onClick={() => setShown(true)}
      >
        選択
      </MuiButton>
      <BaseModal shown={shown} onClickClose={() => setShown(false)}>
        <div className='relative h-[320px] w-[600px]'>
          <div className='px-9 pt-[56px]'>
            <p className='text-center text-lg font-bold text-content-default-primary'>
              {props.type === "entry"
                ? "エントリーインポート"
                : "台割インポート"}
            </p>
            <p className='mt-4 text-center text-sm font-medium text-content-default-primary'>
              エクセルデータをアップロードしてください
            </p>
          </div>
          <div className='mx-auto mt-7 w-[421px]'>
            <BaseFileUploader
              text='ファイルを選択'
              extension={DATA_EXTENSIONS}
              onChange={handleOnChangeFiles}
              name='excel'
              errorText={errorMessage.EXCEL_FORMAT_ERROR}
              error={!!fileErrors.excel}
            />
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default ProjectlistManagementImportModal
