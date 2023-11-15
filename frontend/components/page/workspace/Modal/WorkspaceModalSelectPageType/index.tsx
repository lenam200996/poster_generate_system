import { useState } from "react"
import { pageTypes } from "@/config/api/mock/workspace"
import { useRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"
import BaseModal from "@/components/base/overlay/BaseModal"
import MuiButton from "@mui/material/Button"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import WorkspaceModalSelectLayout from "@/components/page/workspace/Modal/WorkspaceModalSelectLayout"
import WorkspaceModalUploadPageData from "@/components/page/workspace/Modal/WorkspaceModalUploadPageData"
import { useApiClient } from "@/hooks/useApiClient"
import { BookletDetailResponseDto } from "@/openapi"
import { PageType } from "@/config/api/mock/workspace/booklet"

type Props = {
  shown: boolean
  pageNumber: number
  booklet: BookletDetailResponseDto
  onClose?: Function
  onExact?: Function
}

type DisplayStatus =
  | "selectLayout"
  | "uploadPageData"
  | "selectIndexHeader"
  | ""

const PageTypesOptions = pageTypes.map((option) => (
  <MuiMenuItem key={option.value} value={option.value}>
    {option.label}
  </MuiMenuItem>
))
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const WorkspaceModalSelectPageType = (props: Props) => {
  const apiClient = useApiClient()
  const [selectedPageType, setSelectedPageType] = useState<PageType>(null)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("")
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)

  const handleChangePageType = (value: PageType) => {
    setSelectedPageType(value)
  }

  const handleOnClickClose = () => {
    setDisplayStatus("")
    setSelectedPageType(null)
    props.onClose()
  }

  const handleOnExactPageData = () => {
    const array = [...bookletState.pages].map((page) => {
      if (page.pageNumber === props.pageNumber) {
        return {
          ...page,
          setting: {
            type: selectedPageType,
          },
        }
      } else {
        return page
      }
    })

    const formattedBooklet = {
      ...bookletState,
      pages: [...array],
    }

    setBookletState(formattedBooklet)
    setDisplayStatus("")
    props.onExact()
  }

  const handleOnExactSelectLayout = async ({
    layout,
    indexHeader,
  }: {
    layout: string
    indexHeader: string
  }) => {
    try {
      const response = await apiClient.pagesApiFactory.pageControllerCreate({
        projectId: props.booklet.projectId,
        bookletId: props.booklet.id,
        mountId: 1,
        layoutAlphabet: layout.toUpperCase(),
        pageNumber: props.pageNumber,
        pageTypeCode: "HOTEL_MANUSCRIPT",
        thumbIndexImageGroupId: indexHeader,
      })

      const formattedBooklet = {
        ...bookletState,
        pages: [...bookletState.pages, { ...response.data, documents: [] }],
      }

      setBookletState(formattedBooklet)
      setDisplayStatus("")
      props.onExact()
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClickNextToModal = () => {
    if (selectedPageType === "HOTEL_MANUSCRIPT") {
      setDisplayStatus("selectLayout")
    } else if (
      selectedPageType === "CHAPTER_TITLE_PAGE" ||
      selectedPageType === "ADVERTISEMENT" ||
      selectedPageType === "INFORMATION"
    ) {
      setDisplayStatus("uploadPageData")
    }
  }

  return (
    <>
      <BaseModal shown={props.shown} onClickClose={handleOnClickClose}>
        <div className='relative h-[320px] w-[600px] px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>ページ種別の選択</p>
          <p className='mt-4 text-center text-sm font-medium'>
            ページ種別を選択してください
          </p>
          <div className='mt-7 flex items-center justify-center'>
            <span className='mr-5 text-sm font-medium'>ページ種別</span>
            <MuiFormControl size='small' sx={{ minWidth: 122 }}>
              <MuiSelect
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                defaultValue=''
                MenuProps={MenuProps}
                onChange={(event) =>
                  handleChangePageType(event.target.value as PageType)
                }
              >
                <MuiMenuItem value=''>選択</MuiMenuItem>
                {PageTypesOptions}
              </MuiSelect>
            </MuiFormControl>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!selectedPageType}
              onClick={handleOnClickNextToModal}
            >
              次へ
            </MuiButton>
          </div>
        </div>
      </BaseModal>
      <WorkspaceModalSelectLayout
        shown={displayStatus === "selectLayout"}
        pageNumber={props.pageNumber}
        onClose={handleOnClickClose}
        onExact={handleOnExactSelectLayout}
      />
      <WorkspaceModalUploadPageData
        shown={displayStatus === "uploadPageData"}
        pageType={selectedPageType}
        pageNumber={props.pageNumber}
        booklet={props.booklet}
        onClose={handleOnClickClose}
        onExact={handleOnExactPageData}
      />
    </>
  )
}

export default WorkspaceModalSelectPageType
