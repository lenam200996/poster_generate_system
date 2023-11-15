import MuiButton from "@mui/material/Button"

interface Props {
  media: string
  year: number
  month: number
  newYear: string
  newMonth: string
  onClick: Function
}

const ProjectDuplicateComplete = (props: Props) => {
  return (
    <div className='relative h-[320px] w-[600px]'>
      <div className='px-9 pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          プロジェクト複製完了
        </p>
        <p className='mt-4 text-center text-sm font-medium leading-6 text-content-default-primary'>
          {`${props.media}　${props.year}年　${props.month}月号`}を複製し
          <br />
          {`${props.media}　${props.newYear}年　${props.newMonth}月号`}
          を作成しました
        </p>
      </div>
      <div className='absolute left-0 bottom-0 flex h-[72px] w-full items-center justify-center px-9 pb-9'>
        <MuiButton
          variant='contained'
          sx={{ width: 104 }}
          onClick={() => props.onClick()}
        >
          OK
        </MuiButton>
      </div>
    </div>
  )
}

export default ProjectDuplicateComplete
