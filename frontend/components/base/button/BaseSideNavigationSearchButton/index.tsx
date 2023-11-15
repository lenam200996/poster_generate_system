import { useState, useEffect } from "react"
import { useRecoilValue } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import { Theme } from "config/type"
import BaseSideNavigationFilterSearchLink, {
  BaseSideNavigationFilterSearchLinkProps,
} from "../BaseSideNavigationFilterSearchLink"

interface Props {
  theme?: Theme
  links?: BaseSideNavigationFilterSearchLinkProps[]
  actived?: boolean
  onClick?: Function
}

const BaseSideNavigationSearchButton = (props: Props) => {
  const [shown, setShown] = useState<boolean>(false)
  const navigationVisible = useRecoilValue(GlobalNavigationVisibleState)

  useEffect(() => {
    if (!navigationVisible) {
      setShown(false)
    }
  }, [navigationVisible])

  const handleClick = () => {
    if (SearchFilterLinks) {
      setShown(!shown)
    }
    if (!props.onClick) return
    props.onClick()
  }

  const SearchFilterLinks = props.links?.map((item) => (
    <BaseSideNavigationFilterSearchLink key={item.id} {...item} />
  ))

  return (
    <div>
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
          (props.links && props.links.length > 0)) && (
          <span
            className={`material-symbols-outlined absolute top-[6px] right-[8px] leading-none text-content-default-tertiary transition-[100%] delay-100 group-hover:text-content-default-septenary ${
              navigationVisible ? "" : "opacity-0"
            }`}
          >
            {shown ? "keyboard_double_arrow_up" : "keyboard_double_arrow_down"}
          </span>
        )}
        <span className='material-symbols-outlined mr-[10px] text-xl'>
          search
        </span>
        <span
          className={`flex-1 ${
            navigationVisible ? "" : "whitespace-nowrap opacity-0"
          }`}
        >
          検索
          {props.links && props.links.length > 0 && `　(${props.links.length})`}
        </span>
      </button>
      {navigationVisible && shown && (
        <div className='max-h-[calc(100vh_-_228px)] overflow-auto'>
          {SearchFilterLinks}
        </div>
      )}
    </div>
  )
}

BaseSideNavigationSearchButton.defaultProps = {
  onClick: undefined,
}

export default BaseSideNavigationSearchButton
