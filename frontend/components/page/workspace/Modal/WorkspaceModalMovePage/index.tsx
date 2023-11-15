import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import { useRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"
import { useApiClient } from "@/hooks/useApiClient"

import MuiButton from "@mui/material/Button"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import { PageForBookletDto } from "@/openapi"

interface Props {
  pageNumber: number
  page: PageForBookletDto
  onClose: () => void
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const WorkspaceModalMovePage = (props: Props) => {
  const [complite, setComplete] = useState<boolean>(false)
  const [toPageValue, setToPageValue] = useState<number>(null)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)
  const apiClient = useApiClient()
  const handleOnClose = () => props.onClose()

  const handleMove = async () => {
    let response = await apiClient.pagesApiFactory.pageControllerPageMove({
      id: props.page.id,
      moveToPageNumber: toPageValue,
    })
    setBookletState((state) => {
      return {
        ...state,
        pages: state.pages.map((page) => {
          if ([props.pageNumber, toPageValue].includes(page.pageNumber)) {
            const pageNumber =
              page.pageNumber === props.pageNumber
                ? toPageValue
                : props.pageNumber
            return {
              ...page,
              pageNumber,
              documents: page.documents.map((document) => ({
                ...document,
                pageNumber,
              })),
            }
          }
          return page
        }),
      }
    })
    setComplete(true)
  }

  const handleChange = (e) => {
    setToPageValue(parseInt(e.target.value))
  }

  const pageOptions = [...Array(bookletState ? bookletState.numberOfPages : 0)]
    .map((_, i) => i + 3)
    .filter((pageNumber) => pageNumber !== props.pageNumber)
    .map((pageNumber, i) => (
      <MuiMenuItem key={i} value={pageNumber}>
        {pageNumber}ページ
      </MuiMenuItem>
    ))

  const ConfirmView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>入れ替え</p>
          <p className='mt-4 text-center text-sm font-medium'>
            下記で選択したページと入れ替えます
          </p>
          <div className='mt-7 flex items-center justify-center'>
            <span className='w-[90px] text-sm font-medium'>ページ選択</span>
            <MuiFormControl size='small' sx={{ minWidth: 122 }}>
              <MuiSelect
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={toPageValue}
                MenuProps={MenuProps}
                onChange={handleChange}
              >
                <MuiMenuItem value=''>選択</MuiMenuItem>
                {pageOptions}
              </MuiSelect>
            </MuiFormControl>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleMove}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }
  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページの入れ替え完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {props.pageNumber}ページ
            <br />を{toPageValue}ページと入れ替えました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {complite ? <CompleteView /> : <ConfirmView />}
    </BaseModal>
  )
}

export default WorkspaceModalMovePage
