import { useRouter } from "next/router"
import Link from "next/link"
import WorkspacePreview from "@/components/page/workspace/WorkspacePreview"

const WorkspacePreviewFullScreen = () => {
  const router = useRouter()
  return (
    <div className='h-full flex-1 bg-[#F0F2F8]'>
      <div className='flex h-full flex-col'>
        <div className='flex h-[20px] w-full justify-end'>
          <Link
            href={{
              query: {
                id: router.query.id,
                viewMode: "split",
                documentId: router.query.documentId,
              },
            }}
            replace
          >
            <button className='flex h-5 w-5 items-center justify-center bg-[#1976D2]'>
              <span className='material-symbols-outlined text-xl leading-none text-white-0'>
                call_received
              </span>
            </button>
          </Link>
        </div>
        <div className='flex-1 overflow-hidden'>
          <WorkspacePreview
            imgUrl='https://placehold.jp/359x260.png'
            type='fullscreen'
          />
        </div>
        <div className='flex h-[28px] w-full items-center justify-end bg-white-0'></div>
      </div>
    </div>
  )
}

export default WorkspacePreviewFullScreen
