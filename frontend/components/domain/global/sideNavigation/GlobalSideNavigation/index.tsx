import React from "react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import GlobalSideNavigationProject from "@/components/domain/global/sideNavigation/GlobalSideNavigationProject"
import GlobalSideNavigationWorkspace from "@/components/domain/global/sideNavigation/GlobalSideNavigationWorkspace"
import GlobalSideNavigationImport from "@/components/domain/global/sideNavigation/GlobalSideNavigationImport"
import GlobalSideNavigationMyStock from "@/components/domain/global/sideNavigation/GlobalSideNavigationMyStock"

const GlobalSideNavigation = (props: {
  manuscriptExports: (selected, type) => void
}) => {
  const [navigationVisible, setNavigationVisible] = useRecoilState(
    GlobalNavigationVisibleState,
  )
  const router = useRouter()
  return (
    <nav className='relative z-50 flex min-h-screen bg-theme-yk-tertiary'>
      <div
        className={`fixed top-[60px] left-0 z-50 h-full w-[60px] bg-white-0 shadow-[10px_4px_54px_rgba(16,42,73,0.05)] transition-[100%] delay-100 ${
          navigationVisible ? "!w-[252px]" : ""
        }`}
        onMouseEnter={() => setNavigationVisible(true)}
        onMouseLeave={() => setNavigationVisible(false)}
      >
        {["/", "/settings", "/management/[id]"].includes(router.pathname) && (
          <GlobalSideNavigationProject />
        )}
        {router.pathname.startsWith("/import") && (
          <GlobalSideNavigationImport />
        )}
        {router.pathname.startsWith("/myStock") && (
          <GlobalSideNavigationMyStock />
        )}
        {router.pathname === "/workspace/[id]" && (
          <GlobalSideNavigationWorkspace
            manuscriptExports={props.manuscriptExports}
          />
        )}
      </div>
    </nav>
  )
}

export default GlobalSideNavigation
