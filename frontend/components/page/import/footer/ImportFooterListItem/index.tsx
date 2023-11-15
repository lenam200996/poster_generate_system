import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
interface Props {
  id: number
  name: string
  thumbImageUrl: string
  onDelete?: Function
}

const ImportFooterListItem = (props: Props) => {
  return (
    <div className='flex w-full items-center rounded bg-container-main-secondary py-4 pl-3 pr-7'>
      <div className='mx-1 mt-2 mb-[10px] flex-1 bg-transparent'>
        <img
          className='h-full w-full object-contain'
          src={props.thumbImageUrl}
          alt={props.name}
        />
      </div>
      <div className='ml-11 flex items-center'>
        {props.onDelete && (
          <div className='ml-4'>
            <BaseButtonIconText
              icon='delete'
              text='削除'
              onClick={props.onDelete}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportFooterListItem
