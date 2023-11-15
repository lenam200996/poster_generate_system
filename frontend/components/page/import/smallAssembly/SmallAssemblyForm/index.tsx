import { ChangeEventHandler } from "react"
import { TextFieldProps } from "@mui/material/TextField"
import MuiFormControl from "@mui/material/FormControl"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import { FormControlLabel } from "@mui/material"
import { SmallAssembly } from "@/types/page/import/smallAssembly"
import filterMedia from "@/util/filterMedia"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseTextAreaAutoSize from "@/components/base/form/BaseTextAreaAutoSize"
import { useRouter } from "next/router"
import { documentSizeOptions, mediaOptions } from "@/config/options"
import { DocumentSizeEnum } from "@/config/enum"

interface Props {
  item: Pick<
    SmallAssembly,
    | "code"
    | "name"
    | "manuscriptSize"
    | "media"
    | "contents"
    | "remarks"
    | "imageEps"
  >
  onChange?: (name: string, value: string | string[]) => void
}

const SmallAssemblyForm = (props: Props) => {
  const router = useRouter()

  const handleOnChange: TextFieldProps["onChange"] = (event) => {
    if (!props.onChange) {
      return
    }
    const { name, value } = event.target
    props.onChange(name, value)
  }
  const handleOnChangeSelect: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
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

  return (
    <table className='w-full text-sm text-content-default-primary'>
      <tbody>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>名称</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <BaseTextField
                sx={{ minWidth: 320 }}
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
          <th className='w-52 px-0 py-3 text-left font-medium'>うめ草コード</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <div className='flex items-center'>
                <BaseTextField
                  sx={{ width: 140 }}
                  size='small'
                  name='code'
                  value={props.item.code}
                  onChange={handleOnChange}
                />
              </div>
            ) : (
              <div>{props.item.code}</div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>原稿サイズ</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <MuiFormControl sx={{ minWidth: 90 }}>
                <MuiSelect
                  displayEmpty
                  size='small'
                  sx={{ fontSize: 14 }}
                  inputProps={{ "aria-label": "Without label" }}
                  name='manuscriptSize'
                  value={props.item.manuscriptSize}
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
              <div>{DocumentSizeEnum[props.item.manuscriptSize]}</div>
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
                  name='media'
                  value={media.value}
                  control={
                    <MuiCheckbox
                      disableRipple
                      checked={props.item.media.includes(media.value)}
                      onChange={handleOnChangeCheckbox}
                    />
                  }
                  label={media.label}
                />
              ))
            ) : (
              <div>
                {filterMedia(props.item.media)
                  .map(({ label }) => label)
                  .join("、")}
              </div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>内容</th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <BaseTextField
                sx={{ minWidth: 320 }}
                size='small'
                name='contents'
                value={props.item.contents}
                onChange={handleOnChange}
              />
            ) : (
              <div>{props.item.contents}</div>
            )}
          </td>
        </tr>
        <tr className='border-b border-divider-accent-primary'>
          <th className='w-52 px-0 py-3 text-left font-medium'>
            備考
            {[
              "/import/small-assembly/new",
              "/import/small-assembly/edit/[id]",
            ].includes(router.pathname) && "（任意）"}
          </th>
          <td className='px-0 py-3'>
            {props.onChange ? (
              <MuiFormControl>
                <BaseTextAreaAutoSize
                  style={{ width: 336 }}
                  minRows={4}
                  name='remarks'
                  value={props.item.remarks}
                  onChange={handleOnChange}
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

export default SmallAssemblyForm
