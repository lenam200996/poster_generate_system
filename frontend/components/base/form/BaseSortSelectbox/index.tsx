import { useEffect, useState } from "react"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import selectBoxTheme from "@/config/mui/theme/selectBox"

interface Props {
  options: Array<{ label: string; value: string }>
  defaultValue: string
  selectedValue: string
  minWidth: number
  onChange?: Function
}

const theme = createTheme(selectBoxTheme)

const BaseSortSelectbox = (props: Props) => {
  const [sort, setSort] = useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value)
    props.onChange(event.target.value)
  }

  const Options = props.options.map((option) => (
    <MenuItem
      key={option.value}
      value={option.value}
      sx={{ padding: "5px 9px" }}
    >
      <div className='text-[13px] text-content-default-primary'>
        {option.label}
      </div>
    </MenuItem>
  ))

  useEffect(() => {
    if (!props.selectedValue) return
    setSort(props.selectedValue)
  }, []) // eslint-disable-line

  return (
    <ThemeProvider theme={theme}>
      <FormControl size='small' sx={{ minWidth: props.minWidth }}>
        <Select
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          value={sort}
          sx={{ backgroundColor: "#ffffff" }}
          renderValue={(selected) => {
            const item = props.options.find(
              (option) => option.value === selected,
            )
            return (
              <div className='text-[13px] text-content-default-primary'>
                {selected === "" ? props.defaultValue : item.label}
              </div>
            )
          }}
          onChange={handleChange}
        >
          {Options}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}

BaseSortSelectbox.defaultProps = {
  defaultValue: "並び替え",
  minWidth: 114,
}

export default BaseSortSelectbox
