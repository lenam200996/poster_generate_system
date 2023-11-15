import { useRouter } from "next/router"
import MuiButton from "@mui/material/Button"
import { TextFieldProps } from "@mui/material/TextField"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiLink from "@mui/material/Link"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiRadio from "@mui/material/Radio"
import { ChangeEventHandler, useMemo, useState } from "react"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import { Parts } from "@/types/page/import/parts"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseTextAreaAutoSize from "@/components/base/form/BaseTextAreaAutoSize"
import { DocumentSizeEnum, CoumnCategoryEnum } from "@/config/enum"
import { FormControlLabel } from "@mui/material"
import MuiCheckbox from "@mui/material/Checkbox"
import filterMedia from "@/util/filterMedia"
import {
  categoryOptions,
  mediaOptions,
  documentSizeOptions,
  columnCategoryOptions,
} from "@/config/options"
import errorMessage from "@/config/errorMessage"
import { SafeParseError, SafeParseReturnType, z } from "zod"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"

interface Props {
  item: Parts
  onChange?: Function
}

const PartsForm = (props: Props) => {
  const router = useRouter()
  const [errors, setErrors] = useState(null)

  const DATA_FORMAT = ["idml", "indd"]
  const EXTENSIONS = DATA_FORMAT.map((ext) => `.${ext}`).join(",")

  const schema = z.object({
    formatError: z
      .string()
      .refine(
        (file) => DATA_FORMAT.includes(file.split(".").pop()),
        errorMessage.INDESIGN_FORMAT_ERROR,
      ),
  })
  const handleOnChangeTextField: TextFieldProps["onChange"] = (event) => {
    const { name, value } = event.target
    props.onChange(name, value)
  }
  const handleOnChangeRadio = ({
    name,
    value,
  }: {
    name: string
    value: string
  }) => {
    props.onChange(name, value)
    props.onChange("columnCategory", "")
  }

  const handleOnChangeCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!props.onChange) {
      return
    }
    const { name, value, checked } = event.target
    if (checked) {
      props.onChange(event.target.name, [...props.item[name], value])
    } else {
      props.onChange(event.target.name, [
        ...props.item[name].filter((v) => v !== value),
      ])
    }
  }
  const handleOnChangeCheckboxBoolean: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!props.onChange) {
      return
    }
    const { name, checked } = event.target
    props.onChange(name, checked)
  }
  const handleOnChangeSelect = ({
    name,
    value,
  }: {
    name: string
    value: string
  }) => {
    if (!props.onChange) {
      return
    }
    props.onChange(name, value)
  }
  const handleOnChangeFileSelect: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = event.target.files[0]
    setErrors(null)
    const result: SafeParseReturnType<{ formatError: string }, any> =
      schema.safeParse({ formatError: file.name })
    if (!result.success) {
      setErrors((result as SafeParseError<string>).error.flatten().fieldErrors)
      return
    }
    const { name } = event.target
    let fileData: { fileName: string; base64: any } = null
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      fileData = {
        fileName: file.name,
        base64: event.target.result,
      }
      const value = { file, name: fileData.fileName, path: fileData.base64 }
      props.onChange(name, value)
    }
  }
  const handleOnClickInDesignDelete = () => {
    props.onChange("inDesign", undefined)
  }

  const filterdColumnCategoryOptions = useMemo(() => {
    return columnCategoryOptions.filter(
      (columnCategory) => columnCategory.key === props.item.category,
    )
  }, [props.item.category])

  return (
    <table className='w-full text-sm text-content-default-primary'>
      <tbody>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            名称
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <BaseTextField
                sx={{ minWidth: 320 }}
                size='small'
                name='name'
                value={props.item.name}
                onChange={handleOnChangeTextField}
              />
            ) : (
              props.item.name
            )}
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
                  name='documentSize'
                  value={props.item.documentSize}
                  onChange={(event) =>
                    handleOnChangeSelect({
                      name: event.target.name,
                      value: event.target.value,
                    })
                  }
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
              DocumentSizeEnum[props.item.documentSize]
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>媒体</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              mediaOptions.map((media) => (
                <FormControlLabel
                  key={media.value}
                  name='mediaTypes'
                  value={media.value}
                  control={
                    <MuiCheckbox
                      disableRipple
                      checked={props.item.mediaTypes.includes(media.value)}
                      onChange={handleOnChangeCheckbox}
                    />
                  }
                  label={media.label}
                />
              ))
            ) : (
              <div>
                {filterMedia(props.item.mediaTypes)
                  .map(({ label }) => label)
                  .join("、")}
              </div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>種別</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <MuiRadioGroup
                defaultValue={""}
                name='category'
                value={props.item.category}
                onChange={(event) =>
                  handleOnChangeRadio({
                    name: event.target.name,
                    value: event.target.value,
                  })
                }
              >
                <div className='flex items-center'>
                  {categoryOptions.map((categoryOption) => (
                    <FormControlLabel
                      key={categoryOption.value}
                      control={<MuiRadio size='small' />}
                      value={categoryOption.value}
                      label={categoryOption.label}
                    />
                  ))}
                </div>
              </MuiRadioGroup>
            ) : (
              CoumnCategoryEnum[props.item.category]
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            カテゴリ
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <MuiFormControl sx={{ minWidth: 90 }}>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ fontSize: 14 }}
                  inputProps={{ "aria-label": "Without label" }}
                  name='columnCategory'
                  value={props.item.columnCategory}
                  onChange={(event) =>
                    handleOnChangeSelect({
                      name: event.target.name,
                      value: event.target.value,
                    })
                  }
                >
                  <MuiMenuItem value={""}>
                    <div className='text-sm text-content-default-primary'>
                      選択
                    </div>
                  </MuiMenuItem>
                  {filterdColumnCategoryOptions.map((option) => (
                    <MuiMenuItem key={option.value} value={option.value}>
                      <div className='text-sm text-content-default-primary'>
                        {option.label}
                      </div>
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
            ) : (
              columnCategoryOptions.find(
                (columnCategory) =>
                  columnCategory.value === props.item.columnCategory,
              ).label
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            内容
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <BaseTextField
                sx={{ minWidth: 320 }}
                size='small'
                name='detail'
                value={props.item.detail}
                onChange={handleOnChangeTextField}
              />
            ) : (
              props.item.detail
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            使用可否
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <FormControlLabel
                name='availability'
                value={props.item.availability}
                control={
                  <MuiCheckbox
                    disableRipple
                    checked={props.item.availability}
                    onChange={handleOnChangeCheckboxBoolean}
                  />
                }
                label='不可'
              />
            ) : props.item.availability ? (
              "不可"
            ) : (
              "可"
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            InDesignデータ
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              !props.item.inDesign ? (
                <>
                  <MuiFormControl>
                    <MuiButton
                      variant='contained'
                      size='small'
                      component='label'
                      sx={{ minWidth: 47 }}
                    >
                      選択
                      <input
                        type='file'
                        className='hidden'
                        name='inDesign'
                        accept={EXTENSIONS}
                        onChange={(event) => handleOnChangeFileSelect(event)}
                      />
                    </MuiButton>
                  </MuiFormControl>
                  {errors?.formatError && (
                    <div className='pt-1'>
                      <BaseErrorBody>{errors.formatError}</BaseErrorBody>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span className='mr-5 font-bold text-content-active-primary underline'>
                    {props.item.inDesign.name}
                  </span>
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={handleOnClickInDesignDelete}
                  />
                </>
              )
            ) : (
              <MuiLink component='button' underline='none'>
                <span className='font-bold text-content-active-primary underline'>
                  {props.item.inDesign && props.item.inDesign.name}
                </span>
              </MuiLink>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-56 px-0 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            備考
            {["/import/parts/new", "/import/parts/edit/[id]"].includes(
              router.pathname,
            ) && "（任意）"}
          </th>
          <td className={`px-0 ${props.onChange ? "py-3" : "py-4"}`}>
            {props.onChange ? (
              <MuiFormControl>
                <BaseTextAreaAutoSize
                  style={{ width: 345 }}
                  minRows={4}
                  name='remarks'
                  value={props.item.remarks}
                  onChange={handleOnChangeTextField}
                />
              </MuiFormControl>
            ) : (
              <div className='whitespace-pre-wrap'>{props.item.remarks}</div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default PartsForm
