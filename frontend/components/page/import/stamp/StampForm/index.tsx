import { ChangeEventHandler } from "react"
import { useRouter } from "next/router"
import { TextFieldProps } from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import { mediaMock } from "@/config/api/mock/projects"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseTextAreaAutoSize from "@/components/base/form/BaseTextAreaAutoSize"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { StampCategoryEnum } from "@/config/enum"

interface Props {
  item: {
    id?: number
    code: number
    name: string
    media: string[]
    remarks: string
    category: string
  }
  onChange?: (name: string, value: string | string[] | File) => void
}

const StampForm = (props: Props) => {
  const router = useRouter()
  const handleOnChange: TextFieldProps["onChange"] = (event) => {
    if (!props.onChange) {
      return
    }
    props.onChange(event.target.name, event.target.value)
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

  const handleOnChangeRadio: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!props.onChange) return
    const { name, value } = event.target
    props.onChange(name, value)
  }

  return (
    <table className='w-full text-sm text-content-default-primary'>
      <tbody>
        {["/import/stamp/edit/[id]", "/import/stamp/detail/[id]"].includes(
          router.pathname,
        ) && (
          <tr className='border-b border-divider-accent-primary'>
            <th className='w-44 py-3 text-left font-medium'>
              自慢スタンプコード
            </th>
            <td className='flex items-center py-3'>
              <div>{props.item.code}</div>
            </td>
          </tr>
        )}
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-44 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            自慢スタンプ名称
          </th>
          <td
            className={`flex items-center ${props.onChange ? "py-3" : "py-4"}`}
          >
            {props.onChange ? (
              <BaseTextField
                sx={{ width: 320 }}
                size='small'
                name='name'
                value={props.item.name}
                onChange={handleOnChange}
              />
            ) : (
              <div>{props.item.name}</div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-44 text-left font-medium ${
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
                      checked={props.item.media.includes(media.value)}
                      onChange={handleOnChangeCheckbox}
                    />
                  }
                  label={media.label}
                />
              ))
            ) : (
              <div>
                {mediaMock
                  .filter((media) => props.item.media.includes(media.value))
                  .map((media) => media.label)
                  .join("、")}
              </div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-44 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            属性（カテゴリ）
          </th>
          <td
            className={`flex flex-wrap items-center ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            {props.onChange ? (
              <RadioGroup
                defaultValue={props.item.category}
                value={props.item.category}
                name='category'
                onChange={(event) => handleOnChangeRadio(event)}
              >
                <div className='flex items-center'>
                  <FormControlLabel
                    value='PRIDE'
                    control={<Radio />}
                    label='自慢'
                  />
                  <FormControlLabel
                    value='SCORES'
                    control={<Radio />}
                    label='口コミ点数'
                  />
                </div>
              </RadioGroup>
            ) : (
              <div>{StampCategoryEnum[props.item.category]}</div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-44 text-left  font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            備考
            {["/import/stamp/new", "/import/stamp/edit/[id]"].includes(
              router.pathname,
            ) && "（任意）"}
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
                value={props.item.remarks}
                onChange={handleOnChange}
              />
            ) : (
              <div className='whitespace-pre-wrap'>{props.item.remarks}</div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default StampForm
