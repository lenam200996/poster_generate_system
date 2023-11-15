import BaseSideNavigationButton from "@/components/base/button/BaseSideNavigationButton"
import { useRouter } from "next/router"
import GlobalSideNavigationWorkspaceOutputButton from "./GlobalSideNavigationWorkspaceOutputButton"

const GlobalSideNavigationWorkspace = (props: {
  manuscriptExports: (selected: any, type) => void
}) => {
  const router = useRouter()
  const links = [
    {
      label: "3分割ビュー",
      value: `/workspace/${router.query.id}?viewMode=split`,
    },
    {
      label: "2分割ビュー",
      value: `/workspace/${router.query.id}?viewMode=splitTwo`,
    },
    {
      label: "プレビュー",
      value: `/workspace/${router.query.id}?viewMode=fullscreen&viewTarget=preview`,
    },
    {
      label: "編集ビュー",
      value: `/workspace/${router.query.id}?viewMode=fullscreen&viewTarget=form`,
    },
    {
      label: "冊子ビュー",
      value: `/workspace/${router.query.id}?viewMode=fullscreen&viewTarget=booklet`,
    },
  ]
  return (
    <div>
      <div className='bg-white-0 px-3 py-8'>
        <BaseSideNavigationButton links={links} icon='team_dashboard'>
          ウィンドウ
        </BaseSideNavigationButton>
        <div className='mt-8'>
          <GlobalSideNavigationWorkspaceOutputButton
            manuscriptExports={props.manuscriptExports}
          />
        </div>
      </div>
    </div>
  )
}

export default GlobalSideNavigationWorkspace
