import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import { useRouter } from "next/router"

interface Props {
  id: number
  name: string
  thumbImageUrl: string
  onDelete: Function
}

const TemplateListItem = (props: Props) => {
  const router = useRouter()
  return (
    <div className='w-[280px] rounded border border-divider-accent-primary bg-white-0 pb-6'>
      <div className='mx-4 mt-4 mb-[10px] h-[152px]'>
        <img
          className='h-full w-full object-contain'
          src={props.thumbImageUrl}
          alt={props.name}
        />
      </div>
      <div className='mx-[18px] space-y-4 pt-4 pb-2'>
        <p className='text-sm font-bold text-content-default-primary'>
          {props.name}
        </p>
        <div className='flex justify-around'>
          <BaseButtonIconText
            icon='loupe'
            text='詳細'
            onClick={() =>
              router.push({
                pathname: "/import/parts/detail/[id]",
                query: { id: props.id },
              })
            }
          />
          <BaseButtonIconText
            icon='edit_note'
            text='編集'
            onClick={() =>
              router.push({
                pathname: "/import/parts/edit/[id]",
                query: { id: props.id },
              })
            }
          />
          <BaseButtonIconText
            icon='delete'
            text='削除'
            onClick={() => props.onDelete()}
          />
        </div>
      </div>
    </div>
  )
}

export default TemplateListItem
