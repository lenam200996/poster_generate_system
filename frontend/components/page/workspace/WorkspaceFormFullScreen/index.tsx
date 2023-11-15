import { useRouter } from "next/router"
import Link from "next/link"
import WorkspaceForm from "@/components/page/workspace/WorkspaceForm"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { useMemo } from "react"
type Props = {
  idmlEditId: string
  refresh: () => void
  save: () => void
}
const WorkspaceFormFullScreen: React.FC<Props> = (props) => {
  const router = useRouter()
  const { id } = router.query
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)
  const manuscript = useRecoilValue(workspaceManuscriptState)
  const handleOnClick = () => {
    router.replace({
      pathname: "/workspace/[id]",
      query: { id, viewMode: "split", documentId: router.query.documentId },
    })
    setManuscriptState((state) => ({
      ...state,
      viewState: null,
    }))
  }

  /**
   * リフレッシュ
   */
  const onRefresh = () => {
    props.refresh && props.refresh()
  }

  /**
   * セーブ
   */
  const onSave = () => {
    props.save && props.save()
  }
  const showArrowUpperRight = useMemo(() => {
    if (!manuscript) return true
    else if (manuscript.viewState != "Price") return true
    else {
      if (
        manuscript.document &&
        manuscript.document.documentContent &&
        manuscript.document.documentContent.mainPlanCode
      )
        return true
      return false
    }
  }, [manuscript])

  return (
    <div className='h-full flex-1'>
      <div className='relative h-full'>
        {showArrowUpperRight && (
          <div className='absolute left-0 top-0 z-10 flex h-[20px] w-full justify-end'>
            <div onClick={handleOnClick}>
              <button className='flex h-5 w-5 items-center justify-center bg-[#1976D2]'>
                <span className='material-symbols-outlined text-xl leading-none text-white-0'>
                  call_received
                </span>
              </button>
            </div>
          </div>
        )}
        <div className='h-full'>
          <WorkspaceForm
            refresh={onRefresh}
            save={onSave}
            size='large'
            idmlEditId={props.idmlEditId}
          />
        </div>
      </div>
    </div>
  )
}

export default WorkspaceFormFullScreen
