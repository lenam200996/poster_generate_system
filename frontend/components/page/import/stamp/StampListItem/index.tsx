import { useRouter } from "next/router"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"

interface Props {
  id: number
  name: string
  thumbImageUrl: string
  onDelete: Function
}

const StampListItem = (props: Props) => {
  const router = useRouter()
  return (
    <div className='w-[280px] rounded border border-divider-accent-primary bg-white-0'>
      <div className='mx-4 mt-4 mb-[10px] h-[180px]'>
        <img
          src={props.thumbImageUrl}
          alt={props.name}
          className='h-full w-full object-contain'
        />
      </div>
      <div className='mx-[18px] mb-4 pb-2'>
        <p className='py-4 text-sm font-bold text-content-default-primary'>
          {props.name}
        </p>
        <div className='flex justify-around'>
          <BaseButtonIconText
            icon='loupe'
            text='詳細'
            onClick={() =>
              router.push({
                pathname: "/import/stamp/detail/[id]",
                query: { id: props.id },
              })
            }
          />
          <BaseButtonIconText
            icon='edit_note'
            text='編集'
            onClick={() =>
              router.push({
                pathname: "/import/stamp/edit/[id]",
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

export default StampListItem
