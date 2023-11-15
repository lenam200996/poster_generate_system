import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import { GlobalNavigationVisibleState } from "@/atoms/global"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"

const GlobalSideNavigationSwitchModal = () => {
  const router = useRouter()
  const [buttonProps, setButtonProps] = useState({
    icon: "dashboard",
    displayName: "プロジェクトリスト",
  })
  const [value, setValue] = useState<string>("projectlist")
  const [shown, setShown] = useState<boolean>(false)
  const [navigationVisible, setNavigationVisible] = useRecoilState(
    GlobalNavigationVisibleState,
  )
  useEffect(() => {
    if (router.pathname.indexOf("import") > -1) {
      setButtonProps({ icon: "table_rows", displayName: "インポート" })
      setValue("import/indexHeader")
    } else if (router.pathname.indexOf("myStock") > -1) {
      setButtonProps({ icon: "dashboard", displayName: "マイストック" })
      setValue("myStock")
    } else if (router.pathname.indexOf("workspace") > -1) {
      setButtonProps({ icon: "dashboard", displayName: "ワークスペース" })
      setValue("workspace")
    } else {
      setButtonProps({ icon: "dashboard", displayName: "プロジェクトリスト" })
      setValue("projectlist")
    }
  }, [router.pathname])

  useEffect(() => {
    if (!shown) {
      setNavigationVisible(false)
    }
  }, [shown]) // eslint-disable-line

  const handleOnChange = (value: string) => {
    setValue(value)
  }

  const handleOnClick = () => {
    if (value === "projectlist") {
      router.replace(`/`)
    } else {
      router.replace(`/${value}`)
    }
    setShown(false)
  }

  const handleOnClose = () => setShown(false)
  return (
    <div>
      <BaseSideNavigationButton
        actived={true}
        icon={buttonProps.icon}
        onClick={() => setShown(!shown)}
      >
        {buttonProps.displayName}
      </BaseSideNavigationButton>
      <BaseModal shown={shown} onClickClose={() => setShown(false)}>
        <MuiFormControl>
          <MuiRadioGroup
            value={value}
            onChange={(event) => handleOnChange(event.target.value)}
          >
            <div className='relative h-[320px] w-[600px]'>
              <div className='pt-[56px]'>
                <p className='text-center text-lg font-bold text-content-default-primary'>
                  選択してください
                </p>
                <div className='m-auto mt-10 grid w-[445px] grid-cols-2 gap-6'>
                  <BaseRadioSquare
                    label='プロジェクトリスト'
                    value='projectlist'
                  />
                  <RenderWithRoles
                    roles={[RolesMock.admin, RolesMock.operator]}
                  >
                    <BaseRadioSquare
                      label='インポート'
                      value='import/indexHeader'
                    />
                  </RenderWithRoles>
                  <BaseRadioSquare label='マイストック' value='myStock' />
                </div>
              </div>
              <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  onClick={handleOnClose}
                >
                  キャンセル
                </MuiButton>
                <MuiButton
                  variant='contained'
                  sx={{ width: 104 }}
                  onClick={handleOnClick}
                >
                  確定
                </MuiButton>
              </div>
            </div>
          </MuiRadioGroup>
        </MuiFormControl>
      </BaseModal>
    </div>
  )
}

export default GlobalSideNavigationSwitchModal
