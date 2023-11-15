import { ChangeEventHandler } from "react"
import FormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import { copiesMock, mediaMock } from "@/config/api/mock/projects"
import { IndexHeader } from "@/types/page/import/indexHeader"
import BaseTextField from "@/components/base/form/BaseTextField"
import { useRouter } from "next/router"

interface Props {
  item: Pick<IndexHeader, "id" | "name" | "media" | "plate">
  onChange?: (
    name: string,
    value: string | string[] | IndexHeader["plate"],
  ) => void
}

const ImportIndexHeaderForm = (props: Props) => {
  const router = useRouter()
  const handleOnChange = (event) => {
    if (!props.onChange) {
      return
    }
    const { name, value } = event.target
    props.onChange(name, value)
  }

  const handleOnChangeCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!props.onChange) {
      return
    }
    const { name, value, checked } = event.target
    if (name === "media") {
      if (checked) {
        props.onChange(name, [...props.item[name], value])
      } else {
        props.onChange(
          name,
          props.item[name].filter((v) => v !== value),
        )
      }
    } else if (name === "plate") {
      if (checked) {
        props.onChange(name, [...props.item[name], { value, files: [] }])
      } else {
        props.onChange(
          name,
          props.item[name].filter((plate) => plate.value !== value),
        )
      }
    }
  }

  return (
    <table className='w-full text-sm text-content-default-primary'>
      <tbody>
        {[
          "/import/indexHeader/edit/[id]",
          "/import/indexHeader/detail/[id]",
        ].includes(router.pathname) && (
          <tr className='border-b border-divider-accent-primary'>
            <th className='w-40 py-3 text-left font-medium'>
              ツメ見出しセットコード
            </th>
            <td className='flex items-center py-3'>{props.item.id}</td>
          </tr>
        )}
        <tr className='border-b border-divider-accent-primary'>
          <th
            className={`w-40 text-left font-medium ${
              props.onChange ? "py-3" : "py-4"
            }`}
          >
            ツメ見出し名称
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
              props.item.name
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
            {props.onChange
              ? mediaMock.map((media) => (
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
              : mediaMock
                  .filter((media) => props.item.media.includes(media.value))
                  .map((media) => media.label)
                  .join("、")}
          </td>
        </tr>
        {props.onChange && (
          <tr className='border-b border-divider-accent-primary'>
            <th className='w-40 py-3 text-left font-medium'>版</th>
            <td className='flex flex-wrap items-center py-3'>
              {copiesMock.map((copies) => (
                <FormControlLabel
                  key={copies.value}
                  control={
                    <MuiCheckbox
                      disableRipple
                      name='plate'
                      value={copies.value}
                      checked={
                        props.item.plate.find(
                          (plate) => plate.value === copies.value,
                        ) !== undefined
                      }
                      disabled={
                        props.item.plate.find(
                          (plate) =>
                            plate.value === copies.value &&
                            plate.files.length > 0,
                        ) !== undefined
                      }
                      onChange={handleOnChangeCheckbox}
                    />
                  }
                  label={copies.label}
                />
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ImportIndexHeaderForm
