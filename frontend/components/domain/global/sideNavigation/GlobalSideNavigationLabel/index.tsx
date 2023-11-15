interface Props {
  label: string
  active?: boolean
  onClick?: Function
  children?: any
}

const GlobalSideNavigationLabel = (props: Props) => {
  const handleClick = () => {
    if (!props.onClick) return
    props.onClick()
  }

  // レンダリングする前にクラス名を定義する
  const normalBgColor = "bg-[#2989C6]"
  const activeBgColor = "bg-[#006496]"

  return (
    <div className='flex'>
      <button
        onClick={handleClick}
        className={`relative flex h-[124px] w-6 items-center border-0 bg-transparent pl-[5px] pr-1 ${
          props.active ? activeBgColor : normalBgColor
        }`}
      >
        <span
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
          className='traking-[1px] text-[13px] leading-none text-content-default-septenary'
        >
          {props.label}
        </span>
      </button>
      {props.active && props.children}
    </div>
  )
}

export default GlobalSideNavigationLabel
