import { useRouter } from "next/router"
import Link from "next/link"
import WorkspaceBookletLarge from "@/components/page/workspace/WorkspaceBookletLarge"
import WorkspaceChangeSplitListBar from "@/components/page/workspace/WorkspaceChangeSplitListBar"
import { BookletDetailResponseDto } from "@/openapi"
import { useState } from "react"
import WorkspaceModalAddPage from "@/components/page/workspace/Modal/WorkspaceModalAddPage"

type Props = {
  booklet: BookletDetailResponseDto
}

type DisplayStatus = "addNew" | "none"
const WorkspaceBookletViewFullScreen = (props: Props) => {
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const router = useRouter()
  if (props.booklet === null) return
  const pageNumbers = [
    ...Array(props.booklet ? props.booklet.numberOfPages : 0),
  ]
    .map((_, i) => i + 3)
    .reverse()
  return (
    <div className='flex h-full flex-col'>
      <div className='relative h-5 w-full bg-[#F0F2F8] shadow-[0_14px_34px_rgba(16,42,73,0.05)]'>
        <div className='absolute left-0 top-0 flex h-[20px] w-full justify-end'>
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
      </div>
      <div className='flex h-full flex-1 overflow-x-auto bg-container-main-primary'>
        <div className='w-full' />
        <WorkspaceBookletLarge
          key={props.booklet.numberOfPages + 3}
          booklet={props.booklet}
          pageNumber={props.booklet.numberOfPages + 3}
          addNew={true}
          onAddNewModal={() => setDisplayStatus("addNew")}
        />
        {pageNumbers.map((pageNumber, i) => {
          const page = props.booklet.pages.find(
            (page) => page.pageNumber === pageNumber,
          )
          return (
            <WorkspaceBookletLarge
              key={pageNumber}
              booklet={props.booklet}
              pageNumber={pageNumber}
              page={page}
            />
          )
        })}
      </div>
      <WorkspaceChangeSplitListBar />
      {displayStatus === "addNew" && (
        <WorkspaceModalAddPage onClose={() => setDisplayStatus("none")} />
      )}
    </div>
  )
}

export default WorkspaceBookletViewFullScreen
