import { useEffect, useState } from "react"
import MuiButton from "@mui/material/Button"
import BaseButtonText from "@/components/base/button/BaseButtonText"
import BaseTextField from "@/components/base/form/BaseTextField"

interface Props {
  keyword?: string
  placeholder?: string
  onSearch: (keyword: string) => void
  onClear: Function
}

const ImportSearchForm = (props: Props) => {
  const [keyword, setKeyword] = useState(props.keyword ?? "")

  useEffect(() => {
    setKeyword(props.keyword ?? "")
  }, [props.keyword])

  const handleOnChange = (event) => {
    setKeyword(event.target.value)
  }

  const handleOnClickSearch = () => {
    props.onSearch(keyword)
  }

  const handleOnKeyDown = (event) => {
    if (event.keyCode === 13) {
      props.onSearch(keyword)
    }
  }

  return (
    <div className='flex items-center space-x-8'>
      <BaseTextField
        sx={{ minWidth: 440 }}
        size='small'
        value={keyword}
        placeholder={props.placeholder}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
      />
      <div className='space-x-11'>
        <MuiButton
          variant='contained'
          sx={{ minWidth: 104 }}
          onClick={handleOnClickSearch}
        >
          検索
        </MuiButton>
        <BaseButtonText disabled={keyword === ""} onClick={props.onClear}>
          <span className='text-[15px] leading-6'>クリア</span>
        </BaseButtonText>
      </div>
    </div>
  )
}

export default ImportSearchForm
