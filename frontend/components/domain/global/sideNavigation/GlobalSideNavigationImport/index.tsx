import GlobalSideNavigationSwitchModal from "@/components/domain/global/sideNavigation/GlobalSideNavigationSwitchModal"
import BaseSideNavigationLinksButton from "@/components/base/button/BaseSideNavigationLinksButton"

const links = [
  { label: "ツメ見出し", value: "/import/indexHeader" },
  {
    label: "見出し",
    value: "/import/header",
  },
  {
    label: "うめ草",
    value: "/import/small-assembly",
  },
  {
    label: "欄外下画像",
    value: "/import/footer",
  },
  {
    label: "自慢スタンプ",
    value: "/import/stamp",
  },
  // {
  //   label: "評価パーツ",
  //   value: "/import/reviewParts",
  // },
  {
    label: "パーツ",
    value: "/import/parts",
  },
]

const GlobalSideNavigationImport = () => {
  return (
    <div>
      <div className='space-y-8 bg-white-0 px-3 py-8'>
        <GlobalSideNavigationSwitchModal />
        <div>
          <BaseSideNavigationLinksButton links={links} icon='note_add'>
            素材・パーツ
          </BaseSideNavigationLinksButton>
        </div>
      </div>
    </div>
  )
}

export default GlobalSideNavigationImport
