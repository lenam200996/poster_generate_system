import { useState, useEffect } from "react"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import { Theme } from "config/type"
import BaseSideNavigationFilterSearchLink, {
  BaseSideNavigationFilterSearchLinkProps,
} from "../BaseSideNavigationFilterSearchLink"

interface Props {
  theme?: Theme
  icon: string
  links?: { label: string; value: string }[]
  searchFilterLinks?: BaseSideNavigationFilterSearchLinkProps[]
  actived?: boolean
  children: any
  onClick?: Function
}

const BaseSideNavigationButton = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const navigationVisible = useRecoilValue(GlobalNavigationVisibleState)

  useEffect(() => {
    if (!navigationVisible) {
      setShown(false)
    }
  }, [navigationVisible])

  const handleClick = () => {
    if (Links || SearchFilterLinks) {
      setShown(!shown)
    }
    if (!props.onClick) return
    props.onClick()
  }

  const Links = props.links?.map((item) => (
    <Link href={item.value} key={item.label} replace>
      <span className='block min-h-[38px] w-[190px] cursor-pointer rounded-lg py-2 pr-4 pl-11 text-sm font-medium text-theme-yk-sennary hover:bg-theme-yk-primary'>
        {item.label}
      </span>
    </Link>
  ))

  const SearchFilterLinks = props.searchFilterLinks?.map((item) => (
    <BaseSideNavigationFilterSearchLink key={item.id} {...item} />
  ))

  return (
    <div className='space-y-1'>
      <button
        type='button'
        className={`group relative flex h-9 w-full items-center overflow-hidden rounded-lg border-0 bg-transparent transition-[100%] delay-100 ${
          navigationVisible ? "px-4" : "px-2"
        } py-2 text-left text-sm ${
          props.actived
            ? "bg-container-active-primary text-content-default-septenary"
            : "text-theme-yk-sennary hover:bg-[#1976D2] hover:text-content-default-septenary"
        }`}
        onClick={handleClick}
      >
        {((props.links && props.links.length) ||
          (props.searchFilterLinks && props.searchFilterLinks.length > 0)) && (
          <span
            className={`material-symbols-outlined absolute top-[6px] right-[8px] leading-none text-content-default-tertiary transition-[100%] delay-100 group-hover:text-content-default-septenary ${
              navigationVisible ? "" : "opacity-0"
            }`}
          >
            {shown ? "keyboard_double_arrow_up" : "keyboard_double_arrow_down"}
          </span>
        )}
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
      {navigationVisible && shown && Links}
      {navigationVisible && shown && SearchFilterLinks}
    </div>
  )
}

BaseSideNavigationButton.defaultProps = {
  onClick: undefined,
}

export default BaseSideNavigationButton
