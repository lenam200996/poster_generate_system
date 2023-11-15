import { forwardRef } from "react"
import Link from "next/link"
import SVGUserDefaultIcon from "@/src/assets/svg/user-default-icon.svg"
import SVGLogoYukoyukoZenCoreSystem from "@/src/assets/svg/logo-yukoyuko-zen-core-system.svg"
import MuiPopover from "@mui/material/Popover"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"

const GlobalAuthHeader = () => {
  // eslint-disable-next-line react/display-name
  const SvgLogo = forwardRef(() => (
    <SVGLogoYukoyukoZenCoreSystem width={213} height={27} />
  ))
  return (
    <header className='relative flex h-[60px] items-center justify-between border-b-[1px] border-b-divider-accent-secondary bg-container-main-secondary px-5'>
      <h1 className='cursor-pointer'>
        <Link href='/'>
          <SvgLogo />
        </Link>
      </h1>
      <PopupState variant='popover'>
        {(popupState) => (
          <div>
            <div className='relative flex items-center'>
              <button
                className='h-7 w-7 overflow-hidden rounded-full'
                {...bindTrigger(popupState)}
              >
                <SVGUserDefaultIcon />
              </button>
              <span className='material-symbols-outlined ml-2 text-gray-70'>
                arrow_drop_down
              </span>
            </div>
            <MuiPopover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div className='w-[104px] rounded bg-container-main-primary shadow-lv2'>
                <Link href='/'>
                  <button className='text-content-primary-dark90 hover:text-content-primary-mid70 h-9 w-full bg-transparent pl-4 text-left text-sm hover:bg-container-main-quinary'>
                    ログアウト
                  </button>
                </Link>
              </div>
            </MuiPopover>
          </div>
        )}
      </PopupState>
    </header>
  )
}

export default GlobalAuthHeader
