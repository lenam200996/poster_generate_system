import { useState, useEffect } from "react"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import { Theme } from "config/type"

interface Props {
  theme?: Theme
  icon: string
  links?: { label: string; value: string }[]
  actived?: boolean
  children: any
  onClick?: Function
}

const BaseSideNavigationLinksButton = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const navigationVisible = useRecoilValue(GlobalNavigationVisibleState)

  useEffect(() => {
    if (!navigationVisible) {
      setShown(false)
    }
  }, [navigationVisible])

  const handleClick = () => {
    if (Links) {
      setShown(!shown)
    }
    if (!props.onClick) return
    props.onClick()
  }

  const Links = props.links?.map((item) => (
    <Link href={item.value} key={item.label}>
      <span className='block min-h-[38px] w-[190px] cursor-pointer rounded-lg py-2 pr-4 pl-11 text-sm font-medium text-theme-yk-sennary hover:bg-[#1976D2] hover:text-content-default-septenary'>
        {item.label}
      </span>
    </Link>
  ))

  return (
    <div className='space-y-1'>
      <button
        type='button'
        className={`relative flex h-9 w-full items-center overflow-hidden rounded-lg border-0 bg-transparent transition-[100%] delay-100 ${
          navigationVisible ? "px-4" : "px-2"
        } py-2 text-left text-sm ${
          props.actived
            ? "bg-container-active-primary text-content-default-septenary"
            : "text-theme-yk-sennary hover:bg-[#1976D2] hover:text-content-default-septenary"
        }`}
        onClick={handleClick}
      >
        <span className='material-symbols-outlined mr-[10px] text-xl'>
          {props.icon}
        </span>
        <span
          className={`flex-1 ${
            navigationVisible ? "" : "whitespace-nowrap opacity-0"
          }`}
        >
          {props.children}
        </span>
      </button>
      {Links && (
        <div
          className={`transition-[100%] delay-100 ${
            navigationVisible ? "" : "opacity-0"
          }`}
        >
          {navigationVisible && Links}
        </div>
      )}
    </div>
  )
}

BaseSideNavigationLinksButton.defaultProps = {
  onClick: undefined,
}

export default BaseSideNavigationLinksButton
