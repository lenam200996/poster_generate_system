import { useRecoilValue } from "recoil"
import { useRouter } from "next/router"
import Link from "next/link"
import WorkspaceVertical from "@/components/page/workspace/WorkspaceVertical"
import WorkspaceHorizon from "@/components/page/workspace/WorkspaceHorizon"
import WorkspaceBookletView from "@/components/page/workspace/WorkspaceBookletView"
import WorkspacePreview from "@/components/page/workspace/WorkspacePreview"
import WorkspaceForm from "@/components/page/workspace/WorkspaceForm"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { BookletDetailResponseDto } from "@/openapi"
import { useState } from "react"

type Props = {
  booklet: BookletDetailResponseDto
  idmlEditId: string
  refresh?: () => void
  save?: () => void
}

const WorkspaceSplitView = (props: Props) => {
  const router = useRouter()
  const manuscriptState = useRecoilValue(workspaceManuscriptState)

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

  return (
    <div className='flex h-full flex-col'>
      <div className='min-h-[217px]'>
        <WorkspaceBookletView booklet={props.booklet} />
      </div>
      <WorkspaceHorizon />
      <div className='flex h-full flex-1'>
        {/* form start */}
        <div className='w-[calc(50%_-_6px)] min-w-[640px] flex-1'>
          {manuscriptState && (
            <div className='relative h-full'>
              <div className='absolute left-0 top-0 z-10 flex h-[20px] w-full justify-end'>
                <Link
                  href={{
                    query: {
                      id: router.query.id,
                      viewMode: "fullscreen",
                      viewTarget: "form",
                      documentId: router.query.documentId,
                    },
                  }}
                  replace
                >
                  <button className='flex h-5 w-5 items-center justify-center bg-[#1976D2]'>
                    <span className='material-symbols-outlined text-xl leading-none text-white-0'>
                      call_made
                    </span>
                  </button>
                </Link>
              </div>
              <div className='h-full'>
                <WorkspaceForm
                  refresh={onRefresh}
                  save={onSave}
                  size='small'
                  idmlEditId={props.idmlEditId}
                />
              </div>
            </div>
          )}
        </div>
        {/* form end */}
        <WorkspaceVertical />

        {/* preview start */}
        <div className='h-full w-[calc(50%_-_6px)] min-w-[624px] flex-1 bg-[#F0F2F8]'>
          {manuscriptState && (
            <div className='flex h-full flex-col'>
              <div className='flex h-[20px] w-full justify-end'>
                <Link
                  href={{
                    query: {
                      id: router.query.id,
                      viewMode: "fullscreen",
                      viewTarget: "preview",
                      documentId: router.query.documentId,
                    },
                  }}
                  replace
                >
                  <button className='flex h-5 w-5 items-center justify-center bg-[#1976D2]'>
                    <span className='material-symbols-outlined text-xl leading-none text-white-0'>
                      call_made
                    </span>
                  </button>
                </Link>
              </div>
              <div className='flex-1'>
                <WorkspacePreview
                  imgUrl='https://placehold.jp/359x260.png'
                  type='split'
                  idmlEditId={props.idmlEditId}
                />
              </div>
              <div className='flex h-[28px] w-full items-center justify-end bg-white-0'></div>
            </div>
          )}
        </div>
        {/* preview end */}
        <WorkspaceVertical />
      </div>
    </div>
  )
}

export default WorkspaceSplitView
