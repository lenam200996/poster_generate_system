import dayjs, { Dayjs } from "dayjs"
import MuiButton from "@mui/material/Button"
import { enumMedia } from ".."
import filterCopies from "@/util/filterCopies"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
interface Props {
  mediaType: string
  year: number
  month: number
  startSales: string
  finishSales: string
  startReview: string
  finishReview: string
  plates: string[]
  onClose: Function
}

const ProjectNewSettingComplete = (props: Props) => {
  const handleOnClose = () => props.onClose()
  return (
    <div className='relative min-h-[500px] w-[900px]'>
      <div className='pt-[56px]'>
        <p className='text-center text-lg font-bold text-content-default-primary'>
          新規プロジェクト設定完了
        </p>
        <p className='mt-11 text-center text-sm font-medium text-content-default-primary'>
          新規プロジェクトを作成しました
        </p>
      </div>
      <div className='mt-7 w-full space-y-7'>
        <div className='flex items-center text-sm font-medium text-content-default-primary'>
          <p className='ml-auto w-40'>{enumMedia[props.mediaType]}</p>
          <p className='w-1/2 pr-32'>
            {props.year}年{props.month}月号
          </p>
        </div>
        <div className='flex items-center text-sm font-medium text-content-default-primary'>
          <p className='ml-auto w-40'>販売期間</p>
          <p className='w-1/2 pr-32'>{`${dayjs
            .tz(props.startSales, "UTC")
            .format("YYYY/M/D")}　～　${dayjs
            .tz(props.finishSales, "UTC")
            .format("YYYY/M/D")}`}</p>
        </div>
        <div className='flex items-center text-sm font-medium text-content-default-primary'>
          <p className='ml-auto w-40'>口コミ評価対象期間</p>
          <p className='w-1/2 pr-32'>{`${dayjs
            .tz(props.startReview, "UTC")
            .format("YYYY/M/D")}　～　${dayjs
            .tz(props.finishReview, "UTC")
            .format("YYYY/M/D")}`}</p>
        </div>
        <div className='flex items-center text-sm text-content-default-primary'>
          <p className='ml-auto w-40'>版</p>
          <p className='w-1/2 pr-32 text-base'>
            {filterCopies(props.plates)
              .map((copies) => copies.label)
              .join(",")}
          </p>
        </div>
      </div>
      <div className='absolute left-0 bottom-0 flex w-full items-center justify-center px-9 pb-9'>
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

export default ProjectNewSettingComplete
