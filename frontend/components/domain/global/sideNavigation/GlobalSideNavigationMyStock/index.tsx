import { savedFilterSearchConditionsState } from "@/atoms/searchConditions"
import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"
import GlobalSideNavigationSwitchModal from "@/components/domain/global/sideNavigation/GlobalSideNavigationSwitchModal"
import GlobalSideNavigationHelpModal from "@/components/domain/global/sideNavigation/GlobalSideNavigationHelpModal"
import { useRecoilState } from "recoil"
import { useRouter } from "next/router"

const GlobalSideNavigationMyStock = () => {
  const router = useRouter()
  const [savedFilterSearchConditions, setSavedFilterSearchConditions] =
    useRecoilState(savedFilterSearchConditionsState)
  const links = savedFilterSearchConditions.map(({ id, conditions, name }) => {
    const params = new URLSearchParams(
      conditions.map((item) => [item.key, item.value]),
    )
    return {
      id,
      label: name,
      value: `?${params.toString()}`,
      onChange: (newName: string) => {
        setSavedFilterSearchConditions((items) =>
          items.map((item) => ({
            ...item,
            name: item.id === id ? newName : item.name,
          })),
        )
      },
      onDelete: () => {
        setSavedFilterSearchConditions((items) =>
          items.filter((item) => item.id !== id),
        )
      },
    }
  })
  return (
    <div>
      <div className='bg-white-0 px-3 py-8'>
        <GlobalSideNavigationSwitchModal />
      </div>
    </div>
  )
}

export default GlobalSideNavigationMyStock
