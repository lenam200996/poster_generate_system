import { ChangeEventHandler, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { TextFieldProps } from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import { mediaMock } from "@/config/api/mock/projects"
import MuiLink from "@mui/material/Link"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseTextAreaAutoSize from "@/components/base/form/BaseTextAreaAutoSize"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import { documentSizeOptions } from "@/config/options"
import BaseFileUploader from "@/components/base/form/BaseFileUploader"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import errorMessage from "@/config/errorMessage"
import { EPS_DATA_FORMAT, INDESIGN_DATA_FORMAT } from "@/config/dataFormat"

interface Props {
  item: {
    code?: number
    name: string
    media: string[]
    manuscriptSize?: string
    remarks: string
    thisIssueImage?: { file?: File; path: string; name: string }
    previousIssueImage?: { file?: File; path: string; name: string }
    twoPreviousIssueImage?: { file?: File; path: string; name: string }
    wantedImage?: { file?: File; path: string; name: string }
    startFillImage?: { file?: File; path: string; name: string }
    startHalfFillImage?: { file?: File; path: string; name: string }
    startNonFillImage?: { file?: File; path: string; name: string }
    inDesign?: { file?: File; path: string; name: string }
  }
  onChange?: Function
}

const ReviewPartsForm = (props: Props) => {
  const router = useRouter()
  const [item, setItem] = useState(props.item)
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})

  const DATA_FORMAT = EPS_DATA_FORMAT
  const INDESIGN_FORMAT = INDESIGN_DATA_FORMAT
  const DATA_EXTENSIONS = DATA_FORMAT.map((ext) => `.${ext}`)
  const INDESIGN_EXTENSIONS = INDESIGN_FORMAT.map((ext) => `.${ext}`)

  const epsFileSchema = z.object({
    fileFormatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.EPS_FORMAT_ERROR,
      ),
  })

  const indesignFileSchema = z.object({
    inDesignFormatError: z
      .string()
      .refine(
        (file) => INDESIGN_FORMAT.includes(file.split(".").pop()),
        errorMessage.INDESIGN_FORMAT_ERROR,
      ),
  })

  const manuscriptSize = useMemo(() => {
    const option = documentSizeOptions.find(
      ({ value }) => item && item.manuscriptSize === value,
    )
    return option ? option.label : ""
  }, [item])

  const handleOnChange: TextFieldProps["onChange"] = (event) => {
    if (!props.onChange) {
      return
    }
    setItem((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleOnChangeCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!props.onChange) {
      return
    }
    const { name, value, checked } = event.target
    if (checked) {
      setItem((state) => ({
        ...state,
        [name]: [...props.item[name], value],
      }))
    } else {
      setItem((state) => ({
        ...state,
        [name]: [...props.item[name].filter((v) => v !== value)],
      }))
    }
  }

  const handleOnChangeFile = ({
    files,
    name,
  }: {
    files: File[]
    name: string
  }) => {
    if (!props.onChange) {
      return
    }
    if (files.length === 0) return
    const file = files[0]
    const result = epsFileSchema.safeParse({ fileFormatError: file.name })
    const inDesignResult: SafeParseReturnType<
      { inDesignFormatError: string },
      any
    > = indesignFileSchema.safeParse({ inDesignFormatError: file.name })
    if (!result.success && name !== "inDesign") {
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
    }
    if (name === "inDesign" && !inDesignResult.success) {
      const errorResult = inDesignResult as SafeParseError<{
        fileFormatError: string
      }>
      const fieldErrors = errorResult.error.flatten().fieldErrors
      if (fieldErrors.fileFormatError) {
        setFileErrors((prev) => ({
          ...prev,
          ["inDesign"]: fieldErrors.fileFormatError[0],
        }))
      } else {
        setFileErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors["inDesign"]
          return newErrors
        })
      }
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
        [name]: {
          file,
          name: fileData.fileName,
          path: fileData.base64,
        },
      }))
    }
  }

  const handleOnChangeSelect: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setItem((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleOnClickDeleteFile = (name: string) => {
    if (!props.onChange) {
      return
    }
    setItem((state) => ({
      ...state,
      [name]: undefined,
    }))
  }

  useEffect(() => {
    if (!props.onChange) return
    props.onChange(item)
  }, [item]) // eslint-disable-line

  return (
    <table className='w-full text-sm text-content-default-primary'>
      <tbody>
        {[
          "/import/reviewParts/edit/[id]",
          "/import/reviewParts/detail/[id]",
        ].includes(router.pathname) && (
          <tr className='border-b border-divider-accent-primary'>
            <th className='font-mediumpy-3 w-40 text-left'>評価パーツコード</th>
            <td className='flex items-center py-3'>
              <div>{item.code}</div>
            </td>
          </tr>
        )}
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            評価パーツ名称
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              <BaseTextField
                sx={{ width: 320 }}
                size='small'
                name='name'
                value={item.name}
                onChange={handleOnChange}
              />
            ) : (
              <div>{item.name}</div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            媒体
          </th>
          <td
            className={`flex flex-wrap items-center ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            {props.onChange ? (
              mediaMock.map((media) => (
                <FormControlLabel
                  key={media.value}
                  control={
                    <MuiCheckbox
                      disableRipple
                      name='media'
                      value={media.value}
                      checked={item.media.includes(media.value)}
                      onChange={handleOnChangeCheckbox}
                    />
                  }
                  label={media.label}
                />
              ))
            ) : (
              <div>
                {mediaMock
                  .filter((media) => item.media.includes(media.value))
                  .map((media) => media.label)
                  .join("、")}
              </div>
            )}
            {}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            原稿サイズ
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <MuiFormControl sx={{ minWidth: 90 }}>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ fontSize: 14 }}
                  inputProps={{ "aria-label": "Without label" }}
                  name='manuscriptSize'
                  value={item.manuscriptSize ?? ""}
                  onChange={handleOnChangeSelect}
                >
                  <MuiMenuItem value=''>
                    <div className='text-sm text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {documentSizeOptions.map((option) => (
                    <MuiMenuItem key={option.value} value={option.value}>
                      <div className='text-sm text-content-default-primary'>
                        {option.label}
                      </div>
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
            ) : (
              manuscriptSize
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            今号初登場
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.thisIssueImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.thisIssueImage.path,
                        item.thisIssueImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.thisIssueImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => handleOnClickDeleteFile("thisIssueImage")}
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='thisIssueImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.thisIssueImage}
                  />
                </div>
              )
            ) : (
              item.thisIssueImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.thisIssueImage.path,
                      item.thisIssueImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.thisIssueImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            前号初登場
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.previousIssueImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.previousIssueImage.path,
                        item.previousIssueImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.previousIssueImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() =>
                      handleOnClickDeleteFile("previousIssueImage")
                    }
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='previousIssueImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.previousIssueImage}
                  />
                </div>
              )
            ) : (
              item.previousIssueImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.previousIssueImage.path,
                      item.previousIssueImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.previousIssueImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            前々号初登場
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.twoPreviousIssueImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.twoPreviousIssueImage.path,
                        item.twoPreviousIssueImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.twoPreviousIssueImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() =>
                      handleOnClickDeleteFile("twoPreviousIssueImage")
                    }
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='twoPreviousIssueImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.twoPreviousIssueImage}
                  />
                </div>
              )
            ) : (
              item.twoPreviousIssueImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.twoPreviousIssueImage.path,
                      item.twoPreviousIssueImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.twoPreviousIssueImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            募集中
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.wantedImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.wantedImage.path,
                        item.wantedImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.wantedImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => handleOnClickDeleteFile("wantedImage")}
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='wantedImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.wantedImage}
                  />
                </div>
              )
            ) : (
              item.wantedImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.wantedImage.path,
                      item.wantedImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.wantedImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            星画像（全）
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.startFillImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.startFillImage.path,
                        item.startFillImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.startFillImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => handleOnClickDeleteFile("startFillImage")}
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='startFillImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.startFillImage}
                  />
                </div>
              )
            ) : (
              item.startFillImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.startFillImage.path,
                      item.startFillImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.startFillImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            星画像（半）
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.startHalfFillImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.startHalfFillImage.path,
                        item.startHalfFillImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.startHalfFillImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() =>
                      handleOnClickDeleteFile("startHalfFillImage")
                    }
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='startHalfFillImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.startHalfFillImage}
                  />
                </div>
              )
            ) : (
              item.startHalfFillImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.startHalfFillImage.path,
                      item.startHalfFillImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.startHalfFillImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            星画像（無）
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.startNonFillImage ? (
                <div className='flex items-center space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.startNonFillImage.path,
                        item.startNonFillImage.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.startNonFillImage.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => handleOnClickDeleteFile("startNonFillImage")}
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={DATA_EXTENSIONS}
                    text='EPS画像を選択'
                    name='startNonFillImage'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.EPS_FORMAT_ERROR}
                    error={!!fileErrors.startNonFillImage}
                  />
                </div>
              )
            ) : (
              item.startNonFillImage && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(
                      item.startNonFillImage.path,
                      item.startNonFillImage.name,
                    )
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.startNonFillImage.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            口コミ台紙
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              item.inDesign ? (
                <div className='space-x-10'>
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      downloadFileFromUrl(
                        item.inDesign.path,
                        item.inDesign.name,
                      )
                    }
                  >
                    <div className='font-bold text-content-active-primary underline'>
                      {item.inDesign.name}
                    </div>
                  </MuiLink>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => handleOnClickDeleteFile("inDesign")}
                  />
                </div>
              ) : (
                <div className='w-[337px]'>
                  <BaseFileUploader
                    extension={INDESIGN_EXTENSIONS}
                    text='INDDファイルを選択'
                    name='inDesign'
                    onChange={handleOnChangeFile}
                    errorText={errorMessage.INDESIGN_FORMAT_ERROR}
                    error={!!fileErrors.inDesign}
                  />
                </div>
              )
            ) : (
              item.inDesign && (
                <MuiLink
                  component='button'
                  underline='none'
                  onClick={() =>
                    downloadFileFromUrl(item.inDesign.path, item.inDesign.name)
                  }
                >
                  <div className='font-bold text-content-active-primary underline'>
                    {item.inDesign.name}
                  </div>
                </MuiLink>
              )
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            備考
            {[
              "/import/reviewParts/new",
              "/import/reviewParts/edit/[id]",
            ].includes(router.pathname) && "（任意）"}
          </th>
          <td
            className={`flex flex-wrap items-center ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            {props.onChange ? (
              <BaseTextAreaAutoSize
                style={{ width: 336 }}
                minRows={4}
                name='remarks'
                value={item.remarks}
                onChange={handleOnChange}
              />
            ) : (
              <div className='whitespace-pre-wrap'>{item.remarks}</div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default ReviewPartsForm
