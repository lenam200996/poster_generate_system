import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"
import BaseModal from "@/components/base/overlay/BaseModal"

const GlobalSideNavigationHelpModal = () => {
  const [shown, setShown] = useState(false)
  const setNavigationVisible = useSetRecoilState(GlobalNavigationVisibleState)
  useEffect(() => {
    if (!shown) {
      setNavigationVisible(false)
    }
  }, [shown]) // eslint-disable-line
  const handleOnClose = () => {
    setShown(false)
  }

  return (
    <div>
      <BaseSideNavigationButton icon='help' onClick={() => setShown(true)}>
        ヘルプ
      </BaseSideNavigationButton>
      <BaseModal shown={shown} onClickClose={handleOnClose}>
        <div className='h-[500px] w-[900px]'>
          <div className='mt-[56px]'>
            <h1 className='text-center text-lg font-bold text-content-default-primary'>
              ヘルプ画面
            </h1>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default GlobalSideNavigationHelpModal
