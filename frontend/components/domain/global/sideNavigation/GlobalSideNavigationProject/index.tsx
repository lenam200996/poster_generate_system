import { savedFilterSearchConditionsState } from "@/atoms/searchConditions"
import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"
import BaseSideNavigationSearchButton from "@/components/base/button/BaseSideNavigationSearchButton"
import GlobalSideNavigationSwitchModal from "@/components/domain/global/sideNavigation/GlobalSideNavigationSwitchModal"
import GlobalSideNavigationHelpModal from "@/components/domain/global/sideNavigation/GlobalSideNavigationHelpModal"
import { useRecoilState } from "recoil"
import { useRouter } from "next/router"
import { useEffect } from "react"

const GlobalSideNavigationProject = () => {
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
        setSavedFilterSearchConditions((items) => {
          const savedItems = items.map((item) => ({
            ...item,
            name: item.id === id ? newName : item.name,
          }))

          localStorage.setItem("seachConditions", JSON.stringify(savedItems))
          return savedItems
        })
      },
      onDelete: () => {
        setSavedFilterSearchConditions((items) => {
          const filterdItems = items.filter((item) => item.id !== id)
          localStorage.setItem("seachConditions", JSON.stringify(filterdItems))
          return filterdItems
        })
      },
    }
  })

  useEffect(() => {
    const json = localStorage.getItem("seachConditions")
    const array = JSON.parse(json)
    if (array && array.length >= 1) {
      setSavedFilterSearchConditions(array)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (savedFilterSearchConditions.length) {
      localStorage.setItem(
        "seachConditions",
        JSON.stringify(savedFilterSearchConditions),
      )
    }
  }, [savedFilterSearchConditions])

  return (
    <div>
      <div className='bg-white-0 px-3 py-8'>
        <GlobalSideNavigationSwitchModal />
        <div className='mt-8'>
          <BaseSideNavigationSearchButton links={links} />
        </div>
      </div>
    </div>
  )
}

export default GlobalSideNavigationProject
