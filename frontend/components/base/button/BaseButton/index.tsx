import { Theme } from "config/type"

interface Props {
  theme?: Theme
  width: string
  height: string
  disabled?: boolean
  children: any
  onClick?: Function
}

const BaseButton = (props: Props) => {
  const handleClick = () => {
    if (!props.onClick) return
    props.onClick()
  }

  const customStyle = {
    width: props.width,
    height: props.height,
  }

  const bgColorClassName = (): string => {
    if (props.theme) {
      return `bg-theme-${props.theme}-50 hover:bg-theme-${props.theme}-40`
    } else {
      return `bg-gray-60 hover:bg-gray-50`
    }
  }

  return (
    <button
      className={`${bgColorClassName()} w-full rounded-full text-[13px] text-white-0 disabled:bg-gray-40 disabled:text-gray-60`}
      type='button'
      disabled={props.disabled}
      style={customStyle}
      onClick={handleClick}
    >
      {props.children}
    </button>
  )
}

BaseButton.defaultProps = {
  width: "",
  height: "32px",
  disabled: false,
  onClick: undefined,
}

export default BaseButton
