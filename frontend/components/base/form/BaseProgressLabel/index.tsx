type Status = "wait" | "work" | "done" | "error"

type Props = {
  status: Status
}

const waitTextColor = "!text-[#656566]"
const workTextColor = "!text-[#1976D2]"
const doneTextColor = "!text-[#2e7d32]"
const errorTextColor = "!text-[#D32F2F]"

const waitBgColor = "!bg-[#E0E0E0]"
const workBgColor = "!bg-[#1976D2]"
const doneBgColor = "!bg-[#2e7d32]"
const errorBgColor = "!bg-[#D32F2F]"

const BaseProgressLabel = (props: Props) => {
  const statusName = (status: string) => {
    switch (status) {
      case "wait":
        return "待機中"
        break
      case "work":
        return "進行中"
      case "done":
        return "完了"
        break
      case "error":
        return "エラー"
        break
      default:
        return "待機中"
    }
  }

  const statusBgColor = (status: string) => {
    switch (status) {
      case "wait":
        return waitBgColor
        break
      case "work":
        return workBgColor
      case "done":
        return doneBgColor
        break
      case "error":
        return errorBgColor
        break
      default:
        return ""
    }
  }
  const statusTextColor = (status: string) => {
    switch (status) {
      case "wait":
        return waitTextColor
        break
      case "work":
        return workTextColor
      case "done":
        return doneTextColor
        break
      case "error":
        return errorTextColor
        break
      default:
        return ""
    }
  }

  return (
    <div className='flex items-center'>
      <div
        className={`relative mr-2 block h-5 w-5 rounded-full ${statusBgColor(
          props.status,
        )}`}
      >
        {props.status === "done" && (
          <span className='material-symbols-outlined absolute top-[3px] left-[3px] text-sm leading-none text-white-0'>
            done
          </span>
        )}
        {props.status === "error" && (
          <span className='material-symbols-outlined absolute top-[3px] left-[3px] text-sm leading-none text-white-0'>
            priority_high
          </span>
        )}
      </div>
      <p className={`text-sm text-[#656566] ${statusTextColor(props.status)}`}>
        {statusName(props.status)}
      </p>
    </div>
  )
}

export default BaseProgressLabel
