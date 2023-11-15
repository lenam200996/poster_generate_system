import { useEffect, useState } from "react"
import MuiButton from "@mui/material/Button"
import BaseModal from "@/components/base/overlay/BaseModal"

interface Props {
  shown?: boolean
  template: any
  onPrev: () => void
  onClose: () => void
  onClick: () => void
}

const WorkspaceModalDesignTemplateDetail = (props: Props) => {
  const [value, setValue] = useState<number>(0)
  const handleClickOnClose = () => {
    props.onClose()
  }
  const handleOnClickPrev = () => {
    props.onPrev()
  }
  const handleOnClick = () => {
    props.onClick()
  }
  useEffect(() => {}, [])

  return (
    <div>
      <BaseModal shown={props.shown} onClickClose={handleClickOnClose}>
        <div className='relative h-[640px] w-[1200px] px-9 pt-[56px]'>
          <p className='text-xl font-bold text-[#2C2C2C]'>
            {props.template.name}
          </p>
          <div className='flex items-center'>
            <div className='h-[448px] w-[515px] px-6 py-12'>
              <img
                className='h-full '
                src={props.template.imageConvert || props.template.image}
                alt=''
              />
            </div>
            <div className='ml-[50px] w-[552px]'>
              {/* change to map later */}
              <div className='mt-3 flex min-h-[48px] items-center border-b-[1px] border-b-divider-accent-secondary pb-3'>
                <p className='w-[164px] text-sm font-medium text-gray-90'>
                  名称
                </p>
                <p className='text-sm font-medium'>{props.template.name}</p>
              </div>
              <div className='mt-3 flex min-h-[48px] items-center border-b-[1px] border-b-divider-accent-secondary pb-3'>
                <p className='w-[164px] text-sm font-medium text-gray-90'>
                  原稿サイズ
                </p>
                <p className='text-sm font-medium'>
                  {props.template.documentSizeCode}
                </p>
              </div>
              <div className='mt-3 flex min-h-[48px] items-center border-b-[1px] border-b-divider-accent-secondary pb-3'>
                <p className='w-[164px] text-sm font-medium text-gray-90'>
                  内容
                </p>
                <p className='text-sm font-medium'>{props.template.comment}</p>
              </div>
            </div>
          </div>
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              onClick={handleOnClickPrev}
            >
              うめ草選択へ戻る
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              onClick={handleOnClick}
            >
              選択
            </MuiButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalDesignTemplateDetail
