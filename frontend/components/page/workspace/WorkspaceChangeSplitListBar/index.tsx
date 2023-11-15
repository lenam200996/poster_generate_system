import { useRouter } from "next/router"

const WorkspaceChangeSplitListBar = () => {
  const router = useRouter()
  const { viewMode } = router.query
  const { viewTarget } = router.query
  const handleOnClickSplit = () => {
    router.replace({
      query: {
        id: router.query.id,
        viewMode: "split",
      },
    })
  }
  const handleOnClickList = () => {
    router.replace({
      query: {
        id: router.query.id,
        viewMode: "list",
      },
    })
  }
  return (
    <div className='bg-container-neutral-light30 relative h-[24px] w-full'>
      <div className='absolute right-[2px] top-[2px] flex'>
        <button
          className={`flex h-5 w-6 items-center justify-center rounded-bl rounded-tl ${
            viewMode === "split" || viewTarget === "booklet"
              ? "bg-[#1976D2]"
              : "bg-container-neutral-mid50"
          }`}
          onClick={handleOnClickSplit}
        >
          <span className='material-symbols-outlined text-xl leading-none text-white-0'>
            view_column
          </span>
        </button>
        <button
          className={`flex h-5 w-6 items-center justify-center rounded-br rounded-tr ${
            viewMode === "list" ? "bg-[#1976D2]" : "bg-container-neutral-mid50"
          }`}
          onClick={handleOnClickList}
        >
          <span className='material-symbols-outlined text-xl leading-none text-white-0'>
            dehaze
          </span>
        </button>
      </div>
    </div>
  )
}

export default WorkspaceChangeSplitListBar
