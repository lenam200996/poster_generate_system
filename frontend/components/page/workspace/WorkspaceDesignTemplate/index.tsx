import { useEffect, useState } from "react"
import MuiButton from "@mui/material/Button"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import WorkspaceModalDesignTemplateDetail from "../Modal/WorkspaceModalDesignTemplateDetail/index"

interface TemplateItem {
  id: number
  name: string
  recommend?: boolean
  image?: string
  imageConvert?: string
}

interface Props {
  item: TemplateItem
  onClick: (id: number) => void
  onClose: Function
  showDetail?: boolean
}

const WorkspaceDesignTemplate = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const handleOnClick = () => {
    props.onClick(props.item.id)
  }
  const handleOnClose = () => props.onClose()
  useEffect(() => {}, [])

  return (
    <div>
      <div className='w-[256px] rounded border border-divider-accent-primary py-3'>
        <div className='mx-auto h-[152px] w-[215px]'>
          <img
            src={props.item.imageConvert || props.item.imageConvert}
            className='mx-auto h-full'
            alt=''
          />
        </div>
        <div className='mt-4 px-7'>
          {props.item.recommend && (
            <span className='text-xs text-content-default-secondary'>
              推奨テンプレート
            </span>
          )}
          <p
            className={`mt-2 text-sm font-bold ${
              props.item.recommend ? "" : "mt-7"
            }`}
          >
            {props.item.name}
          </p>
          <div
            className={`mt-4 flex ${
              props.showDetail ? "justify-end" : "justify-between"
            }`}
          >
            {!props.showDetail && (
              <BaseButtonIconText
                icon='loupe'
                text='詳細'
                onClick={() => setShown(true)}
              />
            )}
            <MuiButton
              variant='contained'
              size='small'
              sx={{ width: 47 }}
              onClick={handleOnClick}
            >
              選択
            </MuiButton>
          </div>
        </div>
      </div>
      <WorkspaceModalDesignTemplateDetail
        shown={shown}
        template={props.item}
        onPrev={() => setShown(false)}
        onClose={() => setShown(false)}
        onClick={handleOnClick}
      />
    </div>
  )
}

export default WorkspaceDesignTemplate
