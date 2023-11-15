import MuiButton from "@mui/material/Button"

interface Props {
  plateName: string
  pageCounts: string
  destinationProject: string
  onComplete?: Function
  onClose?: Function
}

const ProjectNewBookletComplete = (props: Props) => {
  const handleOnClick = () => props.onComplete()
  const handleOnClose = () => props.onClose()
  return (
    <div className='relative h-[320px] w-[600px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規冊子設定完了
        </p>
        <p className='mt-4 text-center text-sm font-medium text-content-default-primary'>
          新規冊子を作成しました
        </p>
      </div>
      <div className='m-auto mt-7 max-w-max text-sm font-medium text-content-default-primary'>
        <div className='flex items-center'>
          <p className='w-[63px]'>冊子</p>
          <p>{`${props.plateName}　${props.pageCounts}ページ`}</p>
        </div>
        <div className='mt-3 flex items-center'>
          <p className='w-[63px]'>作成先</p>
          <p>{props.destinationProject}</p>
        </div>
      </div>
      <div className='absolute left-0 bottom-0 flex w-full items-center justify-center px-9 pb-9'>
        <MuiButton
          variant='contained'
          sx={{ width: 104 }}
          onClick={() => {
            handleOnClick()
            handleOnClose
          }}
        >
          OK
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectNewBookletComplete
