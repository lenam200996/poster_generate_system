import { useState } from "react"
import { managers } from "@/config/api/mock/workspace"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiTextField from "@mui/material/TextField"
import MuiButton from "@mui/material/Button"
import MuiMenuItem from "@mui/material/MenuItem"
import WorkspaceDesignTemplate from "@/components/page/workspace/WorkspaceDesignTemplate"
import BaseButtonText from "@/components/base/button/BaseButtonText"

interface Props {
  shown?: boolean
  items: Array<{
    id: number
    name: string
    image: string
  }>
  onPrev: () => void
  onClose: () => void
  onSelect: (id: number) => void
}

const ManagerOptions = managers.map((option) => (
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

const WorkspaceModalSelectDesignTemplateSmallAssembly = (props: Props) => {
  const [keyword, setkeyword] = useState("")

  const handleClickOnClose = () => {
    props.onClose()
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }
  const handleOnClick = (id: number) => {
    props.onSelect(id)
  }

  return (
    <div>
      <BaseModal shown={props.shown} onClickClose={handleClickOnClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='flex items-center'>
            <p className=' text-content-primary-dark90 text-lg font-bold'>
              うめ草選択
            </p>
            <div className='ml-8'>
              <MuiTextField
                size='small'
                sx={{ width: 440 }}
                placeholder='例）松茸コラム'
                value={keyword}
                onChange={(event) => setkeyword(event.target.value)}
              />
            </div>
            <div className='ml-8 space-x-11'>
              <MuiButton variant='contained' sx={{ width: 104 }}>
                検索
              </MuiButton>
              <BaseButtonText
                disabled={keyword === ""}
                onClick={() => setkeyword("")}
              >
                <span className='text-[15px] leading-6'>クリア</span>
              </BaseButtonText>
            </div>
          </div>
          <div className='scrollbar-hide mt-8 grid max-h-[410px] grid-cols-4 gap-3 overflow-y-auto'>
            {props.items.map((item) => (
              <WorkspaceDesignTemplate
                key={item.id}
                item={item}
                onClick={handleOnClick}
                onClose={handleClickOnClose}
              />
            ))}
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickPrev}
            >
              戻る
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalSelectDesignTemplateSmallAssembly
